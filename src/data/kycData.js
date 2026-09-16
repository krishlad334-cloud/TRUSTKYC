/**
 * Static KYC Definitions, Requirements, and Risk Flags
 */

export const KYC_DOCUMENT_TYPES = [
  {
    key: "GST_CERTIFICATE",
    label: "GST Certificate",
    code: "GSTIN-REG06",
    description:
      "Form GST REG-06 containing principal place of business and GSTIN registration details.",
    required: true,
    weight: 25,
    maxValidityYears: 5,
    sampleNumber: "27AAACH1234A1Z9",
  },
  {
    key: "PAN_CARD",
    label: "Entity PAN Card",
    code: "CBDT-PAN",
    description:
      "Permanent Account Number card issued by Income Tax Department under section 139A.",
    required: true,
    weight: 25,
    maxValidityYears: 10,
    sampleNumber: "AAACH1234A",
  },
  {
    key: "INCORPORATION_CERTIFICATE",
    label: "Certificate of Incorporation",
    code: "MCA-COI",
    description:
      "Incorporation certificate (Form 24) issued by Registrar of Companies / Ministry of Corporate Affairs.",
    required: true,
    weight: 30,
    maxValidityYears: 99,
    sampleNumber: "U74999MH2018PLC312841",
  },
  {
    key: "BANK_PROOF",
    label: "Bank Account Statement",
    code: "NPCI-STM",
    description:
      "Cancelled corporate cheque or current bank statement (past 90 days) with IFSC code.",
    required: true,
    weight: 20,
    maxValidityYears: 1,
    sampleNumber: "HDFC0000123",
  },
  {
    key: "BOARD_RESOLUTION",
    label: "Board Resolution / Auth Letter",
    code: "MCA-BR7",
    description: "Certified true copy of board resolution authorizing digital signatory.",
    required: false,
    weight: 10,
    maxValidityYears: 2,
    sampleNumber: "BR-2024-889",
  },
];

export const riskFlags = [
  {
    id: "rf-1",
    title: "GSTIN Inactive Check",
    description:
      "Counterparty GSTIN reported inactive on government registry as of last periodic sync.",
    severity: "high",
    raisedAt: "2025-11-04",
    entity: "Northwind Capital Partners",
    resolved: false,
  },
  {
    id: "rf-2",
    title: "Registered Address Variance",
    description: "Registered office address differs slightly from latest bank-issued statement.",
    severity: "medium",
    raisedAt: "2025-10-21",
    entity: "Vertex Industrial Co.",
    resolved: false,
  },
  {
    id: "rf-3",
    title: "Director Name Formatting Variance",
    description: "Minor spelling formatting variance detected across PAN vs MCA database records.",
    severity: "low",
    raisedAt: "2025-10-02",
    entity: "Helios Trade Networks",
    resolved: true,
  },
];

export const complianceWeights = [
  {
    factor: "KYC & Identity Verification",
    key: "kycScore",
    weight: 40,
    max: 40,
    description: "Automated OCR, MCA match, GST active status, PAN validation",
  },
  {
    factor: "Regulatory & Tax Compliance",
    key: "complianceScore",
    weight: 20,
    max: 20,
    description: "Regularity of GSTR-3B filings, zero litigation, sanction lists",
  },
  {
    factor: "Commercial Deal Performance",
    key: "dealPerformanceScore",
    weight: 30,
    max: 30,
    description: "Fulfilled contracts, dispute rates, on-time payment ratio",
  },
  {
    factor: "Platform Activity & Recency",
    key: "activityScore",
    weight: 10,
    max: 10,
    description: "Regular telemetry, profile freshness, counterparty reviews",
  },
];
