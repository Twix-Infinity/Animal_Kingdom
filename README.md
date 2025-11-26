# Animal Kingdom - Farm Health Monitoring System

A modern web application for monitoring and managing livestock health on farms. Built with React, Vite, and Supabase, this system provides real-time health tracking, video analysis capabilities, and comprehensive analytics for farm animal management.

## About

Animal Kingdom is a comprehensive farm health monitoring platform that helps farmers and veterinarians track animal health, manage alerts, analyze video footage for health insights, and maintain detailed records of their livestock. The application features an intuitive dashboard with real-time statistics, health alerts, and analytics to ensure optimal animal welfare.

## Features

- **Animal Management**: Add, view, edit, and track detailed information about farm animals including species, breed, age, weight, and health status
- **Health Status Tracking**: Monitor animal health with four status levels (healthy, monitoring, sick, critical) with visual indicators
- **Health Alerts System**: Automated alert generation and tracking for animals requiring attention
- **Video Analysis**: Upload and analyze farm video footage for health monitoring insights
- **Analytics Dashboard**: Comprehensive statistics and trends about your farm's animal population
- **User Authentication**: Secure email/password authentication powered by Supabase
- **Responsive Design**: Fully mobile-responsive interface that works seamlessly on phones, tablets, and desktops
- **Real-time Updates**: Instant data synchronization across all connected devices

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for video files)
- **Deployment**: Static hosting compatible

## Prerequisites

- Node.js 18+ and npm
- Supabase account (database is pre-configured)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

The application will be available at `http://localhost:5173` in development mode.

## How to Use

### Getting Started

1. **Sign Up**: Create an account using your email and password on the authentication page
2. **Sign In**: Log in with your credentials to access the dashboard

### Dashboard Overview

The main dashboard provides:
- Total animal count
- Number of healthy animals
- Active health alerts
- Average age of animals
- Recent animal entries
- Current health alerts

### Managing Animals

1. Navigate to the **Animals** tab from the sidebar
2. Click **Add Animal** to register a new animal
3. Fill in the required information:
   - Name
   - Type (cattle, sheep, goat, pig, chicken, etc.)
   - Breed
   - Age (in months)
   - Weight (in kg)
   - Health status (healthy, monitoring, sick, critical)
4. Click **Add Animal** to save
5. View all animals in a comprehensive list with their details
6. Delete animals using the trash icon when needed

### Health Alerts

- View all active health alerts in the **Health Alerts** tab
- Alerts show severity levels (low, medium, high, critical)
- Track which animals require attention
- Mark alerts as resolved when addressed

### Video Analysis

1. Go to the **Video Analysis** tab
2. Upload farm video footage for analysis
3. The system processes videos and provides health insights
4. Review analysis results and recommendations

### Analytics

- Access the **Analytics** tab for detailed insights
- View trends and patterns in animal health
- Monitor farm health metrics over time

## Project Structure

```
project/
├── src/
│   ├── components/         # React components
│   │   ├── AnimalForm.jsx
│   │   ├── AnimalList.jsx
│   │   ├── HealthAlerts.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Stats.jsx
│   │   ├── VideoAnalysis.jsx
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Auth.jsx
│   │   └── Dashboard.jsx
│   ├── lib/               # Utilities
│   │   └── supabase.js
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── supabase/
│   ├── migrations/        # Database migrations
│   └── functions/         # Edge functions
├── dist/                  # Production build
├── index.html
├── package.json
└── vite.config.js
```

## Database Schema

The application uses Supabase with the following main tables:

- **animals**: Stores animal information (id, name, type, breed, age, weight, health_status, etc.)
- **health_alerts**: Tracks health alerts (id, animal_id, severity, description, resolved, etc.)
- **video_analyses**: Stores video analysis results

All tables have Row Level Security (RLS) enabled for data protection.

## Security

- Email/password authentication with Supabase Auth
- Row Level Security (RLS) policies on all database tables
- Secure API key management through environment variables
- CORS protection on edge functions

## Mobile Support

The application is fully responsive and optimized for:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Desktop screens (1024px and up)

Features include:
- Hamburger menu navigation on mobile
- Touch-friendly buttons and controls
- Optimized layouts for small screens
- Responsive typography and spacing

## Support

For issues or questions, please check the application logs or contact your system administrator.

## License

Proprietary - All rights reserved
