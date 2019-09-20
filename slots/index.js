let prizes = [
        {value: 0, image: './laptop.png', desc: '笔记本电脑'},
        {value: 1, image: './phone.png', desc: '手机'},
        {value: 2, image: './bracelet.png', desc: '手环'},
        {value: 3, image: './earphone.png', desc: '耳机'}
    ],
    slots = new Slots({prizes, duration: 7000, slotsNum: 3, slotScrollInterval: 400}),
    prizeSelector = document.querySelector('#prize');

document.body.insertBefore(slots.dom, document.querySelector('.operation'));
document.querySelector('#draw').addEventListener('click', function(){
    let _this = this;
    if (slots.status == 1) {
        _this.textContent = '抽奖中';
        new Promise((resolve, reject) => {
            let prizeValue = Math.random() < 0.1 ? 0 : -1;

            // let prizeValue = prizeSelector.value;
            console.log(`prizeValue: ${prizeValue}`);
            setTimeout(() => {
                resolve(prizeValue);
            }, 100);
        }).then(prizeValue => {
            return slots.draw(prizeValue);
        }).then(prizeValue => {
            _this.textContent = '再抽一次';
            let prize = prizes.find(prize => {
                return prize.value == prizeValue;
            });
            if (prize) {
                alert(`恭喜中奖：${prize.desc}`);
            } else {
                alert('很遗憾，没有中奖！');
            }
        });
    }
}, false);
