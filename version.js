fetch('version.txt')
    .then(r => {
        if (!r.ok) throw new Error();
        return r.text();
    })
    .then(v => {
        document.getElementById('v').textContent = v.trim();
    })
    .catch(() => {
        document.getElementById('v').textContent = 'unknown';
    });