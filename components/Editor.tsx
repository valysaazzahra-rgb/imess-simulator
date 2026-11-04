"use client";
import { useRef, useState } from "react";
import { REACTIONS, newMsg, type AppState, type Msg, type Reaction, type Side, type StatusKind } from "@/lib/types";
import { THEMES } from "@/lib/themes";
import { fileToDataUrl } from "@/lib/utils";

type Set = (fn: (s: AppState) => AppState) => void;

const Seg = <T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { id: T; label: string }[] }) => (
  <div className="seg">
    {options.map((o) => (
      <button key={o.id} type="button" className={value === o.id ? "on" : ""} onClick={() => onChange(o.id)}>
        {o.label}
      </button>
    ))}
  </div>
);

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="card">
    <h2>{title}</h2>
    {children}
  </section>
);

const preview = (m: Msg) => (m.kind === "image" ? "📷 Foto" : m.text.slice(0, 28) || "(kosong)");

function MessageItem({ m, i, all, set, last }: { m: Msg; i: number; all: Msg[]; set: Set; last: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const patch = (p: Partial<Msg>) => set((s) => ({ ...s, messages: s.messages.map((x) => (x.id === m.id ? { ...x, ...p } : x)) }));
  const move = (d: -1 | 1) =>
    set((s) => {
      const a = [...s.messages];
      const j = i + d;
      if (j < 0 || j >= a.length) return s;
      [a[i], a[j]] = [a[j], a[i]];
      return { ...s, messages: a };
    });
  const del = () =>
    set((s) => ({
      ...s,
      messages: s.messages.filter((x) => x.id !== m.id).map((x) => (x.replyTo === m.id ? { ...x, replyTo: undefined } : x)),
    }));
  const dup = () =>
    set((s) => {
      const a = [...s.messages];
      a.splice(i + 1, 0, { ...m, id: newMsg({ from: m.from }).id, replyTo: undefined, status: "none", showTime: false });
      return { ...s, messages: a };
    });
  const setRx = (side: Side, v: string) => patch({ reactions: { ...m.reactions, [side]: v || undefined } });

  return (
    <div className={`msg ${m.from}`}>
      <div className="msg-top">
        <button type="button" className={`who ${m.from}`} onClick={() => patch({ from: m.from === "me" ? "them" : "me" })} title="Tukar pengirim">
          {m.from === "me" ? "Aku" : "Dia"}
        </button>
        <span className="idx">#{i + 1}</span>
        <div className="sp" />
        <button type="button" className="ib" onClick={() => move(-1)} disabled={i === 0} title="Naik">↑</button>
        <button type="button" className="ib" onClick={() => move(1)} disabled={last} title="Turun">↓</button>
        <button type="button" className="ib" onClick={dup} title="Duplikat">⧉</button>
        <button type="button" className="ib danger" onClick={del} title="Hapus">✕</button>
      </div>

      {m.kind === "text" ? (
        <textarea rows={2} value={m.text} onChange={(e) => patch({ text: e.target.value })} placeholder="Tulis pesan…" />
      ) : (
        <div className="imgrow">
          <img src={m.image} alt="" />
          <button type="button" className="btn sm" onClick={() => fileRef.current?.click()}>Ganti foto</button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) patch({ image: await fileToDataUrl(f, 1200) });
            e.target.value = "";
          }} />
        </div>
      )}

      <details>
        <summary>Opsi: reply · reaction · status · timestamp</summary>
        <div className="grid2">
          <label>Reply ke
            <select value={m.replyTo ?? ""} onChange={(e) => patch({ replyTo: e.target.value || undefined })}>
              <option value="">— bukan reply —</option>
              {all.filter((x) => x.id !== m.id).map((x) => (
                <option key={x.id} value={x.id}>#{all.indexOf(x) + 1} {x.from === "me" ? "Aku" : "Dia"}: {preview(x)}</option>
              ))}
            </select>
          </label>
          <label>Status
            <select value={m.status} onChange={(e) => patch({ status: e.target.value as StatusKind })}>
              <option value="none">Tidak ada</option>
              <option value="Sent">Sent</option>
              <option value="Delivered">Delivered</option>
              <option value="Read">Read</option>
            </select>
          </label>
          <label>Reaksi dari Dia
            <select value={m.reactions.them ?? ""} onChange={(e) => setRx("them", e.target.value)}>
              <option value="">—</option>
              {REACTIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </label>
          <label>Reaksi dari Aku
            <select value={m.reactions.me ?? ""} onChange={(e) => setRx("me", e.target.value)}>
              <option value="">—</option>
              {REACTIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </label>
          {m.status !== "none" && (
            <label className="span2">Jam status (mis. 19.52)
              <input value={m.statusTime} onChange={(e) => patch({ statusTime: e.target.value })} placeholder="opsional" />
            </label>
          )}
          <label className="chk span2">
            <input type="checkbox" checked={m.showTime} onChange={(e) => patch({ showTime: e.target.checked })} /> Tampilkan timestamp di atas pesan ini
          </label>
          {m.showTime && (
            <>
              <label>Hari<input value={m.day} onChange={(e) => patch({ day: e.target.value })} /></label>
              <label>Jam<input value={m.time} onChange={(e) => patch({ time: e.target.value })} /></label>
            </>
          )}
        </div>
      </details>
    </div>
  );
}

export default function Editor({ state, set, onPreview, onReset }: {
  state: AppState; set: Set; onPreview: () => void; onReset: () => void;
}) {
  const { contact, wallpaper, messages } = state;
  const pfpRef = useRef<HTMLInputElement>(null);
  const wpRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [side, setSide] = useState<Side>("them");

  const setContact = (p: Partial<AppState["contact"]>) => set((s) => ({ ...s, contact: { ...s.contact, ...p } }));
  const setWp = (p: Partial<AppState["wallpaper"]>) => set((s) => ({ ...s, wallpaper: { ...s.wallpaper, ...p } }));
  const add = (m: Msg) => set((s) => ({ ...s, messages: [...s.messages, m] }));
  const addText = () => {
    if (!draft.trim()) return;
    add(newMsg({ from: side, text: draft.trim() }));
    setDraft("");
  };

  return (
    <div className="editor">
      <Card title="Kontak">
        <label>Nama kontak
          <input value={contact.name} onChange={(e) => setContact({ name: e.target.value })} placeholder="mis. RD" />
        </label>
        <div className="row-btns">
          <button type="button" className="btn" onClick={() => pfpRef.current?.click()}>Upload foto profil</button>
          {contact.pfp && <button type="button" className="btn ghost" onClick={() => setContact({ pfp: undefined })}>Hapus</button>}
          <input ref={pfpRef} type="file" accept="image/*" hidden onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) setContact({ pfp: await fileToDataUrl(f, 400, true) });
            e.target.value = "";
          }} />
        </div>
        <div className="field-row">
          <span>Layanan</span>
          <Seg value={contact.service} onChange={(v) => setContact({ service: v })} options={[{ id: "imessage", label: "iMessage (biru)" }, { id: "sms", label: "SMS (hijau)" }]} />
        </div>
        <label className="chk"><input type="checkbox" checked={contact.showVideo} onChange={(e) => setContact({ showVideo: e.target.checked })} /> Tombol video</label>
        <label className="chk"><input type="checkbox" checked={contact.showInput} onChange={(e) => setContact({ showInput: e.target.checked })} /> Input bar di bawah</label>
      </Card>

      <Card title="Wallpaper">
        <div className="swatches">
          {THEMES.map((t) => (
            <button key={t.id} type="button" title={t.name}
              className={`sw ${!wallpaper.custom && wallpaper.themeId === t.id ? "on" : ""}`}
              style={{ background: t.bg }}
              onClick={() => setWp({ themeId: t.id, custom: undefined })} />
          ))}
          <button type="button" className={`sw up ${wallpaper.custom ? "on" : ""}`}
            style={wallpaper.custom ? { background: `center/cover url(${wallpaper.custom})` } : undefined}
            onClick={() => wpRef.current?.click()} title="Upload wallpaper">{wallpaper.custom ? "" : "+"}</button>
          <input ref={wpRef} type="file" accept="image/*" hidden onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) setWp({ custom: await fileToDataUrl(f, 1600) });
            e.target.value = "";
          }} />
        </div>
        <label className="chk"><input type="checkbox" checked={wallpaper.grain} onChange={(e) => setWp({ grain: e.target.checked })} /> Efek grain</label>
        <p className="hint">Warna bubble lawan bicara mengikuti tema wallpaper. Wallpaper upload memakai warna tema yang terakhir dipilih.</p>
      </Card>

      <Card title="Layar & preview">
        <div className="field-row">
          <span>Ukuran</span>
          <select value={state.frame === "long" ? "long" : `${state.screenW}x${state.screenH}`}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "long") set((s) => ({ ...s, frame: "long" }));
              else {
                const [w, h] = v.split("x").map(Number);
                set((s) => ({ ...s, frame: "screen", screenW: w, screenH: h }));
              }
            }}>
            <option value="414x843">Seperti referensi (414×843)</option>
            <option value="393x852">iPhone 15/16 (393×852)</option>
            <option value="402x874">iPhone 16 Pro (402×874)</option>
            <option value="430x932">iPhone Pro Max (430×932)</option>
            <option value="long">Panjang (semua pesan)</option>
          </select>
        </div>
        <button type="button" className="btn primary wide" onClick={onPreview}>
          Lihat preview chat
        </button>
      </Card>

      <Card title={`Pesan (${messages.length})`}>
        <div className="composer">
          <div className="field-row">
            <Seg value={side} onChange={setSide} options={[{ id: "them", label: "Dia" }, { id: "me", label: "Aku" }]} />
            <button type="button" className="btn sm" onClick={() => photoRef.current?.click()}>+ Foto</button>
            <input ref={photoRef} type="file" accept="image/*" hidden onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) add(newMsg({ from: side, kind: "image", image: await fileToDataUrl(f, 1200) }));
              e.target.value = "";
            }} />
          </div>
          <textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ketik pesan lalu Ctrl/⌘+Enter…"
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); addText(); } }} />
          <button type="button" className="btn primary wide" onClick={addText}>Tambah pesan</button>
        </div>
        <div className="msglist">
          {messages.map((m, i) => (
            <MessageItem key={m.id} m={m} i={i} all={messages} set={set} last={i === messages.length - 1} />
          ))}
          {!messages.length && <p className="hint">Belum ada pesan.</p>}
        </div>
      </Card>

      <button type="button" className="btn ghost wide" onClick={onReset}>Reset ke contoh awal</button>
    </div>
  );
}
