/**
 * Centralized Demo Credentials & Demo Identifiers Configuration
 * Used for 100% frontend-only static demo evaluation.
 */

export const DEMO_CREDENTIALS = {
  BUSINESS: {
    email: "KRISHLAD123@GMAIL.COM",
    password: "KISHU@0209",
    role: "BUSINESS",
    displayName: "Krish Lad",
    company: "Helios Trade Networks Pvt Ltd",
    businessId: "biz-001",
    userId: "usr-biz-01",
    kycId: "kyc-101",
    redirectPath: "/business/dashboard",
  },
  ADMIN: {
    email: "SMIT123@GMAIL.COM",
    password: "YANA@0723",
    role: "ADMIN",
    displayName: "Smit Patel",
    department: "Compliance Operations & Risk Supervisory",
    adminId: "adm-001",
    userId: "usr-adm-01",
    redirectPath: "/admin/dashboard",
  },
};

export const DEMO_IDS = {
  BUSINESS_ID: "biz-001",
  USER_ID_BUSINESS: "usr-biz-01",
  USER_ID_ADMIN: "usr-adm-01",
  KYC_ID: "kyc-101",
  PRIMARY_DOCUMENT_ID: "doc-1",
  PRIMARY_DEAL_ID: "DL-2841",
  AUDIT_LOG_ID: "LOG-5812",
  GSTIN: "27AAACH1234A1Z9",
  PAN: "AAACH1234A",
  CIN: "U74999MH2018PLC312841",
};

export const DEMO_DISCLAIMER =
  "These credentials and IDs are frontend demonstration data only and are not intended for production authentication.";
