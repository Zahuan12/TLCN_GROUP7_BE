import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import CompaniesPage from './pages/Companies';
import CareerPathsPage from './pages/CareerPaths';
import BlogsPage from './pages/Blogs';
import StudentsPage from './pages/Students';
import ReportsPage from './pages/Reports';
// Import other pages as they are created
// import LoginPage from './pages/Login';
// etc...

/**
 * Main App Component
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/login" element={<LoginPage />} /> */}

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/career-paths" element={<CareerPathsPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:type" element={<ReportsPage />} />
          
          {/* TODO: Add other routes */}
          {/* <Route path="/settings/*" element={<SettingsPage />} /> */}

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

