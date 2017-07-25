let prizes = [
    {value: 0, image: './laptop.png'},
    {value: 1, image: './phone.png'},
    {value: 2, image: './bracelet.png'},
    {value: 3, image: './earphone.png'}
];

let slots = [new Slot({prizes}), new Slot({prizes}), new Slot({prizes})];
slots.forEach(slot => {
    document.querySelector('#slots').appendChild(slot.dom);
});

let prizeSelector = document.querySelector('#prize');
document.querySelector('#draw').addEventListener('click', function(){
    let prizesArr = getDestinedPrizeIndexesArray();
    slots[0].draw({prizeIndex: prizesArr[0]});
    setTimeout(() => {
        slots[1].draw({prizeIndex: prizesArr[1]});
    }, 1000);
    setTimeout(() => {
        slots[2].draw({prizeIndex: prizesArr[2]});
    }, 2000);
}, false);

/**
 * 获取每个 slot 最终所要显示的项的数组
 * 如[1, 2, 3]表示第1个slot最终要显示奖品1，第2个slot最终要显示奖品2，第3个slot最终要显示奖品3。
 */
function getDestinedPrizeIndexesArray() {
    let prizeValue = prizeSelector.options[prizeSelector.selectedIndex].value,
        prizesArr;
    if (prizeValue != -1) {
        prizesArr = [];
        let prizeIndex = prizes.findIndex(prize => {
            return prize.value == prizeValue;
        });
        for (let i = 0; i < prizes.length; i++) {
            prizesArr.push(prizeIndex);
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
