const sleep = (time) => new Promise((resolve) => {
    setTimeout((resolve, time));
});

async function getCalendarUrl() {
    let userGrade = getParameter("userGrade");
    let userClass = getParameter("userClass");

    if (userGrade && userClass && userGrade != 0 && userClass != 0) {
        try {
            const api = `https://script.google.com/macros/s/AKfycbzu83oiW4V8BkKVkwcgB4SyrE4EIf_7F6IwKD70tqO8CbkYehF3JyF1EcRkk83M-cOd/exec?action=getCalendar&userGrade=${userGrade}&userClass=${userClass}`;
            element = document.getElementById('status');
            toggleElementHide(element);
            updateGuide(`<p>しばらくお待ちください</p>`);
            updateStatus(`<p>読み込み中...</p>`);
            const res = await fetch(api);
            const json = await res.json();
            if (json.success && json.calendarUrl != null) {
                highlight(element);
                updateGuide(`<p>登録ボタンを押してください</p>`);
                updateStatus(`<p><a href=${json.calendarUrl}>カレンダーを登録</a></p>`);
                deleteParams();
            } else {
                await sleep(5000);
                getCalendarUrl();
            }
        } catch (e) {
            console.log(e);
            updateStatus(`<p><span style="font-weight:bold;">エラーが発生しました。</span><br>時間をおいてから、<br>もう一度やり直してください。</p>`);
            window.alert("エラー\n時間をおいてからもう一度やり直してください。");
        }
    }
}

window.onload = getCalendarUrl();

function deleteParams() {
    const url = new URL(window.location.href);
    window.history.replaceState({}, '', url.pathname);
}



function getParameter(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

function updateStatus(html) {
    document.getElementById("status").innerHTML = html;
}
function updateGuide(html) {
    document.getElementById("guide").innerHTML = html;
}

function highlight(element) {
    return element.classList.add('highlight');
}

function toggleElementHide(element) {
    const classes = ["hide", "anim-box", "popup", "js-anim", "is-animated"];
    classes.forEach(className => element.classList.toggle(className));
}
//©2026 tarutarusosu029