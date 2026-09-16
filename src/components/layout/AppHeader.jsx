import { Bell, Search, Moon, Sun, Menu, BookOpen } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { NotificationDrawer } from "../notification-drawer";
import { useTheme } from "../../context/ThemeContext";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../utils/storage";

const DEFAULT_MENU_DATA = [
  { title: "Business Dashboard", path: "/business/dashboard", category: "Business" },
  { title: "KYC Verification Flow", path: "/business/kyc", category: "Business" },
  { title: "Document Repository", path: "/business/documents", category: "Business" },
  { title: "Trust Score Index", path: "/business/trust", category: "Business" },
  { title: "Commercial Deals", path: "/business/deals", category: "Business" },
  { title: "Entity Directory", path: "/business/directory", category: "Business" },
  { title: "Shared Profiles", path: "/business/shared", category: "Business" },
  { title: "Cryptographic Audit Ledger", path: "/business/audit", category: "Business" },
  { title: "Company Settings", path: "/business/settings", category: "Business" },
  { title: "System Documentation", path: "/documentation", category: "Documentation" },

  // Admin Routes
  { title: "Admin Operations Center", path: "/admin/dashboard", category: "Admin" },
  { title: "Business Entity Directory", path: "/admin/businesses", category: "Admin" },
  { title: "KYC Verification Queue", path: "/admin/kyc", category: "Admin" },
  { title: "Document Review & Approvals", path: "/admin/documents", category: "Admin" },
  { title: "Commercial Dispute Mediation", path: "/admin/deals", category: "Admin" },
  { title: "System Audit Ledger", path: "/admin/audit", category: "Admin" },
  { title: "User Roles & Permissions", path: "/admin/users", category: "Admin" },
  { title: "Compliance Reports", path: "/admin/reports", category: "Admin" },
  { title: "Governance SLA Settings", path: "/admin/settings", category: "Admin" },
];

export function AppHeader({ title, subtitle, menuData = DEFAULT_MENU_DATA, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const searchRef = useRef(null);

  const calculateUnreadCount = useCallback((notifs) => {
    return notifs.filter((n) => !n.isRead && !n.read).length;
  }, []);

  const loadNotifications = useCallback(() => {
    const list = getNotifications();
    setNotifications(list);
    setUnreadCount(calculateUnreadCount(list));
  }, [calculateUnreadCount]);

  useEffect(() => {
    loadNotifications();

    const handleDataUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("trustkyc:data_update", handleDataUpdate);
    return () => window.removeEventListener("trustkyc:data_update", handleDataUpdate);
  }, [loadNotifications]);

  const handleMarkAsRead = (notificationId) => {
    const updated = markNotificationRead(notificationId);
    setNotifications(updated);
    setUnreadCount(calculateUnreadCount(updated));
  };

  const handleMarkAllAsRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
    setUnreadCount(0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = menuData.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSearchResults(filtered);
  }, [searchQuery, menuData]);

  const handleResultClick = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/85 px-4 sm:px-6 backdrop-blur-md transition-colors">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="md:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-xs text-foreground active:scale-95 cursor-pointer"
              aria-label="Open navigation sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base sm:text-lg font-bold tracking-tight text-foreground font-display">
              {title}
            </h1>
            {subtitle && (
              <p className="hidden sm:block truncate text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search */}
          <div ref={searchRef} className="relative hidden md:block">
            <div className="flex w-64 lg:w-72 items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 shadow-xs transition-all focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                id="global-search"
                type="text"
                value={searchQuery}
                placeholder="Search platform..."
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground text-foreground"
                autoComplete="off"
              />
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && searchQuery.trim() && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg">
                {searchResults.length > 0 ? (
                  searchResults.map((result, index) => (
                    <Link
                      key={index}
                      to={result.path}
                      onClick={handleResultClick}
                      className="flex w-full cursor-pointer flex-col rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                    >
                      <span className="text-xs font-semibold text-foreground">{result.title}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {result.category} › {result.path}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-3 text-center text-xs text-muted-foreground">
                    No matching views found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Platform Documentation Link */}
          <Link
            to="/documentation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted shadow-xs transition-all active:scale-95"
            title="Open Platform Documentation"
          >
            <BookOpen className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Docs</span>
          </Link>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center cursor-pointer justify-center rounded-xl border border-border bg-card shadow-xs transition-all hover:bg-muted active:scale-95 text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications Panel Trigger */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open notifications"
            className="relative flex h-9 w-9 items-center cursor-pointer justify-center rounded-xl border border-border bg-card shadow-xs transition-all hover:bg-muted active:scale-95"
          >
            <Bell className="h-4 w-4 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-background">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <NotificationDrawer
        open={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </>
  );
}
export default AppHeader;
