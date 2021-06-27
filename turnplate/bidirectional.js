let prizes = [
        {msg: '一等奖', rank: 1},
        {msg: '二等奖', rank: 2},
        {msg: '三等奖', rank: 3},
        {msg: '四等奖', rank: 4}
    ],
    currentPrize = null,
    turnplate = document.querySelector('.turnplate'),
    currentTurnplateAngle = 0,
    pointer = document.querySelector('.pointer'),
    currentPointerAngle = 0,
    rotating = false;

pointer.addEventListener('click', function(e){
    if (rotating) {
        console.log('It is rotating.');
        return;
    }
    getARandomPrize();
    updateCurrentAngle();
    turn();
});

pointer.addEventListener('transitionend', turnout);

function getARandomPrize() {
    currentPrize = prizes[Math.floor(Math.random() * prizes.length)];
}

function updateCurrentAngle() {
    let angleOfSector = 360 / prizes.length;
    let minTurns1 = 10 // 转盘最小转动圈数
    currentTurnplateAngle += 360 * (minTurns1 + Math.random()) // 转盘顺时针随意转动一个角度
    turnplateOffest = currentTurnplateAngle % 360 // 转盘相对于初始位置的偏移角度
    let minTurns2 = 7 // 指针最小转动圈数
    // 指针逆时针转动
    currentPointerAngle -= minTurns2 * 360 // 先转动最少圈数
    currentPointerAngle -= (360 - Math.abs(currentPointerAngle) % 360 )  // 补足角度，恢复至初始状态
    // 初始状态下，指针指向转盘第一个扇形的中间。指针顺时针转动半个扇形角度，使其指向第一个扇形的右边缘。
    currentPointerAngle += angleOfSector / 2
    // 计算在转盘相对初始位置没有任何转动的情况下指针应该转动的角度
    currentPointerAngle -= angleOfSector * (currentPrize.rank - 1) // 补足角度至目标扇形区域右边缘
        + 5 + Math.random() * (angleOfSector - 10) // 目标扇形区域内距离扇形边缘至少 5° 的任意一个角度
    // 转盘相对于初始位置顺时针转动了turnplateOffset度，所以指针可以逆时针少转动turnplateOffset度
    currentPointerAngle += turnplateOffest
}

function turn() {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/style
    // 注意不能通过直接给style属性设置字符串（如：elt.style = "color: blue;"）来设置style，因为style应被当成是只读的（尽管Firefox(Gecko), Chrome 和 Opera允许修改它），这是因为通过style属性返回的CSSStyleDeclaration对象是只读的。
    turnplate.style.cssText = `transform: rotateZ(${currentTurnplateAngle}deg);`;
    pointer.style.cssText = `transform: rotateZ(${currentPointerAngle}deg);`;
}

function turnout() {
    setTimeout(() => {
        alert(currentPrize.msg);
        rotating = false;
    }, 100);
}
