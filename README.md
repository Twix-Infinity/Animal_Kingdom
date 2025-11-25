# Animal Kingdom - Farm Health Monitoring System

A Streamlit web application for monitoring livestock health with Supabase database integration.

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
```

## Running the Application

Start the Streamlit server:
```bash
streamlit run app.py
```

The application will be available at `http://localhost:8501`

## Features

- User authentication (login/signup)
- Dashboard with real-time statistics
- Animal management (add, view, delete animals)
- Health status tracking with color-coded indicators
- Alert system for health issues with severity levels
- Analytics dashboard with charts and visualizations
- Video analysis history tracking
- Supabase database integration

## Project Structure

```
project/
├── app.py                 # Main Streamlit application
├── requirements.txt       # Python dependencies
├── pages/                 # Streamlit page modules
│   ├── dashboard.py       # Dashboard overview
│   ├── animals.py         # Animal management
│   ├── health_alerts.py   # Health alerts management
│   ├── analytics.py       # Analytics and visualizations
│   └── video_analysis.py  # Video analysis history
└── supabase/
    └── migrations/        # Database migrations
```

## Database

The application uses Supabase with the following tables:
- `animals` - Stores animal information (name, type, age, weight, health status, location)
- `health_alerts` - Tracks health alerts and issues with severity levels
- `video_analyses` - Stores video analysis results and detected behaviors

Migrations are located in `supabase/migrations/`.

## Pages

### Dashboard
View overall farm statistics and recent animals with active alerts.

### Animals
Manage your farm animals - add new animals, view details, and delete records.

### Health Alerts
Monitor and resolve health alerts with filtering options for active/resolved alerts.

### Analytics
Comprehensive analytics dashboard with charts showing:
- Health status distribution
- Animal type distribution
- Alert severity breakdown
- Key metrics overview

### Video Analysis
View history of all video analyses with detected behaviors and anomalies.

## Color Scheme

The application uses a warm, professional brown and beige color palette suitable for agricultural applications.
