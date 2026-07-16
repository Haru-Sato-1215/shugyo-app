
const title = document.getElementById("title");

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



const params = new URLSearchParams(window.location.search);

const SHUGYO_TYPE = params.get("type") || "meal";
const liveTime = document.getElementById("liveTime");

let timer = null;

import { db } from "./firebase.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
const status = document.getElementById("status");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

// 修行開始
startBtn.addEventListener("click", async () => {

    await setDoc(doc(db, "records", SHUGYO_TYPE), {

        status: "修行中",

        running: true,

        startTime: serverTimestamp()

    });

    status.textContent = "修行中";

});

// 修行終了
stopBtn.addEventListener("click", async () => {

    const ref = doc(db, "records", SHUGYO_TYPE);

    const snap = await getDoc(ref);

    if(!snap.exists()){
        alert("開始されていません");
        return;
    }

    const data = snap.data();

    const start = data.startTime.toDate();

    const end = new Date();

    const elapsed =
        Math.floor((end - start)/1000);

    await setDoc(ref,{

        status:"終了",

        running:false,

        startTime:data.startTime,

        endTime:Timestamp.fromDate(end),

        elapsed:elapsed

        

    });

    status.textContent="終了";

    alert("経過時間：" + elapsed + "秒");

});

const time = document.getElementById("time");

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

        liveTime.textContent = "経過：" + sec + " 秒";

    }, 1000);

} else {

    if (data.elapsed != null) {

        time.textContent = "記録：" + data.elapsed + " 秒";

        liveTime.textContent = "";
    }

}

});

const params = new URLSearchParams(window.location.search);
const action = params.get("action");

if (action === "toggle") {

    const ref = doc(db, "records", SHUGYO_TYPE);

    getDoc(ref).then((snap) => {

        if (!snap.exists()) {

            startBtn.click();
            return;

        }

        const data = snap.data();

        if (data.running) {

            stopBtn.click();

        } else {

            startBtn.click();

        }

    });

}