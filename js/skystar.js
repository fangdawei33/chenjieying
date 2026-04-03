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

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function nextFloatDelay() {
  return randomBetween(FLOAT_INTERVAL_MIN, FLOAT_INTERVAL_MAX);
}

function getViewportWidth() {
  if (window.visualViewport && window.visualViewport.width) {
    return window.visualViewport.width;
  }
  return window.innerWidth || document.documentElement.clientWidth || 0;
}

function isMobileLayout() {
  var viewportWidth = getViewportWidth();
  var hasTouch = !!(navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  return viewportWidth <= 900 || (hasTouch && viewportWidth <= 1280);
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

function clearContainer() {
  var container = document.querySelector('.container');
  if (!container) return;
  container.innerHTML = '';
}

function startMobileOrbit() {
  var container = document.querySelector('.container');
  if (!container) return;

  container.innerHTML = '';

  var shell = document.createElement('div');
  shell.className = 'mobile-orbit-shell';

  var ring = document.createElement('div');
  ring.className = 'mobile-orbit-ring';

  var orbitLines = floatingLines.slice(1, 9);
  while (orbitLines.length < 8) {
    orbitLines.push(floatingLines[orbitLines.length % floatingLines.length]);
  }

  for (var i = 0; i < orbitLines.length; i++) {
    var item = document.createElement('div');
    var angle = (360 / orbitLines.length) * i;
    var radius = i % 2 === 0 ? randomBetween(116, 150) : randomBetween(98, 132);
    var depth = i % 3 === 0 ? randomBetween(12, 40) : randomBetween(-10, 18);

    item.className = 'orbit-item';
    item.textContent = orbitLines[i];
    item.style.setProperty('--angle', angle + 'deg');
    item.style.setProperty('--radius', radius + 'px');
    item.style.setProperty('--depth', depth + 'px');
    item.style.setProperty('--delay', i * 220 + 'ms');

    ring.appendChild(item);
  }

  shell.appendChild(ring);
  container.appendChild(shell);
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

function bootLayout() {
  clearContainer();

  if (isMobileLayout()) {
    startMobileOrbit();
    return;
  }

  startFloatingLoop();
}

window.addEventListener('load', bootLayout);

var textone = document.querySelector('.textone').querySelector('h1');
var texttwo = document.querySelector('.texttwo').querySelector('h1');
var textthree = document.querySelector('.textthree').querySelector('h1');

textone.innerHTML = '陈洁盈，整片星空将为你一人闪烁';
textone.style.color = '#E8F9FD';
textone.style.fontFamily = '楷体';
texttwo.style.color = '#E8F9FD';
texttwo.style.fontFamily = '楷体';
textthree.style.color = '#E8F9FD';
textthree.style.fontFamily = '楷体';
texttwo.innerHTML = '';

window.setTimeout(function () {
  textone.innerHTML = '祝护考顺利';
  texttwo.innerHTML = '希望你考到自己理想的学校';
  textthree.innerHTML = '加油！';
}, 112500);
