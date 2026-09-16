import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Code2,
  ShieldCheck,
  ServerOff,
  Copy,
  Check,
  Users,
  Route as RouteIcon,
  Database,
  Lock,
  Layers,
  Sparkles,
  Rocket,
  FileCheck2,
  AlertTriangle,
  FolderTree,
  Terminal,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  ScrollText,
  Palette,
  Sliders,
  HelpCircle,
  Eye,
  FileUp,
  Cpu,
  Building2,
  Hash,
  ChevronRight,
  List,
  Grid,
  ArrowUp,
  RefreshCw,
  Info,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { DEMO_CREDENTIALS, DEMO_IDS, DEMO_DISCLAIMER } from "../../config/demoCredentials";
import { demoUsers } from "../../data/users";
import { businesses } from "../../data/businesses";
import { initialDocuments } from "../../data/documents";
import { initialDeals } from "../../data/deals";
import { initialAuditLogs } from "../../data/auditLogs";
import { initialNotifications } from "../../data/notifications";
import { KYC_DOCUMENT_TYPES } from "../../data/kycData";
import { trustBreakdown } from "../../data/dashboardData";

// 25 Comprehensive Documentation Sections
const SECTIONS = [
  { id: "sec-1-intro", num: 1, group: "Core Overview", label: "1. Introduction", icon: BookOpen },
  {
    id: "sec-2-overview",
    num: 2,
    group: "Core Overview",
    label: "2. Project Overview",
    icon: Sparkles,
  },
  {
    id: "sec-3-features",
    num: 3,
    group: "Core Overview",
    label: "3. Platform Features",
    icon: ShieldCheck,
  },
  {
    id: "sec-4-architecture",
    num: 4,
    group: "Core Overview",
    label: "4. Static Architecture",
    icon: ServerOff,
  },

  {
    id: "sec-5-roles",
    num: 5,
    group: "Access & Security",
    label: "5. User Roles & Scopes",
    icon: Users,
  },
  {
    id: "sec-6-credentials",
    num: 6,
    group: "Access & Security",
    label: "6. Demo Credentials",
    icon: Lock,
  },
  {
    id: "sec-7-ids",
    num: 7,
    group: "Access & Security",
    label: "7. Demo Entity Identifiers",
    icon: Hash,
  },
  {
    id: "sec-8-auth-flow",
    num: 8,
    group: "Access & Security",
    label: "8. Authentication Flow",
    icon: Sliders,
  },

  {
    id: "sec-9-structure",
    num: 9,
    group: "Structure & Directory",
    label: "9. Project Structure",
    icon: FolderTree,
  },
  {
    id: "sec-10-routes",
    num: 10,
    group: "Structure & Directory",
    label: "10. Routes & URLs Directory",
    icon: RouteIcon,
  },
  {
    id: "sec-11-technologies",
    num: 11,
    group: "Structure & Directory",
    label: "11. Technologies & Stack",
    icon: Cpu,
  },
  {
    id: "sec-12-static-data",
    num: 12,
    group: "Structure & Directory",
    label: "12. Static Data Catalog",
    icon: Database,
  },

  {
    id: "sec-13-business-dash",
    num: 13,
    group: "Workflows & Modules",
    label: "13. Business Dashboard",
    icon: Building2,
  },
  {
    id: "sec-14-admin-dash",
    num: 14,
    group: "Workflows & Modules",
    label: "14. Admin Console",
    icon: ShieldCheck,
  },
  {
    id: "sec-15-kyc-workflow",
    num: 15,
    group: "Workflows & Modules",
    label: "15. KYC Verification Lifecycle",
    icon: FileCheck2,
  },
  {
    id: "sec-16-documents",
    num: 16,
    group: "Workflows & Modules",
    label: "16. Document Hub & OCR",
    icon: FileUp,
  },
  {
    id: "sec-17-approval",
    num: 17,
    group: "Workflows & Modules",
    label: "17. Review & Approval Flow",
    icon: CheckCircle2,
  },
  {
    id: "sec-18-deals",
    num: 18,
    group: "Workflows & Modules",
    label: "18. Commercial Deals & Disputes",
    icon: Briefcase,
  },
  {
    id: "sec-19-audit",
    num: 19,
    group: "Workflows & Modules",
    label: "19. Immutable Audit Ledger",
    icon: ScrollText,
  },

  {
    id: "sec-20-localstorage",
    num: 20,
    group: "Design & Engineering",
    label: "20. LocalStorage Architecture",
    icon: Database,
  },
  {
    id: "sec-21-typography",
    num: 21,
    group: "Design & Engineering",
    label: "21. Design & Typography (Times New Roman)",
    icon: Palette,
  },
  {
    id: "sec-22-components",
    num: 22,
    group: "Design & Engineering",
    label: "22. Reusable UI Components",
    icon: Layers,
  },
  {
    id: "sec-23-important-code",
    num: 23,
    group: "Design & Engineering",
    label: "23. Core Code Architecture",
    icon: Code2,
  },
  {
    id: "sec-24-deployment",
    num: 24,
    group: "Deployment & Operations",
    label: "24. Static Deployment",
    icon: Rocket,
  },
  {
    id: "sec-25-dev-notes",
    num: 25,
    group: "Deployment & Operations",
    label: "25. Development Setup & Notes",
    icon: Terminal,
  },
];

export default function DocumentationPage() {
  const [viewMode, setViewMode] = useState("all"); // "all" = continuous full document, "single" = topic by topic
  const [activeSectionId, setActiveSectionId] = useState("sec-1-intro");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedDataTab, setSelectedDataTab] = useState("users");
  const [storageKeysInfo, setStorageKeysInfo] = useState([]);

  // Copy helper with toast feedback
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Inspect live browser localStorage
  const refreshStorageStats = () => {
    const keys = [
      "trustkyc_demo_auth_user",
      "trustkyc_demo_auth_role",
      "theme",
      "trustkyc_demo_businesses",
      "trustkyc_demo_documents",
      "trustkyc_demo_deals",
      "trustkyc_demo_audit_logs",
      "trustkyc_demo_notifications",
    ];
    const info = keys.map((k) => {
      const raw = localStorage.getItem(k);
      let count = "Not initialized";
      let bytes = 0;
      if (raw) {
        bytes = new Blob([raw]).size;
        try {
          const parsed = JSON.parse(raw);
          count = Array.isArray(parsed) ? `${parsed.length} items` : "Object";
        } catch {
          count = "String";
        }
      }
      return { key: k, status: raw ? "Active" : "Unset", count, bytes: `${bytes} B` };
    });
    setStorageKeysInfo(info);
  };

  useEffect(() => {
    refreshStorageStats();
  }, []);

  // Jump to section handler
  const handleSelectSection = (secId) => {
    setActiveSectionId(secId);
    if (viewMode === "all") {
      const el = document.getElementById(secId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filter sections by search query
  const filteredSections = SECTIONS.filter(
    (s) =>
      s.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.group.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeSectionIndex = SECTIONS.findIndex((s) => s.id === activeSectionId);
  const prevSection = activeSectionIndex > 0 ? SECTIONS[activeSectionIndex - 1] : null;
  const nextSection =
    activeSectionIndex < SECTIONS.length - 1 ? SECTIONS[activeSectionIndex + 1] : null;

  // Code Block Component with Copy
  const CodeBlock = ({ code, filename, title }) => (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border text-xs font-mono text-muted-foreground">
        <span className="font-semibold text-foreground">{filename || title}</span>
        <button
          onClick={() => copyToClipboard(code, filename || title)}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] border border-border transition-colors cursor-pointer"
        >
          {copiedKey === (filename || title) ? (
            <>
              <Check className="size-3 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/90 bg-muted/20 selection:bg-primary/20">
        <code>{code}</code>
      </pre>
    </div>
  );

  // Section Header Component
  const SectionHeader = ({ id, num, title, icon: Icon, desc }) => (
    <div id={id} className="pt-6 pb-2 scroll-mt-20 border-b border-border/60 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="inline-flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-primary/10 text-primary border border-primary/20">
            Section {num} of 25
          </span>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {SECTIONS.find((s) => s.id === id)?.group}
          </span>
        </div>
        <button
          onClick={() => handleSelectSection(id)}
          className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          #{id}
        </button>
      </div>
      <h2 className="text-2xl font-bold font-display text-foreground flex items-center gap-2.5">
        <Icon className="size-6 text-primary shrink-0" />
        <span>{title}</span>
      </h2>
      {desc && <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold font-mono mb-2">
              <ShieldCheck className="size-3.5" /> 100% Frontend-Only Static Architecture
            </div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              TrustKYC Platform Documentation
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
              Complete architectural, operational, and development specification covering all 25
              modules, statutory data models, security clearance roles, local storage state
              persistence, and static deployment guides.
            </p>
          </div>

          {/* Quick Credentials Badge */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <div className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs font-mono">
              <div className="text-[10px] text-muted-foreground font-semibold uppercase">
                Business Demo
              </div>
              <div className="font-bold text-foreground">{DEMO_CREDENTIALS.BUSINESS.email}</div>
              <div className="text-[11px] text-muted-foreground">
                PWD: {DEMO_CREDENTIALS.BUSINESS.password}
              </div>
            </div>
            <div className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-500/5 text-xs font-mono">
              <div className="text-[10px] text-muted-foreground font-semibold uppercase">
                Admin Demo
              </div>
              <div className="font-bold text-foreground">{DEMO_CREDENTIALS.ADMIN.email}</div>
              <div className="text-[11px] text-muted-foreground">
                PWD: {DEMO_CREDENTIALS.ADMIN.password}
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-muted-foreground">Display Mode:</span>
            <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border text-xs">
              <button
                onClick={() => setViewMode("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "all"
                    ? "bg-card text-foreground font-bold shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="size-3.5" />
                <span>All 25 Sections (Continuous Scroll)</span>
              </button>
              <button
                onClick={() => setViewMode("single")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "single"
                    ? "bg-card text-foreground font-bold shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid className="size-3.5" />
                <span>Single Topic View</span>
              </button>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search 25 topics, routes, keys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sticky Sidebar Index */}
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-20 z-10">
          <div className="rounded-2xl border border-border bg-card p-3 shadow-xs space-y-2 max-h-[calc(100vh-100px)] flex flex-col">
            <div className="px-2 pt-1 pb-2 border-b border-border flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                Table of Contents
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-semibold">
                {filteredSections.length} Sections
              </span>
            </div>

            <nav className="overflow-y-auto space-y-1 pr-1 flex-1">
              {filteredSections.map((sec) => {
                const Icon = sec.icon;
                const active = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                      active
                        ? "bg-primary/10 text-primary font-semibold border border-primary/20 shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon
                      className={`size-3.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
              {filteredSections.length === 0 && (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No matching sections found for "{searchTerm}"
                </div>
              )}
            </nav>

            {/* Quick jump to top */}
            <div className="pt-2 border-t border-border">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
              >
                <ArrowUp className="size-3.5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 space-y-12">
          {/* ========================================================================= */}
          {/* SECTION 1: INTRODUCTION */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-1-intro") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-1-intro"
                num={1}
                title="Introduction to TrustKYC"
                icon={BookOpen}
                desc="Comprehensive architectural blueprint and operational handbook for TrustKYC's B2B Trust Verification System."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  Mission & Problem Statement
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  In modern B2B trade, supply chains, and enterprise SaaS partnerships, businesses
                  face massive counterparty risks: forged GST certificates, shell corporate
                  entities, delayed vendor accreditations, and unverified financial backgrounds.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <strong>TrustKYC</strong> solves this by establishing a decentralized,
                  authoritative KYC registry and commercial deal arbitration platform. Entities
                  upload statutory documents (GSTIN REG-06, PAN, MCA CIN, Bank Statements), undergo
                  simulated OCR extraction and compliance officer verification, and receive a
                  composite <strong>Trust Score (0–100)</strong> recognized across accredited
                  counterparties.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-1">
                    <div className="font-bold text-foreground text-xs font-mono text-primary">
                      100% Client-Side
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Engineered as an autonomous static frontend application. Runs smoothly on any
                      static hosting without remote server dependencies.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-1">
                    <div className="font-bold text-foreground text-xs font-mono text-primary">
                      Times New Roman Global
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Authoritative serif typography applied uniformly across all headings, inputs,
                      tables, badges, and navigation for legal prestige.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-1">
                    <div className="font-bold text-foreground text-xs font-mono text-primary">
                      Dual Persona Engine
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Isolated workspaces for Business Representatives (filings, deals, scores) and
                      Compliance Auditors (queues, overrides, disputes).
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: PROJECT OVERVIEW */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-2-overview") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-2-overview"
                num={2}
                title="Project Overview & Dual-Role Design"
                icon={Sparkles}
                desc="Core capabilities partitioned into separate external and internal operational consoles."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-blue-500/30 bg-card p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 font-bold font-mono text-xs">
                      BUSINESS TENANT WORKSPACE
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      Route: /business/*
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Accredited Corporate Persona
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Designed for business owners, finance managers, and compliance directors.
                    Provides complete self-service management of company statutory documents, live
                    KYC progress, score calibration, deal pipelines, and search in the verified
                    Business Directory.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                    <li>Upload & replace statutory filings (GSTIN, PAN, MCA, Banking)</li>
                    <li>Live Trust Gauge visualization with dynamic grade (A+, A, B, C, D)</li>
                    <li>Counterparty trade contracts, milestones, and dispute initiation</li>
                    <li>Tokenized shareable external compliance links</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-purple-500/30 bg-card p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 font-bold font-mono text-xs">
                      COMPLIANCE OPERATOR CONSOLE
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">Route: /admin/*</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Supervisory & Audit Persona
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Engineered for compliance auditors, risk supervisors, and system administrators.
                    Delivers an authoritative triage desk to inspect uploaded documents, compare OCR
                    extraction with Indian statutory registries, execute approvals, issue structured
                    rejections with remarks, and mediate commercial disputes.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                    <li>Pending KYC document queue with quick-approval and rejection modal</li>
                    <li>OCR extracted data vs registry comparison</li>
                    <li>Deal dispute mediation tribunal with binding settlement controls</li>
                    <li>Immutable system-wide compliance and authentication audit trail</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: PLATFORM FEATURES */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-3-features") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-3-features"
                num={3}
                title="Platform Features & Capabilities"
                icon={ShieldCheck}
                desc="Detailed technical breakdown of all enterprise SaaS modules."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "Statutory KYC Dossiers",
                    desc: "Automated OCR extraction and validation for Form GST REG-06, Corporate PAN cards, MCA Incorporation Certificates, and Bank Statements.",
                    tag: "KYC Engine",
                  },
                  {
                    title: "Algorithmic Trust Score",
                    desc: "Composite 0-100 index weighted across Identity (40%), Regulatory Compliance (20%), Deal Performance (30%), and Activity (10%).",
                    tag: "Scoring Engine",
                  },
                  {
                    title: "Interactive Document Vault",
                    desc: "Inspect, replace, filter, and preview documents with modal zooming, extracted field inspection, and simulated confidence scores.",
                    tag: "Document Hub",
                  },
                  {
                    title: "Commercial Deal Desk",
                    desc: "Contract pipeline with milestones, monetary values in INR, fulfillment tracking, and dispute escalation to administrative tribunal.",
                    tag: "Deal Desk",
                  },
                  {
                    title: "Accredited Directory",
                    desc: "Searchable network of verified business partners with in-depth entity dossiers, active clearance badges, and history metrics.",
                    tag: "Directory",
                  },
                  {
                    title: "Immutable Audit Ledger",
                    desc: "Append-only chronological record of every login, file upload, verification, and score update with actor signatures and IP addresses.",
                    tag: "Compliance Log",
                  },
                ].map((f, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {f.tag}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
                    </div>
                    <h4 className="font-semibold text-foreground text-sm">{f.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 4: STATIC ARCHITECTURE */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-4-architecture") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-4-architecture"
                num={4}
                title="100% Frontend Static Architecture"
                icon={ServerOff}
                desc="Zero server dependencies: How TrustKYC runs autonomously in the browser."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/50 border-b border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Architectural Layer</th>
                        <th className="px-4 py-3 font-semibold">Traditional Backend Approach</th>
                        <th className="px-4 py-3 font-semibold text-primary">
                          TrustKYC Static Demo Architecture
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-b border-border font-mono">
                      <tr>
                        <td className="px-4 py-3 font-bold text-foreground">Data Storage</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          MongoDB Atlas / PostgreSQL cluster
                        </td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">
                          Browser LocalStorage + Deterministic Seeds
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-foreground">API Layer</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Node.js / Express REST API endpoints
                        </td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">
                          In-memory async handlers in storage.js
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-foreground">Real-time Updates</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          WebSocket / Socket.io server daemon
                        </td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">
                          DOM CustomEvents (trustkyc:data_update)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-foreground">Session & Auth</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          HttpOnly Cookies / Redis Session Store
                        </td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">
                          React AuthContext + Simulated JWT Token
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-foreground">Deployment</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Multi-tier Docker / Kubernetes / AWS ECS
                        </td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">
                          Pure CDN static build (Vercel, Netlify, GH Pages)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 5: USER ROLES & SCOPES */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-5-roles") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-5-roles"
                num={5}
                title="User Roles & Access Permissions"
                icon={Users}
                desc="Strict role-based isolation between Business and Admin entities."
              />

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 border-b border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Attribute</th>
                      <th className="px-4 py-3 font-semibold text-blue-600">Business Role</th>
                      <th className="px-4 py-3 font-semibold text-purple-600">Admin Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-b border-border font-mono">
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-foreground">
                        Scope Classification
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        TENANT (External Entity)
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        SYSTEM (Supervisory Authority)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-foreground">Default Landing URL</td>
                      <td className="px-4 py-2.5 text-primary">/business/dashboard</td>
                      <td className="px-4 py-2.5 text-primary">/admin/dashboard</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-foreground">
                        Authorized Route Prefix
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">/business/*</td>
                      <td className="px-4 py-2.5 text-muted-foreground">/admin/*</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-foreground">Document Actions</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        Upload, Replace, View Own, Preview
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        Inspect All, Quick-Approve, Reject with Feedback
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-foreground">Deal Desk Actions</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        Create Deal, Sign Milestones, Dispute
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        Arbitrate Disputes, Issue Settlements
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-foreground">
                        Cross-Access Prevention
                      </td>
                      <td className="px-4 py-2.5 text-rose-600 font-semibold">
                        Redirects to /unauthorized on /admin/*
                      </td>
                      <td className="px-4 py-2.5 text-purple-600 font-semibold">
                        Global clearance
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 6: DEMO CREDENTIALS */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-6-credentials") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-6-credentials"
                num={6}
                title="Demo Credentials & Fast Access"
                icon={Lock}
                desc="Copy credentials with 1-click or use the Persona Switcher on the login screen."
              />

              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Notice:</strong> {DEMO_DISCLAIMER}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Persona Card */}
                <div className="rounded-2xl border border-blue-500/30 bg-card p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 font-bold flex items-center justify-center font-mono">
                        BZ
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {DEMO_CREDENTIALS.BUSINESS.displayName}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {DEMO_CREDENTIALS.BUSINESS.company}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      BUSINESS
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
                      <span className="text-muted-foreground">Email:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground select-all">
                          {DEMO_CREDENTIALS.BUSINESS.email}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(DEMO_CREDENTIALS.BUSINESS.email, "biz_email")
                          }
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedKey === "biz_email" ? (
                            <Check className="size-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
                      <span className="text-muted-foreground">Password:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground select-all">
                          {DEMO_CREDENTIALS.BUSINESS.password}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(DEMO_CREDENTIALS.BUSINESS.password, "biz_pwd")
                          }
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Copy Password"
                        >
                          {copiedKey === "biz_pwd" ? (
                            <Check className="size-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-mono">
                      Target: /business/dashboard
                    </span>
                    <Link
                      to="/"
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                    >
                      Open Login Portal →
                    </Link>
                  </div>
                </div>

                {/* Admin Persona Card */}
                <div className="rounded-2xl border border-purple-500/30 bg-card p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 font-bold flex items-center justify-center font-mono">
                        AD
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {DEMO_CREDENTIALS.ADMIN.displayName}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {DEMO_CREDENTIALS.ADMIN.department}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/10 text-purple-600 border border-purple-500/20">
                      ADMIN
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
                      <span className="text-muted-foreground">Email:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground select-all">
                          {DEMO_CREDENTIALS.ADMIN.email}
                        </span>
                        <button
                          onClick={() => copyToClipboard(DEMO_CREDENTIALS.ADMIN.email, "adm_email")}
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedKey === "adm_email" ? (
                            <Check className="size-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
                      <span className="text-muted-foreground">Password:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground select-all">
                          {DEMO_CREDENTIALS.ADMIN.password}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(DEMO_CREDENTIALS.ADMIN.password, "adm_pwd")
                          }
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Copy Password"
                        >
                          {copiedKey === "adm_pwd" ? (
                            <Check className="size-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-mono">
                      Target: /admin/dashboard
                    </span>
                    <Link
                      to="/"
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                    >
                      Open Login Portal →
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 7: DEMO ENTITY IDENTIFIERS */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-7-ids") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-7-ids"
                num={7}
                title="Demo Entity Identifiers & Registry Keys"
                icon={Hash}
                desc="Exhaustive index of deterministic IDs utilized across models, audit logs, and deals."
              />

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 border-b border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Constant Name</th>
                      <th className="px-4 py-3 font-semibold">Value</th>
                      <th className="px-4 py-3 font-semibold">Scope & Context</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-b border-border font-mono">
                    {Object.entries(DEMO_IDS).map(([key, val]) => (
                      <tr key={key} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-bold text-foreground">{key}</td>
                        <td className="px-4 py-2.5 text-primary font-bold select-all">{val}</td>
                        <td className="px-4 py-2.5 font-sans text-muted-foreground">
                          {key.includes("BUSINESS")
                            ? "Helios Trade Networks Pvt Ltd"
                            : key.includes("ADMIN")
                              ? "Compliance Officer Smit Patel"
                              : key.includes("GSTIN")
                                ? "GST Taxpayer Identification Number"
                                : key.includes("CIN")
                                  ? "MCA Corporate Identification Number"
                                  : key.includes("PAN")
                                    ? "Income Tax Permanent Account Number"
                                    : key.includes("DEAL")
                                      ? "Primary Active Supply Contract"
                                      : key.includes("DOC")
                                        ? "Primary Verified GST Filing"
                                        : "System Demo Entity"}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => copyToClipboard(val, key)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] cursor-pointer"
                          >
                            {copiedKey === key ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                            <span>{copiedKey === key ? "Copied" : "Copy"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 8: AUTHENTICATION FLOW */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-8-auth-flow") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-8-auth-flow"
                num={8}
                title="Authentication Flow & Guard Architecture"
                icon={Sliders}
                desc="Lifecycle of client-side credentials validation, session synthesis, and route protection."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                    <span className="font-bold text-primary">1. Input & Normalization</span>
                    <p className="text-muted-foreground font-sans">
                      Login credentials entered. Emails are trimmed and transformed to lowercase to
                      support case-insensitive matches.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                    <span className="font-bold text-primary">2. In-Memory Resolution</span>
                    <p className="text-muted-foreground font-sans">
                      Matched against static user list. Generates a deterministic bearer token (
                      <code className="font-mono">tkyc-demo-token-...</code>).
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                    <span className="font-bold text-primary">3. Session Sync</span>
                    <p className="text-muted-foreground font-sans">
                      Stores user payload into{" "}
                      <code className="font-mono">trustkyc_demo_auth_user</code> and sets role in{" "}
                      <code className="font-mono">trustkyc_demo_auth_role</code>.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                    <span className="font-bold text-primary">4. Guard & Route</span>
                    <p className="text-muted-foreground font-sans">
                      RoleRoute evaluates permissions. Business redirected to /business/dashboard,
                      Admin to /admin/dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 9: PROJECT STRUCTURE */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-9-structure") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-9-structure"
                num={9}
                title="Actual Project File & Folder Structure"
                icon={FolderTree}
                desc="Strict modular organization under src/ representing complete separation of concerns."
              />

              <CodeBlock
                title="Directory Map"
                filename="src/ (Actual Restructured Tree)"
                code={`src/
├── assets/                  # Logos, icons, and company visual marks
├── components/              # Modular component library
│   ├── admin/               # AdminReviewModal.jsx (decision & rejection feedback)
│   ├── business/            # TrustGauge.jsx (radial score meter & grade calculation)
│   ├── common/              # Button.jsx, Card.jsx, Modal.jsx, StatusBadge.jsx
│   ├── documents/           # DocumentPreviewModal.jsx (zoom & OCR preview)
│   ├── layout/              # AppHeader.jsx, AppSidebar.jsx, AppShell.jsx
│   └── ui/                  # CompanyLogo.jsx, ui-bits.jsx, ui-kit.jsx
├── config/                  # Configuration & Demo Constants
│   └── demoCredentials.js   # Centralized credentials, demo IDs & disclaimers
├── context/                 # Global state providers
│   ├── AuthContext.jsx      # Role-based static authentication & redirection engine
│   └── ThemeContext.jsx     # Dark / light theme state provider
├── data/                    # Centralized statutory mock models & seed catalogs
│   ├── users.js             # Demo user profiles (Krish Lad & Smit Patel)
│   ├── businesses.js        # Accredited enterprise nodes & statutory keys
│   ├── kycData.js           # KYC document specifications, weights, sample numbers
│   ├── documents.js         # Staged files with simulated OCR extractedData
│   ├── deals.js             # Commercial trade contracts & milestone records
│   ├── auditLogs.js         # Append-only compliance activity records
│   ├── notifications.js     # System alerts with deep links
│   └── dashboardData.js     # Historical scores & benchmark factors
├── layouts/                 # Route shell wrappers
│   ├── BusinessLayout.jsx   # Layout for /business/*
│   ├── AdminLayout.jsx      # Layout for /admin/*
│   ├── DocumentationLayout.jsx # Layout for /documentation
│   └── headerConfig.js      # Dynamic page titles & breadcrumbs
├── pages/                   # Application route views
│   ├── auth/                # Landing.jsx (Hero & 1-click role switcher)
│   ├── business/            # DashboardHome, KycPage, DocumentsPage, TrustPage,
│   │                        # DealsPage, DirectoryPage, SharedPage, AuditPage, SettingsPage
│   ├── admin/               # AdminHome, AdminKyc, AdminDocuments, AdminDeals,
│   │                        # AdminUsers, AdminReports, AdminAudit, AdminSettings
│   ├── common/              # UnauthorizedPage.jsx (403), NotFoundPage.jsx (404)
│   └── documentation/       # DocumentationPage.jsx (25-topic documentation)
├── routes/                  # Route tree & security barriers
│   ├── AppRoutes.jsx        # Complete declarative route catalog
│   ├── ProtectedRoute.jsx   # Authentication barrier
│   ├── RoleRoute.jsx        # Business / Admin authorization barrier
│   └── PublicRoute.jsx      # Public route wrapper
├── utils/                   # Client storage engine & CSS helpers
│   ├── storage.js           # LocalStorage CRUD & custom event emitter
│   └── utils.js             # cn() Tailwind class merger
├── App.jsx                  # Root shell & Toast provider
├── main.jsx                 # Client entry point
└── styles.css               # Global Times New Roman typography enforcement`}
              />
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 10: ROUTES & URLS DIRECTORY */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-10-routes") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-10-routes"
                num={10}
                title="Routes & URLs Directory Table"
                icon={RouteIcon}
                desc="All 23 active client-side routes with role requirements, page components, and live links."
              />

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 border-b border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Route Path</th>
                      <th className="px-4 py-3 font-semibold">Allowed Role</th>
                      <th className="px-4 py-3 font-semibold">Component</th>
                      <th className="px-4 py-3 font-semibold">Functional Purpose</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-b border-border font-mono">
                    {[
                      {
                        path: "/",
                        role: "Public",
                        comp: "Landing.jsx",
                        desc: "Hero showcase & dual-role login switcher",
                      },
                      {
                        path: "/login",
                        role: "Public",
                        comp: "Landing.jsx",
                        desc: "Alias redirect to /",
                      },
                      {
                        path: "/business/dashboard",
                        role: "Business",
                        comp: "DashboardHome.jsx",
                        desc: "High-level trust score, KPI metrics, recent activity",
                      },
                      {
                        path: "/business/kyc",
                        role: "Business",
                        comp: "KycPage.jsx",
                        desc: "Interactive KYC submission form & status",
                      },
                      {
                        path: "/business/documents",
                        role: "Business",
                        comp: "DocumentsPage.jsx",
                        desc: "Document repository, upload, replace, inspect",
                      },
                      {
                        path: "/business/trust",
                        role: "Business",
                        comp: "TrustPage.jsx",
                        desc: "Trust score breakdown, benchmark history chart",
                      },
                      {
                        path: "/business/deals",
                        role: "Business",
                        comp: "DealsPage.jsx",
                        desc: "Deal pipeline, milestone sign-offs, disputes",
                      },
                      {
                        path: "/business/directory",
                        role: "Business",
                        comp: "DirectoryPage.jsx",
                        desc: "Accredited counterparty directory search",
                      },
                      {
                        path: "/business/directory/:id",
                        role: "Business",
                        comp: "ProfileDetailPage.jsx",
                        desc: "Detailed counterparty dossier & metrics",
                      },
                      {
                        path: "/business/shared",
                        role: "Business",
                        comp: "SharedPage.jsx",
                        desc: "Tokenized shareable external compliance links",
                      },
                      {
                        path: "/business/audit",
                        role: "Business",
                        comp: "AuditPage.jsx",
                        desc: "Entity-specific audit log trail",
                      },
                      {
                        path: "/business/settings",
                        role: "Business",
                        comp: "SettingsPage.jsx",
                        desc: "Organization profile, security settings",
                      },
                      {
                        path: "/admin/dashboard",
                        role: "Admin",
                        comp: "AdminHome.jsx",
                        desc: "Compliance operations, review throughput, metrics",
                      },
                      {
                        path: "/admin/kyc",
                        role: "Admin",
                        comp: "AdminKyc.jsx",
                        desc: "KYC review queue, OCR verification, decisions",
                      },
                      {
                        path: "/admin/documents",
                        role: "Admin",
                        comp: "AdminDocuments.jsx",
                        desc: "Global repository of all submitted documents",
                      },
                      {
                        path: "/admin/deals",
                        role: "Admin",
                        comp: "AdminDeals.jsx",
                        desc: "Commercial dispute mediation & arbitration",
                      },
                      {
                        path: "/admin/users",
                        role: "Admin",
                        comp: "AdminUsers.jsx",
                        desc: "System clearances, role allocations, user audits",
                      },
                      {
                        path: "/admin/reports",
                        role: "Admin",
                        comp: "AdminReports.jsx",
                        desc: "SLA compliance reports, verification throughput",
                      },
                      {
                        path: "/admin/audit",
                        role: "Admin",
                        comp: "AdminAudit.jsx",
                        desc: "Platform-wide immutable compliance ledger",
                      },
                      {
                        path: "/admin/settings",
                        role: "Admin",
                        comp: "AdminSettings.jsx",
                        desc: "Global thresholds, regulatory guidelines",
                      },
                      {
                        path: "/documentation",
                        role: "Universal",
                        comp: "DocumentationPage.jsx",
                        desc: "25-section system documentation portal",
                      },
                      {
                        path: "/unauthorized",
                        role: "Universal",
                        comp: "UnauthorizedPage.jsx",
                        desc: "403 access denied security warning",
                      },
                      {
                        path: "*",
                        role: "Universal",
                        comp: "NotFoundPage.jsx",
                        desc: "404 route not found fallback page",
                      },
                    ].map((r, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-bold text-foreground">{r.path}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.role === "Business"
                                ? "bg-blue-500/10 text-blue-600"
                                : r.role === "Admin"
                                  ? "bg-purple-500/10 text-purple-600"
                                  : "bg-emerald-500/10 text-emerald-600"
                            }`}
                          >
                            {r.role}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-primary">{r.comp}</td>
                        <td className="px-4 py-2.5 font-sans text-muted-foreground">{r.desc}</td>
                        <td className="px-4 py-2.5 text-right">
                          <Link
                            to={r.path.includes(":") ? "/business/directory/biz-001" : r.path}
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                          >
                            <span>Open</span>
                            <ExternalLink className="size-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 11: TECHNOLOGIES & STACK */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-11-technologies") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-11-technologies"
                num={11}
                title="Technologies, Frameworks & Tooling"
                icon={Cpu}
                desc="Clean, modern frontend toolchain with zero legacy dependencies."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "React 19",
                    role: "UI Framework",
                    desc: "Concurrent rendering, hooks, and clean state primitives.",
                  },
                  {
                    name: "Vite 6",
                    role: "Bundler & Dev Server",
                    desc: "Sub-second HMR and optimized production asset minification.",
                  },
                  {
                    name: "Tailwind CSS v4",
                    role: "Utility Styling",
                    desc: "OKLCH color themes and responsive utility cascading.",
                  },
                  {
                    name: "React Router DOM v7",
                    role: "Routing Engine",
                    desc: "Declarative nested route trees, layouts, and role barriers.",
                  },
                  {
                    name: "Lucide React",
                    role: "Iconography",
                    desc: "Crisp vector icons tailored for enterprise SaaS dashboards.",
                  },
                  {
                    name: "Sonner",
                    role: "Feedback Notifications",
                    desc: "Polished toast notification system with callback actions.",
                  },
                ].map((t, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border bg-card space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground font-mono">{t.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-semibold">
                        {t.role}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 12: STATIC DATA CATALOG & LIVE INSPECTOR */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-12-static-data") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-12-static-data"
                num={12}
                title="Static Data Catalog & Live Inspector"
                icon={Database}
                desc="Inspect the actual static datasets, schema formats, and sample JSON records."
              />

              {/* Interactive JSON Inspector */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Interactive Dataset Inspector
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Select a static catalog to view its live data structure:
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted/60 border border-border text-xs font-mono">
                    {[
                      { id: "users", label: "users.js", count: demoUsers.length },
                      { id: "businesses", label: "businesses.js", count: businesses.length },
                      { id: "documents", label: "documents.js", count: initialDocuments.length },
                      { id: "deals", label: "deals.js", count: initialDeals.length },
                      { id: "auditLogs", label: "auditLogs.js", count: initialAuditLogs.length },
                      {
                        id: "notifications",
                        label: "notifications.js",
                        count: initialNotifications.length,
                      },
                      { id: "kycTypes", label: "kycData.js", count: KYC_DOCUMENT_TYPES.length },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedDataTab(tab.id)}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          selectedDataTab === tab.id
                            ? "bg-card text-foreground font-bold border border-border shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display active dataset sample */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 font-mono text-xs overflow-x-auto max-h-96">
                  {selectedDataTab === "users" && (
                    <pre className="text-foreground/90">
                      <code>{JSON.stringify(demoUsers, null, 2)}</code>
                    </pre>
                  )}
                  {selectedDataTab === "businesses" && (
                    <pre className="text-foreground/90">
                      <code>{JSON.stringify(businesses.slice(0, 2), null, 2)}</code>
                    </pre>
                  )}
                  {selectedDataTab === "documents" && (
                    <pre className="text-foreground/90">
                      <code>{JSON.stringify(initialDocuments.slice(0, 2), null, 2)}</code>
                    </pre>
                  )}
                  {selectedDataTab === "deals" && (
                    <pre className="text-foreground/90">
                      <code>{JSON.stringify(initialDeals.slice(0, 2), null, 2)}</code>
                    </pre>
                  )}
                  {selectedDataTab === "auditLogs" && (
                    <pre className="text-foreground/90">
                      <code>{JSON.stringify(initialAuditLogs.slice(0, 3), null, 2)}</code>
                    </pre>
                  )}
                  {selectedDataTab === "notifications" && (
                    <pre className="text-foreground/90">
                      <code>{JSON.stringify(initialNotifications, null, 2)}</code>
                    </pre>
                  )}
                  {selectedDataTab === "kycTypes" && (
                    <pre className="text-foreground/90">
                      <code>{JSON.stringify(KYC_DOCUMENT_TYPES, null, 2)}</code>
                    </pre>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 13: BUSINESS DASHBOARD */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-13-business-dash") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-13-business-dash"
                num={13}
                title="Business Dashboard Specifications"
                icon={Building2}
                desc="Core landing dashboard for external accredited organizations."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs text-muted-foreground">
                <p>
                  Accessible at{" "}
                  <code className="text-primary font-mono font-bold">/business/dashboard</code>,
                  this dashboard serves as the compliance mission control for corporate users.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1.5">
                    <h5 className="font-bold text-foreground text-xs font-mono">
                      1. Radial Trust Gauge
                    </h5>
                    <p>
                      Displays real-time composite score (88/100) and letter grade (A). Dynamically
                      recomputes when documents are approved.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1.5">
                    <h5 className="font-bold text-foreground text-xs font-mono">
                      2. Multi-Vector Radar Breakdown
                    </h5>
                    <p>
                      Compares four pillars: KYC Verification (38/40), Regulatory Compliance
                      (28/20), Deal Performance (22/30), Platform Activity (8/10).
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1.5">
                    <h5 className="font-bold text-foreground text-xs font-mono">
                      3. Commercial Counterparty Summary
                    </h5>
                    <p>
                      Real-time statistics on active deals, fulfillment percentages, and pending
                      milestones.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1.5">
                    <h5 className="font-bold text-foreground text-xs font-mono">
                      4. Direct Action Hub
                    </h5>
                    <p>
                      One-click shortcuts to upload missing documents, search peer directories, and
                      invite compliance auditors.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 14: ADMIN CONSOLE */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-14-admin-dash") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-14-admin-dash"
                num={14}
                title="Admin Supervisory Console"
                icon={ShieldCheck}
                desc="Compliance operations console for KYC triage, review queues, and dispute mediation."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs text-muted-foreground">
                <p>
                  Accessible at{" "}
                  <code className="text-primary font-mono font-bold">/admin/dashboard</code>, this
                  console gives compliance officers supervisory oversight over the entire TrustKYC
                  network.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1">
                    <h5 className="font-bold text-foreground text-xs font-mono">
                      Review Queue Desk
                    </h5>
                    <p>
                      Prioritizes submissions by risk level and age. Inspect OCR confidence, view
                      original PDF/scan, and execute decisions.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1">
                    <h5 className="font-bold text-foreground text-xs font-mono">
                      Dispute Arbitration
                    </h5>
                    <p>
                      Mediate commercial contract conflicts between counterparties with binding
                      resolution controls.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1">
                    <h5 className="font-bold text-foreground text-xs font-mono">
                      System-Wide Audit
                    </h5>
                    <p>
                      Searchable immutable activity stream capturing IP addresses, timestamps, actor
                      IDs, and severity codes.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 15: KYC VERIFICATION LIFECYCLE */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-15-kyc-workflow") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-15-kyc-workflow"
                num={15}
                title="KYC Verification State Machine"
                icon={FileCheck2}
                desc="Mathematical state machine governing business verification transitions."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs">
                <div className="flex flex-wrap items-center gap-2 font-mono pb-3 border-b border-border">
                  <span className="px-3 py-1 rounded-lg bg-muted text-foreground font-bold">
                    1. DRAFT
                  </span>
                  <span>→</span>
                  <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 font-bold">
                    2. SUBMITTED
                  </span>
                  <span>→</span>
                  <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 font-bold">
                    3. UNDER_REVIEW
                  </span>
                  <span>→</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">
                    4. APPROVED
                  </span>
                  <span className="text-muted-foreground font-sans">or</span>
                  <span className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-600 font-bold">
                    REJECTED
                  </span>
                </div>

                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong>State 1 (Draft):</strong> Entity creates account, stages preliminary
                    document files in localStorage.
                  </p>
                  <p>
                    <strong>State 2 (Submitted):</strong> Entity completes form and clicks Submit.
                    Status updates to <code className="font-mono text-blue-600">SUBMITTED</code>,
                    triggers an audit log, and enters the Admin Queue.
                  </p>
                  <p>
                    <strong>State 3 (Under Review):</strong> Compliance officer opens the
                    application. Status advances to{" "}
                    <code className="font-mono text-amber-600">UNDER_REVIEW</code>.
                  </p>
                  <p>
                    <strong>State 4A (Approved):</strong> Compliance officer approves. Status
                    updates to <code className="font-mono text-emerald-600">APPROVED</code>, trust
                    score increments, and entity gains the Verified Badge in the Business Directory.
                  </p>
                  <p>
                    <strong>State 4B (Rejected):</strong> Officer selects Reject, inputs feedback
                    reason (e.g. "Blurry scan", "Address mismatch"). Entity receives notification
                    and can re-upload replacement.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 16: DOCUMENT HUB & OCR */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-16-documents") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-16-documents"
                num={16}
                title="Document Hub & Simulated OCR Extraction"
                icon={FileUp}
                desc="Comprehensive document management desk at /business/documents."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs text-muted-foreground">
                <p>
                  The Document Hub allows business representatives to manage corporate compliance
                  artifacts. Features simulated optical character recognition (OCR) extracting
                  structured data fields:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono pt-2">
                  <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1">
                    <span className="font-bold text-foreground">GST Certificate (REG-06)</span>
                    <p className="text-[11px] text-muted-foreground font-sans">
                      Extracts GSTIN checksum, Legal Entity Name, Trade Name, Principal Place of
                      Business, Registration Date.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1">
                    <span className="font-bold text-foreground">Corporate PAN Card</span>
                    <p className="text-[11px] text-muted-foreground font-sans">
                      Extracts 10-digit alphanumeric PAN, Entity Category, Incorporation Date, and
                      Authorized Signatory Name.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 17: REVIEW & APPROVAL FLOW */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-17-approval") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-17-approval"
                num={17}
                title="Admin Review & Approval Workflow"
                icon={CheckCircle2}
                desc="Detailed operator workflow for reviewing filings, executing approvals, and logging feedback."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs text-muted-foreground">
                <p>
                  Compliance auditors operate at{" "}
                  <code className="text-primary font-mono">/admin/kyc</code> and{" "}
                  <code className="text-primary font-mono">/admin/documents</code>. Clicking{" "}
                  <strong>Review</strong> launches the{" "}
                  <code className="text-primary font-mono">AdminReviewModal.jsx</code> dialog:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>
                    <strong>Side-by-Side Validation:</strong> Shows the staged document name, size,
                    upload date, and OCR extracted fields.
                  </li>
                  <li>
                    <strong>Quick Approval:</strong> 1-click approval immediately verifies the
                    document in localStorage, recalculates the business trust score, and dispatches
                    an audit event.
                  </li>
                  <li>
                    <strong>Rejection with Mandatory Reason:</strong> Demands a structured remark
                    (e.g. "Expired validity", "Signature missing") and notifies the entity.
                  </li>
                </ul>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 18: COMMERCIAL DEALS & DISPUTES */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-18-deals") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-18-deals"
                num={18}
                title="Commercial Deals & Dispute Arbitration"
                icon={Briefcase}
                desc="Contract lifecycle, milestone tracking, and administrative dispute resolution."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs text-muted-foreground">
                <p>
                  B2B transactions in TrustKYC are tracked as verified deals (
                  <code className="text-primary font-mono font-bold">/business/deals</code>). Each
                  deal includes milestone deliverables, currency values in INR, delivery schedules,
                  and payment terms.
                </p>
                <p>
                  If a counterparty fails to fulfill a milestone, either party can trigger a
                  dispute. Disputed agreements escalate to the Admin Tribunal (
                  <code className="text-primary font-mono">/admin/deals</code>), where an
                  administrative arbitrator inspects claims and issues binding settlements.
                </p>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 19: IMMUTABLE AUDIT LEDGER */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-19-audit") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-19-audit"
                num={19}
                title="Immutable Compliance Audit Ledger"
                icon={ScrollText}
                desc="Cryptographic audit trail capturing all system events across organizations."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs text-muted-foreground">
                <p>
                  Every authentication, file staging, status transition, milestone sign-off, and
                  score adjustment creates an append-only log record:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left font-mono">
                    <thead className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Field</th>
                        <th className="px-4 py-2 font-semibold">Type</th>
                        <th className="px-4 py-2 font-semibold">Description & Example</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-b border-border">
                      <tr>
                        <td className="px-4 py-2 text-foreground font-bold">id</td>
                        <td className="px-4 py-2 text-muted-foreground">String</td>
                        <td className="px-4 py-2 font-sans">
                          Unique sequence key, e.g. <code className="font-mono">LOG-5819</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-foreground font-bold">actor</td>
                        <td className="px-4 py-2 text-muted-foreground">String</td>
                        <td className="px-4 py-2 font-sans">
                          User name & role, e.g.{" "}
                          <code className="font-mono">Smit Patel (Admin)</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-foreground font-bold">action</td>
                        <td className="px-4 py-2 text-muted-foreground">String</td>
                        <td className="px-4 py-2 font-sans">
                          System event code: <code className="font-mono">LOGIN</code>,{" "}
                          <code className="font-mono">DOC_VERIFIED</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-foreground font-bold">severity</td>
                        <td className="px-4 py-2 text-muted-foreground">Enum</td>
                        <td className="px-4 py-2 font-sans">
                          <code className="font-mono">INFO</code>,{" "}
                          <code className="font-mono">WARN</code>,{" "}
                          <code className="font-mono">CRITICAL</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-foreground font-bold">ipAddress</td>
                        <td className="px-4 py-2 text-muted-foreground">String</td>
                        <td className="px-4 py-2 font-sans">
                          Simulated origin IP, e.g. <code className="font-mono">103.21.14.88</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 20: LOCALSTORAGE ARCHITECTURE & LIVE KEYS */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-20-localstorage") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-20-localstorage"
                num={20}
                title="LocalStorage Engine & Live Key Inspector"
                icon={Database}
                desc="Centralized client-side persistence keys, schemas, and live browser inspector."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Live Browser Storage Status
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Current keys stored in your browser session:
                    </p>
                  </div>
                  <button
                    onClick={refreshStorageStats}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground cursor-pointer transition-colors"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>Refresh Stats</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left font-mono">
                    <thead className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Storage Key</th>
                        <th className="px-4 py-2.5 font-semibold">Status</th>
                        <th className="px-4 py-2.5 font-semibold">Record Count</th>
                        <th className="px-4 py-2.5 font-semibold">Byte Size</th>
                        <th className="px-4 py-2.5 font-semibold font-sans">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-b border-border">
                      {storageKeysInfo.map((k, i) => (
                        <tr key={i} className="hover:bg-muted/30">
                          <td className="px-4 py-2 text-primary font-bold">{k.key}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${k.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                            >
                              {k.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-foreground font-semibold">{k.count}</td>
                          <td className="px-4 py-2 text-muted-foreground">{k.bytes}</td>
                          <td className="px-4 py-2 font-sans text-muted-foreground">
                            {k.key === "trustkyc_demo_auth_user"
                              ? "Authenticated user persona"
                              : k.key === "trustkyc_demo_auth_role"
                                ? "RBAC security scope / role"
                                : k.key === "theme"
                                  ? "Light / dark theme state"
                                  : k.key === "trustkyc_demo_businesses"
                                    ? "Registered enterprise nodes"
                                    : k.key === "trustkyc_demo_documents"
                                      ? "Statutory compliance files & OCR"
                                      : k.key === "trustkyc_demo_deals"
                                        ? "Trade contracts & milestones"
                                        : k.key === "trustkyc_demo_audit_logs"
                                          ? "Immutable audit trail"
                                          : "System notifications"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 21: DESIGN SYSTEM & TYPOGRAPHY */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-21-typography") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-21-typography"
                num={21}
                title="Design System & Global Times New Roman Typography"
                icon={Palette}
                desc="Institutional elegance and strict font-family standardization across all components."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs text-muted-foreground">
                <p>
                  To convey institutional credibility, regulatory compliance, and legal authority,
                  TrustKYC strictly enforces
                  <strong> Times New Roman</strong> globally across every heading, body copy, form
                  input, button, table, badge, and modal.
                </p>

                <CodeBlock
                  title="src/styles.css (Font Enforcement Cascade)"
                  filename="src/styles.css"
                  code={`:root {
  --font-sans: "Times New Roman", Times, Georgia, serif !important;
  --font-display: "Times New Roman", Times, Georgia, serif !important;
  --font-mono: "Times New Roman", Times, Georgia, serif !important;
}

body, h1, h2, h3, h4, h5, h6, p, span, a, button, input, select, textarea,
table, th, td, label, badge, div {
  font-family: "Times New Roman", Times, Georgia, serif !important;
}`}
                />
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 22: REUSABLE UI COMPONENTS */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-22-components") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-22-components"
                num={22}
                title="Reusable UI Components Catalog"
                icon={Layers}
                desc="Standardized atomic component library under src/components/."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {[
                  {
                    name: "Button.jsx",
                    path: "src/components/common/Button.jsx",
                    desc: "Variants: primary, secondary, outline, danger, ghost. With loading spinner.",
                  },
                  {
                    name: "Card.jsx",
                    path: "src/components/common/Card.jsx",
                    desc: "Card, CardHeader, CardTitle, CardContent, CardFooter wrappers with subtle borders.",
                  },
                  {
                    name: "StatusBadge.jsx",
                    path: "src/components/common/StatusBadge.jsx",
                    desc: "Pill indicator with colored dots for Verified, Approved, Under Review, Disputed.",
                  },
                  {
                    name: "Modal.jsx",
                    path: "src/components/common/Modal.jsx",
                    desc: "Accessible dialog with backdrop blur, keyboard dismiss, and responsive sizing.",
                  },
                  {
                    name: "TrustGauge.jsx",
                    path: "src/components/business/TrustGauge.jsx",
                    desc: "SVG radial meter computing 0-100 score and letter grade (A+, A, B, C, D).",
                  },
                  {
                    name: "DocumentPreviewModal.jsx",
                    path: "src/components/documents/DocumentPreviewModal.jsx",
                    desc: "Full document viewer with simulated OCR confidence panels.",
                  },
                  {
                    name: "AdminReviewModal.jsx",
                    path: "src/components/admin/AdminReviewModal.jsx",
                    desc: "Decision desk dialog for approving or rejecting filings with feedback.",
                  },
                ].map((c, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground font-mono">{c.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                        UI
                      </span>
                    </div>
                    <div className="text-[11px] text-primary font-mono">{c.path}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">{c.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 23: CORE CODE ARCHITECTURE */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-23-important-code") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-23-important-code"
                num={23}
                title="Core Code Architecture Snippets"
                icon={Code2}
                desc="Representative snippets showcasing route guards, auth providers, and the event-driven storage engine."
              />

              <div className="space-y-4">
                <CodeBlock
                  title="Role-Based Route Barrier"
                  filename="src/routes/RoleRoute.jsx"
                  code={`import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RoleRoute({ allowedRoles, children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const userRole = (user?.role || "").toUpperCase();
  const hasRole = allowedRoles.some((r) => r.toUpperCase() === userRole);

  if (!hasRole) return <Navigate to="/unauthorized" replace />;
  return children;
}`}
                />

                <CodeBlock
                  title="Event-Driven LocalStorage State Machine"
                  filename="src/utils/storage.js"
                  code={`export function emitDataUpdate(topic, payload = {}) {
  try {
    const event = new CustomEvent("trustkyc:data_update", {
      detail: { topic, payload, timestamp: new Date().toISOString() },
    });
    window.dispatchEvent(event);
  } catch (err) {
    console.error("Failed to emit storage update event", err);
  }
}

export function updateDocument(docId, updatedFields) {
  const docs = getStoredDocuments();
  const updated = docs.map((d) =>
    d.id === docId || d._id === docId ? { ...d, ...updatedFields } : d
  );
  saveDocuments(updated);
  emitDataUpdate("documents", { docId, updatedFields });
  return updated;
}`}
                />

                <CodeBlock
                  title="Static Authentication Context"
                  filename="src/context/AuthContext.jsx"
                  code={`const login = async ({ email, password }) => {
  const cleanEmail = (email || "").trim().toLowerCase();
  
  if (cleanEmail === DEMO_CREDENTIALS.ADMIN.email.toLowerCase()) {
    const adminUser = demoUsers.find((u) => u.role === "ADMIN");
    loginWithUser(adminUser);
    navigate("/admin/dashboard", { replace: true });
    return;
  }
  
  if (cleanEmail === DEMO_CREDENTIALS.BUSINESS.email.toLowerCase()) {
    const bizUser = demoUsers.find((u) => u.role === "BUSINESS");
    loginWithUser(bizUser);
    navigate("/business/dashboard", { replace: true });
    return;
  }
  
  throw new Error("Invalid credentials. Please use demo accounts.");
};`}
                />
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 24: STATIC DEPLOYMENT GUIDE */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-24-deployment") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-24-deployment"
                num={24}
                title="Static Hosting & Production Deployment"
                icon={Rocket}
                desc="Step-by-step instructions for hosting on Vercel, Netlify, and GitHub Pages."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs text-muted-foreground">
                <p>
                  Because TrustKYC contains zero backend servers or databases, it can be deployed
                  directly to any static CDN. To ensure client-side React Router DOM routing
                  functions on page reload, configure SPA rewrites:
                </p>

                <CodeBlock
                  title="Vercel SPA Rewrites Configuration"
                  filename="vercel.json"
                  code={`{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`}
                />

                <CodeBlock
                  title="Netlify SPA Rewrites Configuration"
                  filename="public/_redirects"
                  code={`/*    /index.html   200`}
                />
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 25: DEVELOPMENT SETUP & NOTES */}
          {/* ========================================================================= */}
          {(viewMode === "all" || activeSectionId === "sec-25-dev-notes") && (
            <section className="space-y-4">
              <SectionHeader
                id="sec-25-dev-notes"
                num={25}
                title="Development Setup & Important Disclaimers"
                icon={Terminal}
                desc="CLI commands, troubleshooting, and production disclaimer."
              />

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs">
                <h4 className="font-semibold text-foreground">CLI Commands</h4>
                <div className="space-y-2 font-mono">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                    <code>npm install</code>
                    <span className="text-muted-foreground font-sans">
                      Install project dependencies
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                    <code>npm run dev</code>
                    <span className="text-muted-foreground font-sans">
                      Launch local Vite dev server
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                    <code>npm run build</code>
                    <span className="text-muted-foreground font-sans">
                      Compile static assets to /dist
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                    <code>npm run lint</code>
                    <span className="text-muted-foreground font-sans">Verify 0 lint errors</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 flex items-start gap-2.5">
                  <Info className="size-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Static Prototype Disclaimer:</strong> TrustKYC is a front-end simulation
                    created for evaluation and onboarding demonstrations. No financial transactions
                    are executed, and all information is stored exclusively in your local browser
                    storage.
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Prev / Next Topic Navigation (in Single Topic View) */}
          {viewMode === "single" && (
            <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
              {prevSection ? (
                <button
                  onClick={() => handleSelectSection(prevSection.id)}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>← {prevSection.label}</span>
                </button>
              ) : (
                <div />
              )}
              {nextSection ? (
                <button
                  onClick={() => handleSelectSection(nextSection.id)}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{nextSection.label} →</span>
                </button>
              ) : (
                <div />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
