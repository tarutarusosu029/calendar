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

const accordions = document.querySelectorAll('.accordion')

function initializeDetailsAccordion(details) {
    const summary = details.querySelector('summary')
    const panel = details.querySelector('summary + *')

    if (!(details && summary && panel)) return

    let isTransitioning = false

    function onOpen() {
        if (details.open || isTransitioning) return
        isTransitioning = true

        panel.style.gridTemplateRows = '0fr'
        details.setAttribute('open', '')

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                panel.style.gridTemplateRows = '1fr'
            })
        })

        panel.addEventListener('transitionend', function () {
            isTransitioning = false
        }, { once: true })
    }

    function onClose() {
        if (!details.open || isTransitioning) return
        isTransitioning = true

        panel.style.gridTemplateRows = '0fr'

        panel.addEventListener('transitionend', function () {
            details.removeAttribute('open')
            panel.style.gridTemplateRows = ''
            isTransitioning = false
        }, { once: true })
    }

    summary.addEventListener('click', function (event) {
        event.preventDefault()

        if (!details.open) {
            // 他を全部閉じる
            accordions.forEach(function (item) {
                if (item !== details && item.open) {
                    const otherPanel = item.querySelector('summary + *')
                    otherPanel.style.gridTemplateRows = '0fr'

                    otherPanel.addEventListener('transitionend', function () {
                        item.removeAttribute('open')
                        otherPanel.style.gridTemplateRows = ''
                    }, { once: true })
                }
            })

            onOpen()
        } else {
            onClose()
        }
    })
}

// 初期化
accordions.forEach(function (accordion) {
    initializeDetailsAccordion(accordion)
})

//©2026 tarutarusosu029