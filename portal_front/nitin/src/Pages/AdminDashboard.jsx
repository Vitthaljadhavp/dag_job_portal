import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Briefcase,
  AlertCircle,
  MessageCircle,
  Mail,
  Settings,
  ShieldCheck,
  ToggleLeft,
  MessageSquareText,
  Calendar,
  Cpu,
  FileText,
  TrendingUp,
  Star,
  UserCheck,
  EyeOff,
  Palette,
  Megaphone,
  Globe,
  Download,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserRoundCog,
  LogOut,
  KeyRound,
  Languages,
  User,
  MessagesSquare,
  ClipboardList,
} from "lucide-react";
import { motion } from "framer-motion";
import "./AdminDashboard.css";

const dashboardItems = [
  { title: "Manage Users", icon: <Users size={22} />, section: "users" },
  { title: "Reports & Analytics", icon: <BarChart3 size={22} />, section: "reports" },
  { title: "Handle Complaints", icon: <AlertCircle size={22} />, section: "complaints" },
  { title: "Job Post Moderation", icon: <Briefcase size={22} />, section: "jobs" },
  { title: "Application Review", icon: <ClipboardList size={22} />, section: "applications" },
  { title: "Admin Notifications", icon: <Bell size={22} />, section: "notifications" },
  { title: "Feedback Center", icon: <MessagesSquare size={22} />, section: "feedback" },
  { title: "User Messages", icon: <Mail size={22} />, section: "messages" },
  { title: "Profile Settings", icon: <Settings size={22} />, section: "profile" },
  { title: "Security Logs", icon: <ShieldCheck size={22} />, section: "security" },
  { title: "Platform Settings", icon: <Settings size={22} />, section: "platform" },
  { title: "Admin Chat Support", icon: <MessageSquareText size={22} />, section: "chat" },
  { title: "Activity Timeline", icon: <LayoutDashboard size={22} />, section: "activity" },
  { title: "Admin Calendar", icon: <Calendar size={22} />, section: "calendar" },
  { title: "System Health Monitor", icon: <Cpu size={22} />, section: "health" },
  { title: "Revenue Reports", icon: <FileText size={22} />, section: "revenue" },
  { title: "Top Jobs Performance", icon: <TrendingUp size={22} />, section: "topjobs" },
  { title: "Top Recruiters Analytics", icon: <Star size={22} />, section: "toprecruiters" },
  { title: "User Retention Stats", icon: <UserCheck size={22} />, section: "retention" },
  { title: "Blocked Users List", icon: <EyeOff size={22} />, section: "blocked" },
  { title: "Theme Customization", icon: <Palette size={22} />, section: "theme" },
  { title: "Dark Mode Toggle", icon: <ToggleLeft size={22} />, section: "darkmode" },
  { title: "Admin Announcements", icon: <Megaphone size={22} />, section: "announcements" },
  { title: "Live Traffic Overview", icon: <Globe size={22} />, section: "traffic" },
  { title: "Export Platform Data", icon: <Download size={22} />, section: "export" },
];

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "dark") setDarkMode(true);

    const nameFromStorage = localStorage.getItem("adminName");
    if (nameFromStorage) setAdminName(nameFromStorage);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("adminTheme", newMode ? "dark" : "light");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenu(!mobileMenu);

  // Dropdown Actions
  const handleManageProfile = () => alert("Manage Profile Clicked");
  const handleChangePassword = () => alert("Change Password Clicked");
  const handleLanguageSettings = () => alert("Language Settings Clicked");
  const handleAdminSettings = () => alert("Admin Settings Clicked");
  const handleLogout = () => {
    localStorage.removeItem("adminName");
    alert("Logged Out");
    window.location.href = "/login";
  };

  return (
    <div className={`admin-container ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <div className="sidebar-top">
          <h2 className="logo">{sidebarOpen ? "AdminPanel" : "AP"}</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
        <nav className="nav-links">
          {dashboardItems.map((item, index) => (
            <a key={index} href={`#${item.section}`} className="nav-item">
              <div className="icon">{item.icon}</div>
              {sidebarOpen && <span>{item.title}</span>}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-section">
        {/* Topbar */}
        <div className="topbar">
          <div className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </div>
          <div className="welcome-message">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3256/3256013.png"
              alt="hello"
              className="icon-3d"
            />
            <h1>Welcome, {adminName}</h1>
          </div>

          <div className="topbar-right">
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="profile-dropdown">
              <img
                src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
                alt="profile"
                className="profile-pic"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={handleManageProfile}>
                    <User className="icon-3d" /> Manage Profile
                  </div>
                  <div className="dropdown-item" onClick={handleChangePassword}>
                    <KeyRound className="icon-3d" /> Change Password
                  </div>
                  <div className="dropdown-item" onClick={handleLanguageSettings}>
                    <Languages className="icon-3d" /> Language Settings
                  </div>
                  <div className="dropdown-item" onClick={handleAdminSettings}>
                    <Settings className="icon-3d" /> Admin Settings
                  </div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut className="icon-3d" /> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {mobileMenu && (
          <motion.div
            className="mobile-sidebar"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="nav-links-mobile">
              {dashboardItems.map((item, index) => (
                <a key={index} href={`#${item.section}`} onClick={toggleMobileMenu}>
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              ))}
            </nav>
          </motion.div>
        )}

        {/* Dashboard Cards */}
        <div className="dashboard-cards">
          {dashboardItems.slice(0, 9).map((item, index) => (
            <motion.div
              key={index}
              className="dashboard-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              id={item.section}
            >
              <div className="card-icon icon-3d">{item.icon}</div>
              <h2>{item.title}</h2>
              <p>This section is for {item.title.toLowerCase()}.</p>
              <button className="go-btn">Go</button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
