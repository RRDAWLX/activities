class Slot {
    constructor() {
        this.prizes = [
            {value: 1, class: 'one'},
            {value: 2, class: 'two'},
            {value: 3, class: 'three'}
        ];
        if (this.prizes.length < 2) {
            console.log('Prizes length must equal or greater than 2!');
            return false;
        }
        this.currentPrizeIndex = 0;     // 当前显示奖项序号
        this.itemHeight = 100;
        this.totalHeight = this.itemHeight * this.prizes.length;    // 所有奖项总高度
        this.createDoms();
        this.getTimingFunctionGenerator();
    }

    createDoms() {
        let prizes = this.prizes,
            slot = this.slot = document.querySelector('.slot'),
            itemsHtml = '',
            items = [];
        items.push(prizes[prizes.length - 1], ...prizes, ...prizes.slice(0, 2));
        items.forEach(item => {
            itemsHtml += `<li class="prize ${item.class}">${item.value}</li>`;
        });
        slot.innerHTML = `<ul class="prizes-list" style="margin-top: -${this.itemHeight / 2}px;">${itemsHtml}</ul>`;
        this.prizesList = this.slot.querySelector('.prizes-list');
    }

    getTimingFunctionGenerator() {
        this.timingFunctionGenerator = function(distance, duration) {
            let slope = distance / duration ;
            return function(t) {
                let deltaDistance = slope * t;
                if (deltaDistance > distance) {
                    return distance;
                }
                return deltaDistance;
            };
        };
    }

    getScrollFunction(distinedScrollDistance, getDeltaDistance) {
        /*let currentPosition = -this.currentPrizeIndex * this.itemHeight,
            prizesListStyle = this.prizesList.style,
            totalHeight = this.totalHeight,
            startTime, deltaTime, deltaDistance;
        let frame = () => {
            deltaTime = Date.now() - startTime;
            let deltaDistance = getDeltaDistance(deltaTime);
            let position = (currentPosition - deltaDistance) % totalHeight;
            prizesListStyle.transform = `translate3d(0, ${position}px, 0)`;
            if (deltaDistance < distinedScrollDistance) {
                window.requestAnimationFrame(frame);
            } else {
                this.currentPosition = prizeIndex;
            }
        };
        return () => {
            startTime = Date.now();
            frame();
        };*/
    }

    /**
     * @desc 抽奖，在指定的时间内滚动至指定的奖项。
     * @param {Number} prizeIndex 奖项序号
     * @param {Number} duration 摇奖时间，单位 ms
      */
    draw({prizeIndex, duration}) {
        let distinedScrollDistance = this.calculateDestinedScrollDistance(prizeIndex);
        let getDeltaDistance = this.timingFunctionGenerator(distinedScrollDistance, duration);
        let currentPosition = -this.currentPrizeIndex * this.itemHeight;
        let startTime;
        let frame = () => {
            let deltaTime = Date.now() - startTime;
            let deltaDistance = getDeltaDistance(deltaTime);
            let position = (currentPosition - deltaDistance) % this.totalHeight;
            this.prizesList.style.transform = `translate3d(0, ${position}px, 0)`;
            if (deltaDistance < distinedScrollDistance) {
                window.requestAnimationFrame(frame);
            } else {
                this.currentPosition = prizeIndex;
            }
        };
        startTime = Date.now();
        frame();
    }

    /**
     * @desc 计算出需要滚动的距离
     */
    calculateDestinedScrollDistance(prizeIndex) {
        let distinedDistance = (prizeIndex - this.currentPrizeIndex + 20 * this.prizes.length) * this.itemHeight;
        return distinedDistance;
    }


}

let slot = new Slot();console.log(slot);
slot.draw({prizeIndex: 1, duration: 2000});
