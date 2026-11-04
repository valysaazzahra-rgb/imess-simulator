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

export const defaultState = (): AppState => {
  return {
    contact: { name: "", service: "imessage", showVideo: true, showInput: true },
    wallpaper: { themeId: "rose", grain: true },
    messages: [],
    frame: "screen",
    screenW: 414,
    screenH: 843,
  };
};
