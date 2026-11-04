import { forwardRef, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { AppState, Msg, Reaction, Side } from "@/lib/types";
import { getTheme } from "@/lib/themes";
import { initials } from "@/lib/utils";

/* ---------- ikon ---------- */
const Chevron = ({ size = 10 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.2 1.5 6.8 5 3.2 8.5" />
  </svg>
);

const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
const VideoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7.5" width="15.5" height="13" rx="4" />
    <path d="M19.5 12.5l5.2-3.2v9.4l-5.2-3.2z" />
  </svg>
);
const PlusIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
    <path d="M13 4.5v17M4.5 13h17" />
  </svg>
);
const WaveIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
    <path d="M3.5 10v4M7.7 6.5v11M12 3.5v17M16.3 7.5v9M20.5 10v4" />
  </svg>
);

const Tail = () => (
  <svg className="tail" viewBox="0 0 20 18" aria-hidden>
    <path d="M3 0H13C13 9 15 15 20 18C14 19.4 7 18.2 3 15Z" />
  </svg>
);

const ReactionIcon = ({ kind }: { kind: Reaction }) => {
  switch (kind) {
    case "heart":
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case "like":
    case "dislike":
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff" style={kind === "dislike" ? { transform: "scaleX(-1) rotate(180deg)" } : undefined}>
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
        </svg>
      );
    case "haha":
      return <span className="rx-txt" style={{ fontSize: 9.5, lineHeight: "10px", textAlign: "center" }}>HA<br />HA</span>;
    case "emphasis":
      return <span className="rx-txt" style={{ fontSize: 19 }}>!!</span>;
    case "question":
      return <span className="rx-txt" style={{ fontSize: 20 }}>?</span>;
  }
};

/* ---------- potongan kecil ---------- */
function Reactions({ m }: { m: Msg }) {
  const list = (["me", "them"] as Side[]).filter((s) => m.reactions[s]);
  if (!list.length) return null;
  return (
    <div className="rx">
      {list.map((s) => (
        <div key={s} className={`rxb ${s}`}>
          <ReactionIcon kind={m.reactions[s]!} />
        </div>
      ))}
    </div>
  );
}

function BubbleBody({ m, tail }: { m: Msg; tail: boolean }) {
  const hasRx = !!(m.reactions.me || m.reactions.them);
  if (m.kind === "image") {
    return (
      <div className={`bw ${m.from} ${hasRx ? "hasrx" : ""}`}>
        <img className="photo" src={m.image} alt="" draggable={false} />
        <Reactions m={m} />
      </div>
    );
  }
  return (
    <div className={`bw ${m.from} ${hasRx ? "hasrx" : ""}`}>
      <div className="b">{m.text || " "}</div>
      {tail && <Tail />}
      <Reactions m={m} />
    </div>
  );
}

function Stamp({ m }: { m: Msg }) {
  return (
    <div className="ts">
      <b>{m.day}</b> {m.time}
    </div>
  );
}

function Status({ m }: { m: Msg }) {
  if (m.status === "none") return null;
  return (
    <div className={`st ${m.from}`}>
      {m.status === "Read" ? (
        <>
          <b>Read</b> {m.statusTime}
        </>
      ) : (
        <b>{m.status}{m.statusTime ? ` ${m.statusTime}` : ""}</b>
      )}
    </div>
  );
}

/* ---------- Phone ---------- */
function useGrain() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 180;
    const x = c.getContext("2d")!;
    const d = x.createImageData(180, 180);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() < 0.5 ? 255 : 90;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = Math.random() * 38;
    }
    x.putImageData(d, 0, 0);
    setUrl(c.toDataURL("image/png"));
  }, []);
  return url;
}

const Phone = forwardRef<HTMLDivElement, { state: AppState; scrollable?: boolean; fullBleed?: boolean; groupMembers?: string[] }>(function Phone({ state, scrollable = false, fullBleed = false, groupMembers = [] }, ref) {
  const grain = useGrain();
  const { contact, wallpaper, messages, frame, screenW, screenH } = state;
  const theme = getTheme(wallpaper.themeId);
  const sms = contact.service === "sms";
  const byId = new Map(messages.map((m) => [m.id, m]));
  const replyCount = new Map<string, number>();
  messages.forEach((m) => {
    if (m.replyTo && byId.has(m.replyTo)) replyCount.set(m.replyTo, (replyCount.get(m.replyTo) ?? 0) + 1);
  });
  const isReply = (m?: Msg) => !!(m && m.replyTo && byId.has(m.replyTo));

  const style = {
    "--w": `${screenW}px`,
    "--h": `${screenH}px`,
    "--bubble": theme.bubble,
    "--btext": theme.bubbleText,
    "--me": sms ? "#34c759" : "#2f8bf7",
    "--meta": theme.meta,
    "--link": theme.link,
    "--glass": theme.glass,
    "--glass-border": theme.glassBorder,
  } as CSSProperties;

  const items: ReactNode[] = [];
  messages.forEach((m, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const reply = isReply(m);
    const startsGroup = !prev || prev.from !== m.from || reply || m.showTime;
    const lastInGroup = !next || next.from !== m.from || isReply(next) || next.showTime;
    const gap = i === 0 ? 0 : reply ? 16 : startsGroup ? 12 : 2;
    const rxExtra = m.reactions.me || m.reactions.them ? 14 : 0;
    const count = replyCount.get(m.id) ?? 0;

    if (m.showTime) items.push(<Stamp key={m.id + "t"} m={m} />);

    if (reply) {
      const o = byId.get(m.replyTo!)!;
      const same = o.from === m.from;
      items.push(
        <div key={m.id} className="rwrap" style={{ marginTop: gap + rxExtra }}>
          <div className={`qrow ${o.from}`}>
            {o.kind === "image" ? (
              <img className={`q qimg ${o.from}`} src={o.image} alt="" draggable={false} />
            ) : (
              <div className={`q ${o.from}`}>{o.text}</div>
            )}
          </div>
          <div className={`rrow ${o.from}`}>
            <svg className="curve" width="40" height="36" viewBox="0 0 40 36" fill="none" aria-hidden>
              <path d="M4 0C4 22 8 29 36 29" stroke="var(--curve)" strokeWidth="3" strokeLinecap="round" />
            </svg>
            {!same && <div className="sp" />}
            <div className={`row inner ${m.from}`}>
              <BubbleBody m={m} tail={lastInGroup} />
              <Status m={m} />
            </div>
          </div>
        </div>
      );
    } else {
      items.push(
        <div key={m.id} className={`row ${m.from}`} style={{ marginTop: gap + rxExtra }}>
          <BubbleBody m={m} tail={lastInGroup} />
          {count > 0 && (
            <div className={`rc ${m.from}`}>
              {count} {count === 1 ? "Reply" : "Replies"} <Chevron size={9} />
            </div>
          )}
          <Status m={m} />
        </div>
      );
    }
  });

  const bg = wallpaper.custom ? `center / cover no-repeat url("${wallpaper.custom}")` : theme.bg;
  const darkCurve = theme.bubble;

  return (
    <div ref={ref} className={`phone ${frame} ${scrollable ? "scrollable" : ""} ${fullBleed ? "full-bleed" : ""}`} style={{ ...style, ["--curve" as string]: darkCurve }}>
      <div className="wp" style={{ background: bg }} />
      {wallpaper.grain && grain && <div className="grain" style={{ backgroundImage: `url(${grain})` }} />}

      <div className="msgs">{items}</div>

      {/* header */}
      <div className="hdr">
        <div className="glass circ back"><BackIcon /></div>
        {contact.showVideo && <div className="glass circ vid"><VideoIcon /></div>}
        <div className="ctr">
          <div className="pfp">
            {contact.pfp ? <img src={contact.pfp} alt="" draggable={false} /> : <span>{initials(contact.name)}</span>}
          </div>
          <div className="glass pill">
            <span>{contact.name || "Nama"}</span>
            <i><Chevron size={9} /></i>
          </div>
          {groupMembers.length > 0 && <small className="group-members">{groupMembers.join(", ")}</small>}
        </div>
      </div>

      {/* input bar */}
      {contact.showInput && (
        <div className="bar">
          <div className="glass circ plus"><PlusIcon /></div>
          <div className="glass field">
            <span style={{ color: theme.placeholder }}>{sms ? "Text Message" : "iMessage"}</span>
            <WaveIcon color={theme.placeholder} />
          </div>
        </div>
      )}
    </div>
  );
});

export default Phone;
