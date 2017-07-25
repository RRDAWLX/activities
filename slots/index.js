let prizes = [
        {value: 0, image: './laptop.png', desc: '笔记本电脑'},
        {value: 1, image: './phone.png', desc: '手机'},
        {value: 2, image: './bracelet.png', desc: '手环'},
        {value: 3, image: './earphone.png', desc: '耳机'}
    ],
    slots = new Slots({prizes, duration: 8000, slotsNum: 4, slotScrollInterval: 500}),
    prizeSelector = document.querySelector('#prize');

document.body.insertBefore(slots.dom, document.querySelector('.operation'));
document.querySelector('#draw').addEventListener('click', function(){
    let _this = this;
    if (slots.status == 3 || slots.status == 1) {
        _this.textContent = '抽奖中';
        new Promise((resolve, reject) => {
            // let prizeValue = prizeSelector.options[prizeSelector.selectedIndex].value;
            let prizeValue = [-1, 0, -1, 1, -1, 2, -1, 3][Math.floor(Math.random() * 8)];
            console.log(`prizeValue: ${prizeValue}`);
            setTimeout(() => {
                resolve(prizeValue);
            }, 100);
        }).then(prizeValue => {
            return slots.draw(prizeValue);
        }).then(prizeValue => {
            _this.textContent = '再抽一次';
            if (prizeValue == -1) {
                alert('很遗憾，没有中奖！');
            } else {
                let prize = prizes.find(prize => {
                    return prize.value == prizeValue;
                });
                alert(`恭喜中奖：${prize.desc}`);
            }
        });
    }
}, false);
