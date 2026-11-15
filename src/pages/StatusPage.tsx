import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, CircleAlert, CircleHelp, ExternalLink, XCircle } from "lucide-react";
import Seo from "@/components/site/Seo";
import { Container, PageIntro } from "@/components/site/Cards";
import { GITHUB_REPO_API, GITHUB_REPO_URL, STATUS_API_URL } from "@/data/site";

/**
 * Public, live view of how the site is running: uptime from a 5-minute health
 * check (AWS Lambda + CloudWatch), response times, the deploy pipeline's
 * recent runs (GitHub Actions), and what AWS costs so far this month.
 * Everything loads in the browser; the pre-rendered page shows placeholders.
 */

type Target = {
  target: "website" | "api";
  up: boolean | null;
  last_checked: string | null;
  uptime: { "24h": number | null; "7d": number | null; "30d": number | null };
  latency_ms_24h: number | null;
  latency_series: { t: string; ms: number }[];
};
type Status = { generated_at: string; targets: Target[]; cost_this_month: number | null };

type Run = {
  id: number;
  name: string;
  head_sha: string;
  status: string;
  conclusion: string | null;
  created_at: string;
  html_url: string;
  head_commit: { message: string } | null;
};

const TARGET_INFO = {
  website: { name: "Website", detail: "juasoh.com, served by Cloudflare" },
  api: { name: "Contact API", detail: "aws.juasoh.com: API Gateway and Lambda on AWS" },
} as const;

/** Only the pipelines that matter here, under friendlier names. */
const WORKFLOWS: Record<string, string> = {
  "contact-backend": "AWS backend",
  site: "Website checks",
  codeql: "Security scan",
};

const percent = (value: number | null) =>
  value === null ? "—" : `${value >= 99.995 ? "100" : value.toFixed(value >= 99 ? 2 : 1)}%`;

const ago = (iso: string | null) => {
  if (!iso) return "not yet";
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours < 48 ? `${hours} h ago` : `${Math.round(hours / 24)} days ago`;
};

/** "Merge pull request #18 from …\n\nAdmin page: …" -> "Admin page: … (#18)". */
const commitTitle = (message = "") => {
  const merge = message.match(/^Merge pull request #(\d+)[^\n]*\n\n([^\n]+)/);
  return merge ? `${merge[2]} (#${merge[1]})` : message.split("\n")[0];
};

const StatusBadge = ({ up }: { up: boolean | null }) => {
  if (up === null)
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <CircleHelp aria-hidden="true" className="h-4 w-4" /> No data yet
      </span>
    );
  return up ? (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
      <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> Operational
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-destructive">
      <XCircle aria-hidden="true" className="h-4 w-4" /> Down
    </span>
  );
};

/** Hourly average response time, last 24 hours: one series, one hue, bars on a shared baseline. */
const LatencyBars = ({ series, label }: { series: Target["latency_series"]; label: string }) => {
  if (series.length === 0) return null;
  const max = Math.max(...series.map((p) => p.ms), 1);
  const hour = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour: "numeric" });
  return (
    <figure className="mt-5">
      <figcaption className="mb-2 text-sm text-subtle">Response time, hourly average, last 24 hours</figcaption>
      <div className="flex h-16 items-end gap-0.5" role="img" aria-label={`${label}: response time by hour, up to ${max} ms`}>
        {series.map((p) => (
          <div key={p.t} className="group relative flex h-full flex-1 items-end">
            <div
              className="w-full rounded-t bg-primary/70 transition-colors group-hover:bg-primary"
              style={{ height: `${Math.max(4, (p.ms / max) * 100)}%` }}
            />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs shadow-sm group-hover:block">
              {hour(p.t)}: {p.ms} ms
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-subtle" aria-hidden="true">
        <span>{hour(series[0].t)}</span>
        <span>{max} ms peak</span>
        <span>{hour(series[series.length - 1].t)}</span>
      </div>
      <table className="sr-only">
        <caption>{label}: hourly average response time</caption>
        <tbody>
          {series.map((p) => (
            <tr key={p.t}>
              <th scope="row">{hour(p.t)}</th>
              <td>{p.ms} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

const TargetCard = ({ t }: { t: Target }) => {
  const info = TARGET_INFO[t.target];
  return (
    <article className="surface-card px-6 py-5">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{info.name}</h2>
          <p className="text-sm text-muted-foreground">{info.detail}</p>
        </div>
        <StatusBadge up={t.up} />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["24h", "7d", "30d"] as const).map((w) => (
          <div key={w}>
            <dt className="text-xs uppercase tracking-wider text-subtle">Uptime {w}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">{percent(t.uptime[w])}</dd>
          </div>
        ))}
        <div>
          <dt className="text-xs uppercase tracking-wider text-subtle">Avg response</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">
            {t.latency_ms_24h === null ? "—" : `${t.latency_ms_24h} ms`}
          </dd>
        </div>
      </dl>
      <LatencyBars series={t.latency_series} label={info.name} />
      <p className="mt-4 text-sm text-subtle">Last checked {ago(t.last_checked)}.</p>
    </article>
  );
};

const Deploys = () => {
  const [runs, setRuns] = useState<Run[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${GITHUB_REPO_API}/actions/runs?branch=main&event=push&per_page=40`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { workflow_runs: Run[] }) => setRuns(data.workflow_runs.filter((r) => r.name in WORKFLOWS)))
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return (
      <p className="text-muted-foreground">
        Couldn't load the pipeline history right now.{" "}
        <a className="text-link" href={`${GITHUB_REPO_URL}/actions`} target="_blank" rel="noopener noreferrer">
          See it on GitHub
        </a>
        .
      </p>
    );
  }
  if (!runs) return <p className="text-muted-foreground">Loading recent deploys…</p>;

  // One row per commit to main, with the result of each pipeline it ran.
  const commits = new Map<string, Run[]>();
  for (const run of runs) commits.set(run.head_sha, [...(commits.get(run.head_sha) ?? []), run]);
  const rows = [...commits.values()].slice(0, 6);

  return (
    <ul className="divide-y divide-border border-y border-border">
      {rows.map((group) => {
        const first = group[0];
        return (
          <li key={first.head_sha} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{commitTitle(first.head_commit?.message)}</p>
              <p className="text-sm text-subtle">
                {new Date(first.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} ·{" "}
                <code>{first.head_sha.slice(0, 7)}</code>
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.map((run) => {
                const ok = run.conclusion === "success";
                const running = run.status !== "completed";
                const Icon = running ? CircleHelp : ok ? CheckCircle2 : CircleAlert;
                const state = running ? "running" : ok ? "passed" : run.conclusion;
                return (
                  <li key={run.id}>
                    <a
                      href={run.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${WORKFLOWS[run.name]}: ${state} (opens in a new tab)`}
                      className="chip inline-flex items-center gap-1.5 hover:border-primary hover:text-foreground"
                    >
                      <Icon
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 ${running ? "" : ok ? "text-emerald-700 dark:text-emerald-400" : "text-destructive"}`}
                      />
                      {WORKFLOWS[run.name]}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

const StatusPage = () => {
  const [status, setStatus] = useState<Status | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(STATUS_API_URL, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Status) => setStatus(data))
      .catch(() => setFailed(true));
  }, []);

  const states = status?.targets.map((t) => t.up) ?? [];
  const overall = !status
    ? null
    : states.every((s) => s === true)
      ? "All systems operational"
      : states.some((s) => s === false)
        ? "Something is down"
        : "Collecting data: checks run every 5 minutes";

  return (
    <Container>
      <Seo
        title="Status"
        description="Live uptime, response times, deploys and running costs for juasoh.com and its AWS backend."
        breadcrumbs={[["Status", "/status"]]}
      />
      <PageIntro eyebrow="Live" title="System status">
        A health check runs every 5 minutes from AWS. These numbers are live, not a screenshot.
      </PageIntro>

      {failed && (
        <p className="surface-card px-6 py-5 text-muted-foreground">
          The status service didn't answer. That's worth knowing too: try again in a minute.
        </p>
      )}

      {!failed && (
        <>
          <p className="mb-8 text-xl font-semibold" role="status">
            {overall ?? "Loading live status…"}
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            {status ? (
              status.targets.map((t) => <TargetCard key={t.target} t={t} />)
            ) : (
              <>
                <div className="surface-card h-64 animate-pulse" aria-hidden="true" />
                <div className="surface-card h-64 animate-pulse" aria-hidden="true" />
              </>
            )}
          </div>
        </>
      )}

      <section className="mt-16" aria-labelledby="deploys">
        <h2 id="deploys" className="text-2xl font-bold tracking-tight">
          Recent deploys
        </h2>
        <p className="mb-6 mt-2 text-muted-foreground">
          Every change to main runs these pipelines in GitHub Actions; AWS changes also wait for a manual approval.
          Cloudflare deploys the website itself.
        </p>
        <Deploys />
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2" aria-label="Cost and how it works">
        <div className="surface-card px-6 py-5">
          <p className="eyebrow mb-2">AWS cost this month</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {status?.cost_this_month == null ? "—" : `$${status.cost_this_month.toFixed(2)}`}
          </p>
          <p className="mt-2 text-sm text-subtle">
            AWS's own estimate for the whole account, updated a few times a day. Serverless means paying per request,
            so a quiet portfolio costs almost nothing.
          </p>
        </div>
        <div className="surface-card px-6 py-5">
          <p className="eyebrow mb-2">How this works</p>
          <p className="text-muted-foreground">
            An EventBridge schedule runs a Lambda every 5 minutes that requests both endpoints and records the result in
            CloudWatch. Alarms email me after two failed checks in a row. This page reads those metrics through a
            public, cached, read-only API.
          </p>
          <Link to="/work/this-website" className="group mt-4 inline-flex items-center gap-1.5 font-medium text-primary-ink">
            How the whole site is built
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <p className="mt-10 text-sm text-subtle">
        <a className="inline-flex items-center gap-1 hover:text-foreground" href={`${GITHUB_REPO_URL}`} target="_blank" rel="noopener noreferrer">
          Source on GitHub <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        {status && ` · Updated ${ago(status.generated_at)}`}
      </p>
    </Container>
  );
};

export default StatusPage;
