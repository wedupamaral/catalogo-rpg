"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Artifact = {
  id: string;
  roll_number: number;
  name: string;
  rarity: string;
  type: string;
  price: number;
  short_description: string;
  image_url: string;
};

const rarityColors: Record<string, string> = {
  comum: "border-zinc-500",
  incomum: "border-green-500",
  raro: "border-blue-500",
  épico: "border-purple-500",
  epico: "border-purple-500",
  mítico: "border-yellow-500",
  mitico: "border-yellow-500",
  lendário: "border-orange-500",
  lendario: "border-orange-500",
  espiritual: "border-cyan-400",
  "aspectual / essencial": "border-pink-500",
  apocalipse: "border-red-600",
  nobreza: "border-amber-300",
  arquétido: "border-indigo-400",
  arquetido: "border-indigo-400",
  primordial: "border-emerald-300",
  prismático: "border-fuchsia-400",
  prismatico: "border-fuchsia-400",
};

export default function Home() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("Todos");

  useEffect(() => {
    async function loadArtifacts() {
      const { data, error } = await supabase
        .from("artifacts")
        .select("*")
        .order("roll_number", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setArtifacts(data || []);
      }
    }

    loadArtifacts();
  }, []);

  const rarities = useMemo(() => {
    const unique = [
      ...new Set(
        artifacts
          .map((a) => a.rarity)
          .filter(Boolean)
      ),
    ];

    return ["Todos", ...unique];
  }, [artifacts]);

  const filteredArtifacts = useMemo(() => {

    const searchTerm = search.toLowerCase().trim();

    const searchNumbers = searchTerm
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n !== "");

    return artifacts.filter((artifact) => {

      let matchesSearch = false;

      const artifactName =
        artifact.name?.toLowerCase() || "";

      const artifactRoll =
        artifact.roll_number?.toString() || "";

      const isNumericSearch =
        searchNumbers.length > 0 &&
        searchNumbers.every((n) => !isNaN(Number(n)));

      if (searchTerm === "") {

        matchesSearch = true;

      } else if (isNumericSearch) {

        matchesSearch =
          searchNumbers.includes(artifactRoll);

      } else {

        matchesSearch =
          artifactName.includes(searchTerm);

      }

      const matchesRarity =
        selectedRarity === "Todos" ||
        artifact.rarity === selectedRarity;

      return matchesSearch && matchesRarity;
    });

  }, [artifacts, search, selectedRarity]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">

          <h1 className="text-5xl font-black tracking-wide mb-2">
            Catálogo de Artefatos
          </h1>

          <p className="text-zinc-400 text-lg">
            Arquivo Arcano de Miecra
          </p>

        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">

          <input
            type="text"
            placeholder="Buscar por nome ou IDs (12, 38, 129)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              flex-1
              bg-zinc-900
              border border-zinc-700
              rounded-xl
              px-5 py-4
              text-white
              outline-none
            "
          />

          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="
              bg-zinc-900
              border border-zinc-700
              rounded-xl
              px-5 py-4
              text-white
              outline-none
            "
          >

            {rarities.map((rarity) => (
              <option key={rarity}>
                {rarity}
              </option>
            ))}

          </select>

        </div>

        <p className="text-zinc-400 mb-6">
          {filteredArtifacts.length} artefatos encontrados
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filteredArtifacts.map((artifact) => {

            const rarity =
              artifact.rarity?.toLowerCase() || "comum";

            const borderColor =
              rarityColors[rarity] || "border-zinc-700";

            return (
              <div
                key={artifact.id}
                className={`
                  group
                  bg-gradient-to-b
                  from-zinc-900
                  to-zinc-950
                  rounded-2xl
                  overflow-hidden
                  border
                  ${borderColor}
                  shadow-2xl
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                `}
              >

                <div className="h-52 bg-zinc-800 flex items-center justify-center overflow-hidden">

                  {artifact.image_url ? (
                    <img
                      src={artifact.image_url}
                      alt={artifact.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-zinc-500 text-sm">
                      Sem imagem
                    </div>
                  )}

                </div>

                <div className="p-6">

                  <div className="flex justify-between items-start mb-4">

                    <div>

                      <h2 className="text-2xl font-extrabold leading-tight uppercase">
                        {artifact.name}
                      </h2>

                    </div>

                    <div
                      className="
                        bg-zinc-800
                        border border-zinc-700
                        rounded-lg
                        px-3 py-2
                        text-sm
                        font-bold
                      "
                    >
                      #{artifact.roll_number}
                    </div>

                  </div>

                  <div className="flex gap-2 flex-wrap mb-4">

                    <span
                      className={`
                        px-3 py-1 rounded-full text-sm font-bold
                        bg-zinc-800
                        border
                        ${borderColor}
                      `}
                    >
                      {artifact.rarity}
                    </span>

                    <span
                      className="
                        px-3 py-1 rounded-full text-sm
                        bg-zinc-800 border border-zinc-700
                      "
                    >
                      {artifact.type}
                    </span>

                  </div>

                  <p className="text-zinc-300 leading-relaxed min-h-[70px]">
                    {artifact.short_description || "Descrição não cadastrada."}
                  </p>

                  <div className="mt-6 flex justify-between items-center">

                    <div>

                      <p className="text-zinc-500 text-sm">
                        Valor
                      </p>

                      <p className="text-2xl font-black text-yellow-400">
                        R$ {artifact.price || 0}
                      </p>

                    </div>

                    <a
                      href={`/artifacts/${artifact.id}`}
                      className="
                        bg-purple-700
                        hover:bg-purple-600
                        px-5 py-3
                        rounded-xl
                        font-bold
                        transition-all
                      "
                    >
                      Ver Detalhes
                    </a>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </main>
  );
}