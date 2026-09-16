import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DEMO_CREDENTIALS, demoUsers, businesses } from "../data";
import { initDemoStorage } from "../utils/storage";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  USER: "trustkyc_demo_auth_user",
  ROLE: "trustkyc_demo_auth_role",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Normalize business properties to ensure backward compatibility
  const normalizeBusiness = useCallback((bData) => {
    if (!bData) return null;
    const trust = bData.trustScore || {};
    return {
      ...bData,
      overall: bData.overall ?? trust.overall ?? 88,
      kycScore: bData.kycScore ?? trust.kycScore ?? 38,
      complianceScore: bData.complianceScore ?? trust.complianceScore ?? 28,
      dealPerformanceScore: bData.dealPerformanceScore ?? trust.dealPerformanceScore ?? 22,
      activityScore: bData.activityScore ?? trust.activityScore ?? 8,
    };
  }, []);

  // Restore authenticated session from localStorage on app boot
  useEffect(() => {
    initDemoStorage();

    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.scope !== "SYSTEM") {
          const matchedBiz = businesses.find((b) => b.id === parsed.businessId) || businesses[0];
          setBusiness(normalizeBusiness(matchedBiz));
        } else {
          setBusiness(null);
        }
      }
    } catch (err) {
      console.error("Failed to restore demo session:", err);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
    } finally {
      setLoading(false);
    }
  }, [normalizeBusiness]);

  const loginWithUser = (targetUser) => {
    setUser(targetUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(targetUser));
    localStorage.setItem(STORAGE_KEYS.ROLE, targetUser.role);

    if (targetUser.scope === "SYSTEM" || targetUser.role === "ADMIN") {
      setBusiness(null);
      toast.success("Welcome, Compliance Administrator", {
        description: `Authenticated as ${targetUser.name} (${targetUser.department || "Compliance Operations"})`,
      });
      navigate("/admin/dashboard", { replace: true });
    } else {
      const matchedBiz = businesses.find((b) => b.id === targetUser.businessId) || businesses[0];
      setBusiness(normalizeBusiness(matchedBiz));
      toast.success(`Welcome back, ${targetUser.name}`, {
        description: `Authenticated as ${targetUser.title || "Director"} · ${targetUser.businessName || "Helios Trade Networks"}`,
      });
      navigate("/business/dashboard", { replace: true });
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    // Simulate brief asynchronous validation feel
    await new Promise((res) => setTimeout(res, 300));

    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    // Check Admin Credentials
    if (
      cleanEmail === DEMO_CREDENTIALS.ADMIN.email.toLowerCase() &&
      cleanPassword === DEMO_CREDENTIALS.ADMIN.password
    ) {
      const adminUser = demoUsers.find((u) => u.role === "ADMIN");
      loginWithUser(adminUser);
      setLoading(false);
      return { success: true, role: "ADMIN" };
    }

    // Check Business Credentials
    if (
      cleanEmail === DEMO_CREDENTIALS.BUSINESS.email.toLowerCase() &&
      cleanPassword === DEMO_CREDENTIALS.BUSINESS.password
    ) {
      const bizUser = demoUsers.find((u) => u.role === "BUSINESS");
      loginWithUser(bizUser);
      setLoading(false);
      return { success: true, role: "BUSINESS" };
    }

    setLoading(false);
    throw new Error("Invalid credentials. Please use the official demo login credentials.");
  };

  const loginAsBusiness = () => {
    const bizUser = demoUsers.find((u) => u.role === "BUSINESS");
    loginWithUser(bizUser);
  };

  const loginAsAdmin = () => {
    const adminUser = demoUsers.find((u) => u.role === "ADMIN");
    loginWithUser(adminUser);
  };

  const logoutLocal = () => {
    setUser(null);
    setBusiness(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  };

  const logout = async () => {
    logoutLocal();
    toast.info("Signed out of demo session");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        role: user?.role || null,
        loading,
        isAuthenticated: !!user,
        login,
        loginAsBusiness,
        loginAsAdmin,
        logout,
        logoutLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
