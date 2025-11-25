import streamlit as st
from supabase import create_client
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(
    page_title="Animal Kingdom - Farm Health Monitoring",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

try:
    supabase_url = st.secrets.get("VITE_SUPABASE_URL") or os.getenv('VITE_SUPABASE_URL')
    supabase_key = st.secrets.get("VITE_SUPABASE_ANON_KEY") or os.getenv('VITE_SUPABASE_ANON_KEY')
except:
    supabase_url = os.getenv('VITE_SUPABASE_URL')
    supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')

if not supabase_url or not supabase_key:
    st.error("⚠️ Supabase credentials not found. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Streamlit secrets.")
    st.stop()

supabase = create_client(supabase_url, supabase_key)

if 'user' not in st.session_state:
    st.session_state.user = None

def login_page():
    st.title("🩺 Animal Kingdom")
    st.subheader("Farm Health Monitoring System")

    tab1, tab2 = st.tabs(["Login", "Sign Up"])

    with tab1:
        with st.form("login_form"):
            email = st.text_input("Email", key="login_email")
            password = st.text_input("Password", type="password", key="login_password")
            submit = st.form_submit_button("Sign In")

            if submit:
                try:
                    response = supabase.auth.sign_in_with_password({
                        "email": email,
                        "password": password
                    })
                    st.session_state.user = response.user
                    st.rerun()
                except Exception as e:
                    st.error(f"Login failed: {str(e)}")

    with tab2:
        with st.form("signup_form"):
            email = st.text_input("Email", key="signup_email")
            password = st.text_input("Password", type="password", key="signup_password")
            submit = st.form_submit_button("Create Account")

            if submit:
                try:
                    response = supabase.auth.sign_up({
                        "email": email,
                        "password": password
                    })
                    st.success("Account created! Please login.")
                except Exception as e:
                    st.error(f"Signup failed: {str(e)}")

def main_app():
    with st.sidebar:
        st.title("🩺 Animal Kingdom")
        st.caption("Farm Health Monitoring")
        st.divider()

        page = st.radio(
            "Navigation",
            ["Dashboard", "Animals", "Health Alerts", "Analytics", "Video Analysis"],
            label_visibility="collapsed"
        )

        st.divider()
        st.text(f"Logged in as:\n{st.session_state.user.email}")

        if st.button("Sign Out", use_container_width=True):
            supabase.auth.sign_out()
            st.session_state.user = None
            st.rerun()

    if page == "Dashboard":
        from pages import dashboard
        dashboard.show()
    elif page == "Animals":
        from pages import animals
        animals.show()
    elif page == "Health Alerts":
        from pages import health_alerts
        health_alerts.show()
    elif page == "Analytics":
        from pages import analytics
        analytics.show()
    elif page == "Video Analysis":
        from pages import video_analysis
        video_analysis.show()

if st.session_state.user is None:
    login_page()
else:
    main_app()
