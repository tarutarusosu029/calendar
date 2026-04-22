fetch('/version.txt?t=' + Date.now())
    .then(r => r.text())
    .then(v => document.getElementById('v').textContent = v);