document.getElementById('cards').addEventListener('click', function(e) {
    let target = e.target;
    while (target) {
        if (target.classList.contains('card-container')) {
            target.classList.toggle('center');
            break;
        }
        target = target.parentElement;
    }
}, false);
