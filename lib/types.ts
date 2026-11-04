export type Side = "me" | "them";
export type Reaction = "heart" | "like" | "dislike" | "haha" | "emphasis" | "question";
export type StatusKind = "none" | "Sent" | "Delivered" | "Read";

export interface Msg {
  id: string;
  from: Side;
  kind: "text" | "image";
  text: string;
  image?: string;
  replyTo?: string;
  reactions: { me?: Reaction; them?: Reaction };
  status: StatusKind;
  statusTime: string;
  showTime: boolean;
  day: string;
  time: string;
}

export interface Contact {
  name: string;
  pfp?: string;
  service: "imessage" | "sms";
  showVideo: boolean;
  showInput: boolean;
}

export interface Wallpaper {
  themeId: string;
  custom?: string;
  grain: boolean;
}

export interface AppState {
  contact: Contact;
  wallpaper: Wallpaper;
  messages: Msg[];
  frame: "screen" | "long";
  screenW: number;
  screenH: number;
}

export interface ChatDraft {
  id: string;
  group: boolean;
  participants: string[];
  state: AppState;
}

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
};

export const newMsg = (p: Partial<Msg> & { from: Side }): Msg => ({
  id: uid(),
  kind: "text",
  text: "",
  reactions: {},
  status: "none",
  statusTime: "",
  showTime: false,
  day: "Today",
  time: nowTime(),
  ...p,
});

export const REACTIONS: { id: Reaction; label: string }[] = [
  { id: "heart", label: "❤️ Love" },
  { id: "like", label: "👍 Like" },
  { id: "dislike", label: "👎 Dislike" },
  { id: "haha", label: "HAHA" },
  { id: "emphasis", label: "‼️ Emphasis" },
  { id: "question", label: "❓ Question" },
];

/** Placeholder foto (SVG) — user bisa ganti dengan foto sendiri. */
export const PLACEHOLDER_PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='528' height='704' viewBox='0 0 528 704'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#b9a79c'/><stop offset='.5' stop-color='#8d6f66'/><stop offset='1' stop-color='#5c4440'/>
      </linearGradient></defs>
      <rect width='528' height='704' fill='url(#g)'/>
      <g fill='none' stroke='rgba(255,255,255,.85)' stroke-width='14' stroke-linecap='round' stroke-linejoin='round'>
        <rect x='184' y='290' width='160' height='124' rx='22'/>
        <circle cx='264' cy='352' r='34'/>
        <path d='M226 290l12-24h52l12 24'/>
      </g>
    </svg>`
  );

export const defaultState = (): AppState => {
  const m1 = newMsg({ from: "me", kind: "image", image: PLACEHOLDER_PHOTO, showTime: true, day: "Today", time: "19.48" });
  const m2 = newMsg({ from: "them", text: "stunning" });
  const m3 = newMsg({ from: "them", text: "jadi ke sency?" });
  const m4 = newMsg({ from: "me", text: "gitu doang?", replyTo: m2.id });
  const m5 = newMsg({ from: "them", text: "you look amazing bb", reactions: { me: "heart" } });
  const m6 = newMsg({ from: "me", text: "jadi :D", replyTo: m3.id, status: "Delivered" });
  return {
    contact: { name: "RD", service: "imessage", showVideo: true, showInput: true },
    wallpaper: { themeId: "rose", grain: true },
    messages: [m1, m2, m3, m4, m5, m6],
    frame: "screen",
    screenW: 414,
    screenH: 843,
  };
};
