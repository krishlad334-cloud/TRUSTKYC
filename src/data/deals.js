/**
 * Centralized Static Deals Dataset
 * Commercial counterparty contracts, order pipelines, milestones, and dispute resolution records.
 */

export const initialDeals = [
  {
    id: "DL-2841",
    _id: "DL-2841",
    title: "Q4 Component Supply Agreement",
    name: "Q4 Component Supply Agreement",
    counterparty: "Vertex Industrial Co.",
    counterpartyId: "biz-002",
    counterpartyGstin: "27AABCV5678B1Z3",
    value: 4500000,
    amount: 4500000,
    currency: "INR",
    status: "active",
    type: "outgoing",
    createdAt: "2025-10-12T09:30:00Z",
    deliveryDate: "2026-01-15",
    paymentTerms: "Net 45 Days against delivery milestone",
    description:
      "Quarterly supply of precision-machined alloy components with ISO 9001 certified QA inspection.",
    milestones: [
      {
        id: "m-1",
        label: "Initial Tooling & Spec Approval",
        status: "completed",
        date: "2025-10-25",
      },
      {
        id: "m-2",
        label: "Batch 1 Delivery (5,000 units)",
        status: "in_progress",
        date: "2025-11-20",
      },
      {
        id: "m-3",
        label: "Batch 2 Delivery & Final Acceptance",
        status: "pending",
        date: "2026-01-15",
      },
    ],
  },
  {
    id: "DL-2840",
    _id: "DL-2840",
    title: "Solar Panel Procurement & EPC Services",
    name: "Solar Panel Procurement & EPC Services",
    counterparty: "Aurora Green Energy",
    counterpartyId: "biz-004",
    counterpartyGstin: "36AABCA3344D1Z2",
    value: 12800000,
    amount: 12800000,
    currency: "INR",
    status: "completed",
    type: "incoming",
    createdAt: "2025-08-04T11:00:00Z",
    deliveryDate: "2025-10-30",
    paymentTerms: "Milestone-based LC settlement",
    description:
      "1.2 MW solar farm equipment package including monocrystalline PERC modules and grid-tie inverters.",
    milestones: [
      {
        id: "m-1",
        label: "Equipment Dispatch & Bill of Lading",
        status: "completed",
        date: "2025-08-20",
      },
      { id: "m-2", label: "Site Delivery & Inspection", status: "completed", date: "2025-09-15" },
      {
        id: "m-3",
        label: "Commissioning & Grid Synchrony",
        status: "completed",
        date: "2025-10-30",
      },
    ],
  },
  {
    id: "DL-2839",
    _id: "DL-2839",
    title: "Enterprise Cybersecurity Audit Engagement",
    name: "Enterprise Cybersecurity Audit Engagement",
    counterparty: "Quanta Cyber Systems",
    counterpartyId: "biz-006",
    counterpartyGstin: "06AABCQ7788F1Z5",
    value: 850000,
    amount: 850000,
    currency: "INR",
    status: "disputed",
    type: "outgoing",
    createdAt: "2025-09-25T14:15:00Z",
    deliveryDate: "2025-10-25",
    paymentTerms: "50% Advance, 50% on Final Remediation Report",
    description:
      "Comprehensive external penetration testing, cloud posture audit, and SOC 2 Type II readiness review.",
    disputeReason:
      "Deliverable timeline exceeded by 18 days; penetration report missing mobile API endpoints.",
    disputeStatus: "OPEN",
    milestones: [
      {
        id: "m-1",
        label: "Scope Alignment & Reconnaissance",
        status: "completed",
        date: "2025-09-30",
      },
      { id: "m-2", label: "Vulnerability Assessment", status: "completed", date: "2025-10-10" },
      { id: "m-3", label: "Final Penetration Report", status: "disputed", date: "2025-10-25" },
    ],
  },
  {
    id: "DL-2838",
    _id: "DL-2838",
    title: "Pharma Distribution Network MOU",
    name: "Pharma Distribution Network MOU",
    counterparty: "Meridian Pharma Labs",
    counterpartyId: "biz-005",
    counterpartyGstin: "24AABCM5566E1Z8",
    value: 3200000,
    amount: 3200000,
    currency: "INR",
    status: "draft",
    type: "incoming",
    createdAt: "2025-11-02T10:00:00Z",
    deliveryDate: "2026-03-01",
    paymentTerms: "Letter of Credit, 60 Days",
    description:
      "Multi-region cold-chain distribution memorandum for active pharmaceutical ingredients (APIs).",
    milestones: [
      { id: "m-1", label: "Draft Terms Finalization", status: "in_progress", date: "2025-11-15" },
      {
        id: "m-2",
        label: "Regulatory Compliance Clearances",
        status: "pending",
        date: "2025-12-20",
      },
    ],
  },
];

export const disputeLedger = [
  {
    id: "disp-101",
    dealId: "DL-2839",
    dealTitle: "Enterprise Cybersecurity Audit Engagement",
    plaintiff: "Helios Trade Networks",
    defendant: "Quanta Cyber Systems",
    amountDisputed: 425000,
    reason:
      "Deliverable timeline exceeded by 18 days; penetration report missing mobile API endpoints.",
    status: "Under Review",
    filedAt: "2025-10-28",
    priority: "HIGH",
    adminNotes:
      "Reviewing SLA contract clause 4.2 regarding delay penalties and API scope definition.",
  },
];

export const deals = initialDeals;
