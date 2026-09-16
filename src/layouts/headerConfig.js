export const businessHeaders = {
  "/business/dashboard": {
    title: "Enterprise Dashboard",
    subtitle: "Real-time compliance standing, document readiness, and trust index.",
  },
  "/business/kyc": {
    title: "KYC Verification",
    subtitle: "Complete statutory verification by submitting statutory corporate credentials.",
  },
  "/business/documents": {
    title: "Document Repository",
    subtitle: "Upload, inspect, replace, and preview statutory compliance artifacts.",
  },
  "/business/trust": {
    title: "Trust Score Index",
    subtitle: "Forensic breakdown of identity, tax integrity, and commercial track record.",
  },
  "/business/deals": {
    title: "Commercial Deals",
    subtitle: "Track counterparty contracts, escrow milestones, and dispute mediation.",
  },
  "/business/directory": {
    title: "Verified Entity Directory",
    subtitle: "Discover and inspect accredited enterprise partners across the network.",
  },
  "/business/shared": {
    title: "Shared Dossiers",
    subtitle: "Permissioned compliance credential links shared with counterparties.",
  },
  "/business/audit": {
    title: "Cryptographic Audit Ledger",
    subtitle: "Immutable, timestamped chronological log of all compliance and auth events.",
  },
  "/business/settings": {
    title: "Company Settings",
    subtitle: "Manage authorized signatories, tax identification numbers, and notifications.",
  },
};

export const adminHeaders = {
  "/admin/dashboard": {
    title: "Compliance Operations Center",
    subtitle: "System-wide verification queue dispatch, risk alerts, and telemetry.",
  },
  "/admin/businesses": {
    title: "Accredited Entity Registry",
    subtitle: "Screen registered entities, inspect tax identifiers, and calibrate trust scores.",
  },
  "/admin/kyc": {
    title: "KYC Verification Queue",
    subtitle: "Review incoming submissions, inspect OCR docket extractions, and adjudicate status.",
  },
  "/admin/documents": {
    title: "Document Review & Approvals",
    subtitle: "Examine statutory artifacts, validate registry records, and record decisions.",
  },
  "/admin/deals": {
    title: "Commercial Disputes Tribunal",
    subtitle: "Adjudicate contested trade deals, review escrow terms, and manage resolutions.",
  },
  "/admin/audit": {
    title: "System Audit Ledger",
    subtitle: "Forensic immutable record of all document adjudications and security events.",
  },
  "/admin/users": {
    title: "User Role Management",
    subtitle: "Manage administrative roles, clearance tiers, and operator permissions.",
  },
  "/admin/reports": {
    title: "Compliance Reports & SLA Analytics",
    subtitle: "Review turnaround metrics, verification throughput, and automated risk trends.",
  },
  "/admin/settings": {
    title: "Governance & SLA Parameters",
    subtitle: "Configure turnaround windows, automated quarantine thresholds, and connectors.",
  },
};

export function resolveHeader(pathname, headersMap, defaultHeader) {
  if (!pathname) return defaultHeader;

  // Exact match
  if (headersMap[pathname]) {
    return headersMap[pathname];
  }

  // Prefix match
  const matchingKey = Object.keys(headersMap).find((key) => pathname.startsWith(key));
  return matchingKey ? headersMap[matchingKey] : defaultHeader;
}
