// 精选句子：定时随机出现在页面上（避开中间主标题区域）
var floatingLines = [
  '陈洁盈，整片星空将为你一人闪烁',
  '愿我如星君如月，夜夜流光相皎洁',
  '玲珑骰子安红豆，入骨相思知不知',
  '人生若只如初见',
  '因为你，我多少适应了这个世界',
  '偷偷表白一个叫陈洁盈的女孩',
  '满船星梦压星河',
  '从前从前，有个人爱你很久',
  '我见青山多妩媚，料青山见我也应如是',
  '取次花丛懒回顾，半缘修道半缘君',
  '春风十里，不如你',
  '今夜，星星只为你亮'
];

var FLOAT_INTERVAL_MIN = 3800;
var FLOAT_INTERVAL_MAX = 7200;
var FLOAT_STAY_MS = 6500;
var MAX_FLOATING = 5;
var TITLE_STAGE_MS = 15000;
var POEM_STAGE_MS = 30000;
var POEM_LINES = [
  '你抬头时，晚风正把星河吹亮',
  '我闭上眼，心事却朝你生长',
  '愿你所愿，都在晨光里安放'
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function nextFloatDelay() {
  return randomBetween(FLOAT_INTERVAL_MIN, FLOAT_INTERVAL_MAX);
}

function pickPosition() {
  var x, y, tries = 0;
  do {
    x = randomBetween(4, 88);
    y = randomBetween(10, 86);
    tries++;
    var inTitle =
      x > 30 && x < 70 && y > 34 && y < 66;
  } while (inTitle && tries < 18);
  return { left: x + 'vw', top: y + 'vh' };
}

function trimFloating(container) {
  while (container.children.length > MAX_FLOATING) {
    var first = container.firstChild;
    if (first) first.remove();
  }
}

function spawnFloatingLine() {
  var container = document.querySelector('.container');
  if (!container) return;

  trimFloating(container);

  var text = floatingLines[Math.floor(Math.random() * floatingLines.length)];
  var el = document.createElement('div');
  el.className = 'floating-line';
  el.textContent = text;

  var pos = pickPosition();
  el.style.left = pos.left;
  el.style.top = pos.top;

  container.appendChild(el);
  requestAnimationFrame(function () {
    el.classList.add('floating-line--show');
  });

  window.setTimeout(function () {
    el.classList.remove('floating-line--show');
    window.setTimeout(function () {
      if (el.parentNode) el.remove();
    }, 700);
  }, FLOAT_STAY_MS);
}

function startFloatingLoop() {
  spawnFloatingLine();
  function schedule() {
    window.setTimeout(function () {
      spawnFloatingLine();
      schedule();
    }, nextFloatDelay());
  }
  schedule();
}

var textoneWrap = document.querySelector('.textone');
var texttwoWrap = document.querySelector('.texttwo');
var textthreeWrap = document.querySelector('.textthree');

var textone = textoneWrap.querySelector('h1');
var texttwo = texttwoWrap.querySelector('h1');
var textthree = textthreeWrap.querySelector('h1');

function setBaseTextStyle() {
  textone.style.color = '#E8F9FD';
  textone.style.fontFamily = '楷体';
  texttwo.style.color = '#E8F9FD';
  texttwo.style.fontFamily = '楷体';
  textthree.style.color = '#E8F9FD';
  textthree.style.fontFamily = '楷体';
}

function showElement(el) {
  el.classList.remove('stage-hidden');
}

function hideElement(el) {
  el.classList.add('stage-hidden');
}

function resetDrop(el) {
  el.classList.remove('stage-drop');
}

function dropOut(el) {
  el.classList.add('stage-drop');
}

function startTimeline() {
  setBaseTextStyle();

  textone.innerHTML = '陈洁盈，整片星空将为你一人闪烁';
  texttwo.innerHTML = '';
  textthree.innerHTML = '';

  showElement(textoneWrap);
  hideElement(texttwoWrap);
  hideElement(textthreeWrap);
  resetDrop(textoneWrap);
  resetDrop(texttwoWrap);
  resetDrop(textthreeWrap);

  window.setTimeout(function () {
    dropOut(textoneWrap);

    window.setTimeout(function () {
      resetDrop(textoneWrap);
      hideElement(textoneWrap);

      textone.innerHTML = POEM_LINES[0];
      texttwo.innerHTML = '';
      textthree.innerHTML = '';
      showElement(textoneWrap);

      window.setTimeout(function () {
        texttwo.innerHTML = POEM_LINES[1];
        showElement(texttwoWrap);
      }, 1800);

      window.setTimeout(function () {
        textthree.innerHTML = POEM_LINES[2];
        showElement(textthreeWrap);
      }, 3600);

      window.setTimeout(function () {
        dropOut(textoneWrap);
        dropOut(texttwoWrap);
        dropOut(textthreeWrap);

        window.setTimeout(function () {
          hideElement(textoneWrap);
          hideElement(texttwoWrap);
          hideElement(textthreeWrap);
          textone.innerHTML = '';
          texttwo.innerHTML = '';
          textthree.innerHTML = '';
          startFloatingLoop();
        }, 900);
      }, POEM_STAGE_MS);
    }, 900);
  }, TITLE_STAGE_MS);
}

window.addEventListener('load', function () {
  startTimeline();
});
