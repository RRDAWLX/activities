let prizes = [
    {value: 1, class: 'one'},
    {value: 2, class: 'two'},
    {value: 3, class: 'three'}
];

let slots = [new Slot({prizes}), new Slot({prizes}), new Slot({prizes})];
slots.forEach(slot => {
    document.querySelector('#slots').appendChild(slot.dom);
});

let prizeSelector = document.querySelector('#prize');
document.querySelector('#draw').addEventListener('click', function(){
    let prizesArr = getDestinedPrizesArray();
    slots[0].draw({prizeIndex: prizesArr[0]});
    setTimeout(() => {
        slots[1].draw({prizeIndex: prizesArr[1]});
    }, 1000);
    setTimeout(() => {
        slots[2].draw({prizeIndex: prizesArr[2]});
    }, 2000);
}, false);

function getDestinedPrizesArray() {
    let prize = prizeSelector.options[prizeSelector.selectedIndex].value,
        prizesArr;
    if (prize != -1) {
        prizesArr = [];
        for (let i = 0; i < prizes.length; i++) {
            prizesArr.push(prize);
        }
    } else {
        let checkIfEqual = val => {
            return val == prizesArr[0];
        };
        do {
            prizesArr = getRandomArr(prizes.length);
        } while (prizesArr.every(checkIfEqual));
    }
    return prizesArr;
}

function getRandomArr(length) {
    let arr = [];
    for (let i = 0; i < length; i++){
        arr.push(Math.floor(Math.random() * length));
    }
    return arr;
}
