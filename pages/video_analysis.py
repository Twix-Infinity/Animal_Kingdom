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
    st.title("Video Analysis History")
    st.caption("View all processed video analyses and their results")

    analyses_response = supabase.table('video_analyses').select('*, animals(name, type)').order('created_at', desc=True).execute()
    analyses = analyses_response.data if analyses_response.data else []

    if not analyses:
        st.info("📹 No video analyses yet. Upload a video from the Animals tab to get started.")
    else:
        st.subheader(f"Analyses ({len(analyses)})")

        for analysis in analyses:
            status_icons = {
                'completed': '✅',
                'processing': '⏳',
                'failed': '❌',
                'pending': '⏸️'
            }

            status = analysis.get('analysis_status', 'pending')
            icon = status_icons.get(status, '⏸️')

            with st.expander(f"{icon} {analysis.get('animals', {}).get('name', 'Unknown')} - {status.title()}"):
                col_info, col_data = st.columns([2, 1])

                with col_info:
                    st.write(f"**Animal:** {analysis.get('animals', {}).get('name', 'Unknown')} ({analysis.get('animals', {}).get('type', 'Unknown')})")
                    st.write(f"**Status:** {status.title()}")

                    processed_at = analysis.get('processed_at')
                    if processed_at:
                        st.write(f"**Processed:** {datetime.fromisoformat(processed_at.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M')}")
                    else:
                        st.write("**Processed:** Pending")

                with col_data:
                    st.metric("Duration", f"{analysis.get('duration_seconds', 0)}s")
                    st.metric("Anomalies", analysis.get('anomalies_found', 0))

                behaviors = analysis.get('behaviors_detected', [])
                if behaviors and isinstance(behaviors, list) and len(behaviors) > 0:
                    st.subheader("Detected Behaviors")

                    for behavior in behaviors:
                        if isinstance(behavior, dict):
                            behavior_name = behavior.get('behavior', 'Unknown')
                            confidence = behavior.get('confidence', 0)
                            st.write(f"- **{behavior_name}**: {int(confidence * 100)}% confidence")

                if analysis.get('video_url'):
                    st.write(f"**Video URL:** {analysis['video_url']}")
