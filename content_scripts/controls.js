var mlbTvPort;
let setup = function () {
  if (window.hasMlbTvControls) {
    clearTimeout(waiter);
    return;
  }

  // Wait for player to load
  let container = document.querySelector('.bottom-controls-container');
  if (container) {
    window.hasMlbTvControls = true;
  } else {
    waiter = setTimeout(setup, 100);
    return;
  }

  let config = {
    restart: {type: 'jump', value: 0},
    skip_short_back: {type: 'skip', value: -10},
    skip_short: {type: 'skip', value: 10},
    skip_med: {type: 'skip', value: 110},
    skip_long: {type: 'skip', value: 300}
  };

  // Remove game length spoilers
  document.querySelector('.scrubber-bar-wrapper').remove();
  document.querySelector('.time-bar').remove();
  document.querySelector('.controls__button-live').remove();
  document.querySelector('.bottom-controls-container').style.height = 'auto';

  // Setup listener for keyboard shortcuts
  var port = browser.runtime.connect();
  port.onMessage.addListener(onMessage);

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

  function onMessage(message) {
    let settings = config[message.command];

    if (typeof settings !== 'object' || !settings.hasOwnProperty('type')){
      return;
    }

    if (settings.type === 'skip') {
      skip(settings.value);
    }

    if (settings.type === 'jump') {
      jump(settings.value);
    }
  }

  function createButton(wrap, key) {
    let settings = config[key];

    let button = document.createElement('button');
    button.type = 'button';
    button.value = settings.value;
    button.title = settings.type + ' ' + settings.value + 's';
    button.classList.add(settings.type);
    button.classList.add('media-control');

    let img = document.createElement('img');
    img.src = browser.extension.getURL('icons/' + key + '.png');
    img.alt = button.title;

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

  createButton(wrapper, 'restart');
  createButton(wrapper, 'skip_short_back');
  createButton(wrapper, 'skip_short');
  createButton(wrapper, 'skip_med');
  createButton(wrapper, 'skip_long');

  controls.appendChild(wrapper);
}

let waiter = setTimeout(setup, 500);
