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
  rules_text: string;
  flavor_text: string;
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

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const resolvedParams = await params;

  const { data: artifact } = await supabase
    .from("artifacts")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!artifact) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Artefato não encontrado.
      </main>
    );
  }

  const rarity =
    artifact.rarity?.toLowerCase() || "comum";

  const borderColor =
    rarityColors[rarity] || "border-zinc-700";

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-10">

      <div className="max-w-5xl mx-auto">

        <div
          className={`
            rounded-3xl
            border
            ${borderColor}
            overflow-hidden
            bg-gradient-to-b
            from-zinc-900
            to-black
            shadow-2xl
          `}
        >

          <div className="h-96 bg-zinc-800 flex items-center justify-center overflow-hidden">

            {artifact.image_url ? (
              <img
                src={artifact.image_url}
                alt={artifact.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-zinc-500">
                Sem imagem
              </div>
            )}

          </div>

          <div className="p-10">

            <div className="flex justify-between items-start mb-6">

              <div>

                <h1 className="text-5xl font-black uppercase mb-4">
                  {artifact.name}
                </h1>

                <div className="flex gap-3 flex-wrap">

                  <span
                    className={`
                      px-4 py-2 rounded-full
                      border
                      ${borderColor}
                      bg-zinc-900
                      font-bold
                    `}
                  >
                    {artifact.rarity}
                  </span>

                  <span
                    className="
                      px-4 py-2 rounded-full
                      border border-zinc-700
                      bg-zinc-900
                    "
                  >
                    {artifact.type}
                  </span>

                </div>

              </div>

              <div
                className="
                  bg-zinc-900
                  border border-zinc-700
                  rounded-2xl
                  px-6 py-4
                  text-2xl
                  font-black
                "
              >
                #{artifact.roll_number}
              </div>

            </div>

            <div className="mb-10">

              <p className="text-zinc-400 text-sm mb-2">
                VALOR
              </p>

              <p className="text-5xl font-black text-yellow-400">
                R$ {artifact.price || 0}
              </p>

            </div>

            <div className="space-y-10">

              <section>

                <h2 className="text-2xl font-bold mb-4">
                  Descrição
                </h2>

                <p className="text-zinc-300 leading-relaxed text-lg">
                  {artifact.short_description || "Sem descrição."}
                </p>

              </section>

              <section>

                <h2 className="text-2xl font-bold mb-4">
                  Efeitos
                </h2>

                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {artifact.effect_text || "Sem efeitos cadastrados."}
                </p>

              </section>

              <section>

                <h2 className="text-2xl font-bold mb-4">
                  Regras
                </h2>

                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {artifact.rules_text || "Sem regras cadastradas."}
                </p>

              </section>

              <section>

                <h2 className="text-2xl font-bold mb-4">
                  Lore
                </h2>

                <p className="text-zinc-300 italic leading-relaxed whitespace-pre-wrap text-lg">
                  {artifact.flavor_text || "Sem lore cadastrada."}
                </p>

              </section>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}