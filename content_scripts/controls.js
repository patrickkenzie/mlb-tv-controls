let setup = function () {
  if (window.hasMlbTvControls) {
    clearTimeout(waiter);
    return;
  }

  let container = document.querySelector('.bottom-controls-container');
  if (container) {
    window.hasMlbTvControls = true;
  } else {
    waiter = setTimeout(setup, 100);
    return;
  }

  function getVideo() {
    return document.querySelector('#bam-video-player video');
  }

  function skip(duration, back) {
    if (back) {
      duration *= -1;
    }

    getVideo().currentTime += duration;
  }

  function jump(timestamp) {
    getVideo().currentTime = timestamp;
  }

  function createButton(wrap, cls, value, icon) {
    let button = document.createElement('button');
    button.type = 'button';
    button.value = value;
    button.classList.add(cls);

    let img = document.createElement('img');
    img.src = browser.extension.getURL('icons/' + icon + '.png');
    img.title = cls + ' ' + value;

    button.appendChild(img);
    wrap.appendChild(button);
  }

  function createWrapper() {
    let wrapper = document.createElement('div');

    wrapper.classList.add('mlb-tv-controls');
    wrapper.addEventListener('click', (e) => {
      if (e.target.tagName != "BUTTON") {
        return;
      }

      let value = parseInt(e.target.value);

      if (e.target.classList.contains('skip')) {
        skip(value);
      } else if (e.target.classList.contains('jump')) {
        jump(value);
      }
    });

    return wrapper;
  }

  let controls = container.querySelector('.bottom-controls-left');
  let check = controls.querySelector('.mlb-tv-controls');
  if (check) {
    check.innerHTML = '';
  }

  let wrapper = check || createWrapper();

  createButton(wrapper, 'jump', 0, 'restart');
  createButton(wrapper, 'skip', -30, 'backward_short');
  createButton(wrapper, 'skip', 10, 'forward_short');
  createButton(wrapper, 'skip', 110, 'forward_medium');
  createButton(wrapper, 'skip', 300, 'forward_long');

  controls.appendChild(wrapper);

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'skip') {
      skip(message.duration, message.back);
    } else if (message.command === 'jump') {
      jump(message.timestamp);
    }
  });
}

let waiter = setTimeout(setup, 500);
