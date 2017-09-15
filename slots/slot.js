class Slot {
    /**
     * @param {Array} prizes 奖励数组
     * @param {Number} itemHeight 单个奖项元素的高度，单位 px，默认 100px。
     * @param {Number} initialIndex 初始化时显示的奖项,默认为第一个奖项。
     * @param {Number} loop 抽奖过程中旋转的圈数，默认20圈。
     * @param {String} timingFnName 计时函数名，默认为 easeCubicInOut。
     */
    constructor({prizes, itemHeight = 100, initialIndex = 0, loop = 20, timingFnName = 'easeCubicInOut'}) {
        this.prizes = prizes;
        if (this.prizes.length < 2) {
            console.error('奖项数组长度必须大于等于2!');
            return false;
        }
        this.currentPrizeIndex = initialIndex % prizes.length;     // 当前显示奖项序号
        this.itemHeight = itemHeight;
        this.totalHeight = this.itemHeight * this.prizes.length;    // 所有奖项总高度
        this.loop = loop;
        this.createDom();
        this.getTimingFunction(timingFnName);
    }

    createDom() {
        let slot = this.dom = document.createElement('div');
        slot.className = 'slot';
        let prizes = this.prizes,
            itemsHtml = '',
            items = [];
        items.push(prizes[prizes.length - 1], ...prizes, ...prizes.slice(0, 2));    // 在最前面填补最后一个奖项，在最后面填补前两个奖项。
        items.forEach(item => {
            itemsHtml += `<li class="prize"><img src="${item.image}" /></li>`;
        });
        slot.innerHTML = `<ul class="prizes-list" style="margin-top: -${this.itemHeight / 2}px; transform: translate3d(0, -${this.itemHeight * this.currentPrizeIndex}px, 0);">${itemsHtml}</ul>`;
        this.prizesList = slot.querySelector('.prizes-list');
    }

    /*
     * @param {String} timingFnName 计时函数名
     */
    getTimingFunction(timingFnName) {
        console.log(timingFnName, d3[timingFnName]);
        let fns = ['easeCubicInOut', 'easeBackIn', 'easeLinear'];
        if (fns.indexOf(timingFnName) != -1) {
            this.timingFunction = d3[timingFnName];
        } else {
            this.timingFunction = d3.easeCubicInOut;
        }
    }

    /**
     * @desc 计算出需要滚动的距离
     */
    calculateDestinedScrollDistance(detinedPrizeIndex) {
        return (detinedPrizeIndex - this.currentPrizeIndex + this.loop * this.prizes.length) * this.itemHeight;
    }

    /**
     * @desc 抽奖，在指定的时间内滚动至指定的奖项。
     * @param {Number} prizeIndex 奖项在初始化奖项数组中的序号
     * @param {Number} duration 摇奖时间，单位 ms，默认 8000ms。
      */
    draw({prizeIndex, duration = 8000}) {
        return new Promise(
            (resolve) => {
                prizeIndex = prizeIndex % this.prizes.length;
                let distinedScrollDistance = this.calculateDestinedScrollDistance(prizeIndex);
                let timingFunction = this.timingFunction;
                let currentPosition = -this.currentPrizeIndex * this.itemHeight;
                let startTime;
                let frame = () => {
                    if (!startTime) {
                        startTime = Date.now();
                    }
                    let portion = (Date.now() - startTime) / duration;
                    portion = portion > 1 ? 1 : portion;
                    let deltaDistance = distinedScrollDistance * timingFunction(portion);
                    let position = (currentPosition - deltaDistance) % this.totalHeight;
                    this.prizesList.style.transform = `translate3d(0, ${position}px, 0)`;
                    if (portion < 1) {
                        window.requestAnimationFrame(frame);
                    } else {
                        this.currentPrizeIndex = prizeIndex;
                        resolve();
                    }
                };
                frame();
            }
        );
    }
}
