import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  GitFork,
  Info,
  ShieldAlert,
  Sparkles,
  Star,
  Terminal,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useState } from "react";

type Confidence = "HIGH" | "MEDIUM" | "LOW";

type Evidence = {
  type: "FACT" | "INFERENCE";
  description: string;
  source: string;
};

type TechnicalArea = {
  name: string;
  confidence: Confidence;
  technologies: string[];
  evidence: string[];
};

type Technology = {
  name: string;
  projects: string[];
};

type Repository = {
  name: string;
  description: string | null;
  url: string | null;
  activityScore: number | null;
  popularityScore: number | null;
  languages: string[];
  technologies: string[];
  purpose: string | null;
  technicalHighlights: string[];
  evidence: Evidence[];
  confidence: Confidence;
};

export type Analysis = {
  profile: {
    username: string;
    name: string | null;
    bio: string | null;
    avatarUrl: string | null;
    // O prompt agora garante que profileUrl é sempre derivado de username,
    // mas mantemos nullable por segurança com respostas antigas/legadas.
    profileUrl: string | null;
  };

  summary: {
    headline: string;
    description: string;
    confidence: Confidence;
  };

  technicalAreas: TechnicalArea[];

  technologies: {
    languages: Technology[];
    frameworks: Technology[];
    libraries: Technology[];
    tools: Technology[];
    infrastructure: Technology[];
  };

  repositories: Repository[];

  activity: {
    summary: string;
    observations: string[];
    limitations: string[];
  };

  popularity: {
    summary: string;
    observations: string[];
    limitations: string[];
  };

  strengths: {
    title: string;
    description: string;
    evidence: string[];
    confidence: Confidence;
  }[];

  developmentAreas: {
    title: string;
    description: string;
    evidence: string[];
    confidence: Confidence;
  }[];

  limitations: string[];
};

type Props = {
  username: string;
  data: Analysis;
};

// Ambos os scores vêm da mesma ferramenta e usam a mesma escala 0–10
// (ver exemplos: activityScore 8.28/7.83/8.8, popularityScore 0/9).
// Mantemos essa constante única para não deixar as duas barras dessincronizarem de novo.
const SCORE_SCALE_MAX = 10;

const confidenceStyles: Record<Confidence, string> = {
  HIGH: "border-[#9bcfc0] bg-[#e5f4ed] text-[#20735d]",
  MEDIUM: "border-[#ead79b] bg-[#fff7db] text-[#8b671d]",
  LOW: "border-[#d3ded9] bg-[#f1f4f2] text-[#63736d]",
};

function ConfidenceBadge({ value }: { value: Confidence }) {
  const style = confidenceStyles[value] ?? confidenceStyles.LOW;

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider ${style}`}
    >
      {value ?? "LOW"}
    </span>
  );
}

function ScoreBar({
  value,
  max = SCORE_SCALE_MAX,
}: {
  value: number | null | undefined;
  max?: number;
}) {
  const safeValue = typeof value === "number" && !Number.isNaN(value) ? value : 0;
  const percentage = max > 0 ? Math.min(Math.max((safeValue / max) * 100, 0), 100) : 0;

  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[#e3ebe7]">
      <div
        className="score-fill h-full rounded-full bg-[#3c968c] transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function TagList({
  items,
}: {
  items: Array<string | Technology> | null | undefined;
}) {
  if (!items?.length) {
    return <span className="text-xs text-[#84938e]">Sem evidências encontradas</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <TechnologyTag key={`${typeof item === "string" ? item : item.name}-${index}`} item={item} />
      ))}
    </div>
  );
}

function TechnologyTag({ item }: { item: string | Technology }) {
  const technology = typeof item === "string" ? null : item;
  const name = typeof item === "string" ? item : item.name;
  const projectCount = technology?.projects?.length ?? 0;
  const projectLabel = projectCount === 1 ? "1 projeto" : `${projectCount} projetos`;

  return (
    <span
      title={technology?.projects?.join(", ")}
      className="rounded-md border border-[#d8e5e0] bg-[#f7faf8] px-2 py-1 text-[10px] font-medium text-[#4f7069]"
    >
      {name}
      {technology && projectCount > 0 && (
        <span className="ml-1 text-[#78918a]">· {projectLabel}</span>
      )}
    </span>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[#e0e8e4] px-5 py-7 sm:px-7">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[#4d837c]">{icon}</span>
        <h2 className="text-sm font-semibold text-[#1f3935]">{title}</h2>
      </div>

      {children}
    </section>
  );
}

// Formata um score numérico com segurança, sem quebrar em null/undefined.
// Usa sempre 2 casas decimais já que a escala é 0–10 para ambos os scores.
function formatScore(value: number | null | undefined): string {
  return typeof value === "number" && !Number.isNaN(value) ? value.toFixed(2) : "—";
}

export function AnalysisResult({ username, data }: Props) {
  const [copied, setCopied] = useState(false);
  const profile = data?.profile ?? {
    username,
    name: null,
    bio: null,
    avatarUrl: null,
    profileUrl: null,
  };
  const summary = data?.summary ?? { headline: "", description: "", confidence: "LOW" as Confidence };
  const technologies = data?.technologies ?? {
    languages: [],
    frameworks: [],
    libraries: [],
    tools: [],
    infrastructure: [],
  };
  const activity = data?.activity ?? { summary: "", observations: [], limitations: [] };
  const popularity = data?.popularity ?? { summary: "", observations: [], limitations: [] };
  const repositories = Array.isArray(data?.repositories) ? data.repositories : [];
  const technicalAreas = Array.isArray(data?.technicalAreas) ? data.technicalAreas : [];
  const strengths = Array.isArray(data?.strengths) ? data.strengths : [];
  const developmentAreas = Array.isArray(data?.developmentAreas) ? data.developmentAreas : [];
  const limitations = Array.isArray(data?.limitations) ? data.limitations : [];

  // Fallback determinístico caso a API não tenha preenchido profileUrl
  // (o prompt manda sempre construir a partir do username, mas o front
  // fica resiliente a respostas antigas que ainda retornem null).
  const profileUrl = profile.profileUrl || (profile.username || username ? `https://github.com/${profile.username || username}` : null);

  async function copyResult() {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));

    setCopied(true);

    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="analysis-result overflow-hidden rounded-2xl border border-[#d8e4df] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e0e8e4] bg-[#f8fbfa] px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ed] text-[#278165]">
            <CheckCircle2 size={17} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#1d3632]">
              @{username}
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#73857f]">
              análise concluída
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyResult}
          className="flex items-center gap-2 rounded-lg border border-[#d7e3df] px-2.5 py-2 text-xs text-[#55736c] transition hover:bg-[#edf5f2] hover:text-[#245e59]"
          title="Copiar dados"
        >
          {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}

          <span className="hidden sm:inline">
            {copied ? "Copiado" : "Copiar dados"}
          </span>
        </button>
      </div>

      {/* Profile */}
      <div className="border-b border-[#e0e8e4] px-5 py-7 sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name ?? username}
              className="h-20 w-20 rounded-2xl border border-[#d8e5e0]"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#d8e5e0] bg-[#f4f8f6] text-2xl text-[#78918a]">
              <GitFork size={28} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-[#1d3632]">
                {profile.name || username}
              </h1>

              <ConfidenceBadge value={summary.confidence ?? "LOW"} />
            </div>

            <p className="mt-1 text-xs text-[#70827c]">
              @{profile.username || username}
            </p>

            {profile.bio && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5d736c]">
                {profile.bio}
              </p>
            )}
          </div>

          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-[#d7e3df] px-3 py-2 text-xs text-[#55736c] transition hover:bg-[#edf5f2] hover:text-[#245e59]"
            >
              GitHub
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#edf7f4] px-5 py-7 sm:px-7">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={15} className="text-[#2e8178]" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3b7770]">
            resumo técnico
          </span>
        </div>

        <h2 className="font-serif text-2xl font-semibold tracking-tight text-[#1b3934]">
          {summary.headline || "Panorama do perfil"}
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#526c65]">
          {summary.description || "Os dados disponíveis deste perfil foram organizados abaixo."}
        </p>
      </div>

      {/* Technical Areas */}
      {technicalAreas.length > 0 && (
        <Section title="Áreas de experiência" icon={<Terminal size={16} />}>
          <div className="grid gap-3 md:grid-cols-2">
            {technicalAreas.map((area, areaIndex) => (
              <div
                key={`${area.name}-${areaIndex}`}
                className="rounded-xl border border-[#dce7e3] bg-[#fbfdfc] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-[#29443f]">
                    {area.name}
                  </h3>

                  <ConfidenceBadge value={area.confidence} />
                </div>

                <div className="mt-3">
                  <TagList items={area.technologies} />
                </div>

                {area.evidence?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {area.evidence.map((evidence, evidenceIndex) => (
                      <p
                        key={evidenceIndex}
                        className="text-xs leading-5 text-[#70817b]"
                      >
                        • {evidence}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Technologies */}
      <Section title="Tecnologias" icon={<Terminal size={16} />}>
        <div className="grid gap-5 sm:grid-cols-2">
          <TechnologyGroup
            title="Linguagens"
            items={technologies.languages}
          />

          <TechnologyGroup
            title="Frameworks"
            items={technologies.frameworks}
          />

          <TechnologyGroup
            title="Bibliotecas"
            items={technologies.libraries}
          />

          <TechnologyGroup title="Ferramentas" items={technologies.tools} />

          <TechnologyGroup
            title="Infraestrutura"
            items={technologies.infrastructure}
          />
        </div>
      </Section>

      {/* Repositories */}
      <Section title="Repositórios relevantes" icon={<GitFork size={16} />}>
        <div className="space-y-4">
          {repositories.map((repo, repoIndex) => (
            <article
              key={`${repo.name}-${repoIndex}`}
              className="rounded-xl border border-[#dce7e3] bg-[#fbfdfc] p-5 transition hover:border-[#b6d4cd]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#1d3934]">
                      {repo.name}
                    </h3>

                    <ConfidenceBadge value={repo.confidence} />
                  </div>

                  {repo.description && (
                    <p className="mt-2 text-xs leading-5 text-[#70817b]">
                      {repo.description}
                    </p>
                  )}
                </div>

                {repo.url && (
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-[#78918a] transition hover:text-[#24655f]"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>

              {repo.purpose && (
                <div className="mt-5">
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-[#788a84]">
                    Objetivo
                  </p>

                  <p className="text-sm leading-6 text-[#526c65]">
                    {repo.purpose}
                  </p>
                </div>
              )}

              {/* Ambas as barras usam a mesma escala 0-10 (SCORE_SCALE_MAX),
                  já que os dois scores vêm da mesma ferramenta com a mesma unidade. */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-[10px] text-[#71817c]">
                      Atividade
                    </span>

                    <span className="text-[10px] font-medium text-[#52716a]">
                      {formatScore(repo.activityScore)}
                    </span>
                  </div>

                  <ScoreBar value={repo.activityScore} />
                </div>

                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-[10px] text-[#71817c]">
                      Popularidade
                    </span>

                    <span className="text-[10px] font-medium text-[#52716a]">
                      {formatScore(repo.popularityScore)}
                    </span>
                  </div>

                  <ScoreBar value={repo.popularityScore} />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-[#788a84]">
                    Linguagens
                  </p>

                  <TagList items={repo.languages} />
                </div>

                <div>
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-[#788a84]">
                    Tecnologias
                  </p>

                  <TagList items={repo.technologies} />
                </div>
              </div>

              {repo.technicalHighlights?.length > 0 && (
                <div className="mt-5 rounded-lg border border-[#dce9e4] bg-[#f2f8f5] p-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#54746d]">
                    Destaques técnicos
                  </p>

                  <ul className="space-y-2">
                    {repo.technicalHighlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="text-xs leading-5 text-[#536b65]"
                      >
                        <span className="mr-2 text-[#2c8778]">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {repo.evidence?.length > 0 && (
                <div className="mt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Info size={13} className="text-[#748982]" />

                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[#748982]">
                      Evidências
                    </span>
                  </div>

                  <div className="space-y-2">
                    {repo.evidence.map((evidence, index) => (
                      <div
                        key={`${evidence.source}-${index}`}
                        className="rounded-lg border border-[#e1eae6] bg-white p-3"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-semibold ${
                              evidence.type === "FACT"
                                ? "text-[#278165]"
                                : "text-[#9a741f]"
                            }`}
                          >
                            {evidence.type}
                          </span>

                          <span className="text-[9px] text-[#8b9994]">
                            {evidence.source}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-[#70817b]">
                          {evidence.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* Activity */}
      <Section title="Atividade" icon={<TrendingUp size={16} />}>
        <p className="text-sm leading-6 text-[#526c65]">
          {activity.summary}
        </p>

        {activity.observations?.length > 0 && (
          <ul className="mt-4 space-y-2">
            {activity.observations.map((item, index) => (
              <li key={index} className="text-xs leading-5 text-[#70817b]">
                • {item}
              </li>
            ))}
          </ul>
        )}

        {activity.limitations?.length > 0 && (
          <div className="mt-5 rounded-lg border border-[#eadfae] bg-[#fff9e8] p-4">
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-[#8f722e]">
              Limitações
            </p>

            {activity.limitations.map((item, index) => (
              <p key={index} className="text-xs leading-5 text-[#7b7155]">
                {item}
              </p>
            ))}
          </div>
        )}
      </Section>

      {/* Popularity */}
      <Section title="Popularidade" icon={<Star size={16} />}>
        <p className="text-sm leading-6 text-[#526c65]">
          {popularity.summary}
        </p>

        {popularity.observations?.length > 0 && (
          <ul className="mt-4 space-y-2">
            {popularity.observations.map((item, index) => (
              <li key={index} className="text-xs leading-5 text-[#70817b]">
                • {item}
              </li>
            ))}
          </ul>
        )}

        {popularity.limitations?.length > 0 && (
          <div className="mt-5 rounded-lg border border-[#eadfae] bg-[#fff9e8] p-4">
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-[#8f722e]">
              Limitações
            </p>

            {popularity.limitations.map((item, index) => (
              <p key={index} className="text-xs leading-5 text-[#7b7155]">
                {item}
              </p>
            ))}
          </div>
        )}
      </Section>

      {/* Strengths */}
      {strengths.length > 0 && (
        <Section title="Pontos fortes" icon={<Trophy size={16} />}>
          <div className="grid gap-3 md:grid-cols-2">
            {strengths.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="rounded-xl border border-[#cde6db] bg-[#f2faf6] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-[#29443f]">
                    {item.title}
                  </h3>

                  <ConfidenceBadge value={item.confidence} />
                </div>

                <p className="mt-2 text-xs leading-5 text-[#70817b]">
                  {item.description}
                </p>

                {item.evidence?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {item.evidence.map((evidence, index) => (
                      <p key={index} className="text-[11px] text-[#758780]">
                        • {evidence}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Development Areas */}
      {developmentAreas.length > 0 && (
        <Section title="Oportunidades de desenvolvimento" icon={<Info size={16} />}>
          <div className="grid gap-3 md:grid-cols-2">
            {developmentAreas.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="rounded-xl border border-[#dce7e3] bg-[#fbfdfc] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-[#29443f]">
                    {item.title}
                  </h3>

                  <ConfidenceBadge value={item.confidence} />
                </div>

                <p className="mt-2 text-xs leading-5 text-[#70817b]">
                  {item.description}
                </p>

                {item.evidence?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {item.evidence.map((evidence, index) => (
                      <p key={index} className="text-[11px] text-[#758780]">
                        • {evidence}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Limitations */}
      {limitations.length > 0 && (
        <Section title="Limitações da análise" icon={<ShieldAlert size={16} />}>
          <div className="rounded-xl border border-[#eadfae] bg-[#fff9e8] p-4">
            <ul className="space-y-2">
              {limitations.map((limitation, index) => (
                <li key={index} className="text-xs leading-5 text-[#7b7155]">
                  • {limitation}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}
    </section>
  );
}

function TechnologyGroup({
  title,
  items,
}: {
  title: string;
  items: Technology[] | null | undefined;
}) {
  return (
    <div>
      <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-[#788a84]">
        {title}
      </p>

      <TagList items={items} />
    </div>
  );
}

export function AnalysisError({
  status,
  message,
}: {
  status: number | null;
  message: string;
}) {
  return (
    <section className="analysis-error overflow-hidden rounded-2xl border border-[#ecc8c2] bg-[#fff8f6] shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-3 border-b border-[#f0d8d3] px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fae6e1] text-[#bc5549]">
          <AlertCircle size={17} />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#743b35]">
            Não foi possível concluir a análise
          </p>

          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#b16d65]">
            {status ?? "erro de conexão"}
          </p>
        </div>
      </div>

      <div className="px-5 py-5 text-sm leading-7 text-[#7a514b]">
        {message}
      </div>
    </section>
  );
}