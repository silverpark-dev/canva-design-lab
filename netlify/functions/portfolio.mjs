import { getStore } from "@netlify/blobs";

const STORE = "canva-class-portfolio";
const KEY = "links";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
function validUrl(value) {
  if (value === "") return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch { return false; }
}

export default async (req) => {
  const store = getStore({ name: STORE, consistency: "strong" });
  let data = (await store.get(KEY, { type: "json", consistency: "strong" })) || {};

  if (req.method === "GET") return json(data);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "잘못된 요청입니다." }, 400); }

  const student = Number(body.student);
  const lesson = Number(body.lesson);
  const url = String(body.url ?? "").trim();

  if (!Number.isInteger(student) || student < 1 || student > 24)
    return json({ error: "학생 번호가 올바르지 않습니다." }, 400);
  if (!Number.isInteger(lesson) || lesson < 1 || lesson > 10)
    return json({ error: "차시 번호가 올바르지 않습니다." }, 400);
  if (!validUrl(url)) return json({ error: "올바른 http/https 링크를 입력하세요." }, 400);

  const s = String(student), l = String(lesson);
  data[s] ||= {};
  if (url) data[s][l] = url;
  else delete data[s][l];

  await store.setJSON(KEY, data);
  return json({ ok: true, data });
};
