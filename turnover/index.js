let prizes = [
    {image: './bracelet.png'},
    {image: './earphone.png'},
    {image: './laptop.png'},
    {image: './phone.png'}
];

let turnover = new Turnover({prizes});  console.log(turnover);
let button = document.querySelector('#button');
document.body.appendChild(turnover.dom);
document.body.appendChild(turnover.button);
