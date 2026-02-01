// frontend/src/pages/LandingPage.jsx
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { user, loading } = useAuth();
  
  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }
  
  // If user is already logged in, redirect to appropriate dashboard
  if (user) {
    if (user.role === "client") {
      return <Navigate to="/client-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Function to scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">TaskFlow Pro</div>
          <div className="space-x-4">
            <button
              onClick={scrollToFeatures}
              className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              About
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your
              <span className="text-blue-600"> Task Management</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A powerful platform for teams to manage tasks, collaborate with clients, 
              and boost productivity. Perfect for businesses, freelancers, and agencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition shadow-lg hover:shadow-xl text-center"
              >
                Start Free Today
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-500 border-2 border-blue-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition text-center"
              >
                Existing User
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl shadow-2xl transform rotate-3"></div>
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl shadow-2xl transform -rotate-6"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Added id for scrolling */}
      <section id="features-section" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Everything You Need
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Task Management</h3>
              <p className="text-gray-600">
                Create, assign, and track tasks with deadlines. Organize by priority and status.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Client Portal</h3>
              <p className="text-gray-600">
                Dedicated dashboard for clients to view tasks, update status, and communicate.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold mb-3">User Management</h3>
              <p className="text-gray-600">
                Manage user roles (admin, user, client) and permissions with ease.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Updates</h3>
              <p className="text-gray-600">
                Instant notifications and live updates on task progress and changes.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Enterprise-grade security with role-based access control and data protection.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Responsive Design</h3>
              <p className="text-gray-600">
                Works perfectly on desktop, tablet, and mobile devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0">
            <div className="text-center md:w-1/3">
              <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Register & Login</h3>
              <p className="text-gray-600">
                Sign up as a user or client. Get instant access to your personalized dashboard.
              </p>
            </div>
            
            <div className="text-center md:w-1/3">
              <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Manage Tasks</h3>
              <p className="text-gray-600">
                Create tasks, assign to clients, set deadlines, and track progress in real-time.
              </p>
            </div>
            
            <div className="text-center md:w-1/3">
              <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Collaborate</h3>
              <p className="text-gray-600">
                Clients update task status, communicate updates, and stay informed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join teams worldwide who are already transforming their workflow with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-slate-100 transition shadow-lg"
            >
              Start Free Today
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10 transition"
            >
                Existing User
            </Link>
          </div>
          <p className="mt-6 text-blue-100">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} TaskFlow Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;