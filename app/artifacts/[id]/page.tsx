"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Artifact = {
  id: string;
  roll_number: number;
  name: string;
  rarity: string;
  type: string;
  price: number;
  short_description: string;
  effect_text: string;
};

function getArtifactImage(name: string) {

  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");

  return `https://jrvxpyypfrshucugjfdo.supabase.co/storage/v1/object/public/artifacts/${normalizedName}.png?v=${Date.now()}`;
}

export default function ArtifactPage() {

  const params = useParams();

  const id = params.id as string;

  const [artifact, setArtifact] =
    useState<Artifact | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function copyArtifact() {

    if (!artifact) return;

    const text = `
${artifact.name}

Raridade: ${artifact.rarity}
Tipo: ${artifact.type}
ID Rolagem: ${artifact.roll_number}

Descrição:
${artifact.short_description || "Sem descrição."}

Efeitos:
${artifact.effect_text || "Sem efeitos cadastrados."}
`;

    await navigator.clipboard.writeText(text);

    alert("Artefato copiado!");
  }

  useEffect(() => {

    async function loadArtifact() {

      const { data } = await supabase
        .from("artifacts")
        .select("*")
        .eq("id", id)
        .single();

      setArtifact(data);

      setLoading(false);
    }

    if (id) {
      loadArtifact();
    }

  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Carregando artefato...
      </main>
    );
  }

  if (!artifact) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Artefato não encontrado.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-10
            items-start
          "
        >

          <div
            className="
              bg-zinc-900
              rounded-3xl
              border
              border-zinc-700
              p-6
              flex
              justify-center
            "
          >

            <img
              src={getArtifactImage(artifact.name)}
              alt={artifact.name}
              className="
                w-full
                max-w-[600px]
                h-auto
                object-contain
                rounded-2xl
              "
            />

          </div>

          <div
            className="
              bg-zinc-900
              rounded-3xl
              border
              border-zinc-700
              p-10
            "
          >

            <div className="mb-8">

              <h1 className="text-5xl font-black uppercase mb-4 leading-tight">
                {artifact.name}
              </h1>

              <div className="flex gap-3 flex-wrap">

                <span className="px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800">
                  {artifact.rarity}
                </span>

                <span className="px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800">
                  {artifact.type}
                </span>

                <span className="px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800">
                  #{artifact.roll_number}
                </span>

              </div>

            </div>

            <button
              onClick={copyArtifact}
              className="
                bg-purple-700
                hover:bg-purple-600
                transition-all
                px-6
                py-3
                rounded-xl
                font-bold
                mb-10
              "
            >
              Copiar Artefato
            </button>

            <section>

              <h2 className="text-2xl font-bold mb-4">
                Descrição
              </h2>

              <p className="text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap">
                {artifact.short_description || "Sem descrição."}
              </p>

            </section>

            <section className="mt-10">

              <h2 className="text-2xl font-bold mb-4">
                Efeitos
              </h2>

              <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-lg">
                {artifact.effect_text || "Sem efeitos cadastrados."}
              </p>

            </section>

          </div>

        </div>

      </div>

    </main>
  );
}