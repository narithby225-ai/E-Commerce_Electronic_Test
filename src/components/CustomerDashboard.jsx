import React, { useState } from 'react';
import { ShoppingBag, Heart, MapPin, CreditCard, Clock, Package, Truck, Eye } from 'lucide-react';
import DeliveryTracker from './DeliveryTracker';

export default function CustomerDashboard({ user, darkMode, orders = [] }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const stats = [
    { label: 'Total Orders', value: '12', icon: ShoppingBag, color: 'cyan' },
    { label: 'Wishlist Items', value: '8', icon: Heart, color: 'rose' },
    { label: 'Saved Addresses', value: '3', icon: MapPin, color: 'blue' },
    { label: 'Payment Methods', value: '2', icon: CreditCard, color: 'green' }
  ];

  // Get user's orders
  const userOrders = orders.filter(order => order.userId === user.id || (!order.userId && order.id));
  
  const getDisplayStatus = (deliveryStatus) => {
    switch (deliveryStatus) {
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return 'Processing';
    }
  };

  const getStatusColor = (deliveryStatus) => {
    switch (deliveryStatus) {
      case 'delivered': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'out_for_delivery': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'preparing': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200'}`}>
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
        <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Manage your orders, wishlist, and account settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold">{userOrders.length}</span>
          </div>
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Orders</div>
        </div>
        {stats.slice(1).map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders with Delivery Tracking */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            Your Orders & Delivery
          </h3>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No orders yet</p>
            <p className="text-xs mt-1">Your orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userOrders.slice(0, 5).map((order) => (
              <div key={order.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold">Order #{order.id}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.deliveryStatus)}`}>
                    {getDisplayStatus(order.deliveryStatus)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-slate-700">
                  <div className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                    {order.items.length} item(s) • ${order.total.toFixed(2)}
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivery Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-y-auto max-h-[90vh] ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="p-6">
              <DeliveryTracker order={selectedOrder} darkMode={darkMode} />
              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-4 w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className={`p-4 rounded-xl border text-left transition ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500' : 'bg-white border-slate-200 hover:border-blue-400'}`}>
          <ShoppingBag className="w-6 h-6 text-cyan-400 mb-2" />
          <div className="font-semibold mb-1">Track Orders</div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>View order status</div>
        </button>
        <button className={`p-4 rounded-xl border text-left transition ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500' : 'bg-white border-slate-200 hover:border-blue-400'}`}>
          <Heart className="w-6 h-6 text-rose-400 mb-2" />
          <div className="font-semibold mb-1">Wishlist</div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>View saved items</div>
        </button>
        <button className={`p-4 rounded-xl border text-left transition ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500' : 'bg-white border-slate-200 hover:border-blue-400'}`}>
          <MapPin className="w-6 h-6 text-blue-400 mb-2" />
          <div className="font-semibold mb-1">Addresses</div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage addresses</div>
        </button>
      </div>
    </div>
  );
}
