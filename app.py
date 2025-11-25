import os
import sys
from functools import wraps
from datetime import datetime

try:
    from flask import Flask, render_template, request, jsonify, session, redirect, url_for
    from dotenv import load_dotenv
    from supabase import create_client, Client
except ImportError as e:
    print(f"Missing required package: {e}")
    print("Please install dependencies: pip install -r requirements.txt")
    sys.exit(1)

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')

supabase_url = os.getenv('VITE_SUPABASE_URL')
supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('auth_page'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return render_template('landing.html')

@app.route('/auth')
def auth_page():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return render_template('auth.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        if response.user:
            session['user'] = {
                'id': response.user.id,
                'email': response.user.email
            }
            session['access_token'] = response.session.access_token
            return jsonify({'success': True, 'user': session['user']})
        else:
            return jsonify({'success': False, 'error': 'Signup failed'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if response.user:
            session['user'] = {
                'id': response.user.id,
                'email': response.user.email
            }
            session['access_token'] = response.session.access_token
            return jsonify({'success': True, 'user': session['user']})
        else:
            return jsonify({'success': False, 'error': 'Login failed'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

@app.route('/api/animals', methods=['GET'])
@login_required
def get_animals():
    try:
        response = supabase.table('animals').select('*').execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/animals', methods=['POST'])
@login_required
def create_animal():
    data = request.json

    try:
        response = supabase.table('animals').insert({
            'name': data.get('name'),
            'species': data.get('species'),
            'age': data.get('age'),
            'health_status': data.get('health_status', 'healthy'),
            'location': data.get('location'),
            'last_checkup': data.get('last_checkup')
        }).execute()

        return jsonify({'success': True, 'data': response.data[0]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/animals/<animal_id>', methods=['PUT'])
@login_required
def update_animal(animal_id):
    data = request.json

    try:
        response = supabase.table('animals').update(data).eq('id', animal_id).execute()
        return jsonify({'success': True, 'data': response.data[0]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/animals/<animal_id>', methods=['DELETE'])
@login_required
def delete_animal(animal_id):
    try:
        supabase.table('animals').delete().eq('id', animal_id).execute()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/health-alerts', methods=['GET'])
@login_required
def get_health_alerts():
    try:
        response = supabase.table('health_alerts').select('*, animals(name, species)').execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/health-alerts', methods=['POST'])
@login_required
def create_health_alert():
    data = request.json

    try:
        response = supabase.table('health_alerts').insert({
            'animal_id': data.get('animal_id'),
            'alert_type': data.get('alert_type'),
            'severity': data.get('severity'),
            'description': data.get('description'),
            'status': 'active'
        }).execute()

        return jsonify({'success': True, 'data': response.data[0]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/health-alerts/<alert_id>/resolve', methods=['POST'])
@login_required
def resolve_alert(alert_id):
    try:
        response = supabase.table('health_alerts').update({
            'status': 'resolved',
            'resolved_at': datetime.now().isoformat()
        }).eq('id', alert_id).execute()

        return jsonify({'success': True, 'data': response.data[0]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/stats', methods=['GET'])
@login_required
def get_stats():
    try:
        animals = supabase.table('animals').select('*').execute()
        alerts = supabase.table('health_alerts').select('*').eq('status', 'active').execute()

        total_animals = len(animals.data)
        healthy_count = len([a for a in animals.data if a['health_status'] == 'healthy'])
        active_alerts = len(alerts.data)

        stats = {
            'totalAnimals': total_animals,
            'healthyAnimals': healthy_count,
            'activeAlerts': active_alerts,
            'averageAge': sum([a['age'] for a in animals.data]) / total_animals if total_animals > 0 else 0
        }

        return jsonify({'success': True, 'data': stats})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
