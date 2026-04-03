// 精选句子：定时随机出现在页面上（避开中间主标题区域）
var floatingLines = [
  '💕🥰别被焦虑困住，你一直都在认真努力，护考一定稳稳上岸，夜夜安睡无噩梦💕🥰',
  '💕🥰所有疲惫都会变成底气，放宽心，你超棒的，考试顺顺利利，好梦常伴💕🥰',
  '💕🥰心定则万事安，付出的每一分努力，都会在考场上给你最好的答案💕🥰',
  '💕🥰别太逼自己啦，你已经很努力了，愿你夜夜无噩梦，心安即是归处，护考一定稳稳上岸💕🥰',
  '💕🥰愿你考试顺顺利利，夜夜安睡无噩梦，所有的努力都能在考场上得到最好的回报💕🥰',
  
  
  '💕🥰人生若只如初见💕🥰',
  '💕🥰因为你，我多少适应了这个世界💕🥰',
  '💕🥰偷偷表白一个叫陈洁盈的女孩💕🥰',
  '💕🥰满船星梦压星河💕🥰',
  '❤💕从前从前，有个人爱你很久🥰😉',
  '🥰😉我见青山多妩媚，料青山见我也应如是🥰😉',
  '🥰😉取次花丛懒回顾，半缘修道半缘君🥰😉',
  '🥰😉春风十里，不如你🥰😉',
  '🥰😉愿得一心人，白首不相离🥰😉',
  '🥰😉山有木兮木有枝，心悦君兮君不知🥰😉',
  '🥰😉愿我如星君如月，夜夜流光相皎洁🥰😉',
  '🥰😉今夜，星星只为你亮🥰😉'
];

var FLOAT_INTERVAL_MIN = 3800;
var FLOAT_INTERVAL_MAX = 7200;
var FLOAT_STAY_MS = 6500;
var MAX_FLOATING = 5;
var TITLE_STAGE_MS = 15000;
var POEM_STAGE_MS = 30000;
var currentStage = 'title';
var floatingLoopEnabled = false;
var floatingTimerId = null;
var timelineStarted = false;
var titleToPoemTimerId = null;
var titleFallbackTimerId = null;
var POEM_LINES = [
  '最近你总太累，梦也不安稳',
  '愿晚风轻轻吹，带走所有伤痛',
  '烦恼慢慢消散，噩梦不留痕迹',
  '护考顺顺利利，夜夜睡得沉稳'
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
  if (currentStage !== 'floating') return;

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
  floatingLoopEnabled = true;
  spawnFloatingLine();

  function schedule() {
    if (!floatingLoopEnabled) return;
    floatingTimerId = window.setTimeout(function () {
      spawnFloatingLine();
      schedule();
    }, nextFloatDelay());
  }

  schedule();
}

function stopFloatingLoop() {
  floatingLoopEnabled = false;
  if (floatingTimerId) {
    window.clearTimeout(floatingTimerId);
    floatingTimerId = null;
  }
}

function clearTimelineTimers() {
  if (titleToPoemTimerId) {
    window.clearTimeout(titleToPoemTimerId);
    titleToPoemTimerId = null;
  }
  if (titleFallbackTimerId) {
    window.clearTimeout(titleFallbackTimerId);
    titleFallbackTimerId = null;
  }
}

function clearFloatingContainer() {
  var container = document.querySelector('.container');
  if (!container) return;
  container.innerHTML = '';
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

function forceShow(el) {
  el.classList.remove('stage-hidden');
  el.classList.remove('stage-drop');
}

function forceHide(el) {
  el.classList.add('stage-hidden');
  el.classList.remove('stage-drop');
}

function enterPoemStage() {
  if (currentStage !== 'title') return;

  currentStage = 'poem';
  clearTimelineTimers();

  forceShow(textoneWrap);
  forceHide(texttwoWrap);
  forceHide(textthreeWrap);

  textone.innerHTML = POEM_LINES[0];
  texttwo.innerHTML = '';
  textthree.innerHTML = '';

  window.setTimeout(function () {
    texttwo.innerHTML = POEM_LINES[1];
    forceShow(texttwoWrap);
  }, 1200);

  window.setTimeout(function () {
    textthree.innerHTML = POEM_LINES[2];
    forceShow(textthreeWrap);
  }, 2400);

  window.setTimeout(function () {
    dropOut(textoneWrap);
    dropOut(texttwoWrap);
    dropOut(textthreeWrap);

    window.setTimeout(function () {
      forceHide(textoneWrap);
      forceHide(texttwoWrap);
      forceHide(textthreeWrap);
      textone.innerHTML = '';
      texttwo.innerHTML = '';
      textthree.innerHTML = '';
      currentStage = 'floating';
      startFloatingLoop();
    }, 900);
  }, POEM_STAGE_MS);
}

function startTimeline() {
  if (!textoneWrap || !texttwoWrap || !textthreeWrap || !textone || !texttwo || !textthree) {
    return;
  }

  currentStage = 'title';
  stopFloatingLoop();
  clearTimelineTimers();
  clearFloatingContainer();

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

  titleToPoemTimerId = window.setTimeout(function () {
    dropOut(textoneWrap);

    window.setTimeout(function () {
      enterPoemStage();
    }, 900);
  }, TITLE_STAGE_MS);

  titleFallbackTimerId = window.setTimeout(function () {
    enterPoemStage();
  }, TITLE_STAGE_MS + 1200);
}

function bootTimelineOnce() {
  if (timelineStarted) return;
  timelineStarted = true;
  startTimeline();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    bootTimelineOnce();
  });
} else {
  bootTimelineOnce();
}
