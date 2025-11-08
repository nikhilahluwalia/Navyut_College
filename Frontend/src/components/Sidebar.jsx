import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BarChart2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  MessageSquare,
  FileText,
  HelpCircle,
  LogOut,
  User,
  Bell
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, name: 'Dashboard', path: '/dashboard', badge: null },
  { icon: GraduationCap, name: 'Manage Colleges', path: '/colleges', badge: 3 },
  { icon: Users, name: 'Manage Users', path: '/users', badge: 12 },
  { icon: BookOpen, name: 'Courses', path: '/courses', badge: null },
  { icon: Calendar, name: 'Events', path: '/events', badge: 5 },
  { icon: BarChart2, name: 'Reports', path: '/reports', badge: 'New' },
  { icon: MessageSquare, name: 'Messages', path: '/messages', badge: 8 },
  { icon: FileText, name: 'Documents', path: '/documents', badge: null },
  { icon: Settings, name: 'Settings', path: '/settings', badge: null },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    localStorage.setItem('sidebarCollapsed', !collapsed);
  };

  const userData = {
    name: 'Sarah Wilson',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 z-20 shadow-2xl border-r border-gray-700 ${
          collapsed ? 'w-16' : 'w-64'
        } ${isMobile && !collapsed ? 'translate-x-0' : isMobile ? '-translate-x-full lg:translate-x-0' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">CollegeConnect</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link to="/dashboard" className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg mx-auto">
              <GraduationCap className="w-4 h-4 text-white" />
            </Link>
          )}
          
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-300" />
            )}
          </button>
        </div>

        {/* User Profile */}
        {!collapsed && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={userData.avatar} 
                  alt={userData.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-500/50"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{userData.name}</p>
                <p className="text-xs text-gray-400 truncate">{userData.role}</p>
              </div>
              <button className="p-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
                <Bell className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-500/20 text-blue-400 border-r-2 border-blue-500 shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}>
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"></div>
                )}
                
                {/* Icon */}
                <div className={`relative transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  <item.icon className="w-5 h-5 shrink-0" />
                </div>
                
                {/* Text & Badge */}
                {!collapsed && (
                  <>
                    <span className="ml-3 text-sm font-medium flex-1">{item.name}</span>
                    {item.badge && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        typeof item.badge === 'number' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 text-xs bg-red-500 px-1 rounded">{item.badge}</span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900/50">
          {!collapsed ? (
            <div className="space-y-2">
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors duration-200">
                <HelpCircle className="w-4 h-4 mr-3" />
                Help & Support
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm text-red-300 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200">
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex justify-center space-x-1">
              <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
                <HelpCircle className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      {isMobile && collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed top-4 left-4 z-30 lg:hidden w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center"
        >
          <LayoutDashboard className="w-5 h-5 text-white" />
        </button>
      )}
    </>
  );
}