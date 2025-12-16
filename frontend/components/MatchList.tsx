// frontend/components/MatchList.tsx
import React from "react";
import MatchCard from "./MatchCard";

export default function MatchList({ matches }: { matches: any[] }) {
  if (!matches || matches.length === 0) {
    return <div className="text-center text-neutral-400">Nenhum jogo encontrado.</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((m, idx) => (
        <MatchCard key={idx} match={m} />
      ))}
    </div>
  );
}