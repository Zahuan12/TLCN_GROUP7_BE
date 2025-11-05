import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
// Import other pages as they are created
// import LoginPage from './pages/Login';
// import UsersPage from './pages/Users';
// import CompaniesPage from './pages/Companies';
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
          
          {/* TODO: Add other routes */}
          {/* <Route path="/users" element={<UsersPage />} /> */}
          {/* <Route path="/companies" element={<CompaniesPage />} /> */}
          {/* <Route path="/career-paths" element={<CareerPathsPage />} /> */}
          {/* <Route path="/blogs" element={<BlogsPage />} /> */}
          {/* <Route path="/reports/*" element={<ReportsPage />} /> */}
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

