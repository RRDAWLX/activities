let prizes = [
    {image: './laptop.png', msg: '笔记本电脑'},
    {image: './phone.png', msg: '智能手机'},
    {image: './bracelet.png', msg: '智能手环'},
    {image: './earphone.png', msg: '耳机'},
];

let turnover = new Turnover({prizes});
console.log(turnover);
document.body.appendChild(turnover.dom);
document.body.appendChild(turnover.button);
