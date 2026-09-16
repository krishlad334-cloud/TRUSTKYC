/**
 * Static User Credentials and Profiles
 * NOTE: These credentials and profiles are strictly for frontend demonstration purposes.
 */

import { DEMO_CREDENTIALS as CONFIG_CREDS } from "../config/demoCredentials";

export const DEMO_CREDENTIALS = CONFIG_CREDS;

export const demoUsers = [
  {
    id: "usr-biz-01",
    _id: "usr-biz-01",
    email: "KRISHLAD123@GMAIL.COM",
    password: "KISHU@0209",
    name: "Krish Lad",
    role: "BUSINESS",
    scope: "BUSINESS",
    title: "Chief Compliance Officer & Director",
    businessId: "biz-001",
    businessName: "Helios Trade Networks Pvt Ltd",
    avatar: "KL",
    phone: "+91 98200 12345",
    joinedAt: "2024-01-15",
    kycStatus: "VERIFIED",
    trustScore: 88,
    permissions: ["READ_KYC", "UPLOAD_KYC", "MANAGE_DEALS", "INVITE_TEAM", "VIEW_AUDIT"],
  },
  {
    id: "usr-adm-01",
    _id: "usr-adm-01",
    email: "SMIT123@GMAIL.COM",
    password: "YANA@0723",
    name: "Smit Patel",
    role: "ADMIN",
    scope: "SYSTEM",
    title: "Principal Compliance Officer & Risk Supervisor",
    businessId: "biz-system",
    businessName: "TrustKYC Compliance Operations",
    avatar: "SP",
    phone: "+91 98110 54321",
    joinedAt: "2023-08-01",
    permissions: [
      "SYSTEM_ADMIN",
      "OVERRIDE_KYC",
      "AUDIT_NETWORK",
      "RESOLVE_DISPUTES",
      "RECALIBRATE_SCORES",
    ],
  },
];
