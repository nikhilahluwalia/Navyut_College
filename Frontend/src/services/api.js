
// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers with authentication
const getHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API call wrapper with error handling
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: getHeaders(),
    });

    const data = await response.json();

    // Handle token expiration
    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error(data.message || 'Authentication failed');
    }

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth Service
export const authService = {
  login: async (email, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  register: async (userData) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Protected API Service (requires authentication)
export const protectedService = {
  getProfile: async () => {
    return await apiCall('/user/profile', {
      method: 'GET',
    });
  },

  getAdminDashboard: async () => {
    return await apiCall('/user/admin/dashboard', {
      method: 'GET',
    });
  },

  getStaffData: async () => {
    return await apiCall('/user/staff/data', {
      method: 'GET',
    });
  },
};

// Mock data for colleges and users (keeping for backward compatibility)
 export const mockData = {
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
  };// Mock data for colleges
const colleges = [
  {
    id: 1,
    name: 'University of Technology',
    location: 'New York, NY',
    budget: 5000000,
    courses: ['Computer Science', 'Engineering', 'Business'],
  },
  // Add more mock colleges
];

// Mock data for users
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Counselor',
    status: 'Active',
  },
  // Add more mock users
];

// Mock data for analytics
const analytics = {
  totalColleges: 150,
  totalUsers: 1250,
  totalBookmarks: 3750,
  userSignups: [
    { date: '2025-01', count: 120 },
    { date: '2025-02', count: 150 },
    // Add more data points
  ],
  collegeBookmarks: [
    { date: '2025-01', count: 300 },
    { date: '2025-02', count: 450 },
    // Add more data points
  ],
  topBookmarkedColleges: [
    { name: 'University of Technology', count: 450 },
    { name: 'State College', count: 380 },
    // Add more colleges
  ],
  userStatus: {
    active: 850,
    inactive: 400,
  },
};

// Mock API functions with Promise delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const collegeService = {
  getColleges: async () => {
    await delay(800);
    return colleges;
  },
  addCollege: async (college) => {
    await delay(800);
    const newCollege = { ...college, id: colleges.length + 1 };
    colleges.push(newCollege);
    return newCollege;
  },
  updateCollege: async (id, college) => {
    await delay(800);
    const index = colleges.findIndex(c => c.id === id);
    if (index === -1) throw new Error('College not found');
    colleges[index] = { ...colleges[index], ...college };
    return colleges[index];
  },
  deleteCollege: async (id) => {
    await delay(800);
    const index = colleges.findIndex(c => c.id === id);
    if (index === -1) throw new Error('College not found');
    colleges.splice(index, 1);
  },
};

export const userService = {
  getUsers: async () => {
    await delay(800);
    return users;
  },
  addUser: async (user) => {
    await delay(800);
    const newUser = { ...user, id: users.length + 1 };
    users.push(newUser);
    return newUser;
  },
  updateUser: async (id, user) => {
    await delay(800);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...user };
    return users[index];
  },
  deleteUser: async (id) => {
    await delay(800);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    users.splice(index, 1);
  },
};

export const analyticsService = {
  getAnalytics: async () => {
    await delay(1000);
    return analytics;
  },
};