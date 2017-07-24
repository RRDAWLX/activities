class Turnover {
    constructor({prizes}) {
        // 0 正在初始化
        // 1 初始化完成
        // 2 正在准备抽奖
        // 3 抽奖准备完成
        // 4 抽奖中
        // 5 抽奖完成
        this.status = 0;
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
                let target = e.target;
                while (target) {
                    if (target.classList.contains('card-container')) {
                        this.status = 4;
                        console.log('drawing');
                        this.currentCardIndex = target.getAttribute('data-order');

                        new Promise(resolve => {
                            // 在这里向后端发起请求，抽奖。
                            setTimeout(() => {
                                let prize = Math.floor(Math.random() * 4);
                                resolve(prize);
                            }, 100);
                        }).then((prize) => {
                            this.currentPrizeIndex = prize;
                            let prizes = this.prizes.slice(0);
                            prizes.splice(this.currentPrizeIndex, 1);
                            prizes.sort(() => {
                                return Math.random() - 0.5;
                            }).splice(this.currentCardIndex, 0, this.prizes[this.currentPrizeIndex]);
                            this.setPrizes(prizes);

                            /*console.log(this.prizes.map(prize => prize.image));
                            console.log(prizes.map(prize => prize.image));
                            console.log(prize);*/

                            return prize;
                        }).then(() => {
                            return this.turnCardToFront(this.cards[this.currentCardIndex].card);
                        }).then(() => {
                            return Promise.all(
                                this.cards.filter((card, index) => {
                                    return index != this.currentCardIndex;
                                }).map(card => {
                                    return this.turnCardToFront(card.card);
                                })
                            );
                        }).then(() => {
                            this.status = 5;
                            console.log('drawn: animations done');
                        });
                        break;
                    }
                    target = target.parentElement;
                }
            }
        }, false);

        this.button.addEventListener('click', () => {
            if (this.status == 5 || this.status == 1) {
                this.prepareForDrawing();
            }
        }, false);
    }

    turnCardToFront(cardDom) {
        return cardDom.animate([
            {transform: 'rotateY(180deg)'},
            {transform: 'rotateY(0deg)'}
        ], {
            duration: 500,
            fill: 'both'
        }).finished;
    }

    turnCardToBack(cardDom) {
        return cardDom.animate([
            {transform: 'rotateY(0deg)'},
            {transform: 'rotateY(180deg)'}
        ], {
            duration: 500,
            fill: 'both'
        }).finished;
    }

    prepareForDrawing() {
        this.status = 2;
        Promise.all([
            // card0
            this.turnCardToBack(this.cards[0].card).then(() => {
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
            this.turnCardToBack(this.cards[1].card).then(() => {
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
            this.turnCardToBack(this.cards[2].card).then(() => {
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
            this.turnCardToBack(this.cards[3].card).then(() => {
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
            this.resetPrizes();
            this.status = 3;
            console.log('prepared: animations done');
        });
    }

    setPrizes(prizes) {
        this.cards.forEach((card, index) => {
            card.setPrize(prizes[index]);
        });
    }

    resetPrizes() {
        this.cards.forEach(card => {
            card.resetPrize();
        });
    }
}
