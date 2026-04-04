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
var POEM_STAGE_MS = 14000;
var POEM_LINE_INTERVAL_MS = 1600;
var currentStage = 'title';
var floatingLoopEnabled = false;
var floatingTimerId = null;
var timelineStarted = false;
var titleToPoemTimerId = null;
var titleFallbackTimerId = null;
var MAIN_FONT_STACK = "'STKaiti', 'KaiTi', 'Kaiti SC', 'Songti SC', 'Noto Serif SC', 'Source Han Serif SC', 'PingFang SC', 'Microsoft YaHei', serif";
var POEM_LINES = [
  '你为梦想走过的每一步，都算数',
  '那些熬过的夜，终会在清晨发光',
  '焦虑会散去，底气会慢慢长成翅膀',
  '愿你提笔从容，落笔有光',
  '护考一路顺风，答案都写成希望'
];
var FINAL_TITLE_LINES = [
  '祝护考顺利',
  '希望你考到自己理想的学校',
  '加油！'
];
var bgmAudio = document.getElementById('bgm');
var bgmUnlockBtn = document.getElementById('bgm-unlock');
var bgmUnlocked = false;
var finalTitleResizeBound = false;

function showBgmUnlockBtn() {
  if (!bgmUnlockBtn) return;
  bgmUnlockBtn.classList.add('is-visible');
}

function hideBgmUnlockBtn() {
  if (!bgmUnlockBtn) return;
  bgmUnlockBtn.classList.remove('is-visible');
}

function tryPlayBgm() {
  if (!bgmAudio) return;
  var playResult = bgmAudio.play();
  if (playResult && typeof playResult.then === 'function') {
    playResult.then(function () {
      bgmUnlocked = true;
      hideBgmUnlockBtn();
    }).catch(function () {
      // Autoplay may be blocked until first user gesture.
      showBgmUnlockBtn();
    });
  } else {
    window.setTimeout(function () {
      if (!bgmAudio.paused) {
        bgmUnlocked = true;
        hideBgmUnlockBtn();
      } else {
        bgmUnlocked = false;
        showBgmUnlockBtn();
      }
    }, 150);
  }
}

function unlockBgmOnGesture() {
  if (bgmUnlocked) return;
  tryPlayBgm();
}

function initBgm() {
  if (!bgmAudio) return;

  bgmAudio.volume = 0.8;
  bgmAudio.preload = 'auto';
  bgmAudio.muted = false;
  bgmAudio.load();
  tryPlayBgm();

  if (bgmUnlockBtn) {
    bgmUnlockBtn.addEventListener('click', function () {
      tryPlayBgm();
    });
  }

  var gestureEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];
  gestureEvents.forEach(function (eventName) {
    document.addEventListener(eventName, unlockBgmOnGesture, { passive: true });
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && bgmAudio.paused) {
      tryPlayBgm();
    }
  });

  bgmAudio.addEventListener('canplay', function () {
    if (bgmAudio.paused) {
      tryPlayBgm();
    }
  });

  bgmAudio.addEventListener('play', function () {
    bgmUnlocked = true;
    hideBgmUnlockBtn();
  });

  bgmAudio.addEventListener('pause', function () {
    if (!document.hidden) {
      showBgmUnlockBtn();
    }
  });
}

function layoutFinalTitle() {
  if (!textoneWrap || !texttwoWrap || !textthreeWrap) return;
  if (currentStage !== 'floating') return;

  var vh = window.innerHeight || document.documentElement.clientHeight || 800;
  var topStart = Math.round(vh * 0.14);
  var gap = Math.max(16, Math.round(vh * 0.02));

  textoneWrap.style.top = topStart + 'px';
  textoneWrap.style.bottom = 'auto';

  var oneHeight = textoneWrap.offsetHeight || 60;
  var secondTop = topStart + oneHeight + gap;

  texttwoWrap.style.top = secondTop + 'px';
  texttwoWrap.style.bottom = 'auto';

  var twoHeight = texttwoWrap.offsetHeight || 90;
  var thirdTop = secondTop + twoHeight + gap;
  var maxThirdTop = Math.round(vh * 0.82);
  if (thirdTop > maxThirdTop) thirdTop = maxThirdTop;

  textthreeWrap.style.top = thirdTop + 'px';
  textthreeWrap.style.bottom = 'auto';
}

function bindFinalTitleResize() {
  if (finalTitleResizeBound) return;
  finalTitleResizeBound = true;
  window.addEventListener('resize', function () {
    if (currentStage === 'floating') {
      layoutFinalTitle();
    }
  });
}

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
    var inTitle;
    if (currentStage === 'floating') {
      inTitle = x > 16 && x < 84 && y > 22 && y < 82;
    } else {
      inTitle = x > 30 && x < 70 && y > 34 && y < 66;
    }
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
var textfourWrap = document.querySelector('.textfour');
var textfiveWrap = document.querySelector('.textfive');
var textsixWrap = document.querySelector('.textsix');

var textone = textoneWrap.querySelector('h1');
var texttwo = texttwoWrap.querySelector('h1');
var textthree = textthreeWrap.querySelector('h1');
var textfour = textfourWrap ? textfourWrap.querySelector('h1') : null;
var textfive = textfiveWrap ? textfiveWrap.querySelector('h1') : null;
var textsix = textsixWrap ? textsixWrap.querySelector('h1') : null;

var poemWraps = [textoneWrap, texttwoWrap, textthreeWrap, textfourWrap, textfiveWrap, textsixWrap].filter(Boolean);
var poemTexts = [textone, texttwo, textthree, textfour, textfive, textsix].filter(Boolean);

function setBaseTextStyle() {
  textone.style.color = '#E8F9FD';
  textone.style.fontFamily = MAIN_FONT_STACK;
  texttwo.style.color = '#E8F9FD';
  texttwo.style.fontFamily = MAIN_FONT_STACK;
  textthree.style.color = '#E8F9FD';
  textthree.style.fontFamily = MAIN_FONT_STACK;
  if (textfour) {
    textfour.style.color = '#E8F9FD';
    textfour.style.fontFamily = MAIN_FONT_STACK;
  }
  if (textfive) {
    textfive.style.color = '#E8F9FD';
    textfive.style.fontFamily = MAIN_FONT_STACK;
  }
  if (textsix) {
    textsix.style.color = '#E8F9FD';
    textsix.style.fontFamily = MAIN_FONT_STACK;
  }
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

function setPoemMode(enabled) {
  poemWraps.forEach(function (wrap) {
    if (!wrap) return;
    if (enabled) {
      wrap.classList.add('poem-line');
    } else {
      wrap.classList.remove('poem-line');
    }
  });
}

function setFinalTitleMode(enabled) {
  [textoneWrap, texttwoWrap, textthreeWrap].forEach(function (wrap) {
    if (!wrap) return;
    if (enabled) {
      wrap.classList.add('final-title');
    } else {
      wrap.classList.remove('final-title');
    }
  });
}

function enterFinalFloatingStage() {
  setPoemMode(false);
  setFinalTitleMode(true);
  bindFinalTitleResize();

  textone.innerHTML = FINAL_TITLE_LINES[0] || '';
  texttwo.innerHTML = FINAL_TITLE_LINES[1] || '';
  textthree.innerHTML = FINAL_TITLE_LINES[2] || '';

  forceShow(textoneWrap);
  forceShow(texttwoWrap);
  forceShow(textthreeWrap);

  [textfourWrap, textfiveWrap, textsixWrap].forEach(function (wrap) {
    if (!wrap) return;
    forceHide(wrap);
  });

  [textfour, textfive, textsix].forEach(function (textEl) {
    if (!textEl) return;
    textEl.innerHTML = '';
  });

  currentStage = 'floating';
  window.requestAnimationFrame(function () {
    layoutFinalTitle();
  });
  startFloatingLoop();
}

function revealPoemLine(index) {
  if (!poemTexts[index] || !poemWraps[index]) return;
  poemTexts[index].innerHTML = POEM_LINES[index] || '';
  window.requestAnimationFrame(function () {
    forceShow(poemWraps[index]);
  });
}

function enterPoemStage() {
  if (currentStage !== 'title') return;

  currentStage = 'poem';
  clearTimelineTimers();

  setPoemMode(true);
  poemWraps.forEach(function (wrap) {
    forceHide(wrap);
  });
  poemTexts.forEach(function (textEl) {
    textEl.innerHTML = '';
  });

  var totalLines = Math.min(POEM_LINES.length, poemTexts.length);
  for (var i = 0; i < totalLines; i++) {
    (function (idx) {
      window.setTimeout(function () {
        revealPoemLine(idx);
      }, idx * POEM_LINE_INTERVAL_MS);
    })(i);
  }

  window.setTimeout(function () {
    poemWraps.forEach(function (wrap) {
      dropOut(wrap);
    });

    window.setTimeout(function () {
      poemWraps.forEach(function (wrap) {
        forceHide(wrap);
      });
      poemTexts.forEach(function (textEl) {
        textEl.innerHTML = '';
      });
      enterFinalFloatingStage();
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
  poemTexts.forEach(function (textEl, index) {
    if (index === 0) return;
    textEl.innerHTML = '';
  });

  showElement(textoneWrap);
  setFinalTitleMode(false);
  poemWraps.forEach(function (wrap, index) {
    if (index === 0) {
      resetDrop(wrap);
      return;
    }
    hideElement(wrap);
    resetDrop(wrap);
  });

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
  initBgm();
  startTimeline();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    bootTimelineOnce();
  });
} else {
  bootTimelineOnce();
}
