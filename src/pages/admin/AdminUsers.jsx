import { useState } from "react";
import { Users, ShieldCheck, Mail, Phone, Calendar, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/StatusBadge";
import { demoUsers } from "../../data/users";

export default function AdminUsers() {
  const [usersList] = useState(demoUsers);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">
            User Roles & Operator Clearance
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit system operator clearance tiers, authorized signatories, and role scopes.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden p-0 border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[650px]">
            <thead className="bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-5 py-3.5">Name / Contact</th>
                <th className="px-5 py-3.5">Organization / Entity</th>
                <th className="px-5 py-3.5 text-center">System Role</th>
                <th className="px-5 py-3.5">Permissions Granted</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b border-border">
              {usersList.map((usr) => (
                <tr key={usr.id || usr._id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-foreground">{usr.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{usr.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-foreground">
                      {usr.businessName || "TrustKYC Operations"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{usr.title}</div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-primary/10 text-primary border-primary/20">
                      {usr.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[280px]">
                      {(usr.permissions || []).map((perm, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-muted/60 text-[10px] font-mono text-muted-foreground"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge status="verified" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
