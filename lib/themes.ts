export interface Theme {
  id: string;
  name: string;
  bg: string;
  bubble: string; // bubble lawan bicara
  bubbleText: string;
  meta: string; // timestamp / status
  link: string; // "1 Reply"
  glass: string; // tombol kaca
  glassBorder: string;
  placeholder: string;
}

export const THEMES: Theme[] = [
  {
    id: "rose",
    name: "Rose",
    bg:
      "radial-gradient(120% 55% at 15% 48%, rgba(226,148,176,.6), transparent 62%)," +
      "linear-gradient(180deg,#d9c3b5 0%,#dcaab1 32%,#dd9fb4 52%,#dbaaa8 74%,#d7bfae 100%)",
    bubble: "#7b5c57",
    bubbleText: "#fff",
    meta: "rgba(90,60,58,.62)",
    link: "rgba(255,248,240,.92)",
    glass: "rgba(122,88,80,.40)",
    glassBorder: "rgba(255,238,215,.55)",
    placeholder: "rgba(255,255,255,.62)",
  },
  {
    id: "ocean",
    name: "Ocean",
    bg:
      "radial-gradient(110% 50% at 80% 40%, rgba(120,165,235,.65), transparent 62%)," +
      "linear-gradient(180deg,#c9d7ea 0%,#9db9e2 40%,#8fb0e0 58%,#b4c7e4 80%,#d3dcea 100%)",
    bubble: "#5b6a86",
    bubbleText: "#fff",
    meta: "rgba(45,60,90,.6)",
    link: "rgba(255,255,255,.92)",
    glass: "rgba(70,90,125,.38)",
    glassBorder: "rgba(235,245,255,.6)",
    placeholder: "rgba(255,255,255,.65)",
  },
  {
    id: "sage",
    name: "Sage",
    bg:
      "radial-gradient(110% 50% at 20% 50%, rgba(150,195,150,.6), transparent 62%)," +
      "linear-gradient(180deg,#d8dccb 0%,#a9c4a4 40%,#9dbd9f 58%,#c4d3bd 80%,#dfe2d2 100%)",
    bubble: "#5f745c",
    bubbleText: "#fff",
    meta: "rgba(50,72,50,.6)",
    link: "rgba(255,255,255,.92)",
    glass: "rgba(80,105,78,.38)",
    glassBorder: "rgba(240,255,235,.6)",
    placeholder: "rgba(255,255,255,.65)",
  },
  {
    id: "lilac",
    name: "Lilac",
    bg:
      "radial-gradient(110% 50% at 75% 45%, rgba(185,160,225,.65), transparent 62%)," +
      "linear-gradient(180deg,#e0d6ea 0%,#bba6de 40%,#b79fdc 58%,#d3c6e6 80%,#e6dcee 100%)",
    bubble: "#6e5c8f",
    bubbleText: "#fff",
    meta: "rgba(75,55,105,.6)",
    link: "rgba(255,255,255,.92)",
    glass: "rgba(110,90,145,.38)",
    glassBorder: "rgba(248,238,255,.6)",
    placeholder: "rgba(255,255,255,.65)",
  },
  {
    id: "sunset",
    name: "Sunset",
    bg:
      "radial-gradient(110% 50% at 20% 45%, rgba(240,140,115,.6), transparent 62%)," +
      "linear-gradient(180deg,#f2d9b9 0%,#efb08f 40%,#ee9a86 58%,#f0c3a6 80%,#f4dcc0 100%)",
    bubble: "#8b5a49",
    bubbleText: "#fff",
    meta: "rgba(110,60,40,.62)",
    link: "rgba(255,255,255,.95)",
    glass: "rgba(140,88,70,.38)",
    glassBorder: "rgba(255,238,215,.6)",
    placeholder: "rgba(255,255,255,.68)",
  },
  {
    id: "night",
    name: "Night",
    bg:
      "radial-gradient(110% 50% at 80% 50%, rgba(80,60,120,.55), transparent 62%)," +
      "linear-gradient(180deg,#17171a 0%,#221f2b 45%,#1a1a22 70%,#101013 100%)",
    bubble: "#3a3a3d",
    bubbleText: "#fff",
    meta: "rgba(235,235,245,.55)",
    link: "rgba(235,235,245,.7)",
    glass: "rgba(120,120,128,.32)",
    glassBorder: "rgba(255,255,255,.22)",
    placeholder: "rgba(235,235,245,.5)",
  },
  {
    id: "plain",
    name: "Putih",
    bg: "#ffffff",
    bubble: "#e9e9eb",
    bubbleText: "#000",
    meta: "rgba(60,60,67,.6)",
    link: "rgba(60,60,67,.6)",
    glass: "rgba(120,120,128,.14)",
    glassBorder: "rgba(60,60,67,.12)",
    placeholder: "rgba(60,60,67,.35)",
  },
];

export const getTheme = (id: string) => THEMES.find((t) => t.id === id) ?? THEMES[0];
