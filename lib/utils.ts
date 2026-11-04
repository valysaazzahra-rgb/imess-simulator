/** Baca file gambar, kecilkan (maks `max` px) lalu jadikan data URL. */
export async function fileToDataUrl(file: File, max = 1400, square = false): Promise<string> {
  const bmp = await createImageBitmap(file);
  let sx = 0,
    sy = 0,
    sw = bmp.width,
    sh = bmp.height;
  if (square) {
    const s = Math.min(bmp.width, bmp.height);
    sx = (bmp.width - s) / 2;
    sy = (bmp.height - s) / 2;
    sw = sh = s;
  }
  const scale = Math.min(1, max / Math.max(sw, sh));
  const cw = Math.round(sw * scale);
  const ch = Math.round(sh * scale);
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, cw, ch);
  return canvas.toDataURL("image/jpeg", 0.9);
}

export const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
};
