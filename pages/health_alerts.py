import streamlit as st
from supabase import create_client
import os
from datetime import datetime

try:
    supabase_url = st.secrets.get("VITE_SUPABASE_URL") or os.getenv('VITE_SUPABASE_URL')
    supabase_key = st.secrets.get("VITE_SUPABASE_ANON_KEY") or os.getenv('VITE_SUPABASE_ANON_KEY')
except:
    supabase_url = os.getenv('VITE_SUPABASE_URL')
    supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')

supabase = create_client(supabase_url, supabase_key)

def show():
    st.title("Health Alerts")
    st.caption("Monitor and manage all health alerts")

    col1, col2 = st.columns([3, 1])

    with col2:
        filter_option = st.selectbox("Filter", ["All Alerts", "Active Only", "Resolved Only"])

    query = supabase.table('health_alerts').select('*, animals(name, type)')

    if filter_option == "Active Only":
        query = query.eq('resolved', False)
    elif filter_option == "Resolved Only":
        query = query.eq('resolved', True)

    alerts_response = query.order('created_at', desc=True).execute()
    alerts = alerts_response.data if alerts_response.data else []

    if not alerts:
        st.success("✅ No alerts found")
    else:
        st.subheader(f"Alerts ({len(alerts)})")

        for alert in alerts:
            severity_colors = {
                'low': ('🟡', '#FEF3C7', '#92400E'),
                'medium': ('🟠', '#FED7AA', '#9A3412'),
                'high': ('🔴', '#FECACA', '#991B1B'),
                'critical': ('🔴🔴', '#FEE2E2', '#7F1D1D')
            }

            icon, bg_color, text_color = severity_colors.get(alert.get('severity', 'medium'), ('🟠', '#FED7AA', '#9A3412'))

            resolved = alert.get('resolved', False)
            opacity = 0.5 if resolved else 1.0

            with st.container():
                col_main, col_action = st.columns([5, 1])

                with col_main:
                    status_text = "✅ RESOLVED" if resolved else f"{icon} {alert.get('severity', 'Unknown').upper()}"
                    st.markdown(f"**{status_text}**")

                    alert_type = alert.get('alert_type', 'Unknown').replace('_', ' ').title()
                    st.subheader(alert_type)

                    if alert.get('animals'):
                        st.write(f"**Animal:** {alert['animals']['name']} ({alert['animals']['type']})")

                    st.write(alert.get('description', ''))

                    col_a, col_b = st.columns(2)
                    with col_a:
                        detected_at = alert.get('detected_at') or alert.get('created_at')
                        if detected_at:
                            st.caption(f"🕐 {datetime.fromisoformat(detected_at.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M')}")

                    with col_b:
                        st.caption(f"Confidence: {alert.get('confidence_score', 0)}%")

                    if alert.get('notes'):
                        with st.expander("📝 Notes"):
                            st.write(alert['notes'])

                with col_action:
                    if not resolved:
                        if st.button("Mark Resolved", key=f"resolve_{alert.get('id')}", use_container_width=True):
                            try:
                                supabase.table('health_alerts').update({
                                    'resolved': True,
                                    'resolved_at': datetime.now().isoformat()
                                }).eq('id', alert.get('id')).execute()

                                st.success("Resolved!")
                                st.rerun()
                            except Exception as e:
                                st.error(f"Error: {str(e)}")

                st.divider()
