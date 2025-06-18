import { create } from 'zustand'

const useSettingsStore = create((set, get) => ({
  // State
  users: [],
  staff: [],
  roles: [],
  permissions: [],
  activityLogs: [],
  settingsStats: {
    totalUsers: 0,
    activeStaff: 0,
    totalRoles: 0,
    pendingInvites: 0
  },
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    role: 'all',
    department: 'all'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  },

  // Mock data for demonstration
  mockUsers: [
    {
      id: 'USR001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Admin',
      department: 'Management',
      status: 'Active',
      lastLogin: new Date().toISOString(),
      joinedDate: new Date(Date.now() - 86400000 * 365).toISOString(),
      permissions: ['read', 'write', 'delete', 'admin']
    },
    {
      id: 'USR002',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Manager',
      department: 'Sales',
      status: 'Active',
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
      joinedDate: new Date(Date.now() - 86400000 * 180).toISOString(),
      permissions: ['read', 'write']
    },
    {
      id: 'USR003',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Developer',
      department: 'Engineering',
      status: 'Active',
      lastLogin: new Date(Date.now() - 7200000).toISOString(),
      joinedDate: new Date(Date.now() - 86400000 * 90).toISOString(),
      permissions: ['read', 'write']
    },
    {
      id: 'USR004',
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Designer',
      department: 'Design',
      status: 'Inactive',
      lastLogin: new Date(Date.now() - 86400000 * 7).toISOString(),
      joinedDate: new Date(Date.now() - 86400000 * 60).toISOString(),
      permissions: ['read']
    },
    {
      id: 'USR005',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@company.com',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Support',
      department: 'Customer Service',
      status: 'Pending',
      lastLogin: null,
      joinedDate: new Date().toISOString(),
      permissions: ['read']
    }
  ],

  mockStaff: [
    {
      id: 'STF001',
      employeeId: 'EMP001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      position: 'CEO',
      department: 'Management',
      salary: 150000,
      hireDate: new Date(Date.now() - 86400000 * 365).toISOString(),
      status: 'Active',
      manager: null,
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY'
    },
    {
      id: 'STF002',
      employeeId: 'EMP002',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      position: 'Sales Manager',
      department: 'Sales',
      salary: 85000,
      hireDate: new Date(Date.now() - 86400000 * 180).toISOString(),
      status: 'Active',
      manager: 'Sarah Johnson',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Los Angeles, CA'
    },
    {
      id: 'STF003',
      employeeId: 'EMP003',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      position: 'Senior Developer',
      department: 'Engineering',
      salary: 95000,
      hireDate: new Date(Date.now() - 86400000 * 90).toISOString(),
      status: 'Active',
      manager: 'Sarah Johnson',
      phone: '+1 (555) 345-6789',
      address: '789 Pine St, Chicago, IL'
    }
  ],

  mockRoles: [
    {
      id: 'ROLE001',
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: ['read', 'write', 'delete', 'admin', 'user_management', 'system_settings'],
      userCount: 1,
      color: 'red',
      createdAt: new Date(Date.now() - 86400000 * 365).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      id: 'ROLE002',
      name: 'Manager',
      description: 'Department management with limited admin access',
      permissions: ['read', 'write', 'user_management'],
      userCount: 1,
      color: 'blue',
      createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 15).toISOString()
    },
    {
      id: 'ROLE003',
      name: 'Developer',
      description: 'Development access with code repository permissions',
      permissions: ['read', 'write', 'code_access'],
      userCount: 1,
      color: 'green',
      createdAt: new Date(Date.now() - 86400000 * 200).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 10).toISOString()
    },
    {
      id: 'ROLE004',
      name: 'Designer',
      description: 'Design tools and asset management access',
      permissions: ['read', 'design_tools'],
      userCount: 1,
      color: 'purple',
      createdAt: new Date(Date.now() - 86400000 * 150).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'ROLE005',
      name: 'Support',
      description: 'Customer support and ticket management',
      permissions: ['read', 'support_tickets'],
      userCount: 1,
      color: 'orange',
      createdAt: new Date(Date.now() - 86400000 * 100).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],

  mockPermissions: [
    { id: 'read', name: 'Read', description: 'View content and data' },
    { id: 'write', name: 'Write', description: 'Create and edit content' },
    { id: 'delete', name: 'Delete', description: 'Remove content and data' },
    { id: 'admin', name: 'Admin', description: 'Full administrative access' },
    { id: 'user_management', name: 'User Management', description: 'Manage users and permissions' },
    { id: 'system_settings', name: 'System Settings', description: 'Configure system settings' },
    { id: 'code_access', name: 'Code Access', description: 'Access code repositories' },
    { id: 'design_tools', name: 'Design Tools', description: 'Access design applications' },
    { id: 'support_tickets', name: 'Support Tickets', description: 'Manage customer support' }
  ],

  mockActivityLogs: [
    {
      id: 'LOG001',
      user: 'Sarah Johnson',
      action: 'User Created',
      target: 'Lisa Thompson',
      timestamp: new Date().toISOString(),
      details: 'Created new user account with Support role'
    },
    {
      id: 'LOG002',
      user: 'Michael Chen',
      action: 'Role Updated',
      target: 'Developer Role',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: 'Added code_access permission to Developer role'
    },
    {
      id: 'LOG003',
      user: 'Sarah Johnson',
      action: 'User Deactivated',
      target: 'David Wilson',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      details: 'Deactivated user account due to inactivity'
    }
  ],

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch users
  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const { mockUsers } = get()
      set({ 
        users: mockUsers,
        loading: false 
      })
    } catch (error) {
      set({ error, loading: false })
    }
  },

  // Fetch staff
  fetchStaff: async () => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const { mockStaff } = get()
      set({ 
        staff: mockStaff,
        loading: false 
      })
    } catch (error) {
      set({ error, loading: false })
    }
  },

  // Fetch roles
  fetchRoles: async () => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      const { mockRoles } = get()
      set({ 
        roles: mockRoles,
        loading: false 
      })
    } catch (error) {
      set({ error, loading: false })
    }
  },

  // Fetch permissions
  fetchPermissions: async () => {
    try {
      const { mockPermissions } = get()
      set({ permissions: mockPermissions })
    } catch (error) {
      set({ error })
    }
  },

  // Fetch activity logs
  fetchActivityLogs: async () => {
    try {
      const { mockActivityLogs } = get()
      set({ activityLogs: mockActivityLogs })
    } catch (error) {
      set({ error })
    }
  },

  // Fetch settings statistics
  fetchSettingsStats: async () => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const { mockUsers, mockStaff, mockRoles } = get()
      const stats = {
        totalUsers: mockUsers.length,
        activeStaff: mockStaff.filter(s => s.status === 'Active').length,
        totalRoles: mockRoles.length,
        pendingInvites: mockUsers.filter(u => u.status === 'Pending').length
      }
      set({ 
        settingsStats: stats,
        loading: false 
      })
    } catch (error) {
      set({ error, loading: false })
    }
  },

  // Create user
  createUser: async (userData) => {
    set({ loading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newUser = {
        id: `USR${Date.now()}`,
        ...userData,
        joinedDate: new Date().toISOString(),
        lastLogin: null,
        status: 'Pending'
      }
      set(state => ({
        users: [...state.users, newUser],
        loading: false
      }))
    } catch (error) {
      set({ error, loading: false })
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    set({ loading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, ...userData } : user
        ),
        loading: false
      }))
    } catch (error) {
      set({ error, loading: false })
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    set({ loading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      set(state => ({
        users: state.users.filter(user => user.id !== userId),
        loading: false
      }))
    } catch (error) {
      set({ error, loading: false })
    }
  },

  // Create role
  createRole: async (roleData) => {
    set({ loading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const newRole = {
        id: `ROLE${Date.now()}`,
        ...roleData,
        userCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      set(state => ({
        roles: [...state.roles, newRole],
        loading: false
      }))
    } catch (error) {
      set({ error, loading: false })
    }
  },

  // Update role
  updateRole: async (roleId, roleData) => {
    set({ loading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      set(state => ({
        roles: state.roles.map(role =>
          role.id === roleId ? { ...role, ...roleData, updatedAt: new Date().toISOString() } : role
        ),
        loading: false
      }))
    } catch (error) {
      set({ error, loading: false })
    }
  },

  // Delete role
  deleteRole: async (roleId) => {
    set({ loading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      set(state => ({
        roles: state.roles.filter(role => role.id !== roleId),
        loading: false
      }))
    } catch (error) {
      set({ error, loading: false })
    }
  },

  // Update filters
  updateFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 }
    }))
  },

  // Update pagination
  updatePagination: (newPagination) => {
    set(state => ({
      pagination: { ...state.pagination, ...newPagination }
    }))
  },

  // Get filtered users
  getFilteredUsers: () => {
    const { users, filters, pagination } = get()
    
    let filtered = users.filter(user => {
      const matchesSearch = !filters.search || 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.role.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesStatus = filters.status === 'all' || user.status === filters.status
      const matchesRole = filters.role === 'all' || user.role === filters.role
      const matchesDepartment = filters.department === 'all' || user.department === filters.department
      
      return matchesSearch && matchesStatus && matchesRole && matchesDepartment
    })

    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
    const endIndex = startIndex + pagination.itemsPerPage
    
    return {
      items: filtered.slice(startIndex, endIndex),
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / pagination.itemsPerPage)
    }
  },

  // Get filtered staff
  getFilteredStaff: () => {
    const { staff, filters, pagination } = get()
    
    let filtered = staff.filter(member => {
      const matchesSearch = !filters.search || 
        member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.position.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesStatus = filters.status === 'all' || member.status === filters.status
      const matchesDepartment = filters.department === 'all' || member.department === filters.department
      
      return matchesSearch && matchesStatus && matchesDepartment
    })

    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
    const endIndex = startIndex + pagination.itemsPerPage
    
    return {
      items: filtered.slice(startIndex, endIndex),
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / pagination.itemsPerPage)
    }
  },

  // Computed stats
  computedStats: () => {
    const { settingsStats } = get()
    return [
      {
        title: 'Total Users',
        value: settingsStats.totalUsers.toLocaleString(),
        trend: '+12.5%',
        increasing: true,
        icon: '👥',
        color: 'blue'
      },
      {
        title: 'Active Staff',
        value: settingsStats.activeStaff.toLocaleString(),
        trend: '+8.2%',
        increasing: true,
        icon: '👨‍💼',
        color: 'green'
      },
      {
        title: 'Total Roles',
        value: settingsStats.totalRoles.toLocaleString(),
        trend: '+2.1%',
        increasing: true,
        icon: '🔐',
        color: 'purple'
      },
      {
        title: 'Pending Invites',
        value: settingsStats.pendingInvites.toLocaleString(),
        trend: '-15.3%',
        increasing: false,
        icon: '📧',
        color: 'orange'
      }
    ]
  }
}))

export default useSettingsStore