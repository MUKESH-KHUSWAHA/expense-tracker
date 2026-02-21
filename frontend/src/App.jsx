import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { PreferencesProvider } from "./context/PreferencesContext";

const Analytics = lazy(() => import("./pages/Analytics"));

const App = () => {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route
              path="analytics"
              element={
                <Suspense
                  fallback={
                    <div className="flex flex-col items-center justify-center py-24">
                      <div className="h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading analytics...</p>
                    </div>
                  }
                >
                  <Analytics />
                </Suspense>
              }
            />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PreferencesProvider>
    </AuthProvider>
  );
};

export default App;
