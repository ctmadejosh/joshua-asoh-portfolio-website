import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { adminFetch, SignedOutError } from "@/lib/adminApi";
import { serviceInfo } from "@/data/awsServices";

type Charges = { this_month: number | null; last_month: number | null };
type Costs = {
  generated_at: string;
  total: Charges;
  services: ({ service: string } & Charges)[];
  budget: { limit: number | null; actual: number | null; forecast: number | null } | null;
  notes: string[];
};

/** Small amounts matter here, so show up to 4 decimals under a dollar. */
const money = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "—";
  if (value === 0) return "$0.00";
  return value >= 1 ? `$${value.toFixed(2)}` : `$${value.toFixed(4).replace(/0{1,2}$/, "")}`;
};

const monthName = (offset: number) => {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + offset);
  return d.toLocaleString(undefined, { month: "long", timeZone: "UTC" });
};

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="surface-card px-5 py-4">
    <p className="eyebrow mb-2">{label}</p>
    <p className="text-2xl font-semibold tracking-tight">{value}</p>
    {hint && <p className="mt-1 text-sm text-subtle">{hint}</p>}
  </div>
);

const CostsPanel = ({ onSignedOut }: { onSignedOut: (note: string) => void }) => {
  const [costs, setCosts] = useState<Costs | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setCosts(null);
    try {
      const response = await adminFetch("/costs");
      if (!response.ok) throw new Error();
      setCosts((await response.json()) as Costs);
    } catch (err) {
      if (err instanceof SignedOutError) onSignedOut(err.message);
      else setError("Couldn't load costs. Try again in a moment.");
    }
  }, [onSignedOut]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) {
    return (
      <div className="surface-card max-w-md px-6 py-6">
        <p className="mb-4 text-muted-foreground">{error}</p>
        <button type="button" className="btn-secondary" onClick={() => void load()}>
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }
  if (!costs) {
    return (
      <p className="text-muted-foreground" role="status">
        Loading costs…
      </p>
    );
  }

  const { budget } = costs;
  const thisMonth = costs.total.this_month ?? budget?.actual ?? null;
  const usedPct = budget?.limit && thisMonth !== null ? Math.min(100, (thisMonth / budget.limit) * 100) : null;
  const forecastPct =
    budget?.limit && budget.forecast != null ? Math.min(100, (budget.forecast / budget.limit) * 100) : null;
  const metricsOff = costs.notes.includes("BILLING_METRICS_OFF");

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label={`${monthName(0)} so far`} value={money(thisMonth)} hint="Estimated, before credits" />
        <Stat label="Forecast for the month" value={money(budget?.forecast)} hint="From AWS Budgets" />
        <Stat label={`${monthName(-1)} total`} value={money(costs.total.last_month)} />
      </div>

      {budget?.limit != null && usedPct !== null && (
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">Budget: {money(budget.limit)} a month</span>
            <span className="text-subtle">{usedPct.toFixed(usedPct < 1 ? 2 : 0)}% used</span>
          </div>
          <div
            className="relative h-3 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Share of the monthly budget used"
            aria-valuenow={Math.round(usedPct)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(usedPct, 0.5)}%` }} />
            {forecastPct !== null && (
              <div
                className="absolute inset-y-0 w-0.5 bg-foreground/60"
                style={{ left: `${forecastPct}%` }}
                title={`Forecast: ${money(budget.forecast)}`}
              />
            )}
          </div>
          <p className="mt-2 text-sm text-subtle">
            You get an email at 80% of the budget, or if the month is forecast to go over it.
          </p>
        </div>
      )}

      {metricsOff ? (
        <div className="surface-card px-6 py-5">
          <h2 className="font-semibold">Turn on the per-service breakdown</h2>
          <p className="mt-2 text-muted-foreground">
            The breakdown comes from free CloudWatch billing metrics, which AWS only publishes once you switch them
            on. In the AWS console, go to{" "}
            <strong>Billing and Cost Management, Billing preferences, Alert preferences, Edit</strong>, tick{" "}
            <strong>Receive CloudWatch billing alerts</strong>, and save. The first figures appear within about a
            day.
          </p>
        </div>
      ) : (
        <div className="surface-card overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">Estimated charges by AWS service</caption>
            <thead className="border-b border-border text-subtle">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Service
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  What it is here
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  {monthName(0)}
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  {monthName(-1)}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {costs.services.map((s) => {
                const info = serviceInfo(s.service);
                return (
                  <tr key={s.service}>
                    <th scope="row" className="px-5 py-3 font-medium">
                      {info.name}
                    </th>
                    <td className="px-5 py-3 text-muted-foreground">{info.usedFor}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{money(s.this_month)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{money(s.last_month)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-sm text-subtle">
        Estimates from CloudWatch billing metrics and AWS Budgets, which AWS updates a few times a day. The final
        bill is in the AWS console under Billing, Bills. Checked{" "}
        {new Date(costs.generated_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}.
        {costs.notes.includes("BUDGET_UNAVAILABLE") && " The budget couldn't be read this time."}
      </p>
    </div>
  );
};

export default CostsPanel;
