class Slots {
    constructor({prizes}) {
        this.status = 0;    // 0:初始化中；1：初始化完成，可以进行抽奖；2：抽奖中；3：抽奖完成，可再次进行抽奖。
        this.prizes = prizes;
        this.slots = [new Slot({prizes}), new Slot({prizes}), new Slot({prizes})];
        this.createDom();
        this.status = 1;
    }

    createDom() {
        this.dom = document.createElement('div');
        this.dom.className = 'slots';
        this.slots.forEach(slot => {
            this.dom.appendChild(slot.dom);
        });
    }

    draw(prizeValue) {
        if (this.status == 3 || this.status == 1) {
            this.status = 2;
            this.currentPrizeValue = prizeValue;
            let prizesIndexes = this.getDestinedPrizeIndexesArray(prizeValue),
                slots = this.slots,
                promises = [];
            for (let i = 0, len = slots.length; i < len; i++) {
                promises.push(new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 1000 * i);
                }).then(() => {
                    return slots[i].draw({prizeIndex: prizesIndexes[i]});
                }));
            }

            return Promise.all(promises).then(prizeIndexesArray => {
                this.status = 3;
                return prizeValue;
            });
        } else if (this.status == 2) {
            console.log('抽奖中');
        } else {
            console.log('初始化中');
        }

    }

    /**
     * 获取每个 slot 最终所要显示的项的数组
     * 如[1, 2, 3]表示第1个slot最终要显示奖品1，第2个slot最终要显示奖品2，第3个slot最终要显示奖品3。
     */
    getDestinedPrizeIndexesArray(prizeValue) {
        let prizesArr,
            prizeIndex = this.prizes.findIndex(prize => {
                return prize.value == prizeValue;
            });

        if (prizeIndex >= 0) {
            prizesArr = [];
            this.currentPrize = this.prizes[prizeIndex];
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
