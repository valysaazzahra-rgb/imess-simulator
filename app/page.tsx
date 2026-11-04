"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Editor from "@/components/Editor";
import ChatSidebar from "@/components/ChatSidebar";
import Phone from "@/components/Phone";
import { defaultState, uid, type AppState, type ChatDraft } from "@/lib/types";

const KEY = "imessage-sim:v1";
const starterMessages = ["", "stunning", "jadi ke sency?", "gitu doang?", "you look amazing bb", "jadi :D"];

function isStarterExample(state: AppState) {
  return state.contact?.name === "RD"
    && state.messages?.length === starterMessages.length
    && state.messages.every((message, index) => message.text === starterMessages[index])
    && state.messages[0].kind === "image";
}

export default function Page() {
  const [chats, setChats] = useState<ChatDraft[]>(() => [{ id: uid(), group: false, participants: [], state: defaultState() }]);
  const [activeId, setActiveId] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [phoneH, setPhoneH] = useState(843);
  const activeChat = chats.find((chat) => chat.id === activeId) ?? chats[0];
  const state = activeChat?.state ?? defaultState();

  // muat draft tersimpan
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.chats) && saved.chats.length) {
          const restored = saved.chats.filter((chat: ChatDraft) => !isStarterExample(chat.state));
          const nextChats = restored.length ? restored : [{ id: uid(), group: false, participants: [], state: defaultState() }];
          setChats(nextChats);
          setActiveId(saved.activeId && nextChats.some((chat: ChatDraft) => chat.id === saved.activeId) ? saved.activeId : nextChats[0].id);
        } else {
          const id = uid();
          const savedState = { ...defaultState(), ...saved } as AppState;
          setChats([{ id, group: false, participants: [], state: isStarterExample(savedState) ? defaultState() : savedState }]);
          setActiveId(id);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  // simpan draft (diam-diam gagal kalau kuota penuh)
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ chats, activeId: activeChat?.id ?? activeId }));
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [chats, activeId, activeChat?.id, loaded]);

  // skala preview supaya muat di layar kecil
  useLayoutEffect(() => {
    const box = boxRef.current;
    const ph = phoneRef.current;
    if (!box || !ph) return;
    const update = () => {
      const avail = box.clientWidth;
      setScale(Math.min(1, avail / ph.offsetWidth));
      setPhoneH(ph.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    ro.observe(ph);
    return () => ro.disconnect();
  }, [showPreview, fullscreenPreview]);

  useEffect(() => {
    if (!fullscreenPreview) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreenPreview(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreenPreview]);

  const set = useCallback((fn: (s: AppState) => AppState) => {
    setChats((current) => current.map((chat) => chat.id === activeId ? { ...chat, state: fn(chat.state) } : chat));
  }, [activeId]);

  const createChat = (group: boolean, name: string, participants: string[]) => {
    const next = defaultState();
    next.contact = { ...next.contact, name: name || (group ? "Group chat" : "Nama kontak"), pfp: undefined };
    next.messages = [];
    const chat: ChatDraft = { id: uid(), group, participants, state: next };
    setChats((current) => [...current, chat]);
    setActiveId(chat.id);
    setShowPreview(false);
    setFullscreenPreview(false);
  };

  return (
    <main className="app">
      <div className="left">
        <header className="top">
          <h1>iMessage Simulator</h1>
          <p>Susun draft chat, lalu buka preview untuk mengambil screenshot.</p>
        </header>
        <div className="editor-workspace">
          <ChatSidebar chats={chats} activeId={activeChat?.id ?? ""} onSelect={(id) => { setActiveId(id); setShowPreview(false); setFullscreenPreview(false); }} onCreate={createChat} />
          <Editor
            state={state}
            set={set}
            onPreview={() => setShowPreview(true)}
            onReset={() => confirm("Reset draft chat ini ke contoh awal?") && set((current) => {
              const fresh = defaultState();
              if (activeChat?.group) fresh.contact.name = activeChat.state.contact.name;
              return fresh;
            })}
          />
        </div>
      </div>

      <div className="right">
        {showPreview ? (
          <section className={`preview-panel ${fullscreenPreview ? "fullscreen" : ""}`} aria-label="Preview percakapan">
            <div className="preview-toolbar">
              <div><strong>Preview chat</strong><span>Scroll percakapan, lalu screenshot sesuai bagian yang diinginkan.</span></div>
              <div className="preview-actions">
                <button type="button" className="btn" onClick={() => setFullscreenPreview((value) => !value)}>
                  {fullscreenPreview ? "Keluar layar penuh" : "Layar penuh"}
                </button>
                <button type="button" className="btn" onClick={() => { setFullscreenPreview(false); setShowPreview(false); }}>Kembali ke editor</button>
              </div>
            </div>
            <div className="preview-scroll" ref={boxRef}>
              <div className="stage" style={{ maxWidth: state.screenW }}>
                <div className="scaler" style={{ height: phoneH * scale, width: state.screenW * scale }}>
                  <div style={{ width: state.screenW, transform: `scale(${scale})`, transformOrigin: "top left" }}>
                    <Phone ref={phoneRef} state={state} scrollable fullBleed={fullscreenPreview} groupMembers={activeChat?.group ? activeChat.participants : []} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : <div className="preview-placeholder">Preview percakapan akan tampil di sini.</div>}
      </div>
    </main>
  );
}
