
import { db } from "./firebase.js";



import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// =========================
// URLパラメータ取得
// =========================
const params = new URLSearchParams(window.location.search);

const SHUGYO_TYPE = params.get("type") || "meal";
const action = params.get("action");

// =========================
// HTML取得
// =========================
const title = document.getElementById("title");
const status = document.getElementById("status");
const time = document.getElementById("time");
const liveTime = document.getElementById("liveTime");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const pauseBtn = document.getElementById("pauseBtn");

const startTimeText = document.getElementById("startTimeText");
const endTimeText = document.getElementById("endTimeText");

stopBtn.style.display="none";
pauseBtn.style.display="none";
// =========================
// タイトル
// =========================
switch (SHUGYO_TYPE) {

    case "meal":
        title.textContent = "🍱 食事";
        break;

    case "meditation":
        title.textContent = "🧘 坐禅";
        break;

    case "samu":
        title.textContent = "🧹 作務";
        break;

    case "walking":
        title.textContent = "🚶 経行";
        break;
}

// =========================
// タイマー
// =========================
let timer = null;

// =========================
// 修行開始
// =========================
async function startTraining() {

    await setDoc(doc(db, "records", SHUGYO_TYPE), {

        status: "修行中",

        running: true,

        startTime: serverTimestamp()

    });

}

// =========================
// 修行終了
// =========================
async function stopTraining() {

    const ref = doc(db, "records", SHUGYO_TYPE);

    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    const start = data.startTime.toDate();

    const end = new Date();

    const elapsed = Math.floor((end - start) / 1000);

    await setDoc(ref, {

        status: "終了",

        running: false,

        startTime: data.startTime,

        endTime: Timestamp.fromDate(end),

        elapsed: elapsed

    });

}

// =========================
// ボタン
// =========================
startBtn.addEventListener("click", startTraining);

stopBtn.addEventListener("click", stopTraining);

pauseBtn.addEventListener("click", () => {

    alert("中断機能は現在開発中です。");

});

// =========================
// Firestore監視
// =========================
onSnapshot(doc(db, "records", SHUGYO_TYPE), (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    status.textContent = data.status;

    if (timer) {
        clearInterval(timer);
    }

    if (data.running) {

        const start = data.startTime.toDate();

        timer = setInterval(() => {

            const now = new Date();

            const sec = Math.floor((now - start) / 1000);

            const h = String(Math.floor(sec / 3600)).padStart(2,"0");
            const m = String(Math.floor((sec % 3600)/60)).padStart(2,"0");
            const s = String(sec % 60).padStart(2,"0");

            liveTime.textContent = `${h}:${m}:${s}`;

        }, 1000);

        startTimeText.textContent =
        data.startTime.toDate().toLocaleTimeString("ja-JP",{

        hour:"2-digit",
        minute:"2-digit"

        });

        endTimeText.textContent="--:--";

    } else {

        if (data.elapsed != null) {

            const sec = data.elapsed;

            const h = String(Math.floor(sec / 3600)).padStart(2,"0");
            const m = String(Math.floor((sec % 3600)/60)).padStart(2,"0");
            const s = String(sec % 60).padStart(2,"0");

            time.textContent = `${h}:${m}:${s}`;

            liveTime.textContent = "";

        }

        startTimeText.textContent =
        data.startTime.toDate().toLocaleTimeString("ja-JP",{

            hour:"2-digit",
            minute:"2-digit"

        });

    if(data.endTime){

    endTimeText.textContent =
     data.endTime.toDate().toLocaleTimeString("ja-JP",{

            hour:"2-digit",
            minute:"2-digit"

        });

}

    }
if(data.running){

    startBtn.style.display="none";

    stopBtn.style.display="block";

    pauseBtn.style.display="block";

}else{

    startBtn.style.display="block";

    stopBtn.style.display="none";

    pauseBtn.style.display="none";

}

});

// =========================
// URLから開始・終了
// =========================



if (action === "toggle") {

    setTimeout(async () => {

        const ref = doc(db, "records", SHUGYO_TYPE);

        const snap = await getDoc(ref);

        if (!snap.exists()) {

            await startTraining();

        } else {

            const data = snap.data();

            if (data.running) {

                await stopTraining();

            } else {

                await startTraining();

            }

        }

    }, 300);

}