class Turnover {
    constructor({prizes}) {
        this.status = 0;    // 0： 正在初始化，1： 初始化完成，2： 正在准备抽奖，3： 抽奖准备完成，4： 抽奖中，5： 抽奖完成
        this.prizes = prizes;
        this.createDom();
        this.addListeners();
        this.status = 1;
    }

    createDom() {
        this.cards = this.prizes.map((prize, order) => {
            let card = new Card({order});
            card.setPrize(prize);
            return card;
        });
        this.dom = document.createElement('div');
        this.dom.className = 'turnover';
        this.cards.forEach(card => {
            this.dom.appendChild(card.dom);
        });
        this.button = document.createElement('div');
        this.button.className = 'button';
        this.button.textContent = '抽奖';
    }

    addListeners() {
        this.dom.addEventListener('click', e => {
            if (turnover.status == 3) {
                this.status = 4;    // 立即设置状态为4，防止连续触发抽奖。
                let target = e.target;
                while (target) {    // 从目标元素逐层往外查找 .card-container 元素
                    if (target.classList.contains('card-container')) {
                        break;
                    }
                    target = target.parentElement;
                }

                if (target) {
                    console.log('drawing');
                    this.currentCardIndex = target.getAttribute('data-order');

                    new Promise(resolve => {
                        // 在这里向后端发起请求，抽奖。
                        setTimeout(() => {
                            let random = Math.random()
                            // 中奖概率在这调整
                            switch (true) {
                                case random < 0.1:
                                    resolve(0);
                                    break;

                                case random < 0.3:
                                    resolve(1);
                                    break;

                                case random < 0.6:
                                    resolve(2);
                                    break;

                                default:
                                    resolve(3);
                            }
                            /*let prizeIndex = Math.floor(Math.random() * 4);
                            resolve(prizeIndex);*/
                        }, 100);
                    }).then(prizeIndex => {
                        // 在被点击的牌上放置目标奖项的图片，其他牌上随机放置其他奖项的图片。
                        this.currentPrizeIndex = prizeIndex;
                        let prizes = this.prizes.slice(0);
                        prizes.splice(this.currentPrizeIndex, 1);
                        prizes.sort(() => {
                            return Math.random() - 0.5;
                        }).splice(this.currentCardIndex, 0, this.prizes[this.currentPrizeIndex]);
                        this.setPrizes(prizes);

                        /*console.log(this.prizes.map(prize => prize.image));
                        console.log(prizes.map(prize => prize.image));
                        console.log(prize);*/
                    }).then(() => {
                        // 翻开被点击的牌
                        return this.turnCardToFront(this.cards[this.currentCardIndex]);
                    }).then(() => {
                        // 翻开其他牌
                        return Promise.all(
                            this.cards.filter((card, index) => {
                                return index != this.currentCardIndex;
                            }).map(card => {
                                return this.turnCardToFront(card);
                            })
                        );
                    }).then(() => {
                        // 修改翻牌游戏的状态
                        this.status = 5;
                        console.log('drawn: animations done');
                        alert(this.prizes[this.currentPrizeIndex].msg);
                    });
                } else {
                    this.status = 3;    // 回退到状态3
                }
            }
        }, false);

        this.button.addEventListener('click', () => {
            if (this.status == 5 || this.status == 1) {
                this.prepareForDrawing();
            }
        }, false);
    }

    turnCardToFront(card) {
        return card.turnToFront();
    }

    turnCardToBack(card) {
        return card.turnToBack();
    }

    prepareForDrawing() {
        console.log('preparing');
        this.status = 2;
        Promise.all([
            // card0，先翻到背面，再移到中间，最后移回到初始位置。
            this.turnCardToBack(this.cards[0]).then(() => {
                return this.cards[0].dom.animate([
                    {transform: 'translate3d(-100%, -100%, 0)'},
                    {transform: 'translate3d(-50%, -50%, 0)', offset: 0.35},
                    {transform: 'translate3d(-50%, -50%, 0)', offset: 0.65},
                    {transform: 'translate3d(-100%, -100%, 0)'}
                ], {
                    duration: 1200
                }).finished;
            }),

            // card1
            this.turnCardToBack(this.cards[1]).then(() => {
                return this.cards[1].dom.animate([
                    {transform: 'translate3d(0, -100%, 0)'},
                    {transform: 'translate3d(-50%, -50%, 0)', offset: 0.35},
                    {transform: 'translate3d(-50%, -50%, 0)', offset: 0.65},
                    {transform: 'translate3d(0, -100%, 0)'}
                ], {
                    duration: 1200
                }).finished;
            }),

            // card2
            this.turnCardToBack(this.cards[2]).then(() => {
                return this.cards[2].dom.animate([
                    {transform: 'translate3d(-100%, 0, 0)'},
                    {transform: 'translate3d(-50%, -50%, 0)', offset: 0.35},
                    {transform: 'translate3d(-50%, -50%, 0)', offset: 0.65},
                    {transform: 'translate3d(-100%, 0, 0)'}
                ], {
                    duration: 1200
                }).finished;
            }),

            // card3
            this.turnCardToBack(this.cards[3]).then(() => {
                return this.cards[3].dom.animate([
                    {transform: 'translate3d(0, 0, 0)'},
                    {transform: 'translate3d(-50%, -50%, 0)', offset: 0.35},
                    {transform: 'translate3d(-50%, -50%, 0)', offset: 0.65},
                    {transform: 'translate3d(0, 0, 0)'}
                ], {
                    duration: 1200
                }).finished;
            })
        ]).then(() => {
            this.clearPrizes();
            this.status = 3;
            console.log('prepared: animations done');
        });
    }

    setPrizes(prizes) {
        this.cards.forEach((card, index) => {
            card.setPrize(prizes[index]);
        });
    }

    clearPrizes() {
        this.cards.forEach(card => {
            card.clearPrize();
        });
    }
}
