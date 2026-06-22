import { computeWordDiff } from "@/lib/diff";

interface DiffTextProps {
  oldText: string;
  newText: string;
}

export function DiffText({ oldText, newText }: DiffTextProps) {
  const chunks = computeWordDiff(oldText || "", newText || "");

  return (
    <div className="font-sans text-[13px] whitespace-pre-wrap leading-relaxed border border-border/40 p-3.5 rounded-xl bg-muted/20 max-h-[220px] overflow-y-auto">
      {chunks.map((chunk, idx) => {
        if (chunk.type === "added") {
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: pure text chunk diff rendering requires positional mapping
              key={idx}
              className="bg-green-500/20 text-green-700 dark:text-green-300 px-0.5 rounded font-semibold underline decoration-green-500/50"
            >
              {chunk.value}
            </span>
          );
        }
        if (chunk.type === "removed") {
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: pure text chunk diff rendering requires positional mapping
              key={idx}
              className="bg-red-500/20 text-red-700 dark:text-red-300 px-0.5 rounded line-through decoration-red-500/50"
            >
              {chunk.value}
            </span>
          );
        }
        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: pure text chunk diff rendering requires positional mapping
            key={idx}
          >
            {chunk.value}
          </span>
        );
      })}
    </div>
  );
}

interface DiffViewerProps {
  tab: string;
  oldVal: unknown;
  newVal: unknown;
}

export function DiffViewer({ tab, oldVal, newVal }: DiffViewerProps) {
  if (tab === "personal") {
    const oldText = (oldVal as { text?: string })?.text || "";
    const newText = (newVal as { text?: string })?.text || "";
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Ringkasan Profesional
        </span>
        <DiffText oldText={oldText} newText={newText} />
      </div>
    );
  }

  if (tab === "experience" || tab === "education") {
    const isExp = tab === "experience";
    const oldExp = oldVal as {
      company?: string;
      institution?: string;
      position?: string;
      degree?: string;
      duration?: string;
      location?: string;
      bullets?: string[];
    };
    const newExp = newVal as {
      company?: string;
      institution?: string;
      position?: string;
      degree?: string;
      duration?: string;
      location?: string;
      bullets?: string[];
    };

    const oldOrg = isExp ? oldExp?.company : oldExp?.institution;
    const newOrg = isExp ? newExp?.company : newExp?.institution;
    const oldRole = isExp ? oldExp?.position : oldExp?.degree;
    const newRole = isExp ? newExp?.position : newExp?.degree;
    const oldDur = oldExp?.duration || "";
    const newDur = newExp?.duration || "";
    const oldLoc = oldExp?.location || "";
    const newLoc = newExp?.location || "";

    const oldBullets = (oldExp?.bullets || [])
      .map((b: string) => `• ${b}`)
      .join("\n");
    const newBullets = (newExp?.bullets || [])
      .map((b: string) => `• ${b}`)
      .join("\n");

    const changes: { label: string; oldVal: string; newVal: string }[] = [];
    if (oldOrg !== newOrg) {
      changes.push({
        label: isExp ? "Perusahaan" : "Institusi",
        oldVal: oldOrg || "-",
        newVal: newOrg || "-",
      });
    }
    if (oldRole !== newRole) {
      changes.push({
        label: isExp ? "Jabatan / Posisi" : "Gelar / Bidang Studi",
        oldVal: oldRole || "-",
        newVal: newRole || "-",
      });
    }
    if (oldDur !== newDur) {
      changes.push({
        label: "Durasi / Periode",
        oldVal: oldDur,
        newVal: newDur,
      });
    }
    if (isExp && oldLoc !== newLoc) {
      changes.push({ label: "Lokasi", oldVal: oldLoc, newVal: newLoc });
    }

    return (
      <div className="flex flex-col gap-4">
        {changes.length > 0 && (
          <div className="flex flex-col gap-2.5 border border-border/40 p-3.5 rounded-xl bg-muted/10">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Detail Informasi
            </span>
            <div className="grid grid-cols-1 gap-2">
              {changes.map((c, idx) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: simple static changes list
                  key={idx}
                  className="flex flex-col gap-1 border-b border-border/30 pb-1.5 last:border-0 last:pb-0"
                >
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {c.label}
                  </span>
                  <div className="flex items-center flex-wrap gap-2 text-xs">
                    <span className="line-through text-red-600 bg-red-500/10 px-1.5 py-0.5 rounded">
                      {c.oldVal}
                    </span>
                    <span className="text-muted-foreground text-[10px]">➔</span>
                    <span className="text-green-700 dark:text-green-300 bg-green-500/15 px-1.5 py-0.5 rounded font-semibold">
                      {c.newVal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Tanggung Jawab & Deskripsi (Poin Peluru)
          </span>
          <DiffText oldText={oldBullets} newText={newBullets} />
        </div>
      </div>
    );
  }

  if (tab === "skills-others") {
    const serializeSkills = (list: unknown[]) => {
      return (list || [])
        .map((listItem) => {
          const item = listItem as {
            category?: string;
            year?: string;
            description?: string;
          };
          const categoryStr = item.category
            ? `[${item.category}]`
            : "[Kategori Tanpa Nama]";
          const yearStr = item.year ? ` (${item.year})` : "";
          const descStr = item.description ? `: ${item.description}` : "";
          return `${categoryStr}${yearStr}${descStr}`;
        })
        .join("\n");
    };

    const oldText = serializeSkills(oldVal as unknown[]);
    const newText = serializeSkills(newVal as unknown[]);

    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Keahlian & Pencapaian Lainnya
        </span>
        <DiffText oldText={oldText} newText={newText} />
      </div>
    );
  }

  return null;
}
