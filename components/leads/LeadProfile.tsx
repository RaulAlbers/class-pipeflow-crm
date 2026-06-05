import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  User,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { LEAD_SOURCE_LABELS, type Lead } from "@/types/lead";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-overlay">
        <Icon className="h-3.5 w-3.5 text-text-muted" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm text-text mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

interface LeadProfileProps {
  lead: Lead;
}

export function LeadProfile({ lead }: LeadProfileProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header card */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-semibold text-text">{lead.name}</h2>
              <p className="text-sm text-text-muted">
                {lead.position ? `${lead.position} · ` : ""}
                {lead.company}
              </p>
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        {/* Contact info */}
        <div className="divide-y divide-border">
          <InfoRow icon={Mail} label="E-mail" value={
            <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
              {lead.email}
            </a>
          } />
          {lead.phone && (
            <InfoRow icon={Phone} label="Telefone" value={lead.phone} />
          )}
          <InfoRow icon={Building2} label="Empresa" value={lead.company} />
          {lead.position && (
            <InfoRow icon={Briefcase} label="Cargo" value={lead.position} />
          )}
        </div>
      </div>

      {/* Deal info */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
          Negócio
        </h3>
        <div className="divide-y divide-border">
          {lead.value > 0 && (
            <InfoRow
              icon={TrendingUp}
              label="Valor estimado"
              value={
                <span className="font-semibold text-text">
                  {formatCurrency(lead.value)}
                </span>
              }
            />
          )}
          <InfoRow icon={User} label="Responsável" value={lead.assignedTo || "Não atribuído"} />
          <InfoRow
            icon={Calendar}
            label="Origem"
            value={LEAD_SOURCE_LABELS[lead.source]}
          />
          <InfoRow
            icon={Calendar}
            label="Cadastrado em"
            value={formatDate(lead.createdAt)}
          />
        </div>
      </div>

      {/* Notes */}
      {lead.notes && (
        <div className="rounded-lg border border-border bg-surface p-5">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
            Observações
          </h3>
          <p className="text-sm text-text-subtle leading-relaxed">{lead.notes}</p>
        </div>
      )}
    </div>
  );
}
