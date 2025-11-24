import { Activity, Eye, Bell, Video, TrendingUp, Shield } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">Animal Kingdom</span>
        </div>
        <button
          onClick={onGetStarted}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Sign In
        </button>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Monitor Your Livestock Health
            <br />
            <span className="text-emerald-600">With AI-Powered Insights</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Animal Kingdom uses advanced video analysis to detect health issues in your livestock early,
            helping you maintain a healthier herd and prevent costly veterinary problems.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-emerald-600 text-white text-lg rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Video Analysis</h3>
            <p className="text-slate-600 leading-relaxed">
              Upload videos of your animals and get instant AI-powered analysis of their behavior and health patterns.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Alerts</h3>
            <p className="text-slate-600 leading-relaxed">
              Receive real-time notifications when potential health issues are detected in your livestock.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">24/7 Monitoring</h3>
            <p className="text-slate-600 leading-relaxed">
              Track your animals health status around the clock with continuous monitoring and detailed reports.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Health Trends</h3>
            <p className="text-slate-600 leading-relaxed">
              Visualize health patterns over time to identify issues before they become serious problems.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Early Detection</h3>
            <p className="text-slate-600 leading-relaxed">
              Catch signs of illness early with AI that detects subtle changes in behavior and posture.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Complete Records</h3>
            <p className="text-slate-600 leading-relaxed">
              Maintain comprehensive health records for each animal with automated tracking and documentation.
            </p>
          </div>
        </div>

        <div className="bg-emerald-600 text-white rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Herd?</h2>
          <p className="text-emerald-50 text-lg mb-8">
            Join farmers who are using Animal Kingdom to keep their livestock healthy and thriving.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-emerald-600 text-lg rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Start Monitoring Today
          </button>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-slate-200">
        <div className="text-center text-slate-600">
          <p>&copy; 2024 Animal Kingdom. Keeping your livestock healthy with AI.</p>
        </div>
      </footer>
    </div>
  );
}
