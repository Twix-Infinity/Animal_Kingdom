# Farm Health Monitoring System

A Python Flask web application for monitoring livestock health with AI-powered insights and Supabase database integration.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Supabase account

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
Ensure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
FLASK_SECRET_KEY=your_secret_key_here
```

## Running the Application

Start the Flask development server:
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## Features

- User authentication (login/signup)
- Animal management (add, view, delete animals)
- Health status tracking
- Alert system for health issues
- Dashboard with statistics
- Supabase database integration

## Project Structure

```
project/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── templates/            # HTML templates
│   ├── base.html
│   ├── auth.html
│   └── dashboard.html
├── static/              # Static assets
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── main.js
│       ├── auth.js
│       └── dashboard.js
└── supabase/
    └── migrations/      # Database migrations
```

## Database

The application uses Supabase with the following tables:
- `animals` - Stores animal information
- `health_alerts` - Tracks health alerts and issues

Migrations are located in `supabase/migrations/`.
