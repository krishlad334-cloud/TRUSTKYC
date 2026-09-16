import { useState, useMemo } from "react";
import {
  X,
  AlertTriangle,
  FileCheck2,
  Handshake,
  FileText,
  CheckCircle2,
  Bell,
  ShieldAlert,
  UserPlus,
  CheckCheck,
} from "lucide-react";
const getTypeStyles = (type = "") => {
  const upperType = String(type).toUpperCase();

  if (upperType.includes("KYC")) {
    if (upperType.includes("REJECTED"))
      return {
        icon: AlertTriangle,
        color:
          "text-rose-600 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/40",
      };
    if (upperType.includes("VERIFIED"))
      return {
        icon: FileCheck2,
        color:
          "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/40",
      };
    return {
      icon: FileText,
      color:
        "text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/40",
    };
  }

  if (upperType.includes("DEAL")) {
    if (upperType.includes("COMPLETED"))
      return {
        icon: CheckCircle2,
        color:
          "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/40",
      };
    if (upperType.includes("REJECTED") || upperType.includes("CANCELLED"))
      return { icon: X, color: "text-slate-500 bg-slate-100 dark:bg-slate-800 border-border" };
    return {
      icon: Handshake,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/40",
    };
  }

  if (upperType.includes("DISPUTE")) {
    return {
      icon: ShieldAlert,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/40",
    };
  }

  if (upperType.includes("MEMBER") || upperType.includes("ROLE")) {
    return {
      icon: UserPlus,
      color: "text-sky-600 bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-900/40",
    };
  }

  return { icon: Bell, color: "text-muted-foreground bg-muted border-border" };
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export function NotificationDrawer({
  open,
  onClose,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.isRead && !n.read);
    }
    return notifications;
  }, [notifications, filter]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transition-all duration-300 shadow-2xl flex flex-col ${
          open ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"
        }`}
      >
        {/* Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-border shrink-0 bg-card">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground text-base">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-xs text-primary hover:underline font-medium cursor-pointer inline-flex items-center gap-1"
              >
                <CheckCheck className="size-3.5" />
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-lg hover:bg-muted flex items-center cursor-pointer justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close notifications"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-5 py-2.5 border-b border-border bg-muted/30 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              filter === "all"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              filter === "unread"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1 bg-background/50">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <Bell className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                {filter === "unread"
                  ? "You've read all your notifications!"
                  : "You'll be notified when verification updates or deal events occur."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const currentId = n._id || n.id;
              const isRead = n.isRead ?? n.read ?? false;
              const { icon: DynamicIcon, color: iconStyleClasses } = getTypeStyles(n.type);

              return (
                <div
                  key={currentId}
                  onClick={() => !isRead && onMarkAsRead && onMarkAsRead(currentId)}
                  className={`p-3.5 rounded-xl border transition-all duration-150 relative cursor-pointer group ${
                    isRead
                      ? "bg-card border-border/80 opacity-75 hover:opacity-100"
                      : "bg-card border-primary/30 shadow-xs hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`size-9 rounded-xl flex items-center justify-center border shrink-0 ${iconStyleClasses}`}
                    >
                      <DynamicIcon className="size-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-xs tracking-tight ${
                            !isRead ? "font-bold text-foreground" : "font-medium text-foreground"
                          }`}
                        >
                          {n.title || "Notification"}
                        </p>
                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                          {formatTimeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {n.message || n.description || ""}
                      </p>
                    </div>

                    {!isRead && <span className="size-2 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
