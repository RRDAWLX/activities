let prizes = [
        {msg: '一等奖', rank: 1},
        {msg: '二等奖', rank: 2},
        {msg: '三等奖', rank: 3},
        {msg: '四等奖', rank: 4}
    ],
    currentPrize = null,
    turnplate = document.querySelector('.turnplate'),
    currentAngle = 0,
    pointer = document.querySelector('.pointer'),
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

turnplate.addEventListener('transitionend', turnout);
turnplate.addEventListener('webkitTransitionEnd', turnout);

function getARandomPrize() {
    // currentPrize = prizes[Math.floor(Math.random() * prizes.length)];
    let random = Math.random()
    switch (true) {
        case random < 0.1:
            currentPrize = prizes[0];
            break;

        case random < 0.3:
            currentPrize = prizes[1];
            break;

        case random < 0.6:
            currentPrize = prizes[2];
            break;

        default:
            currentPrize = prizes[3]
    }
}

function updateCurrentAngle() {
    let angleOfSector = 360 / prizes.length;
    currentAngle = currentAngle + (360 - currentAngle % 360) +      // 补足角度，恢复至初始状态
        360 * 10 +       // 至少转 10 圈
        angleOfSector * (currentPrize.rank - 1) +     // 补足角度至目标扇形区域起始位置
        5 + Math.random() * (angleOfSector - 10) -     // 目标扇形区域内距离扇形边缘至少 5° 的任意一个角度
        angleOfSector / 2;  // 初始状态下，转盘已经转动了 1/2 个扇形，所以要减去
}

function turn() {
    // turnplate.style = `-webkit-transform: rotateZ(${currentAngle}deg); transform: rotateZ(${currentAngle}deg);`;     // 这种方法存在兼容性问题，不知道为什。
    // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/style
    // 注意不能通过直接给style属性设置字符串（如：elt.style = "color: blue;"）来设置style，因为style应被当成是只读的（尽管Firefox(Gecko), Chrome 和 Opera允许修改它），这是因为通过style属性返回的CSSStyleDeclaration对象是只读的。
    turnplate.style.cssText = `-webkit-transform: rotateZ(${currentAngle}deg); transform: rotateZ(${currentAngle}deg);`;
    // turnplate.setAttribute('style', `-webkit-transform: rotateZ(${currentAngle}deg); transform: rotateZ(${currentAngle}deg);`);
    /*turnplate.style.webkitTransform = `rotateZ(${currentAngle}deg)`;
    turnplate.style.WebkitTransform = `rotateZ(${currentAngle}deg)`;
    turnplate.style.transform = `rotateZ(${currentAngle}deg)`;*/
}

function turnout() {
    setTimeout(() => {
        alert(currentPrize.msg);
        rotating = false;
    }, 500)
}
