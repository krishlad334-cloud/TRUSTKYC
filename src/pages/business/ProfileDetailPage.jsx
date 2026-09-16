import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { businesses } from "@/data";
import { toast } from "sonner";

import { Card, StatusBadge } from "@/components/ui-bits";

import {
  ArrowLeft,
  MapPin,
  Building2,
  ShieldCheck,
  Calendar,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  FileText,
  Undo2,
} from "lucide-react";

export default function ProfileDetailPage() {
  const { id } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      const profileData = businesses.find((b) => b.id === id || b._id === id) || businesses[0];
      setBusiness(profileData);
    } catch {
      toast.error("Failed to load business profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading business profile...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="mx-auto mt-10 max-w-lg">
        <Card className="p-8 text-center">
          <h2 className="mb-2 text-lg font-semibold">Business Not Found</h2>

          <p className="mb-6 text-sm text-muted-foreground">
            Unable to load the requested business profile.
          </p>

          <Link
            to="/business/directory"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <ArrowLeft size={16} />
            Back to Directory
          </Link>
        </Card>
      </div>
    );
  }

  const basicInfo = business?.basicInfo || {};
  const verification = business?.verification || {};
  const dealStats = business?.dealStats || {};

  const tradeName = basicInfo?.tradeName || "Unknown Business";
  const overallTrustScore =
    typeof business?.trustScore === "object"
      ? business?.trustScore?.overall || 0
      : business?.trustScore || 0;

  const initials =
    tradeName
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TG";

  const memberSince = basicInfo?.memberSince
    ? new Date(basicInfo.memberSince).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const statCards = [
    {
      title: "Total Deals",
      value: dealStats?.totalDeals ?? 0,
      icon: Briefcase,
    },
    {
      title: "Active Deals",
      value: dealStats?.activeDeals ?? 0,
      icon: Clock3,
    },
    {
      title: "Completed",
      value: dealStats?.completedDeals ?? 0,
      icon: CheckCircle2,
    },
    {
      title: "Disputed",
      value: dealStats?.disputedDeals ?? 0,
      icon: AlertTriangle,
    },
    {
      title: "Completion Rate",
      value: `${dealStats?.completionRate ?? 0}%`,
      icon: ShieldCheck,
    },
  ];

  const InfoItem = ({ label, value }) => (
    <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1">
      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground break-words">{value || "—"}</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/business/directory"
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <Undo2 className="h-3.5 w-3.5" />
          <span>Back to Directory</span>
        </Link>
        <span className="text-xs font-mono text-muted-foreground">Accredited Entity Dossier</span>
      </div>

      {/* Hero Section */}
      <Card className="overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-accent/10 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent text-2xl font-bold text-primary-foreground shadow-lg shrink-0 border border-primary/20">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                  Verified Counterparty
                </span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="text-xs text-muted-foreground font-mono">ID: {id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {tradeName}
              </h1>

              <p className="mt-1 text-xs text-muted-foreground font-medium">
                {basicInfo?.industry || "Commercial & Corporate Enterprise"}
              </p>

              <div className="mt-3.5 flex flex-wrap gap-2.5">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {basicInfo?.city || "City"}, {basicInfo?.state || "State"}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Member Since {memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
            {overallTrustScore > 0 && (
              <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm text-center md:text-right min-w-[140px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Trust Score
                </p>
                <div className="text-2xl font-bold font-mono text-primary mt-0.5">
                  {overallTrustScore}{" "}
                  <span className="text-xs text-muted-foreground font-normal">/ 100</span>
                </div>
              </div>
            )}
            <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm text-center md:text-right min-w-[140px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                KYC Status
              </p>
              <StatusBadge status={verification?.kycStatus || "PENDING"} />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="p-5 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="text-2xl font-bold font-mono text-foreground">{item.value}</div>

              <p className="mt-1 text-xs text-muted-foreground font-medium">{item.title}</p>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Business Information */}
        <Card className="lg:col-span-2 p-6">
          <div className="mb-5 flex items-center gap-2 pb-3 border-b border-border">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Verified Registry Information</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoItem label="Trade Name" value={basicInfo?.tradeName} />
            <InfoItem label="Legal Registered Name" value={basicInfo?.legalName} />
            <InfoItem
              label="Constitution Type"
              value={basicInfo?.companyType?.replaceAll("_", " ")}
            />
            <InfoItem label="Industry Sector" value={basicInfo?.industry} />
            <InfoItem label="City" value={basicInfo?.city} />
            <InfoItem label="State" value={basicInfo?.state} />
          </div>
        </Card>

        {/* Verification */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />

            <h2 className="text-lg font-semibold">Verification</h2>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              KYC Status
            </p>

            <StatusBadge status={verification?.kycStatus || "PENDING"} />
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
              Verified Documents
            </p>

            {verification?.verifiedDocs?.length ? (
              <div className="flex flex-wrap gap-2">
                {verification.verifiedDocs.map((doc) => (
                  <span
                    key={doc}
                    className="inline-flex items-center gap-1 rounded-full border bg-primary/5 px-3 py-1.5 text-xs font-medium"
                  >
                    <FileText size={12} />

                    {doc.replaceAll("_", " ")}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No verified documents found.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Deal Insights */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">Deal Performance Overview</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Deals</p>

            <p className="mt-2 text-2xl font-bold">{dealStats?.totalDeals ?? 0}</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Active Deals</p>

            <p className="mt-2 text-2xl font-bold">{dealStats?.activeDeals ?? 0}</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Completed Deals
            </p>

            <p className="mt-2 text-2xl font-bold">{dealStats?.completedDeals ?? 0}</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Disputed Deals</p>

            <p className="mt-2 text-2xl font-bold">{dealStats?.disputedDeals ?? 0}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Completion Rate</span>

            <span className="text-sm font-semibold">{dealStats?.completionRate ?? 0}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full btn-primary transition-all duration-500"
              style={{
                width: `${dealStats?.completionRate ?? 0}%`,
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
