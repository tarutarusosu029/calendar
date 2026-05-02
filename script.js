const sleep = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

async function getCalendarUrl() {
    let userGrade = getParameter("userGrade");
    let userClass = getParameter("userClass");
    let userAgent = window.navigator.userAgent.toLowerCase();
    if (userGrade && userClass && userGrade != 0 && userClass != 0) {
        try {
            document.getElementById('userGrade').value = userGrade;
            document.getElementById('userClass').value = userClass;
            let action = "getCalendar";
            let api = `https://script.google.com/macros/s/AKfycbzu83oiW4V8BkKVkwcgB4SyrE4EIf_7F6IwKD70tqO8CbkYehF3JyF1EcRkk83M-cOd/exec`;
            let apiReqUrl = `${api}?action=${action}&userGrade=${userGrade}&userClass=${userClass}&userAgent=${userAgent}`;
            element = document.getElementById('status');
            if (element.classList.contains('hide')) {
                toggleElementHide(element);
                updateGuide(`<p>カレンダーを探しています...</p>`);
            }
            updateStatus(`<div class="loader"></div>`);
            const res = await fetch(apiReqUrl);
            const json = await res.json();
            submitBtnDisabled();
            if (json.success && json.calendarUrl != null) {
                highlight(element);
                updateGuide(`<p>登録ボタンを押してください</p>`);
                updateStatus(`<p><a href=${json.calendarUrl}>カレンダーを登録</a></p>`);
                action = "uploadSuccessLog";
                apiReqUrl = `${api}?action=${action}&userGrade=${userGrade}&userClass=${userClass}&userAgent=${userAgent}`;
                deleteParams();
                await fetch(apiReqUrl);
            } else {
                console.log("retry");
                updateGuide(`<p>新しいカレンダーを作っています...</p>`);
                return getCalendarUrl();
            }
        } catch (e) {
            console.log(e);
            updateGuide(`<p>時間をおいてからもう一度やり直してください</p>`);
            updateStatus(`<div class="loader-error"></div>`);
            errorHighlight(element);
            window.alert("エラー\n時間をおいてから\nもう一度やり直してください");
            action = "uploadErrorLog";
            apiReqUrl = `${api}?action=${action}&userGrade=${userGrade}&userClass=${userClass}&userAgent=${userAgent}&error=${e}`;
            deleteParams();
            await fetch(apiReqUrl);
        }
    }
}

function deleteParams() {
    const url = new URL(window.location.href);
    window.history.replaceState({}, '', url.pathname);
    document.getElementById('userGrade').value = 0;
    document.getElementById('userClass').value = 0;
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

function submitBtnDisabled() {
    document.getElementById('submitBtn').addEventListener('click', function () {
        this.disabled = true;
    });
}

function highlight(element) {
    return element.classList.add('highlight');
}

function errorHighlight(element) {
    return element.classList.add('highlight-error');
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

accordions.forEach(function (accordion) {
    initializeDetailsAccordion(accordion)
})

function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

window.onload = function () {
    getCalendarUrl();
    console.info(choose([
        'こんにちは🌱',
        '使ってくれてありがとう🌱',
        'いたずらしないでね😖',
        'バグを見つけたらこっそり教えてね🤐',
        '中身が気になるの？🤔',
        'あんまりみないでね🫣',
        '普通は行けない場所にもなにかあるかも...🫣'
    ]));
}

//©2026 tarutarusosu029