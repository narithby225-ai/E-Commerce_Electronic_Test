import React from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';

export default function DeliveryTracker({ order, darkMode }) {
  const deliveryStages = [
    {
      id: 'preparing',
      label: 'Preparing Items',
      icon: Package,
      description: 'Your order is being prepared and packaged',
      color: 'blue'
    },
    {
      id: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: Truck,
      description: 'Your order is on the way',
      color: 'amber'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: CheckCircle,
      description: 'Your order has been delivered',
      color: 'emerald'
    }
  ];

  const getCurrentStageIndex = () => {
    return deliveryStages.findIndex(stage => stage.id === order.deliveryStatus);
  };

  const currentStageIndex = getCurrentStageIndex();

  const getStageColor = (stage, index) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'active';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return darkMode ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-emerald-100 border-emerald-400 text-emerald-700';
      case 'active':
        return darkMode ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-cyan-100 border-cyan-400 text-cyan-700';
      default:
        return darkMode ? 'bg-slate-700/50 border-slate-600 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500';
    }
  };

  const getLineColor = (index) => {
    if (index < currentStageIndex) {
      return darkMode ? 'bg-emerald-500' : 'bg-emerald-400';
    }
    return darkMode ? 'bg-slate-700' : 'bg-slate-300';
  };

  return (
    <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            Delivery Tracking
          </h3>
          <p className="text-xs text-slate-400 mt-1">Order #{order.id}</p>
        </div>
        {order.estimatedDelivery && (
          <div className="text-right">
            <div className="text-xs text-slate-400">Estimated Delivery</div>
            <div className="text-sm font-bold text-cyan-400">{order.estimatedDelivery}</div>
          </div>
        )}
      </div>

      {/* Delivery Timeline */}
      <div className="relative">
        {deliveryStages.map((stage, index) => {
          const StageIcon = stage.icon;
          const stageStatus = getStageColor(stage, index);
          const isActive = index === currentStageIndex;
          const isCompleted = index < currentStageIndex;

          return (
            <div key={stage.id} className="relative">
              {/* Connecting Line */}
              {index < deliveryStages.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 -translate-x-1/2">
                  <div className={`w-full h-full ${getLineColor(index)}`}></div>
                </div>
              )}

              {/* Stage Item */}
              <div className="flex items-start gap-4 pb-8">
                {/* Icon Circle */}
                <div className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  getStatusColor(stageStatus)
                } ${isActive ? 'animate-pulse' : ''}`}>
                  <StageIcon className="w-5 h-5" />
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Stage Info */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold text-sm ${isActive ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {stage.label}
                    </h4>
                    {stage.id === order.deliveryStatus && order.statusTimestamp && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.statusTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stage.description}
                  </p>
                  
                  {/* Additional Info for Active Stage */}
                  {isActive && (
                    <div className={`mt-3 p-3 rounded-lg border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      {stage.id === 'preparing' && (
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2 text-cyan-400">
                            <Package className="w-3 h-3" />
                            <span className="font-semibold">Packing in progress</span>
                          </div>
                          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                            Your items are being carefully prepared for shipment
                          </p>
                        </div>
                      )}
                      {stage.id === 'out_for_delivery' && order.courierInfo && (
                        <div className="text-xs space-y-2">
                          <div className="flex items-center gap-2 text-amber-400">
                            <Truck className="w-3 h-3" />
                            <span className="font-semibold">Courier: {order.courierInfo.name}</span>
                          </div>
                          {order.courierInfo.phone && (
                            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                              Contact: {order.courierInfo.phone}
                            </p>
                          )}
                          {order.courierInfo.vehicle && (
                            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                              Vehicle: {order.courierInfo.vehicle}
                            </p>
                          )}
                        </div>
                      )}
                      {stage.id === 'delivered' && order.deliveredTo && (
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle className="w-3 h-3" />
                            <span className="font-semibold">Received by: {order.deliveredTo}</span>
                          </div>
                          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                            {order.deliveryNote || 'Package delivered successfully'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Address */}
      {order.shippingAddress && (
        <div className={`mt-4 p-4 rounded-lg border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Delivery Address</div>
              <div className="text-sm">{order.shippingAddress}</div>
            </div>
          </div>
        </div>
      )}

      {/* Order Items Summary */}
      {order.items && order.items.length > 0 && (
        <div className={`mt-4 p-4 rounded-lg border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-xs font-semibold text-slate-400 mb-2">Items in this order</div>
          <div className="space-y-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="truncate">{item.name} × {item.quantity}</span>
                <span className="font-semibold text-cyan-400">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="text-xs text-slate-400">
                +{order.items.length - 3} more item(s)
              </div>
            )}
          </div>
          <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-between`}>
            <span className="text-sm font-semibold">Total Amount</span>
            <span className="text-lg font-bold text-cyan-400">${order.total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
