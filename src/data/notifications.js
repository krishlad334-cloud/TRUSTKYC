/**
 * Centralized Static Notifications Dataset
 */

export const initialNotifications = [
  {
    id: "notif-1",
    _id: "notif-1",
    title: "Document Verified",
    message: "Your GST Certificate REG06 has been verified by the automated compliance engine.",
    type: "KYC_VERIFIED",
    category: "KYC",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18m ago
    link: "/business/kyc",
  },
  {
    id: "notif-2",
    _id: "notif-2",
    title: "New Counterparty Inquiry",
    message:
      "Aurora Green Energy Systems Ltd requested access to your verified compliance dossier.",
    type: "PROFILE_VIEW",
    category: "DEALS",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(), // 1h ago
    link: "/business/directory",
  },
  {
    id: "notif-3",
    _id: "notif-3",
    title: "Deal Milestone Complete",
    message: "Milestone 'Initial Tooling & Spec Approval' on DL-2841 has been signed off.",
    type: "DEAL_UPDATE",
    category: "DEALS",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
    link: "/business/deals",
  },
  {
    id: "notif-4",
    _id: "notif-4",
    title: "Trust Score Recalibrated",
    message: "Your Trust Score increased by +3 points to 88 based on verified trade fulfillments.",
    type: "SCORE_CHANGE",
    category: "TRUST",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
    link: "/business/trust",
  },
  {
    id: "notif-5",
    _id: "notif-5",
    title: "Quarterly Audit Report Ready",
    message: "Your Q3 cryptographic activity seal and immutable audit statement has been compiled.",
    type: "AUDIT_REPORT",
    category: "AUDIT",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2d ago
    link: "/business/audit",
  },
];

export const notifications = initialNotifications;
