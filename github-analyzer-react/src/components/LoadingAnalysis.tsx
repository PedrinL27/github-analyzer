import { Check, CircleDashed, LoaderCircle } from "lucide-react";

export function LoadingAnalysis({ username }: { username: string }) {
  return (
    <div className="rounded-2xl border border-[#2e4f49] bg-[#162d2a] p-7 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#214944]">
          <LoaderCircle className="animate-spin text-[#8ed1c4]" size={20} />
        </div>
        <div>
          <p className="text-base font-bold text-[#e4f1ed]">
            Analisando @{username}
          </p>
          <p className="text-sm text-[#9bb0aa]">
            Reunindo dados e organizando os principais insights
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Step done text="Perfil do GitHub encontrado" />
        <Step done text="Repositórios reunidos" />
        <Step active text="Preparando a análise" />
      </div>
    </div>
  );
}

function Step({ done, active, text }: { done?: boolean; active?: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      {done ? (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#20483f] text-[#87cbb5]">
          <Check size={12} />
        </span>
      ) : active ? (
        <LoaderCircle className="animate-spin text-[#8ed1c4]" size={18} />
      ) : (
        <CircleDashed className="text-[#637a73]" size={18} />
      )}
      <span className={done ? "text-[#a0b8b1]" : active ? "text-[#e0efe9]" : "text-[#748a83]"}>
        {text}
      </span>
    </div>
  );
}
