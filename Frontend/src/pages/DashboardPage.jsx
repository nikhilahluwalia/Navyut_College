import { 
  Users, School, Bookmark, TrendingUp, AlertCircle, 
  Calendar, MessageSquare, FileText, Download, Filter,
  Search, Plus, Eye, Edit, Trash2, MoreVertical, BarChart3,
  UserCheck, UserX, Clock, CheckCircle, XCircle, Mail
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyticsService, userService, collegeService } from '../services/api';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await analyticsService.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mock data for demonstration
  const mockData = {
    totalColleges: 156,
    totalUsers: 12458,
    totalBookmarks: 45623,
    pendingApprovals: 23,
    activeSessions: 342,
    userSignups: [
      { date: 'Jan 1', count: 120 },
      { date: 'Jan 2', count: 190 },
      { date: 'Jan 3', count: 300 },
      { date: 'Jan 4', count: 500 },
      { date: 'Jan 5', count: 200 },
      { date: 'Jan 6', count: 300 },
      { date: 'Jan 7', count: 450 },
    ],
    collegeBookmarks: [
      { date: 'Jan 1', count: 450 },
      { date: 'Jan 2', count: 520 },
      { date: 'Jan 3', count: 780 },
      { date: 'Jan 4', count: 910 },
      { date: 'Jan 5', count: 670 },
      { date: 'Jan 6', count: 830 },
      { date: 'Jan 7', count: 980 },
    ],
    topBookmarkedColleges: [
      { id: 1, name: 'Stanford University', count: 2450, status: 'active' },
      { id: 2, name: 'MIT', count: 2180, status: 'active' },
      { id: 3, name: 'Harvard University', count: 1950, status: 'active' },
      { id: 4, name: 'Caltech', count: 1670, status: 'pending' },
      { id: 5, name: 'Princeton University', count: 1420, status: 'active' },
    ],
    recentUsers: [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-15', college: 'Stanford' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending', joinDate: '2024-01-14', college: 'MIT' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'active', joinDate: '2024-01-13', college: 'Harvard' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'suspended', joinDate: '2024-01-12', college: 'Princeton' },
    ],
    userDistribution: [
      { name: 'Students', value: 75 },
      { name: 'Faculty', value: 15 },
      { name: 'Staff', value: 10 },
    ],
    collegeDistribution: [
      { name: 'Public', value: 60 },
      { name: 'Private', value: 40 },
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  // Merge fetched analytics with mockData so missing fields don't cause runtime errors
  const data = analytics ? { ...mockData, ...analytics } : mockData;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Colleges"
          value={data.totalColleges}
          icon={School}
          trend={12}
          description="Registered institutions"
          delay={100}
        />
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          icon={Users}
          trend={8}
          description="Active platform users"
          delay={200}
        />
        <StatCard
          title="Total Bookmarks"
          value={data.totalBookmarks}
          icon={Bookmark}
          trend={15}
          description="College saves"
          delay={300}
        />
        <StatCard
          title="Pending Approvals"
          value={data.pendingApprovals || 23}
          icon={AlertCircle}
          trend={-5}
          description="Require attention"
          delay={400}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Signups Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Signups Trend
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Signups</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.userSignups || []}>
                <defs>
                  <linearGradient id="userSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  fill="url(#userSignups)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookmarks Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              College Bookmarks Trend
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Bookmarks</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.collegeBookmarks || []}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row - User Distribution and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Distribution */}
        <div className="card lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            User Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.userDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data.userDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {(data.userDistribution || []).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent User Activity
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {(data.recentUsers || []).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email} • {user.college}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : user.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {user.status}
                  </span>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.joinDate}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row - Popular Colleges and Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Popular Colleges */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Most Popular Colleges
            </h3>
            <button className="btn-primary flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>View Reports</span>
            </button>
          </div>
          <div className="space-y-4">
            {(data.topBookmarkedColleges || []).map((college, index) => (
              <div
                key={college.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {college.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {college.count.toLocaleString()} bookmarks
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    college.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {college.status}
                  </span>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
              <Users className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-900 dark:text-white">Manage Users</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">1,248 new</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
              <School className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-900 dark:text-white">Colleges</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">156 total</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
              <FileText className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-900 dark:text-white">Reports</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group">
{/* <Settings className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" /> */}
              <span className="font-medium text-gray-900 dark:text-white">Settings</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure</span>
            </button>
          </div>

          {/* System Status */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">System Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">API Response</span>
                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Server Load</span>
                <span className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                  <Clock className="w-4 h-4 mr-1" />
                  Moderate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}