import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Truck,
  Bot,
  ShieldAlert,
  FileText,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';

export const AppLayout = () => {
  const { user, currentOrg, organizations, switchOrganization, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ suppliers: [], invoices: [], purchaseOrders: [], aiAgents: [], risks: [] });
  const [searching, setSearching] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread notifications
  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications?limit=15');
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, [currentOrg]);

  // Global search execution with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults({ suppliers: [], invoices: [], purchaseOrders: [], aiAgents: [], risks: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.success && res.data) {
          setSearchResults(res.data);
        }
      } catch (e) {
        // ignore
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      // ignore
    }
  };

  const navItems = [
    { label: 'Executive Command', path: '/dashboard', icon: LayoutDashboard },
    { label: 'B2B Procurement', path: '/procurement', icon: ShoppingBag },
    { label: 'Payments & MSME', path: '/payments', icon: CreditCard },
    { label: 'Supply Chain Risk', path: '/supply-chain', icon: Truck },
    { label: 'AI Agent Monitor', path: '/ai-agents', icon: Bot },
    { label: 'Climate & Continuity', path: '/business-risk', icon: ShieldAlert },
    { label: 'Audit Trail', path: '/audit-logs', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#07090e] text-slate-800 dark:text-slate-100 font-sans">
      {/* SIDEBAR */}
      <aside
        className={`flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0c0f17]/90 backdrop-blur-xl transition-all duration-300 z-30 shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-brand-500 to-emerald-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-brand-500/25 shrink-0">
              B
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  BizAI
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                  Command Center
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500/10 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Tenant Badge at Bottom */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-brand-500 border border-slate-300 dark:border-slate-700 shrink-0">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div className="leading-tight overflow-hidden">
                  <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold truncate uppercase">
                    {user?.role?.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              title="Logout"
              className="w-full flex justify-center p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#0c0f17]/70 backdrop-blur-xl px-6 flex items-center justify-between z-20 shrink-0">
          {/* Global Search Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs transition-colors w-64 lg:w-80 cursor-pointer text-left"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search suppliers, invoices, POs, risks...</span>
              <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Organization Switcher */}
            {organizations.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 text-xs">
                <Building2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <select
                  value={currentOrg?.id || ''}
                  onChange={(e) => switchOrganization(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
                >
                  {organizations.map(org => (
                    <option key={org.id} value={org.id} className="dark:bg-slate-900">
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100/60 dark:bg-slate-900/60 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Notification Drawer Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100/60 dark:bg-slate-900/60 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup Drawer */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Active Alerts & Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-brand-500 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-center py-6 text-slate-400">All caught up! No unread notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border transition-colors ${
                            n.is_read
                              ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/40 opacity-70'
                              : 'bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h5>
                            <StatusBadge status={n.type} className="text-[9px] py-0 px-1.5" />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DYNAMIC PAGE OUTLET */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* GLOBAL SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-2xl glass-panel rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across suppliers, POs, invoices, inventory, AI agents..."
                className="w-full bg-transparent text-base text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-500"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
              {searching ? (
                <p className="text-center py-8 text-xs text-slate-400">Searching enterprise index...</p>
              ) : searchQuery && Object.values(searchResults).every(arr => arr.length === 0) ? (
                <p className="text-center py-8 text-xs text-slate-400">No matching enterprise entities found.</p>
              ) : (
                <>
                  {/* Suppliers */}
                  {searchResults.suppliers?.length > 0 && (
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Suppliers</h5>
                      <div className="space-y-1">
                        {searchResults.suppliers.map(s => (
                          <div
                            key={s.id}
                            onClick={() => { navigate('/procurement'); setSearchOpen(false); }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer"
                          >
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">{s.company_name}</span>
                            <span className="text-xs text-brand-500 font-medium">Reliability {s.reliability_score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Invoices */}
                  {searchResults.invoices?.length > 0 && (
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Invoices</h5>
                      <div className="space-y-1">
                        {searchResults.invoices.map(i => (
                          <div
                            key={i.id}
                            onClick={() => { navigate('/payments'); setSearchOpen(false); }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer"
                          >
                            <div>
                              <span className="font-semibold text-sm text-slate-900 dark:text-white">{i.invoice_number}</span>
                              <span className="text-xs text-slate-400 ml-2">({i.customer_name})</span>
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">₹{Number(i.total_amount).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Agents */}
                  {searchResults.aiAgents?.length > 0 && (
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">AI Agents</h5>
                      <div className="space-y-1">
                        {searchResults.aiAgents.map(a => (
                          <div
                            key={a.id}
                            onClick={() => { navigate('/ai-agents'); setSearchOpen(false); }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer"
                          >
                            <div>
                              <span className="font-semibold text-sm text-slate-900 dark:text-white">{a.name}</span>
                              <span className="text-xs text-slate-400 ml-2">{a.department}</span>
                            </div>
                            <StatusBadge status={a.status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
