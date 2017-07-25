class Slots {
    constructor({prizes}) {
        this.prizes = prizes;
        this.slots = [new Slot({prizes}), new Slot({prizes}), new Slot({prizes})];
        this.createDom();
    }

    createDom() {
        this.dom = document.createElement('div');
        this.dom.className = 'slots';
        this.slots.forEach(slot => {
            this.dom.appendChild(slot.dom);
        });
    }

    draw(prizeValue) {
        let prizesIndexes = this.getDestinedPrizeIndexesArray(prizeValue),
            slots = this.slots;
        for (let i = 0, len = slots.length; i < len; i++) {
            setTimeout(() => {
                slots[i].draw({prizeIndex: prizesIndexes[i]});
            }, 1000 * i);
        }
    }

    /**
     * 获取每个 slot 最终所要显示的项的数组
     * 如[1, 2, 3]表示第1个slot最终要显示奖品1，第2个slot最终要显示奖品2，第3个slot最终要显示奖品3。
     */
    getDestinedPrizeIndexesArray(prizeValue) {
        let prizesArr;
        if (prizeValue != -1) {
            prizesArr = [];
            let prizeIndex = this.prizes.findIndex(prize => {
                return prize.value == prizeValue;
            });
            for (let i = 0, len = this.slots.length; i < len; i++) {
                prizesArr.push(prizeIndex);
            }
        } else {
            let checkIfEqual = val => {
                return val == prizesArr[0];
            };
            do {
                prizesArr = this.getRandomArr();
            } while (prizesArr.every(checkIfEqual));
        }
        console.log(`DestinedPrizeIndexesArray: ${prizesArr}`);
        return prizesArr;
    }

    getRandomArr() {
        let arr = [],
            slotsLen = this.slots.length,
            prizesLen = this.prizes.length;
        for (let i = 0; i < slotsLen; i++){
            arr.push(Math.floor(Math.random() * prizesLen));
        }
        return arr;
    }
}
