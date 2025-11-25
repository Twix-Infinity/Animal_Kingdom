import streamlit as st
from supabase import create_client
import os
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

try:
    supabase_url = st.secrets["VITE_SUPABASE_URL"]
    supabase_key = st.secrets["VITE_SUPABASE_ANON_KEY"]
except (KeyError, FileNotFoundError):
    supabase_url = os.getenv('VITE_SUPABASE_URL')
    supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')

supabase = create_client(supabase_url, supabase_key)

def show():
    st.title("Analytics Dashboard")
    st.caption("Comprehensive overview of farm health metrics")

    animals_response = supabase.table('animals').select('*').execute()
    animals = animals_response.data if animals_response.data else []

    alerts_response = supabase.table('health_alerts').select('*').execute()
    alerts = alerts_response.data if alerts_response.data else []

    videos_response = supabase.table('video_analyses').select('*').execute()
    videos = videos_response.data if videos_response.data else []

    total_animals = len(animals)
    healthy_animals = len([a for a in animals if a.get('health_status') == 'healthy'])
    active_alerts = len([a for a in alerts if not a.get('resolved', False)])
    resolved_alerts = len([a for a in alerts if a.get('resolved', False)])
    completed_videos = len([v for v in videos if v.get('analysis_status') == 'completed'])
    total_anomalies = sum([v.get('anomalies_found', 0) for v in videos])

    health_rate = (healthy_animals / total_animals * 100) if total_animals > 0 else 0

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Health Rate", f"{health_rate:.1f}%", delta="Good" if health_rate > 70 else "Attention needed")

    with col2:
        st.metric("Total Animals", total_animals)

    with col3:
        st.metric("Active Alerts", active_alerts)

    with col4:
        st.metric("Videos Analyzed", completed_videos)

    st.divider()

    col_left, col_right = st.columns(2)

    with col_left:
        st.subheader("Health Status Distribution")

        health_counts = {
            'healthy': len([a for a in animals if a.get('health_status') == 'healthy']),
            'monitoring': len([a for a in animals if a.get('health_status') == 'monitoring']),
            'sick': len([a for a in animals if a.get('health_status') == 'sick']),
            'critical': len([a for a in animals if a.get('health_status') == 'critical'])
        }

        if total_animals > 0:
            df_health = pd.DataFrame(list(health_counts.items()), columns=['Status', 'Count'])
            fig_health = px.bar(df_health, x='Status', y='Count',
                               color='Status',
                               color_discrete_map={
                                   'healthy': '#9d7a4a',
                                   'monitoring': '#3b82f6',
                                   'sick': '#f59e0b',
                                   'critical': '#ef4444'
                               })
            fig_health.update_layout(showlegend=False)
            st.plotly_chart(fig_health, use_container_width=True)
        else:
            st.info("No data available")

        st.subheader("Alert Severity Breakdown")

        severity_counts = {
            'low': len([a for a in alerts if a.get('severity') == 'low']),
            'medium': len([a for a in alerts if a.get('severity') == 'medium']),
            'high': len([a for a in alerts if a.get('severity') == 'high']),
            'critical': len([a for a in alerts if a.get('severity') == 'critical'])
        }

        if len(alerts) > 0:
            df_severity = pd.DataFrame(list(severity_counts.items()), columns=['Severity', 'Count'])
            fig_severity = px.bar(df_severity, x='Severity', y='Count',
                                 color='Severity',
                                 color_discrete_map={
                                     'low': '#eab308',
                                     'medium': '#f97316',
                                     'high': '#ef4444',
                                     'critical': '#dc2626'
                                 })
            fig_severity.update_layout(showlegend=False)
            st.plotly_chart(fig_severity, use_container_width=True)
        else:
            st.info("No alerts yet")

    with col_right:
        st.subheader("Animal Type Distribution")

        type_counts = {
            'cow': len([a for a in animals if a.get('type') == 'cow']),
            'pig': len([a for a in animals if a.get('type') == 'pig']),
            'chicken': len([a for a in animals if a.get('type') == 'chicken'])
        }

        if total_animals > 0:
            df_types = pd.DataFrame(list(type_counts.items()), columns=['Type', 'Count'])
            fig_types = px.pie(df_types, values='Count', names='Type',
                              color_discrete_sequence=['#9d7a4a', '#735437', '#b89968'])
            st.plotly_chart(fig_types, use_container_width=True)
        else:
            st.info("No data available")

        st.subheader("Key Metrics")

        metrics_data = {
            "Metric": ["Total Alerts", "Resolved Alerts", "Total Videos", "Total Anomalies"],
            "Value": [len(alerts), resolved_alerts, len(videos), total_anomalies]
        }

        df_metrics = pd.DataFrame(metrics_data)
        st.dataframe(df_metrics, hide_index=True, use_container_width=True)
