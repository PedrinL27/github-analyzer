import { Component, useState, type ErrorInfo, type FormEvent, type ReactNode } from "react";
import { BarChart3, Github, ShieldCheck } from "lucide-react";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { LoadingAnalysis } from "./components/LoadingAnalysis";
import {
  AnalysisError,
  AnalysisResult,
  type Analysis,
} from "./components/AnalysisResult";
import { analyzeGithubUser, API_BASE } from "./services/analyzerApi";

type ResultState =
  | { type: "idle" }
  | { type: "loading"; username: string }
  | { type: "success"; username: string; data: Analysis }
  | { type: "error"; status: number | null; message: string };

function getErrorMessage(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object" && data !== null) {
    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }

    if ("mensagem" in data && typeof data.mensagem === "string") {
      return data.mensagem;
    }
  }

  return "Unknown error";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isTechnologyList(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.name === "string" &&
        isStringArray(item.projects)
    )
  );
}

function isInsightBlock(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.summary === "string" &&
    isStringArray(value.observations) &&
    isStringArray(value.limitations)
  );
}

function isAnalysisData(value: unknown): value is Analysis {
  if (!isRecord(value)) return false;

  const { profile, summary, technologies, technicalAreas, repositories, activity, popularity } = value;

  return (
    isRecord(profile) &&
    typeof profile.username === "string" &&
    isRecord(summary) &&
    typeof summary.headline === "string" &&
    typeof summary.description === "string" &&
    isRecord(technologies) &&
    isTechnologyList(technologies.languages) &&
    isTechnologyList(technologies.frameworks) &&
    isTechnologyList(technologies.libraries) &&
    isTechnologyList(technologies.tools) &&
    isTechnologyList(technologies.infrastructure) &&
    Array.isArray(technicalAreas) &&
    Array.isArray(repositories) &&
    isInsightBlock(activity) &&
    isInsightBlock(popularity)
  );
}

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro ao exibir a análise", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center px-5">
          <section className="w-full max-w-lg rounded-3xl border border-[#b9d4cf] bg-[#17312e] p-8 text-center shadow-2xl shadow-black/20">
            <p className="text-lg font-bold text-[#ecf6f2]">A análise chegou em um formato inesperado.</p>
            <p className="mt-3 text-sm leading-6 text-[#a9c0ba]">Nada foi perdido. Atualize a página e tente novamente em alguns instantes.</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-[#67aaa1] px-4 py-2.5 text-sm font-bold text-[#102521] transition hover:bg-[#83bbb3]">
              Tentar novamente
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<ResultState>({ type: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = username.trim().replace(/^@/, "");
    if (!normalized) return;

    setUsername(normalized);
    setResult({ type: "loading", username: normalized });

    try {
      const { response, data } = await analyzeGithubUser(normalized);

      if (!response.ok) {
        setResult({
          type: "error",
          status: response.status,
          message: getErrorMessage(data),
        });
        return;
      }

      if (!isAnalysisData(data)) {
        setResult({
          type: "error",
          status: response.status,
          message: "A resposta recebida não segue o contrato de análise esperado.",
        });
        return;
      }

      setResult({
        type: "success",
        username: normalized,
        data,
      });
    } catch (error) {
      setResult({
        type: "error",
        status: null,
        message:
          error instanceof Error
            ? `Não consegui falar com a API: ${error.message}`
            : "Não consegui falar com a API.",
      });
    }
  }

  return (
    <AppErrorBoundary>
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-5xl px-10 py-6 sm:px-8 sm:py-9">
        <Header />

        <section className="mx-auto max-w-5xl pb-14 pt-16 text-center sm:pt-24">
          <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#edf6f3] sm:text-7xl">
            Descubra seu
            <span className="block text-[#83c9bc]">seu GitHub.</span>
          </h1>


          <div className="mt-9 text-left">
            <SearchBar
              username={username}
              setUsername={setUsername}
              onSubmit={handleSubmit}
              disabled={result.type === "loading"}
            />
          </div>
        </section>

        <section className="mx-auto max-w-5xl">
          {result.type === "loading" && (
            <LoadingAnalysis username={result.username} />
          )}

          {result.type === "success" && (
            <AnalysisResult username={result.username} data={result.data} />
          )}

          {result.type === "error" && (
            <AnalysisError
              status={result.status}
              message={result.message}
            />
          )}
        </section>

        {result.type === "idle" && (
          <section className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            <Feature
              icon={<Github size={17} />}
              title="Dados do GitHub"
              text="Perfil e repositórios reunidos em um só lugar."
            />
            <Feature
              icon={<BarChart3 size={17} />}
              title="Leitura contextual"
              text="Tecnologias e trajetória explicadas sem jargão excessivo."
            />
          </section>
        )}

        <footer className="mx-auto mt-20 max-w-3xl border-t border-[#29443f] pt-5 text-[11px] text-[#879b94]">
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <span className="font-semibold tracking-wide">gh-analyzer</span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={13} />
              Dados processados pela API · {API_BASE}
            </span>
          </div>
        </footer>
      </div>
    </main>
    </AppErrorBoundary>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2b4944] bg-[#162d2a] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:border-[#4f7770]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#214944] text-[#93d0c5]">
        {icon}
      </div>
      <h2 className="text-base font-bold text-[#e3f0ec]">{title}</h2>
      <p className="mt-1.5 text-sm leading-6 text-[#9eb2ac]">{text}</p>
    </div>
  );
}
