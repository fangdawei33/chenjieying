// poem
var words=[
    '伤心桥下春波绿',
    '曾是惊鸿照影来',
    '当年明月在',
    '曾照彩云归',
    '归去来兮',
    '真堪偕隐',
    '画船听雨眠',
    '愿为江水',
    '与君重逢',
    '一日不见兮',
    '思之若狂',
    '好想回到那个夏天',
    '趴在桌子上偷偷看你',
    '偷偷表白一个叫陈洁盈的女孩',
    '你曾是我灰色人生中的一道彩虹',
    '柳絮空缱绻',
    '南风知不知',
    '我见青山多妩媚',
    '料青山见我也应如是',
    '取次花丛懒回顾',
    '半缘修道半缘君',
    '三笑徒然当一痴',
    '人生若只如初见',
    '我余光中都是你',
    '人生自是有情痴',
    '此恨不关风与月',
    '因为你，我多少适应了这个世界',
    '春蚕到死丝方尽',
    '蜡炬成灰泪始干',
    '今夜何夕',
    '见此良人',
    '愿我如星君如月',
    '夜夜流光相皎洁',
    '情不所起',
    '一往而深',
    '玲珑骰子安红豆',
    '入骨相思知不知',
    '多情只有春庭月',
    '尤为离人照落花',
    '若有知音见采',
    '不辞唱遍阳春',
    '休言半纸无多重',
    '万斛离愁尽耐担',
    '夜月一帘幽梦',
    '和光同尘',
    '杳霭流玉',
    '月落星沉',
    '霞姿月韵',
    '喜上眉梢',
    '醉后不知天在水',
    '满船星梦压星河',
    '落花人独立',
    '微雨燕双飞',
    '掬水月在手',
    '弄花香满衣',
    '夜深忽梦少年事',
    '唯梦闲人不梦君',
    '垆边人似月',
    '皓腕凝霜雪',
    '众里嫣然通一顾',
    '人间颜色如尘土',
    '若非群玉山头见',
    '会向瑶台月下逢',
    '沉鱼落雁鸟惊喧',
    '羞花闭月花愁颤',
    '解释春风无限恨',
    '沉香亭北倚阑干'
];
function randomNum(min,max){
    var num = (Math.random()*(max-min+1)+min).toFixed(2);
    return num;
}
function pickFloatingXY(isMobile, idx) {
    if (!isMobile) {
        return {
            top: randomNum(4, 92) + 'vh',
            left: randomNum(4, 92) + 'vw'
        };
    }
    // Mobile: deterministic anchors, always spread around edges.
    var anchors = [
        { top: '8vh', left: '6vw' },   { top: '16vh', left: '8vw' },  { top: '26vh', left: '5vw' },
        { top: '76vh', left: '7vw' },  { top: '86vh', left: '10vw' }, { top: '94vh', left: '6vw' },
        { top: '10vh', left: '74vw' }, { top: '18vh', left: '79vw' }, { top: '28vh', left: '76vw' },
        { top: '74vh', left: '75vw' }, { top: '84vh', left: '80vw' }, { top: '93vh', left: '77vw' },
        { top: '4vh', left: '28vw' },  { top: '6vh', left: '44vw' },  { top: '8vh', left: '58vw' },
        { top: '96vh', left: '27vw' }, { top: '94vh', left: '43vw' }, { top: '92vh', left: '57vw' },
        { top: '34vh', left: '3vw' },  { top: '52vh', left: '4vw' },  { top: '68vh', left: '3vw' },
        { top: '35vh', left: '84vw' }, { top: '52vh', left: '86vw' }, { top: '67vh', left: '84vw' },
        { top: '12vh', left: '90vw' }, { top: '88vh', left: '90vw' }, { top: '12vh', left: '2vw' },
        { top: '88vh', left: '2vw' }
    ];
    return anchors[idx % anchors.length];
}
function init(){
    let container = document.querySelector('.container');
    let f = document.createDocumentFragment();
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const activeWords = isMobile ? words.slice(0, 28) : words;
    container.innerHTML = '';
    activeWords.forEach((w, idx)=>{
    let word_box = document.createElement('div');
    let word = document.createElement('div');
        word.innerText = w;
        word.classList.add('word');
        word.style.color = '#BAABDA';
        word.style.fontFamily = '楷体';
        word.style.fontSize = isMobile ? '12px' : '20px'
        word_box.classList.add('word-box');
        var pos = pickFloatingXY(isMobile, idx);
        word_box.style.top = pos.top;
        word_box.style.left = pos.left;
        word_box.style.setProperty("--animation-duration",(isMobile ? randomNum(14,26) : randomNum(8,20))+'s');
        word_box.style.setProperty("--animation-delay",randomNum(-20,0)+'s');
        
        word_box.appendChild(word);
        f.appendChild(word_box);


    })
    container.appendChild(f);
}
window.addEventListener('load',init);
let textone = document.querySelector('.textone').querySelector('h1');
      let texttwo = document.querySelector('.texttwo').querySelector('h1');
      let textthree = document.querySelector('.textthree').querySelector('h1');

      setTimeout(function(){
        textone.innerHTML = '今晚，整片星空将为你一人闪烁';
          textone.style.color = '#E8F9FD';
          textone.style.fontFamily = '楷体'
          texttwo.style.color = '#E8F9FD';
          texttwo.style.fontFamily = '楷体'
          textthree.style.color = '#E8F9FD';
          textthree.style.fontFamily = '楷体'
          texttwo.innerHTML = '';
      },28000)
      setTimeout(function(){
        textone.innerHTML = '从前从前,有个人爱你很久';
        texttwo.innerHTML = '但偏偏，风渐渐';
        textthree.innerHTML = '把距离吹的好远';
      },112500)


 
