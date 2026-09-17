import { useEffect, useMemo, useState, useCallback } from "react";
import { formatINR, businesses } from "@/data";
import { toast } from "sonner";
import { getDeals, addDeal, updateDealStatus, deleteDeal } from "@/utils/storage";

import {
  Plus,
  Handshake,
  TrendingUp,
  CheckCircle2,
  AlertOctagon,
  Pencil,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  AlertTriangle,
  BadgeCheck,
  X,
  Clock,
  Calendar,
  FileText,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const mapStatus = (status) => {
  const map = {
    PENDING_ACCEPTANCE: "pending",
    ACTIVE: "active",
    COMPLETED: "completed",
    DISPUTED: "disputed",
    RESOLVED: "resolved",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
  };
  return map[status] ?? "active";
};

const normalizeDeal = (deal) => {
  const rawCounterparty =
    deal.counterPartyBusinessId ?? deal.counterPartyBusiness ?? deal.counterparty;
  const rawCreator = deal.createdByBusinessId ?? deal.createdByBusiness;

  return {
    id: deal._id,
    name: deal.title,
    description: deal.description,
    value: deal.value,
    referenceNumber: deal.referenceNumber,
    createdByBusiness: rawCreator,
    counterparty: rawCounterparty,
    status: mapStatus(deal.status),
    initiatorCompletedAt: deal.initiatorCompletedAt,
    counterPartyCompletedAt: deal.counterPartyCompletedAt,

    createdAt: new Date(deal.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),

    rawDeadline: deal.dealTimeline || deal.endDate || null,

    deadline: deal.dealTimeline
      ? new Date(deal.dealTimeline).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : deal.endDate
        ? new Date(deal.endDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : null,

    canAccept: deal.canAccept,
    canReject: deal.canReject,
    canCancel: deal.canCancel,

    disputeReason: deal.disputeReason,
    disputeRaisedBy: deal.disputeRaisedBy,
    disputeId: deal.disputeId,

    timeline: deal.timeline || deal.dealTimeline || [],
  };
};

const getCompletionState = (deal, business) => {
  if (deal.initiatorCompletedAt && deal.counterPartyCompletedAt) return "both_completed";
  const creatorId = deal.createdByBusiness?._id || deal.createdByBusiness;
  if (deal.initiatorCompletedAt && creatorId == business?._id) return "user_completed";
  if (deal.counterPartyCompletedAt) return "waiting_completion";
  return "not_started";
};

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft("Expired / Deadline Passed");
        setIsExpired(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      let parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(`${parts.join(" ")} remaining`);
      setIsExpired(false);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <p className={`text-sm font-medium ${isExpired ? "text-rose-500" : "text-amber-600"}`}>
      {timeLeft}
    </p>
  );
}

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState("incoming");
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    incomingDeals: 0,
    disputedDeals: 0,
    activeDeals: 0,
    completedDeals: 0,
  });
  const [open, setOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [disputingDeal, setDisputingDeal] = useState(null);
  const [resolvingDeal, setResolvingDeal] = useState(null);
  const [viewingDeal, setViewingDeal] = useState(null);
  const [counterparties, setCounterparties] = useState([]);

  const tabs = [
    { key: "incoming", label: "Incoming" },
    { key: "sent", label: "Sent" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "disputed", label: "Disputed" },
  ];

  const { business } = useAuth();

  const loadSummary = useCallback(() => {
    const all = getDeals();
    setSummary({
      incomingDeals: all.filter(
        (d) => d.type === "incoming" || d.status === "draft" || d.status === "pending",
      ).length,
      activeDeals: all.filter((d) => d.status === "active").length,
      completedDeals: all.filter((d) => d.status === "completed" || d.status === "resolved").length,
      disputedDeals: all.filter((d) => d.status === "disputed").length,
      sentDeals: all.filter((d) => d.type === "outgoing" || d.type === "sent").length,
    });
  }, []);

  const loadDeals = useCallback(
    (type = activeTab) => {
      try {
        setLoading(true);
        const all = getDeals();
        let filtered = all;

        if (type === "disputed") {
          filtered = all.filter((d) => d.status === "disputed");
        } else if (type === "incoming") {
          filtered = all.filter(
            (d) => d.type === "incoming" || d.status === "draft" || d.status === "pending",
          );
        } else if (type === "sent") {
          filtered = all.filter((d) => d.type === "outgoing" || d.type === "sent");
        } else if (type === "active") {
          filtered = all.filter((d) => d.status === "active");
        } else if (type === "completed") {
          filtered = all.filter((d) => d.status === "completed" || d.status === "resolved");
        }

        setDeals(filtered.map(normalizeDeal));
        loadSummary();
      } catch (err) {
        console.error(err);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    },
    [activeTab, loadSummary],
  );

  const loadCounterparties = useCallback(() => {
    setCounterparties(businesses);
  }, []);

  const loadDealById = (id) => {
    const all = getDeals();
    const match = all.find((d) => d.id === id || d._id === id);
    if (!match) return null;
    return normalizeDeal({
      ...match,
      timeline: match.milestones || [],
    });
  };

  useEffect(() => {
    loadDeals(activeTab);
  }, [activeTab, loadDeals]);

  useEffect(() => {
    loadCounterparties();
    loadSummary();
    const handleUpdate = () => {
      loadDeals(activeTab);
      loadSummary();
    };
    window.addEventListener("trustkyc:data_update", handleUpdate);
    return () => window.removeEventListener("trustkyc:data_update", handleUpdate);
  }, [loadCounterparties, loadSummary, loadDeals, activeTab]);

  const handleCreateDeal = (payload) => {
    const matchedBiz = businesses.find(
      (b) => b.id === payload.counterparty || b._id === payload.counterparty,
    );
    addDeal({
      title: payload.name,
      name: payload.name,
      counterparty: matchedBiz?.tradeName || matchedBiz?.name || "Enterprise Counterparty",
      counterpartyId: payload.counterparty,
      counterpartyGstin: matchedBiz?.gstin || "27AABCV5678B1Z3",
      value: Number(payload.value) || 0,
      amount: Number(payload.value) || 0,
      description: payload.description,
      type: "outgoing",
      status: "active",
      createdAt: new Date().toISOString(),
    });

    loadDeals(activeTab);
    loadSummary();
    setOpen(false);
    toast.success("Deal agreement created successfully");
  };

  const handleUpdateDeal = (updatedDeal) => {
    updateDealStatus(updatedDeal.id, updatedDeal.status || "active");
    loadDeals(activeTab);
    setEditingDeal(null);
    toast.success("Deal updated successfully");
  };

  const handleDeleteDeal = (id) => {
    if (!window.confirm("Delete this deal?")) return;
    deleteDeal(id);
    loadDeals(activeTab);
    loadSummary();
    toast.success("Deal deleted successfully");
  };

  const handleAcceptDeal = (id) => {
    updateDealStatus(id, "active");
    loadDeals(activeTab);
    loadSummary();
    toast.success("Deal accepted");
  };

  const handleRejectDeal = (id) => {
    updateDealStatus(id, "rejected");
    loadDeals(activeTab);
    loadSummary();
    toast.success("Deal rejected");
  };

  const handleCancelDeal = (id) => {
    if (!id) return toast.error("Invalid deal ID");
    updateDealStatus(id, "cancelled");
    loadDeals(activeTab);
    loadSummary();
    toast.success("Deal cancelled successfully");
  };

  const handleComplete = (id) => {
    if (!id) return toast.error("Invalid deal ID");
    updateDealStatus(id, "completed");
    loadDeals(activeTab);
    loadSummary();
    toast.success("Deal marked as completed");
  };

  const handleDisputeDeal = (id, reason) => {
    if (!id) return toast.error("Invalid deal ID");
    updateDealStatus(id, "disputed");
    loadDeals(activeTab);
    loadSummary();
    setDisputingDeal(null);
    toast.success("Dispute raised and forwarded to admin panel");
  };

  const handleResolveDispute = (id, resolutionNote) => {
    if (!id) return toast.error("Invalid deal ID");
    updateDealStatus(id, "resolved");
    loadDeals(activeTab);
    loadSummary();
    setResolvingDeal(null);
    toast.success("Dispute resolved successfully");
  };

  useEffect(() => {
    loadSummary();
  }, [deals, loadSummary]);

  const openEditModal = async (id) => {
    const deal = await loadDealById(id);
    if (deal) setEditingDeal(deal);
  };

  const openViewModal = async (id) => {
    const deal = await loadDealById(id);
    if (deal) {
      setViewingDeal(deal);
    } else {
      toast.error("Failed to load deal details");
    }
  };

  const dealStats = useMemo(
    () => ({
      incoming: summary.incomingDeals,
      active: summary.activeDeals,
      completed: summary.completedDeals,
      disputed: summary.disputedDeals,
    }),
    [summary],
  );

  return (
    <>
      {/* Top Header & Actions */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground font-display">
              Commercial Deal Pipeline
            </h1>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              Escrow & Milestones
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            B2B trade contracts, multi-party signature tracking, and dispute mediation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary text-xs font-semibold py-2.5 px-4 shadow-sm shadow-primary/20 inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Initiate Deal</span>
        </button>
      </div>

      {/* Stats Pipeline Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Handshake}
          label="Incoming Proposals"
          value={dealStats.incoming}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Execution"
          value={dealStats.active}
          color="violet"
        />
        <StatCard
          icon={CheckCircle2}
          label="Finalized / Completed"
          value={dealStats.completed}
          color="green"
        />
        <StatCard
          icon={AlertOctagon}
          label="In Dispute Review"
          value={dealStats.disputed}
          color="red"
        />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1.5 p-1 bg-muted/40 rounded-xl w-fit border border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === tab.key
                ? "btn-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            } ${
              tab.key === "disputed" && activeTab === "disputed"
                ? "bg-rose-500 text-white shadow-sm border border-rose-600"
                : ""
            }`}
          >
            {tab.label}
            {tab.key === "disputed" && dealStats.disputed > 0 && activeTab !== "disputed" && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {dealStats.disputed}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-white border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : deals.length === 0 ? (
        <EmptyState tab={activeTab} onNew={() => setOpen(true)} />
      ) : (
        <div className="space-y-3">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              activeTab={activeTab}
              onAccept={handleAcceptDeal}
              onReject={handleRejectDeal}
              onCancel={handleCancelDeal}
              onEdit={openEditModal}
              onView={openViewModal}
              onDelete={handleDeleteDeal}
              onComplete={handleComplete}
              onDispute={(deal) => setDisputingDeal(deal)}
              onResolve={(deal) => setResolvingDeal(deal)}
              business={business}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {open && (
        <CreateDealModal
          counterparties={counterparties}
          onClose={() => setOpen(false)}
          onCreate={handleCreateDeal}
        />
      )}
      {editingDeal && (
        <EditDealModal
          deal={editingDeal}
          onClose={() => setEditingDeal(null)}
          onSave={handleUpdateDeal}
        />
      )}
      {disputingDeal && (
        <DisputeDealModal
          deal={disputingDeal}
          onClose={() => setDisputingDeal(null)}
          onSubmit={handleDisputeDeal}
        />
      )}
      {resolvingDeal && (
        <ResolveDisputeModal
          deal={resolvingDeal}
          onClose={() => setResolvingDeal(null)}
          onSubmit={handleResolveDispute}
        />
      )}
      {viewingDeal && <ViewDealModal deal={viewingDeal} onClose={() => setViewingDeal(null)} />}
    </>
  );
}

function DealCard({
  deal,
  activeTab,
  onAccept,
  onReject,
  onCancel,
  onEdit,
  onView,
  onDelete,
  onComplete,
  onDispute,
  onResolve,
  business,
}) {
  const completionState = activeTab === "active" ? getCompletionState(deal, business) : null;
  const cpName = deal.counterparty?.tradeName || deal.counterparty?.legalName || "—";

  return (
    <div
      className={`bg-card text-foreground rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md ${
        activeTab === "disputed"
          ? "border-rose-500/40 hover:border-rose-500"
          : "border-border hover:border-primary/40"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h3 className="text-sm font-bold text-foreground truncate">{deal.name}</h3>
            <StatusBadge status={deal.status} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span className="font-mono bg-muted/60 px-2 py-0.5 rounded border border-border text-[11px]">
              {deal.referenceNumber}
            </span>
            <Dot />
            <span className="font-medium text-foreground">{cpName}</span>
            <Dot />
            <span>Created {deal.createdAt}</span>
            {deal.deadline && (
              <>
                <Dot />
                <span className="text-primary font-medium">Due {deal.deadline}</span>
              </>
            )}
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
            Deal Value
          </p>
          <p className="text-lg font-bold font-mono text-foreground">{formatINR(deal.value)}</p>
        </div>
      </div>

      {deal.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 px-5 pb-3 leading-relaxed">
          {deal.description}
        </p>
      )}

      {deal.status === "disputed" && deal.disputeReason && (
        <DisputeBanner reason={deal.disputeReason} />
      )}

      {activeTab === "active" &&
        completionState !== "not_started" &&
        deal.status !== "disputed" && <CompletionBanner state={completionState} />}

      <div className="border-t border-border/60 px-5 py-3 flex items-center justify-between bg-muted/10">
        <div className="text-xs text-muted-foreground">
          {deal.rawDeadline && <CountdownTimer targetDate={deal.rawDeadline} />}
        </div>

        <div className="flex items-center gap-2">
          <DealActions
            activeTab={activeTab}
            deal={deal}
            completionState={completionState}
            business={business}
            onAccept={onAccept}
            onReject={onReject}
            onCancel={onCancel}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onComplete={onComplete}
            onDispute={onDispute}
            onResolve={onResolve}
          />
        </div>
      </div>
    </div>
  );
}

function DealActions({
  activeTab,
  deal,
  completionState,
  business,
  onAccept,
  onReject,
  onCancel,
  onEdit,
  onView,
  onDelete,
  onComplete,
  onDispute,
  onResolve,
}) {
  const isDisputed = deal.status === "disputed";
  const isPending =
    deal.status === "pending" || deal.status === "draft" || activeTab === "incoming";
  const isActive = deal.status === "active";
  const isCompleted = deal.status === "completed" || deal.status === "resolved";

  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-end">
      <Btn icon={ExternalLink} variant="ghost" onClick={() => onView(deal.id)}>
        Details
      </Btn>

      {isPending && activeTab === "incoming" && (
        <>
          <Btn icon={ThumbsUp} variant="solid-success" onClick={() => onAccept(deal.id)}>
            Accept
          </Btn>
          <Btn icon={ThumbsDown} variant="ghost-danger" onClick={() => onReject(deal.id)}>
            Reject
          </Btn>
        </>
      )}

      {isActive && (
        <>
          <Btn icon={CheckCircle2} variant="solid-success" onClick={() => onComplete(deal.id)}>
            Mark Done
          </Btn>
          <Btn icon={AlertOctagon} variant="ghost-danger" onClick={() => onDispute(deal)}>
            Dispute
          </Btn>
          <Btn icon={Pencil} variant="ghost" onClick={() => onEdit(deal.id)}>
            Edit
          </Btn>
        </>
      )}

      {isDisputed && (
        <Btn icon={BadgeCheck} variant="solid-success" onClick={() => onResolve(deal)}>
          Resolve
        </Btn>
      )}

      {activeTab === "sent" && deal.status !== "completed" && deal.status !== "disputed" && (
        <>
          <Btn icon={Pencil} variant="ghost" onClick={() => onEdit(deal.id)}>
            Edit
          </Btn>
          <Btn icon={XCircle} variant="ghost-danger" onClick={() => onCancel(deal.id)}>
            Cancel
          </Btn>
        </>
      )}

      {(isCompleted || deal.status === "cancelled" || deal.status === "rejected") && (
        <Btn icon={XCircle} variant="ghost-danger" onClick={() => onDelete(deal.id)}>
          Remove
        </Btn>
      )}
    </div>
  );
}

function DisputeBanner({ reason }) {
  return (
    <div className="mx-5 mb-3 flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
      <AlertTriangle className="size-4 shrink-0 mt-0.5 text-rose-500" />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5">
          Commercial Dispute Active
        </p>
        <p className="text-xs leading-relaxed">{reason}</p>
      </div>
    </div>
  );
}

function CompletionBanner({ state }) {
  const configs = {
    user_completed: {
      bg: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
      icon: <Clock className="size-3.5 shrink-0" />,
      msg: "You marked this agreement completed — awaiting counterparty confirmation.",
    },
    waiting_completion: {
      bg: "bg-primary/10 border-primary/20 text-primary",
      icon: <Clock className="size-3.5 shrink-0" />,
      msg: "Counterparty has marked milestones fulfilled — your confirmation needed.",
    },
    both_completed: {
      bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      icon: <CheckCircle2 className="size-3.5 shrink-0" />,
      msg: "Mutual agreement reached — both parties have signed off on completion.",
    },
  };
  const c = configs[state];
  if (!c) return null;
  return (
    <div
      className={`mx-5 mb-3 flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${c.bg}`}
    >
      {c.icon}
      <span>{c.msg}</span>
    </div>
  );
}

function Btn({ children, icon: Icon, variant = "ghost", onClick, disabled }) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  const variants = {
    ghost: "btn-secondary",
    "ghost-danger": "btn-danger",
    "solid-success": "btn-primary",
  };
  return (
    <button
      type="button"
      className={`${base} ${variants[variant] || "btn-secondary"}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="size-3.5" />}
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    active: "bg-primary/10 text-primary border-primary/20",
    completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    disputed: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    resolved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    cancelled: "bg-muted text-muted-foreground border-border",
  };
  const labels = {
    pending: "Pending Acceptance",
    active: "Active",
    completed: "Completed",
    disputed: "Disputed",
    resolved: "Resolved",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${styles[status] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: { bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    violet: { bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
    green: { bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    red: { bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
  };
  const c = colors[color] ?? colors.blue;
  return (
    <div className="bg-card text-foreground rounded-2xl border border-border p-5 shadow-xs">
      <div className={`size-9 rounded-xl border ${c.bg} flex items-center justify-center mb-3`}>
        <Icon className="size-4.5" />
      </div>
      <p className="text-2xl font-bold font-mono tracking-tight text-foreground">{value ?? 0}</p>
      <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
    </div>
  );
}

function EmptyState({ tab, onNew }) {
  const configs = {
    disputed: {
      icon: <AlertOctagon className="size-8 text-muted-foreground" />,
      title: "No Active Disputes",
      desc: "All commercial counterparties are operating in full compliance with agreed covenants.",
    },
    default: {
      icon: <Handshake className="size-8 text-muted-foreground" />,
      title: `No ${tab} Agreements`,
      desc: "No commercial agreements recorded under this ledger status.",
    },
  };
  const cfg = configs[tab] ?? configs.default;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-border bg-card">
      <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        {cfg.icon}
      </div>
      <h3 className="text-base font-bold text-foreground mb-1 font-display">{cfg.title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-5 leading-relaxed">{cfg.desc}</p>
      {tab === "sent" && (
        <button
          type="button"
          onClick={onNew}
          className="btn-primary text-xs font-semibold py-2 px-4 shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="size-3.5" /> Initiate a Deal
        </button>
      )}
    </div>
  );
}

function Dot() {
  return <span className="size-1 rounded-full bg-muted-foreground/40 shrink-0" />;
}

function Modal({ children, onClose, title, subtitle }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card text-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground font-display">{title}</h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-muted flex cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "form-input text-xs w-full";
const textareaCls = "form-input text-xs w-full resize-none";

// ─── Input Form Component ───────────────────────────────────────────────────
function Input({ label, ...props }) {
  return (
    <Field label={label}>
      <input className={inputCls} {...props} />
    </Field>
  );
}

function Select({ label, options, ...props }) {
  return (
    <Field label={label}>
      <select className={inputCls} {...props}>
        <option value="">Select counterparty</option>
        {options.map((cp) => (
          <option key={cp.id || cp._id} value={cp.id || cp._id}>
            {cp.tradeName || cp.legalName || cp.name}
          </option>
        ))}
      </select>
    </Field>
  );
}

function CreateDealModal({ counterparties, onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", counterparty: "", value: "", description: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title="New Deal" subtitle="Create a business agreement" onClose={onClose}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onCreate(form);
        }}
        className="space-y-4"
      >
        <Input
          label="Deal title"
          value={form.name}
          onChange={set("name")}
          placeholder="e.g. Q3 Supply Agreement"
        />
        <Select
          label="Counterparty"
          options={counterparties}
          value={form.counterparty}
          onChange={set("counterparty")}
        />
        <Input
          label="Deal value (₹)"
          type="number"
          value={form.value}
          onChange={set("value")}
          placeholder="0"
        />
        <Input
          label="Description"
          value={form.description}
          onChange={set("description")}
          placeholder="Brief terms or notes…"
        />
        <div className="pt-1">
          <button
            type="submit"
            className="w-full h-10 rounded-lg btn-primary cursor-pointer text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            Create Deal
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditDealModal({ deal, onClose, onSave }) {
  const [form, setForm] = useState(deal);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title="Edit Deal" subtitle={deal.referenceNumber} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="space-y-4"
      >
        <Input label="Deal title" value={form.name} onChange={set("name")} />
        <Input
          label="Counterparty"
          value={form.counterparty?.tradeName || form.counterparty?.legalName}
          disabled
        />
        <Input label="Deal value (₹)" type="number" value={form.value} onChange={set("value")} />
        <Input label="Description" value={form.description} onChange={set("description")} />
        <div className="pt-1">
          <button
            type="submit"
            className="w-full h-10 rounded-lg btn-primary cursor-pointer text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DisputeDealModal({ deal, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return toast.error("Please enter a dispute reason");
    setLoading(true);
    await onSubmit(deal.id, reason.trim());
    setLoading(false);
  };

  return (
    <Modal title="Raise a Dispute" subtitle={deal.referenceNumber} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-muted/30 rounded-xl border border-border px-3.5 py-3 text-xs text-foreground/80 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deal</span>
            <span className="font-semibold text-foreground">{deal.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Value</span>
            <span className="font-semibold text-foreground">{formatINR(deal.value)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Counterparty</span>
            <span className="font-semibold text-foreground">
              {deal.counterparty?.tradeName || deal.counterparty?.legalName || "—"}
            </span>
          </div>
        </div>

        <Field label="Reason for dispute">
          <textarea
            className={textareaCls}
            rows={4}
            placeholder="Describe the issue clearly — e.g. payment not received, goods not delivered as agreed…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </Field>

        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-lg btn-secondary text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !reason.trim()}
            className="flex-1 h-10 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-rose-600/20"
          >
            {loading ? "Submitting…" : "Raise Dispute"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ResolveDisputeModal({ deal, onClose, onSubmit }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return toast.error("Please enter a resolution note");
    setLoading(true);
    await onSubmit(deal.id, note.trim());
    setLoading(false);
  };

  return (
    <Modal title="Resolve Dispute" subtitle={deal.referenceNumber} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {deal.disputeReason && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-3 text-xs space-y-1">
            <p className="text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider text-[10px]">
              Dispute Reason
            </p>
            <p className="text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
              {deal.disputeReason}
            </p>
          </div>
        )}

        <div className="bg-muted/30 rounded-xl border border-border px-3.5 py-3 text-xs text-foreground/80 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deal</span>
            <span className="font-semibold text-foreground">{deal.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Value</span>
            <span className="font-semibold text-foreground">{formatINR(deal.value)}</span>
          </div>
        </div>

        <Field label="Resolution note">
          <textarea
            className={textareaCls}
            rows={4}
            placeholder="Explain how the issue was resolved or your counter-response…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
        </Field>

        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-lg btn-secondary text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !note.trim()}
            className="flex-1 h-10 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-emerald-600/20"
          >
            {loading ? "Resolving…" : "Mark Resolved"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── View Deal Timeline Modal (With Real-Time Deadlines) ────────────────────
function ViewDealModal({ deal, onClose }) {
  const counterpartyName =
    deal.counterparty?.tradeName || deal.counterparty?.legalName || deal.counterparty || "—";

  return (
    <Modal title="Deal Details" subtitle={deal.referenceNumber} onClose={onClose}>
      <div className="space-y-5">
        {/* Deal Summary Info Cards */}
        <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-3.5">
          <div className="flex items-start gap-2.5">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Title
              </h4>
              <p className="text-sm font-semibold text-foreground">{deal.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Counterparty
              </h4>
              <p className="text-sm font-semibold text-foreground">{counterpartyName}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Deal Value
              </h4>
              <p className="text-sm font-bold text-foreground">{formatINR(deal.value)}</p>
            </div>
          </div>

          {deal.rawDeadline && (
            <div className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Deal Deadline
                </h4>
                {/* Dynamically tracking and processing live ticking dates inside the card placeholder */}
                <CountdownTimer targetDate={deal.rawDeadline} />
              </div>
            </div>
          )}

          {deal.description && (
            <div className="border-t border-border pt-3 mt-1">
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Terms / Description
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{deal.description}</p>
            </div>
          )}
        </div>

        {/* Timeline Log Section */}
        <div>
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" /> Deal Timeline
          </h3>

          {deal.timeline && deal.timeline.length > 0 ? (
            <div className="relative pl-4 border-l-2 border-border ml-2 space-y-4 py-1">
              {deal.timeline.map((event, idx) => (
                <div key={event._id || idx} className="relative">
                  {/* Timeline node bullet indicator */}
                  <span className="absolute -left-[21px] top-1.5 bg-background border-2 border-primary rounded-full h-2.5 w-2.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {(event.event || "STATUS_UPDATED").replaceAll("_", " ")}
                    </p>

                    {event.description && (
                      <p className="text-[11px] text-muted-foreground mt-1">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 border border-dashed border-border rounded-xl bg-muted/20">
              <p className="text-xs text-muted-foreground">Created on {deal.createdAt}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-10 rounded-lg btn-secondary text-sm font-semibold transition-colors cursor-pointer"
        >
          Close View
        </button>
      </div>
    </Modal>
  );
}
