import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[#29443f] pb-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#77bdb2] text-[#112522] shadow-sm shadow-black/20">
          <Github size={18} strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-base font-bold tracking-tight text-[#edf6f3]">
            gh-analyzer
          </p>
          <p className="text-[10px] font-bold tracking-wide text-[#90a59e]">PERFIS & REPOSITÓRIOS</p>
        </div>
      </div>
      <span className="hidden rounded-full border border-[#31534e] bg-[#172f2c] px-3 py-1 text-[11px] font-semibold text-[#a9c9c2] sm:block">
        Análise de perfil
      </span>
    </header>
  );
}
