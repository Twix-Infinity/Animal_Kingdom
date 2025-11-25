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
    st.title("Animals")
    st.caption("Manage your farm animals")

    col1, col2 = st.columns([3, 1])

    with col2:
        if st.button("➕ Add Animal", use_container_width=True):
            st.session_state.show_add_form = True

    if st.session_state.get('show_add_form', False):
        st.subheader("Add New Animal")

        with st.form("add_animal_form"):
            col_a, col_b = st.columns(2)

            with col_a:
                name = st.text_input("Name*")
                animal_type = st.selectbox("Type*", ["cow", "pig", "chicken"])
                age_months = st.number_input("Age (months)*", min_value=0, value=0)
                weight_kg = st.number_input("Weight (kg)", min_value=0.0, value=0.0, step=0.1)

            with col_b:
                health_status = st.selectbox("Health Status", ["healthy", "monitoring", "sick", "critical"])
                pen_location = st.text_input("Pen Location*")
                last_checked = st.date_input("Last Checked")

            col_submit, col_cancel = st.columns(2)

            with col_submit:
                submitted = st.form_submit_button("Add Animal", use_container_width=True)

            with col_cancel:
                cancel = st.form_submit_button("Cancel", use_container_width=True)

            if submitted:
                if not name or not pen_location:
                    st.error("Please fill in all required fields")
                else:
                    try:
                        response = supabase.table('animals').insert({
                            'name': name,
                            'type': animal_type,
                            'age_months': age_months,
                            'weight_kg': weight_kg,
                            'health_status': health_status,
                            'pen_location': pen_location,
                            'last_checked': last_checked.isoformat() if last_checked else None
                        }).execute()

                        st.success(f"Added {name} successfully!")
                        st.session_state.show_add_form = False
                        st.rerun()
                    except Exception as e:
                        st.error(f"Error adding animal: {str(e)}")

            if cancel:
                st.session_state.show_add_form = False
                st.rerun()

    st.divider()

    animals_response = supabase.table('animals').select('*').order('created_at', desc=True).execute()
    animals = animals_response.data if animals_response.data else []

    if not animals:
        st.info("No animals added yet. Click 'Add Animal' to get started.")
    else:
        st.subheader(f"All Animals ({len(animals)})")

        for animal in animals:
            status_colors = {
                'healthy': '🟢',
                'monitoring': '🔵',
                'sick': '🟡',
                'critical': '🔴'
            }
            status_icon = status_colors.get(animal.get('health_status', 'healthy'), '🟢')

            with st.expander(f"{status_icon} {animal.get('name', 'Unknown')} - {animal.get('type', 'Unknown').title()}"):
                col_info, col_actions = st.columns([4, 1])

                with col_info:
                    col_a, col_b, col_c = st.columns(3)

                    with col_a:
                        st.write(f"**Age:** {animal.get('age_months', 0)} months")
                        st.write(f"**Weight:** {animal.get('weight_kg', 0)} kg")

                    with col_b:
                        st.write(f"**Location:** {animal.get('pen_location', 'N/A')}")
                        st.write(f"**Status:** {animal.get('health_status', 'Unknown').title()}")

                    with col_c:
                        last_checked = animal.get('last_checked')
                        if last_checked:
                            st.write(f"**Last Checked:** {last_checked}")
                        st.write(f"**ID:** {animal.get('id', 'N/A')[:8]}...")

                with col_actions:
                    if st.button("🗑️ Delete", key=f"delete_{animal.get('id')}", use_container_width=True):
                        if st.session_state.get(f"confirm_delete_{animal.get('id')}", False):
                            try:
                                supabase.table('animals').delete().eq('id', animal.get('id')).execute()
                                st.success("Deleted successfully!")
                                st.rerun()
                            except Exception as e:
                                st.error(f"Error deleting: {str(e)}")
                        else:
                            st.session_state[f"confirm_delete_{animal.get('id')}"] = True
                            st.warning("Click again to confirm")
