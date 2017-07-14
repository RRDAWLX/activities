let slot = new Slot({
    prizes: [
        {value: 1, class: 'one'},
        {value: 2, class: 'two'},
        {value: 3, class: 'three'}
    ],
    loop: 10
});
document.querySelector('#slots').appendChild(slot.dom);
// slot.draw({prizeIndex: 1});
let prizeSelector = document.querySelector('#prize');
document.querySelector('#draw').addEventListener('click', function(){
    slot.draw({
        prizeIndex: prizeSelector.options[prizeSelector.selectedIndex].value
    });
}, false);
