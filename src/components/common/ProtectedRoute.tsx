import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#082F24]">Verifying Security Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strict role check: Customer trying to access Admin Suite
  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <div className="min-h-[80vh] bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-rose-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-1 bg-rose-100 text-rose-800 text-[11px] font-bold uppercase rounded-full">
              403 Forbidden
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#082F24] mt-2">
              Administrator Privileges Required
            </h2>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Your account (<strong>{user.email}</strong>) has the <strong>Traveler / Customer</strong> role and is not authorized to access the LankaVoyage Admin Management Suite.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/customer"
              className="w-full py-3 bg-[#0D3B2E] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#134E3F] transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-[#E5C378]" />
              <span>Return to Customer Dashboard</span>
            </Link>
            <Link
              to="/login"
              className="w-full py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200 transition-all flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in with Admin Credentials</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
