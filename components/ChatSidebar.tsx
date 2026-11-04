"use client";
import { useState } from "react";
import type { ChatDraft } from "@/lib/types";

export default function ChatSidebar({ chats, activeId, onSelect, onCreate }: {
  chats: ChatDraft[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: (group: boolean, name: string, participants: string[]) => void;
}) {
  const [creating, setCreating] = useState<"chat" | "group" | null>(null);
  const [name, setName] = useState("");
  const [members, setMembers] = useState("");
  const submit = () => {
    const participants = members.split(",").map((x) => x.trim()).filter(Boolean);
    if (creating === "group" && participants.length < 2) return;
    onCreate(creating === "group", name.trim(), participants);
    setCreating(null);
    setName("");
    setMembers("");
  };

  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar-title"><strong>Draft chat</strong><span>{chats.length}</span></div>
      <button className="btn primary wide" type="button" onClick={() => { setCreating("chat"); setName(""); setMembers(""); }}>+ Chat baru</button>
      <button className="btn wide" type="button" onClick={() => { setCreating("group"); setName(""); setMembers(""); }}>+ Group chat</button>

      {creating && <div className="new-chat-form">
        <strong>{creating === "group" ? "Buat group chat" : "Buat chat"}</strong>
        <label>{creating === "group" ? "Nama grup" : "Nama kontak"}
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={creating === "group" ? "mis. Teman dekat" : "mis. Alex"} />
        </label>
        {creating === "group" && <label>Anggota (pisahkan dengan koma)
          <textarea rows={3} value={members} onChange={(e) => setMembers(e.target.value)} placeholder="Alex, Bima" />
          <small>Masukkan minimal 2 anggota.</small>
        </label>}
        <button type="button" className="btn primary wide" onClick={submit} disabled={creating === "group" && members.split(",").filter((x) => x.trim()).length < 2}>Buat</button>
        <button type="button" className="btn ghost wide" onClick={() => setCreating(null)}>Batal</button>
      </div>}

      <nav className="chat-list" aria-label="Daftar draft chat">
        {chats.map((chat) => {
          const name = chat.state.contact.name || (chat.group ? "Group tanpa nama" : "Chat baru");
          const last = chat.state.messages.at(-1);
          const snippet = last ? last.kind === "image" ? "📷 Foto" : last.text || "Pesan kosong" : chat.group ? `${chat.participants.length} anggota` : "Belum ada pesan";
          return <button type="button" key={chat.id} className={`chat-list-item ${activeId === chat.id ? "active" : ""}`} onClick={() => onSelect(chat.id)}>
            <span className={`chat-avatar ${chat.group ? "group" : ""}`}>{chat.group ? "👥" : name.slice(0, 1).toUpperCase()}</span>
            <span className="chat-list-copy"><strong>{name}</strong><small>{chat.group ? "Grup · " : ""}{snippet}</small></span>
          </button>;
        })}
      </nav>
    </aside>
  );
}
