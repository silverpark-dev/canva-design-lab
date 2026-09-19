const API = "/api/portfolio";
let all = {};
let current = 1;

let studentNum = 12;

// 수업 차시
const lessonNames = [
  "1차시","2차시","3차시","4차시","5차시",
  "6차시"
];

function draw(q = ""){
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for(let i = 1; i <= studentNum; i++){
    const name = `${i}번 친구`;
    if(!name.includes(q)) continue;

    const studentData = all[String(i)] || {};
    const saved = Object.values(studentData).filter(Boolean).length;
    const card = document.createElement("div");

    card.className = "card";
    card.addEventListener("click", () => openStudent(i));
    card.innerHTML = `
      <div class="top">
        <span>STUDENT ${String(i).padStart(2,"0")}</span>
        <span class="dot"></span>
      </div>
      <h3>${name}</h3>
      <div class="count">${saved}/${lessonNames.length} 작품 등록됨 →</div>
    `;
    grid.appendChild(card);
  }
}

async function load(){
  const status = document.getElementById("status");

  try{
    const response = await fetch(API, {
      method: "GET",
      cache: "no-store"
    });

    if(!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    all = data && typeof data === "object" ? data : {};
    status.textContent = "✓ 온라인 공용 저장 연결됨";
  }catch(error){
    console.error("저장소 연결 오류:", error);
    status.textContent = "저장소 연결 실패 — Netlify API 설정을 확인해주세요.";
  }

  draw();
}

function openStudent(i){
  current = i;
  document.getElementById("studentTitle").textContent =
    `${i}번 친구의 포트폴리오`;

  const box = document.getElementById("lessons");
  box.innerHTML = "";
  const data = all[String(i)] || {};

  lessonNames.forEach((name,index) => {
    const lesson = String(index + 1);
    const url = data[lesson] || "";

    const item = document.createElement("div");
    item.className = "lesson";

    const title = document.createElement("b");
    title.textContent = name;

    const row = document.createElement("div");
    row.className = "row";

    const input = document.createElement("input");
    input.id = `u-${lesson}`;
    input.type = "url";
    input.placeholder = "Canva 작품 링크 붙여넣기";
    input.value = url;

    const button = document.createElement("button");
    button.className = "save";
    button.type = "button";
    button.textContent = "저장";
    button.addEventListener("click", () => saveLink(lesson, button));

    row.appendChild(input);
    row.appendChild(button);
    item.appendChild(title);
    item.appendChild(row);

    if(url){
      const link = document.createElement("a");
      link.className = "open";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "작품 보기 ↗";
      item.appendChild(link);
    }

    box.appendChild(item);
  });

  document.getElementById("modal").classList.add("on");
}

function closeModal(){
  document.getElementById("modal").classList.remove("on");
  draw(document.getElementById("search").value.trim());
}

async function saveLink(lesson, button){
  const input = document.getElementById("u-" + lesson);
  const url = input.value.trim();

  if(url && !/^https?:\/\//i.test(url)){
    alert("http:// 또는 https://로 시작하는 링크를 넣어주세요.");
    return;
  }

  button.disabled = true;
  const oldText = button.textContent;
  button.textContent = "저장 중";

  try{
    const response = await fetch(API, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        student: current,
        lesson: Number(lesson),
        url
      })
    });

    let result = {};
    try{
      result = await response.json();
    }catch{}

    if(!response.ok){
      throw new Error(result.error || `저장 실패 (HTTP ${response.status})`);
    }

    if(result.data){
      all = result.data;
    }else{
      if(!all[String(current)]) all[String(current)] = {};
      all[String(current)][lesson] = url;
    }

    openStudent(current);
  }catch(error){
    console.error("링크 저장 오류:", error);
    alert("저장하지 못했습니다.\n\n" + error.message);
  }finally{
    button.disabled = false;
    button.textContent = oldText;
  }
}

document.getElementById("search").addEventListener("input", event => {
  draw(event.target.value.trim());
});

document.getElementById("closeButton").addEventListener("click", closeModal);

document.getElementById("modal").addEventListener("click", event => {
  if(event.target.id === "modal") closeModal();
});

draw();
load();
