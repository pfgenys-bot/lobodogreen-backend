// backend/services/scrapers/matchesService.js
// Serviço unificado que junta os scrapers da mesma pasta (cbf.js, conmebol.js, uefa.js, etc.)

import * as cbfModule from "./cbf.js";
import * as conmebolModule from "./conmebol.js";
import * as uefaModule from "./uefa.js";
import * as laligaModule from "./laliga.js";

const resolveFn = (mod, candidates = []) => {
  // retorna a primeira função encontrada entre candidatos ou uma função que retorna []
  for (const name of candidates) {
    if (typeof mod[name] === "function") return mod[name];
  }
  if (typeof mod.default === "function") return mod.default;
  // fallback: tentar qualquer exportação que seja função
  for (const k of Object.keys(mod)) {
    if (typeof mod[k] === "function") return mod[k];
  }
  return async () => [];
};

const cbfFn = resolveFn(cbfModule, ["getCBF", "fetchCBF", "getCbfMatches", "getCBFMatches"]);
const conmebolFn = resolveFn(conmebolModule, ["fetchCONMEBOL", "getCONMEBOL", "fetchConmebol"]);
const uefaFn = resolveFn(uefaModule, ["fetchUEFA", "getUEFA", "fetchUefa"]);
const laligaFn = resolveFn(laligaModule, ["fetchLaLiga", "getLaLiga", "fetchLaliga"]);

export const fetchAllMatches = async () => {
  try {
    // executa em paralelo para ser mais rápido
    const [cbf, conmebol, uefa, laliga] = await Promise.allSettled([
      cbfFn(),
      conmebolFn(),
      uefaFn(),
      laligaFn()
    ]);

    const safeVal = (p) => (p.status === "fulfilled" && Array.isArray(p.value) ? p.value : []);

    const all = [
      ...safeVal(cbf),
      ...safeVal(conmebol),
      ...safeVal(uefa),
      ...safeVal(laliga)
    ];

    return all;
  } catch (err) {
    console.error("Erro em fetchAllMatches:", err);
    return [];
  }
};