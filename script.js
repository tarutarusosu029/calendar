const sleep = (time) => new Promise((resolve) => {
    setTimeout((resolve, time));
});

async function getCalendarUrl() {
    let userGrade = getParameter("userGrade");
    let userClass = getParameter("userClass");

    if (userGrade && userClass && userGrade != 0 && userClass != 0) {
        try {
            const api = `https://script.google.com/macros/s/AKfycbx3zfsa6aJeL8ql97_q0EpxP1vvL7e5LJe_TYnucMHckyhZ_UIa_kz5obdE8NTOuCco/exec?action=getCalendar&userGrade=${userGrade}&userClass=${userClass}`;
            element = document.getElementById('link');
            toggleElementHide(element);
            showLoadingAnimation();
            const res = await fetch(api);
            const json = await res.json();
            if (json.success && json.calendarUrl != null) {
                hideLoadingAnimation();
                highlight(element);
                document.getElementById("link").innerHTML = `<p><a href=${json.calendarUrl}>カレンダーを登録</a></p>`;
                deleteParams();
            } else {
                await sleep(5000);
                getCalendarUrl();
            }
        } catch (e) {
            console.log(e);
            showDialog("エラー", "時間をおいてから\nもう一度やり直してください。");
        }
    }
}

function deleteParams() {
    const url = new URL(window.location.href);
    window.history.replaceState({}, '', url.pathname);
}

window.onload = getCalendarUrl();

function getParameter(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

function showDialog(title, message) {
    const screenMasc = document.getElementById("");
    const dialog = document.getElementById("");
}

function hideDialog() {
    const screenMasc = document.getElementById("");
    const dialog = document.getElementById("");
}

function showLoadingAnimation() {
    const screenMasc = document.getElementById("");
    const loadingAnimation = document.getElementById("link").innerHTML = "<p>Loading...</p>";
}

function hideLoadingAnimation() {
    const screenMasc = document.getElementById("");
    const loadingAnimation = document.getElementById("link").innerHTML = "<p>Success</p>";
}

function highlight(element) {
    return element.classList.add('highlight');
}

function toggleElementHide(element) {
    return element.classList.toggle('hide');
}

//©2026 test.resavation326
