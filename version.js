fetch('/version.txt')
    .then(r => r.text())
    .then(v => {
        document.getElementById('v').textContent = v.trim();
    });