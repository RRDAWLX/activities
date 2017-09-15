class Slots {
    /**
     * @param {Array} prizes 奖励数组
     * @param {Number} duration 每个 slot 的滚动时间，单位 ms，默认 8000ms。
     * @param {Number} slotsNum slots 中 slot 的个数，默认 3 个，至少 2 个。
     * @param {Number} slotScrollInterval 相连两个 slot 的滚动时间差，单位 ms，默认间隔 500ms。
     * @param {String} timingFnName 单个 slot 滚动的计时函数名，默认为 easeCubicInOut。
     */
    constructor({prizes, duration = 8000, slotsNum = 3, slotScrollInterval = 500, timingFnName = 'easeCubicInOut'}) {
        this.status = 0;    // 0:初始化中；1：初始化/抽奖完成，可以进行抽奖；2：抽奖中。
        this.prizes = prizes;
        this.duration = duration;
        if (slotsNum > 1) {
            this.createSlots(slotsNum, timingFnName);
        } else {
            console.error('slot 个数至少 2 个！');
        }
        this.slotScrollInterval = slotScrollInterval;
        this.createDom();
        this.status = 1;
    }

    createSlots(slotsNum, timingFnName) {
        this.slots = [];
        for (let i = 0; i < slotsNum; i++) {
            this.slots.push(new Slot({prizes, timingFnName}));
        }
    }

    createDom() {
        this.dom = document.createElement('div');
        this.dom.className = 'slots';
        this.slots.forEach(slot => {
            this.dom.appendChild(slot.dom);
        });
    }

    /**
     * @param {Number} prizeValue 奖项，用于标识奖项的特征值
     */
    draw(prizeValue) {
        if (this.status == 1) {
            this.status = 2;
            this.currentPrizeValue = prizeValue;
            let prizesIndexes = this.getDestinedPrizeIndexesArray(prizeValue),
                slots = this.slots,
                promises = [];
            for (let i = 0, len = slots.length; i < len; i++) {
                promises.push(new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, this.slotScrollInterval * i);
                }).then(() => {
                    return slots[i].draw({prizeIndex: prizesIndexes[i], duration: this.duration});
                }));
            }

            return Promise.all(promises).then(prizeIndexesArray => {
                this.status = 1;
                return prizeValue;
            });
        } else if (this.status == 2) {
            console.log('抽奖中');
        } else {
            console.log('初始化中');
        }

    }

    /**
     * @desc 获取每个 slot 最终所要显示的项的数组。如[1, 2, 3]表示第1个slot最终要显示奖品1，第2个slot最终要显示奖品2，第3个slot最终要显示奖品3。
     * @param {Number} prizeValue 奖项，用于标识奖项的特征值
     */
    getDestinedPrizeIndexesArray(prizeValue) {
        let prizesArr,
            prizeIndex = this.prizes.findIndex(prize => {   // 查找奖项序号，如果未中奖，序号为 -1 。
                return prize.value == prizeValue;
            });

        if (prizeIndex >= 0) {
            prizesArr = [];
            this.currentPrize = this.prizes[prizeIndex];
            for (let i = 0, len = this.slots.length; i < len; i++) {
                prizesArr.push(prizeIndex);
            }
        } else {
            prizesArr = this.getRandomArr();
        }

        console.log(`DestinedPrizeIndexesArray: ${prizesArr}`);
        return prizesArr;
    }

    /**
     * @desc 获取一个各项不全相等的随机数组，数组元素为奖项数组元素的序号。
     */
    getRandomArr() {
        let arr,
            slotsLen = this.slots.length,
            prizesLen = this.prizes.length,
            checkIfEqual = val => {
                return val == arr[0];
            };

        do {
            arr = [];
            for (let i = 0; i < slotsLen; i++){
                arr.push(Math.floor(Math.random() * prizesLen));
            }
        } while (arr.every(checkIfEqual));

        return arr;
    }
}
