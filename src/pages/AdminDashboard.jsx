// src/pages/AdminDashboard.jsx - WITH DONE STATUS SYSTEM
// Completed orders can be marked as DONE when fulfilled
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import {
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://slccifxxjgoaqpqabmbb.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY2NpZnh4amdvYXFwcWFibWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTI1NDEsImV4cCI6MjA3OTA2ODU0MX0.GqvYY0XDRGmkBqNDkPopqoFB58SUJ3Mbzz52e7CKPZI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_PASSWORD = 'scottyuzi2025admin';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    doneOrders: 0,
    monthlyRevenue: [],
    orderStatusBreakdown: { pending: 0, completed: 0, done: 0, cancelled: 0, failed: 0 },
  });

  // Hide public layout elements
  useEffect(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const nav = document.querySelector('nav') || document.querySelector('.hamburger-menu');
    const cookieBanner = document.querySelector('[data-cookie-consent]');
    const contactCard = document.querySelector('[data-contact-card]');

    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (nav) nav.style.display = 'none';
    if (cookieBanner) cookieBanner.style.display = 'none';
    if (contactCard) contactCard.style.display = 'none';

    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      if (nav) nav.style.display = '';
      if (cookieBanner) cookieBanner.style.display = '';
      if (contactCard) contactCard.style.display = '';
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setOrders(data || []);

      // Analytics
      const completed = data?.filter((o) => o.status === 'completed') || [];
      const done = data?.filter((o) => o.status === 'done') || [];
      const pending = data?.filter((o) => o.status === 'pending') || [];
      const cancelled = data?.filter((o) => o.status === 'cancelled') || [];
      const failed = data?.filter((o) => o.status === 'failed') || [];

      // Monthly revenue (completed + done)
      const monthly = Array(6).fill(0);
      [...completed, ...done].forEach((order) => {
        const monthIndex = new Date(order.created_at).getMonth();
        const currentMonth = new Date().getMonth();
        const index = (monthIndex - (currentMonth - 5) + 12) % 12;
        if (index >= 0 && index < 6) {
          monthly[index] += parseFloat(order.total || 0);
        }
      });

      setAnalytics({
        totalOrders: data?.length || 0,
        totalRevenue: [...completed, ...done].reduce((sum, o) => sum + parseFloat(o.total || 0), 0),
        pendingOrders: pending.length,
        completedOrders: completed.length,
        doneOrders: done.length,
        monthlyRevenue: monthly,
        orderStatusBreakdown: {
          pending: pending.length,
          completed: completed.length,
          done: done.length,
          cancelled: cancelled.length,
          failed: failed.length,
        },
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error loading orders. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!confirm(`Change status to "${newStatus.toUpperCase()}"?`)) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      alert(`Order updated to ${newStatus.toUpperCase()}`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update status');
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) return alert('No orders to export');

    const headers = [
      'Order ID',
      'Date',
      'Customer',
      'Email',
      'Phone',
      'Total',
      'Status',
      'Shipping Method',
      'Collection Store',
    ].join(',');

    const rows = orders.map((order) => [
      order.payment_id,
      new Date(order.created_at).toLocaleString('en-ZA'),
      `${order.first_name} ${order.last_name}`,
      order.email,
      order.phone,
      `R${order.total}`,
      order.status.toUpperCase(),
      order.shipping_method || 'courier',
      order.collection_store_name || order.shipping_method === 'instore' ? 'Not specified' : 'N/A',
    ].join(','));

    const csv = `${headers}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scottyuzi-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Revenue Chart
  const revenueChartData = {
    labels: ['6 mo ago', '5 mo', '4 mo', '3 mo', '2 mo', 'Last mo'],
    datasets: [
      {
        label: 'Revenue (R)',
        data: analytics.monthlyRevenue,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(21, 128, 61)',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    animation: { duration: 2000, easing: 'easeOutBounce' },
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Monthly Revenue Trend', font: { size: 16, weight: 'bold' }, padding: { top: 0, bottom: 20 } },
      tooltip: { backgroundColor: 'rgba(0,0,0,0.9)', titleColor: 'white', bodyColor: 'white', cornerRadius: 4, padding: 12 },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: 'gray' } },
      x: { grid: { display: false }, ticks: { color: 'gray' } },
    },
  };

  // Status Chart
  const statusChartData = {
    labels: ['Pending', 'Completed', 'Done', 'Cancelled', 'Failed'],
    datasets: [
      {
        data: [
          analytics.orderStatusBreakdown.pending,
          analytics.orderStatusBreakdown.completed,
          analytics.orderStatusBreakdown.done,
          analytics.orderStatusBreakdown.cancelled,
          analytics.orderStatusBreakdown.failed,
        ],
        backgroundColor: ['#EAB308', '#22C55E', '#10B981', '#6B7280', '#EF4444'],
        hoverOffset: 4,
      },
    ],
  };

  const statusChartOptions = {
    responsive: true,
    animation: { animateScale: true, animateRotate: true },
    plugins: {
      legend: { position: 'right', labels: { padding: 20, font: { size: 14 } } },
      title: { display: true, text: 'Order Status Distribution', font: { size: 16, weight: 'bold' }, padding: { top: 0, bottom: 20 } },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ScottyUzi Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('adminAuth');
              setIsAuthenticated(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalOrders}</p>
              </div>
              <ArrowTrendingUpIcon className="h-10 w-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  R{analytics.totalRevenue.toFixed(2)}
                </p>
              </div>
              <CurrencyDollarIcon className="h-10 w-10 text-green-500 opacity-70" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{analytics.pendingOrders}</p>
              </div>
              <ClockIcon className="h-10 w-10 text-yellow-500 opacity-70" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{analytics.completedOrders}</p>
              </div>
              <CheckCircleIcon className="h-10 w-10 text-green-500 opacity-70" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Done</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{analytics.doneOrders}</p>
              </div>
              <CheckCircleIcon className="h-10 w-10 text-emerald-500 opacity-70" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend (Last 6 Months)</h3>
            <div className="h-[300px]">
              <Bar data={revenueChartData} options={revenueChartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Order Status Breakdown</h3>
            <div className="h-[300px]">
              <Pie data={statusChartData} options={statusChartOptions} />
            </div>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'completed', 'done', 'cancelled', 'failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                    filter === status
                      ? 'bg-black text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by ID, email, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none w-full sm:w-64"
              />
              <button
                onClick={exportToCSV}
                disabled={orders.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.payment_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-ZA')}
                        <br />
                        <span className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString('en-ZA')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.first_name} {order.last_name}
                        <br />
                        <span className="text-xs text-gray-500">{order.email}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        R{parseFloat(order.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'done'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'cancelled'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.payment_id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Quick Status Actions */}
              <div className="flex flex-wrap gap-3">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'completed');
                        setSelectedOrder(null);
                      }}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'cancelled');
                        setSelectedOrder(null);
                      }}
                      className="px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                      Cancel Order
                    </button>
                  </>
                )}
                
                {selectedOrder.status === 'completed' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'done');
                      setSelectedOrder(null);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-bold"
                  >
                    ✓ Mark as DONE (Order Fulfilled)
                  </button>
                )}
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Order Info</h3>
                  <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString('en-ZA')}</p>
                  <p><strong>Status:</strong> <span className="uppercase font-medium">{selectedOrder.status}</span></p>
                  <p><strong>Total:</strong> R{parseFloat(selectedOrder.total || 0).toFixed(2)}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Customer</h3>
                  <p><strong>Name:</strong> {selectedOrder.first_name} {selectedOrder.last_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                </div>
              </div>

              {/* Shipping / Collection */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  {selectedOrder.shipping_method === 'instore' ? 'Collection Details' : 'Shipping Address'}
                </h3>
                {selectedOrder.shipping_method === 'instore' ? (
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                    <p className="font-bold text-green-900 text-lg mb-2">
                      📦 IN-STORE COLLECTION
                    </p>
                    <p className="text-sm text-green-800 mb-1">
                      <strong>Collection Store:</strong>
                    </p>
                    <p className="text-base font-semibold text-green-900">
                      {selectedOrder.collection_store_name || selectedOrder.collection_store || 'Not specified'}
                    </p>
                    <p className="text-xs text-green-700 mt-2">
                      Customer will pick up from this location
                    </p>
                  </div>
                ) : (
                  <>
                    <p>{selectedOrder.address}</p>
                    {selectedOrder.apartment && <p>{selectedOrder.apartment}</p>}
                    <p>{selectedOrder.city}, {selectedOrder.province} {selectedOrder.postal_code}</p>
                    <p className="mt-2"><strong>Method:</strong> Courier Delivery</p>
                  </>
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
                {selectedOrder.order_items?.length > 0 ? (
                  <div className="space-y-4">
                    {selectedOrder.order_items.map((item, idx) => {
                      let customization = null;
                      try {
                        if (item.customization) customization = JSON.parse(item.customization);
                      } catch {}

                      return (
                        <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Product</p>
                              <p className="font-medium">{item.product_name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Size</p>
                              <p className="font-medium">{item.size}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Qty</p>
                              <p className="font-medium">{item.quantity}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>

                          {customization && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-800 font-bold mb-3">🎨 Customization Required:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-red-700">Name on Back:</p>
                                  <p className="text-xl font-black text-red-900">{customization.name || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-red-700">Number on Back:</p>
                                  <p className="text-3xl font-black text-red-600">{customization.number || '—'}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No items in this order</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;