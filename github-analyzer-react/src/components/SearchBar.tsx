import { ArrowRight, Github } from "lucide-react";
import type { FormEvent } from "react";

type SearchBarProps = {
  username: string;
  setUsername: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
};

export function SearchBar({
  username,
  setUsername,
  onSubmit,
  disabled,
}: SearchBarProps) {
  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="group relative flex min-h-[70px] items-center rounded-2xl border border-[#3b605a] bg-[#162d2a] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition focus-within:border-[#76bcb1] focus-within:ring-4 focus-within:ring-[#65a99e]/15"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[#8bc8bd]">
          <Github size={20} />
        </div>

        <div className="flex min-w-0 flex-1 items-center">
          <span className="hidden text-sm font-medium text-[#88a29a] sm:block">
            github.com/
          </span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="seu-usuario"
            autoComplete="off"
            autoFocus
            disabled={disabled}
            className="min-w-0 flex-1 bg-transparent px-1 py-3 text-base font-semibold text-[#edf6f3] outline-none placeholder:text-[#718982] disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !username.trim()}
          className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#78bdb2] px-5 text-sm font-bold text-[#102521] transition hover:bg-[#94d0c5] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Analisar</span>
          <ArrowRight size={17} />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-[#90a39d]">
        <span>Experimente:</span>
        {["torvalds", "ahejlsberg", "akitaonrails"].map((example) => (
          <button
            key={example}
            type="button"
            disabled={disabled}
            onClick={() => setUsername(example)}
            className="rounded-md border border-[#2d4c47] bg-[#152a27] px-2.5 py-1 text-[#a5c3bc] transition hover:border-[#5c9087] hover:bg-[#1e3d38] hover:text-[#d5ebe5] disabled:opacity-50"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
