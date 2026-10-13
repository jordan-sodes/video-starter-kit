// Serves work/ at http://localhost:8765 so voiceover takes pages can play audio
// (a browser can't play audio from a page opened as a plain file). Used by "takes" in .claude/launch.json.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { ROOT } from "./lib.mjs";

const base = path.join(ROOT, "work");
const types = {
  ".html": "text/html; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".json": "application/json",
  ".md": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};
http
  .createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = path.normalize(path.join(base, url));
    if (!file.startsWith(base)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      const list = fs.existsSync(base)
        ? fs
            .readdirSync(base)
            .map((d) => `<li><a href="/${d}/takes/index.html">${d}</a></li>`)
            .join("")
        : "";
      return res
        .writeHead(404, { "Content-Type": "text/html" })
        .end(`<p>Not found. Videos:</p><ul>${list}</ul>`);
    }
    const size = fs.statSync(file).size;
    const type = types[path.extname(file)] || "application/octet-stream";
    const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
    if (range) {
      const start = +range[1] || 0;
      const end = range[2] ? +range[2] : size - 1;
      res.writeHead(206, {
        "Content-Type": type,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
      });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": size,
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(8765, () => console.log("Takes pages at http://localhost:8765"));
