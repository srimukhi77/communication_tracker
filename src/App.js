import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  NavLink,
} from "react-router-dom";
import { Bell } from "lucide-react";
import { useCommunication } from "./context/data";
import { CommunicationProvider } from "./context/data";
import AdminModule from "./routes/adminModule";
import UserDashboard from "./routes/userDashboard";
import CalendarView from "./components/notificationCalander";
import CompanyListPage from "./routes/companies";
import NotificationsPage from "./components/notification";
import { ThemeProvider, useTheme } from './ThemeContext';
// import { useTheme } from './ThemeContext';
import './styles.css';
// import ThemedApp from './ThemedApp';


import "./App.css";

function AppContent() {
  const { overdueCommunicationsCount } = useCommunication();
  const { theme, toggleTheme } = useTheme();

  return (
    // <Router>
      <div className={`app-container ${theme}`}>
        <nav className="main-navigation">
          <div className="logo">Communication Tracker</div>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Add Company
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/company"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Company List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/calendar"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Calendar
              </NavLink>
            </li>
            <li>
              <NavLink to="/notification" className="overdue-notification">
                <Bell size={24} />
                {overdueCommunicationsCount > 0 && (
                  <span className="notification-badge">
                    {overdueCommunicationsCount}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>

        <button className="theme-toggle" onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Theme
      </button>
    
        <main className="main-content">
          <Routes>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminModule />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/company" element={<CompanyListPage />} />
            <Route path="/notification" element={<NotificationsPage />} />
          </Routes>
        </main>
      </div>
      
  );
}
function App() {
  return (
    <ThemeProvider>
      <CommunicationProvider>
        <Router>
          <AppContent />
        </Router>
      </CommunicationProvider>
    </ThemeProvider>
  );
}

export default App;
