// frontend/components/MatchCard.tsx
import React from "react";

type Props = {
  match: any;
};

export default function MatchCard({ match }: Props) {
  return (
    <div className="p-3 bg-white/5 rounded-lg shadow-sm border border-white/5">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <div className="font-semibold text-lg">{match.home}</div>
          <div className="text-sm text-neutral-300">{match.away}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-neutral-400">{match.date || "—"}</div>
          <div className={`text-xs mt-1 ${match.status === "live" ? "text-rose-400" : "text-neutral-300"}`}>
            {match.status?.toUpperCase() || "SCHEDULED"}
          </div>
        </div>
      </div>
      {match.link && (
        <div className="mt-3">
          <a href={match.link} target="_blank" rel="noreferrer" className="text-sm text-cyan-400 hover:underline">
            ▶️ Assistir / Fonte
          </a>
        </div>
      )}
    </div>
  );
}