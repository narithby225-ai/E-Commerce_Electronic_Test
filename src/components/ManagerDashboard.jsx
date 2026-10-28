import React, { useState } from 'react';
import { Package, TrendingUp, Users, AlertCircle, CheckCircle, Clock, Box, Plus, Truck, RefreshCw } from 'lucide-react';
import AddProduct from './AddProduct';
import DeliveryTracker from './DeliveryTracker';

export default function ManagerDashboard({ user, darkMode, onAddProduct, orders = [], onUpdateOrderStatus }) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const stats = [
    { label: 'Pending Orders', value: orders.filter(o => o.deliveryStatus === 'preparing').length.toString(), icon: Clock, color: 'amber', change: '+12%' },
    { label: 'Out for Delivery', value: orders.filter(o => o.deliveryStatus === 'out_for_delivery').length.toString(), icon: Truck, color: 'blue', change: '+8%' },
    { label: 'Delivered Today', value: orders.filter(o => o.deliveryStatus === 'delivered' && new Date(o.statusTimestamp).toDateString() === new Date().toDateString()).length.toString(), icon: CheckCircle, color: 'emerald', change: '+15%' },
    { label: 'Total Orders', value: orders.length.toString(), icon: Package, color: 'cyan', change: '+20%' }
  ];

  // Filter orders by status
  const preparingOrders = orders.filter(o => o.deliveryStatus === 'preparing');
  const deliveryOrders = orders.filter(o => o.deliveryStatus === 'out_for_delivery');

  const updateDeliveryStatus = (orderId, newStatus) => {
    if (onUpdateOrderStatus) {
      const courierInfo = newStatus === 'out_for_delivery' ? {
        name: 'FastExpress',
        phone: '+1 (555) 123-4567',
        vehicle: 'Van #247'
      } : undefined;

      const deliveredTo = newStatus === 'delivered' ? 'John Doe' : undefined;
      const deliveryNote = newStatus === 'delivered' ? 'Package delivered successfully' : undefined;

      onUpdateOrderStatus(orderId, newStatus, {
        courierInfo,
        deliveredTo,
        deliveryNote
      });
    }
  };

  const lowStockProducts = [
    { id: 'P-101', name: 'MacBook Pro 14" M3', stock: 3, threshold: 10 },
    { id: 'P-102', name: 'GeForce RTX 4080', stock: 2, threshold: 5 },
    { id: 'P-103', name: 'AMD Ryzen 7 7800X3D', stock: 4, threshold: 10 }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Low': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-y-auto max-h-[90vh] ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="p-6">
              <AddProduct 
                onClose={() => setShowAddProduct(false)}
                onSave={(product) => {
                  if (onAddProduct) {
                    onAddProduct(product);
                  }
                  setShowAddProduct(false);
                }}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Manager Dashboard - {user.name} 👨‍💼</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Manage orders, inventory, and customer requests</p>
          </div>
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
              <span className={`text-xs font-semibold px-2 py-1 rounded ${stat.change.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preparing Orders */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              Preparing Orders ({preparingOrders.length})
            </h3>
          </div>

          <div className="space-y-3">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No orders to prepare</p>
              </div>
            ) : (
              preparingOrders.slice(0, 4).map((order) => (
                <div key={order.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">Order #{order.id}</div>
                      <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {order.items.length} items • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">${order.total.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => updateDeliveryStatus(order.id, 'out_for_delivery')}
                      className="flex-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs font-semibold transition flex items-center justify-center gap-1"
                    >
                      <Truck className="w-3 h-3" />
                      Ship Out
                    </button>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded text-xs font-semibold transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Out for Delivery */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" />
              Out for Delivery ({deliveryOrders.length})
            </h3>
          </div>

          <div className="space-y-3">
            {deliveryOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No active deliveries</p>
              </div>
            ) : (
              deliveryOrders.slice(0, 4).map((order) => (
                <div key={order.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">Order #{order.id}</div>
                      <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {order.courierInfo?.name || 'Courier'} • {order.courierInfo?.vehicle || 'In transit'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">${order.total.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => updateDeliveryStatus(order.id, 'delivered')}
                      className="flex-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded text-xs font-semibold transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Mark Delivered
                    </button>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded text-xs font-semibold transition"
                    >
                      Track
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delivery Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-y-auto max-h-[90vh] ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="p-6">
              <DeliveryTracker order={selectedOrder} darkMode={darkMode} />
              <div className="mt-4 flex gap-3">
                {selectedOrder.deliveryStatus === 'preparing' && (
                  <button
                    onClick={() => {
                      updateDeliveryStatus(selectedOrder.id, 'out_for_delivery');
                      setSelectedOrder(null);
                    }}
                    className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    Ship Out
                  </button>
                )}
                {selectedOrder.deliveryStatus === 'out_for_delivery' && (
                  <button
                    onClick={() => {
                      updateDeliveryStatus(selectedOrder.id, 'delivered');
                      setSelectedOrder(null);
                    }}
                    className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Delivered
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button className={`p-4 rounded-xl border text-left transition ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500' : 'bg-white border-slate-200 hover:border-purple-400'}`}>
          <Package className="w-6 h-6 text-purple-400 mb-2" />
          <div className="font-semibold mb-1">All Orders</div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>View all orders</div>
        </button>
        <button className={`p-4 rounded-xl border text-left transition ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500' : 'bg-white border-slate-200 hover:border-purple-400'}`}>
          <Box className="w-6 h-6 text-blue-400 mb-2" />
          <div className="font-semibold mb-1">Inventory</div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage stock</div>
        </button>
        <button className={`p-4 rounded-xl border text-left transition ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500' : 'bg-white border-slate-200 hover:border-purple-400'}`}>
          <Users className="w-6 h-6 text-emerald-400 mb-2" />
          <div className="font-semibold mb-1">Customers</div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>View customers</div>
        </button>
        <button className={`p-4 rounded-xl border text-left transition ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500' : 'bg-white border-slate-200 hover:border-purple-400'}`}>
          <Truck className="w-6 h-6 text-cyan-400 mb-2" />
          <div className="font-semibold mb-1">Deliveries</div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Track deliveries</div>
        </button>
      </div>
    </div>
  );
}
