import React from 'react';
import { DollarSign, TrendingUp, Users, Package, ShoppingBag, BarChart3, Settings, Shield } from 'lucide-react';

export default function OwnerDashboard({ user, darkMode }) {
  const stats = [
    { label: 'Total Revenue', value: '$124,567', icon: DollarSign, color: 'emerald', change: '+22.5%' },
    { label: 'Total Orders', value: '1,234', icon: ShoppingBag, color: 'cyan', change: '+15.3%' },
    { label: 'Active Customers', value: '892', icon: Users, color: 'blue', change: '+8.2%' },
    { label: 'Products Listed', value: '52', icon: Package, color: 'purple', change: '+4' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 234 },
    { month: 'Feb', revenue: 52000, orders: 298 },
    { month: 'Mar', revenue: 61000, orders: 354 },
    { month: 'Apr', revenue: 58000, orders: 312 },
    { month: 'May', revenue: 67000, orders: 389 },
    { month: 'Jun', revenue: 72000, orders: 421 }
  ];

  const topProducts = [
    { id: 1, name: 'MacBook Pro 14" M3', sales: 89, revenue: 155779.11 },
    { id: 2, name: 'iPhone 15 Pro Max', sales: 124, revenue: 173475.76 },
    { id: 3, name: 'Sony WH-1000XM5', sales: 156, revenue: 53023.44 }
  ];

  const systemHealth = [
    { metric: 'Server Uptime', value: '99.98%', status: 'excellent' },
    { metric: 'Response Time', value: '124ms', status: 'good' },
    { metric: 'Database Load', value: '34%', status: 'excellent' },
    { metric: 'Error Rate', value: '0.02%', status: 'excellent' }
  ];

  const getHealthColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-emerald-400 bg-emerald-500/10';
      case 'good': return 'text-blue-400 bg-blue-500/10';
      case 'warning': return 'text-amber-400 bg-amber-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10 border-cyan-500/30' : 'bg-gradient-to-br from-cyan-50 via-purple-50 to-blue-50 border-cyan-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Owner Dashboard - {user.name} 👑</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Complete system overview and analytics</p>
          </div>
          <Shield className="w-12 h-12 text-cyan-400" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
              <span className="text-xs font-semibold px-2 py-1 rounded text-emerald-400 bg-emerald-500/10">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Revenue Overview
            </h3>
            <select className={`px-3 py-1 rounded-lg text-sm border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>

          <div className="space-y-4">
            {revenueData.map((data) => (
              <div key={data.month}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold">{data.month}</span>
                  <span className="text-cyan-400 font-bold">${(data.revenue / 1000).toFixed(1)}K</span>
                </div>
                <div className="relative w-full bg-slate-700/50 rounded-full h-3">
                  <div
                    className="absolute top-0 left-0 h-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  ></div>
                </div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {data.orders} orders
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Top Products
          </h3>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-500/20 text-amber-400' : index === 1 ? 'bg-slate-500/20 text-slate-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1 truncate">{product.name}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
                      {product.sales} sales
                    </div>
                    <div className="text-sm font-bold text-emerald-400">
                      ${product.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            System Health
          </h3>

          <div className="space-y-3">
            {systemHealth.map((item) => (
              <div key={item.metric} className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.value}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getHealthColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Quick Actions */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Admin Actions
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button className={`p-4 rounded-lg border text-left transition ${darkMode ? 'bg-slate-900/50 border-slate-700 hover:border-cyan-500' : 'bg-slate-50 border-slate-200 hover:border-blue-400'}`}>
              <Package className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="font-semibold text-sm">Manage Products</div>
            </button>
            <button className={`p-4 rounded-lg border text-left transition ${darkMode ? 'bg-slate-900/50 border-slate-700 hover:border-cyan-500' : 'bg-slate-50 border-slate-200 hover:border-blue-400'}`}>
              <Users className="w-5 h-5 text-blue-400 mb-2" />
              <div className="font-semibold text-sm">User Management</div>
            </button>
            <button className={`p-4 rounded-lg border text-left transition ${darkMode ? 'bg-slate-900/50 border-slate-700 hover:border-cyan-500' : 'bg-slate-50 border-slate-200 hover:border-blue-400'}`}>
              <BarChart3 className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="font-semibold text-sm">Full Analytics</div>
            </button>
            <button className={`p-4 rounded-lg border text-left transition ${darkMode ? 'bg-slate-900/50 border-slate-700 hover:border-cyan-500' : 'bg-slate-50 border-slate-200 hover:border-blue-400'}`}>
              <Settings className="w-5 h-5 text-purple-400 mb-2" />
              <div className="font-semibold text-sm">System Settings</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
