import streamlit as st
from supabase import create_client
import os
from datetime import datetime

try:
    supabase_url = st.secrets["VITE_SUPABASE_URL"]
    supabase_key = st.secrets["VITE_SUPABASE_ANON_KEY"]
except (KeyError, FileNotFoundError):
    supabase_url = os.getenv('VITE_SUPABASE_URL')
    supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')

supabase = create_client(supabase_url, supabase_key)

def show():
    st.title("Dashboard Overview")
    st.caption("Monitor your farm's health at a glance")

    animals_response = supabase.table('animals').select('*').order('created_at', desc=True).execute()
    animals = animals_response.data if animals_response.data else []

    alerts_response = supabase.table('health_alerts').select('*, animals(name, type)').eq('resolved', False).order('created_at', desc=True).execute()
    alerts = alerts_response.data if alerts_response.data else []

    total_animals = len(animals)
    healthy_animals = len([a for a in animals if a.get('health_status') == 'healthy'])
    active_alerts = len(alerts)
    avg_age = sum([a.get('age_months', 0) for a in animals]) / total_animals if total_animals > 0 else 0

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Total Animals", total_animals)

    with col2:
        st.metric("Healthy Animals", healthy_animals)

    with col3:
        st.metric("Active Alerts", active_alerts)

    with col4:
        st.metric("Average Age", f"{avg_age:.1f} yrs")

    st.divider()

    col_left, col_right = st.columns([2, 1])

    with col_left:
        st.subheader("Recent Animals")

        if not animals:
            st.info("No animals added yet.")
        else:
            for animal in animals[:5]:
                status_colors = {
                    'healthy': '🟢',
                    'monitoring': '🔵',
                    'sick': '🟡',
                    'critical': '🔴'
                }
                status_icon = status_colors.get(animal.get('health_status', 'healthy'), '🟢')

                with st.expander(f"{status_icon} {animal.get('name', 'Unknown')} - {animal.get('type', 'Unknown').title()}"):
                    col_a, col_b = st.columns(2)
                    with col_a:
                        st.write(f"**Age:** {animal.get('age_months', 0)} months")
                        st.write(f"**Weight:** {animal.get('weight_kg', 0)} kg")
                    with col_b:
                        st.write(f"**Location:** {animal.get('pen_location', 'N/A')}")
                        st.write(f"**Status:** {animal.get('health_status', 'Unknown').title()}")

    with col_right:
        st.subheader("Active Health Alerts")

        if not alerts:
            st.success("No active alerts")
        else:
            for alert in alerts:
                severity_colors = {
                    'low': '🟡',
                    'medium': '🟠',
                    'high': '🔴',
                    'critical': '🔴🔴'
                }
                icon = severity_colors.get(alert.get('severity', 'medium'), '🟠')

                with st.container():
                    st.write(f"{icon} **{alert.get('severity', 'Unknown').upper()}**")
                    st.write(f"*{alert.get('alert_type', 'Unknown').replace('_', ' ').title()}*")
                    if alert.get('animals'):
                        st.caption(f"{alert['animals']['name']} ({alert['animals']['type']})")
                    st.write(alert.get('description', ''))
                    st.caption(f"Confidence: {alert.get('confidence_score', 0)}%")
                    st.divider()
