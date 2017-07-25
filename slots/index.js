let prizes = [
        {value: 0, image: './laptop.png'},
        {value: 1, image: './phone.png'},
        {value: 2, image: './bracelet.png'},
        {value: 3, image: './earphone.png'}
    ],
    slots = new Slots({prizes}),
    prizeSelector = document.querySelector('#prize');
document.body.insertBefore(slots.dom, document.querySelector('.operation'));
document.querySelector('#draw').addEventListener('click', function(){
    slots.draw(prizeSelector.options[prizeSelector.selectedIndex].value);
}, false);
