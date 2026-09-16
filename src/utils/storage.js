/**
 * Client-Side Storage Manager with Automatic Seeding
 * Powers 100% static interactive demo persistence across page reloads.
 */

import {
  businesses as initialBusinesses,
  initialDocuments,
  initialDeals,
  initialAuditLogs,
  initialNotifications,
} from "../data";

const STORAGE_KEYS = {
  BUSINESSES: "trustkyc_demo_businesses",
  DOCUMENTS: "trustkyc_demo_documents",
  DEALS: "trustkyc_demo_deals",
  AUDIT_LOGS: "trustkyc_demo_audit_logs",
  NOTIFICATIONS: "trustkyc_demo_notifications",
  AUTH_USER: "trustkyc_demo_auth_user",
  AUTH_ROLE: "trustkyc_demo_auth_role",
};

export function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

export function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("trustkyc:data_update"));
  } catch (err) {
    console.error(`Error saving localStorage key "${key}":`, err);
  }
}

/**
 * Ensures demo localStorage contains initial dataset on first visit
 */
export function initDemoStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.BUSINESSES)) {
    setStored(STORAGE_KEYS.BUSINESSES, initialBusinesses);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    setStored(STORAGE_KEYS.DOCUMENTS, initialDocuments);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEALS)) {
    setStored(STORAGE_KEYS.DEALS, initialDeals);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    setStored(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }
}

// ==========================================
// DOCUMENT OPERATIONS
// ==========================================

export function getDocuments() {
  return getStored(STORAGE_KEYS.DOCUMENTS, initialDocuments);
}

export function addDocument(newDoc) {
  const docs = getDocuments();
  const docWithMeta = {
    id: `doc-${Date.now()}`,
    _id: `doc-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
    status: "pending",
    fileUrl: "/sample-doc.pdf",
    ...newDoc,
  };
  const updated = [docWithMeta, ...docs];
  setStored(STORAGE_KEYS.DOCUMENTS, updated);

  addAuditLog({
    type: "Document Uploaded",
    action: "File Upload",
    actor: "Priya Sharma (Business)",
    target: newDoc.name || "Compliance Artifact",
    category: "DOCUMENTS",
    severity: "INFO",
    status: "SUCCESS",
    details: `Uploaded ${newDoc.type || "Document"} into review queue.`,
  });

  return docWithMeta;
}

export function updateDocumentStatus(docId, status, notes = "") {
  const docs = getDocuments();
  const updated = docs.map((d) => {
    if (d.id === docId || d._id === docId) {
      return {
        ...d,
        status,
        verifiedAt: status === "verified" ? new Date().toISOString() : null,
        rejectionReason: status === "rejected" ? notes || "Rejected by Compliance Officer" : null,
        verifiedBy: status === "verified" ? "Compliance Officer (Admin Review)" : null,
      };
    }
    return d;
  });
  setStored(STORAGE_KEYS.DOCUMENTS, updated);

  const targetDoc = docs.find((d) => d.id === docId || d._id === docId);

  addAuditLog({
    type: status === "verified" ? "KYC Approved" : "KYC Rejected",
    action: status === "verified" ? "Document Verification" : "Document Rejection",
    actor: "Vikramaditya Sen (Admin)",
    target: targetDoc?.name || docId,
    category: "COMPLIANCE",
    severity: status === "verified" ? "INFO" : "WARNING",
    status: status === "verified" ? "SUCCESS" : "REJECTED",
    details: notes || `Document status updated to ${status}.`,
  });

  return updated;
}

export function updateDocument(docId, updatedFields) {
  const docs = getDocuments();
  const updated = docs.map((d) =>
    d.id === docId || d._id === docId ? { ...d, ...updatedFields } : d,
  );
  setStored(STORAGE_KEYS.DOCUMENTS, updated);
  return updated;
}

export function replaceDocument(docId, newDocData) {
  const docs = getDocuments();
  const updated = docs.map((d) => {
    if (d.id === docId || d._id === docId) {
      return {
        ...d,
        ...newDocData,
        uploadedAt: new Date().toISOString(),
        status: "pending",
        rejectionReason: null,
      };
    }
    return d;
  });
  setStored(STORAGE_KEYS.DOCUMENTS, updated);

  addAuditLog({
    type: "Document Replaced",
    action: "File Replacement",
    actor: "Krish Lad (Business)",
    target: newDocData.name || docId,
    category: "DOCUMENTS",
    severity: "INFO",
    status: "SUCCESS",
    details: `Updated/replaced document ${newDocData.name || docId} into review queue.`,
  });

  return updated;
}

export function deleteDocument(docId) {
  const docs = getDocuments();
  const updated = docs.filter((d) => d.id !== docId && d._id !== docId);
  setStored(STORAGE_KEYS.DOCUMENTS, updated);
  return updated;
}

// ==========================================
// DEAL OPERATIONS
// ==========================================

export function getDeals() {
  return getStored(STORAGE_KEYS.DEALS, initialDeals);
}

export function addDeal(dealData) {
  const deals = getDeals();
  const newDeal = {
    id: `DL-${Math.floor(1000 + Math.random() * 9000)}`,
    _id: `DL-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: "active",
    type: "outgoing",
    milestones: [
      {
        id: "m-1",
        label: "Contract Execution",
        status: "completed",
        date: new Date().toISOString().slice(0, 10),
      },
      { id: "m-2", label: "Initial Deliverables", status: "in_progress", date: "2026-02-15" },
    ],
    ...dealData,
  };
  const updated = [newDeal, ...deals];
  setStored(STORAGE_KEYS.DEALS, updated);

  addAuditLog({
    type: "Deal Created",
    action: "Contract Initialized",
    actor: "Priya Sharma (Business)",
    target: `${newDeal.id} (${newDeal.title || newDeal.name})`,
    category: "COMMERCIAL",
    severity: "INFO",
    status: "SUCCESS",
    details: `Initiated commercial agreement with counterparty. Value: ₹${(newDeal.value || 0).toLocaleString()}`,
  });

  return newDeal;
}

export function updateDealStatus(dealId, status) {
  const deals = getDeals();
  const updated = deals.map((d) => (d.id === dealId || d._id === dealId ? { ...d, status } : d));
  setStored(STORAGE_KEYS.DEALS, updated);
  return updated;
}

export function deleteDeal(dealId) {
  const deals = getDeals();
  const updated = deals.filter((d) => d.id !== dealId && d._id !== dealId);
  setStored(STORAGE_KEYS.DEALS, updated);
  return updated;
}

// ==========================================
// AUDIT LOG OPERATIONS
// ==========================================

export function getAuditLogs() {
  return getStored(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
}

export function addAuditLog(entry) {
  const logs = getAuditLogs();
  const newLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    ipAddress: "127.0.0.1 (Demo)",
    severity: "INFO",
    status: "SUCCESS",
    ...entry,
  };
  const updated = [newLog, ...logs];
  setStored(STORAGE_KEYS.AUDIT_LOGS, updated);
  return newLog;
}

// ==========================================
// NOTIFICATIONS OPERATIONS
// ==========================================

export function getNotifications() {
  return getStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
}

export function markNotificationRead(notifId) {
  const notifs = getNotifications();
  const updated = notifs.map((n) =>
    n.id === notifId || n._id === notifId ? { ...n, isRead: true } : n,
  );
  setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
}

export function markAllNotificationsRead() {
  const notifs = getNotifications();
  const updated = notifs.map((n) => ({ ...n, isRead: true }));
  setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
}

// ==========================================
// BUSINESS ENTITIES OPERATIONS
// ==========================================

export function getBusinesses() {
  return getStored(STORAGE_KEYS.BUSINESSES, initialBusinesses);
}

export function updateBusinessEntity(updatedBiz) {
  const list = getBusinesses();
  const updated = list.map((b) =>
    b.id === updatedBiz.id || b._id === updatedBiz.id ? { ...b, ...updatedBiz } : b,
  );
  setStored(STORAGE_KEYS.BUSINESSES, updated);
  return updated;
}

export function updateBusinessKycStatus(bizId, kycStatus) {
  const list = getBusinesses();
  const updated = list.map((b) => {
    if (b.id === bizId || b._id === bizId) {
      return { ...b, kycStatus };
    }
    return b;
  });
  setStored(STORAGE_KEYS.BUSINESSES, updated);

  addAuditLog({
    type: "KYC Status Updated",
    action: "Status Transition",
    actor: "System Compliance Engine",
    target: bizId,
    category: "COMPLIANCE",
    severity: "INFO",
    status: "SUCCESS",
    details: `Business ${bizId} KYC status transitioned to ${kycStatus}.`,
  });

  return updated;
}

export function submitBusinessKyc(bizId = "biz-001") {
  return updateBusinessKycStatus(bizId, "SUBMITTED");
}

/**
 * Resets all demo storage back to defaults
 */
export function resetDemoStorage() {
  localStorage.removeItem(STORAGE_KEYS.BUSINESSES);
  localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
  localStorage.removeItem(STORAGE_KEYS.DEALS);
  localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  initDemoStorage();
}
