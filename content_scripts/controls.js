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

  function createButton(label, cls, value) {
    let button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.value = value;
    button.classList.add(cls);

    return button;
  }

  function createWrapper() {
    let wrapper = document.createElement('div');

    wrapper.classList.add('mlb-tv-controls');
    wrapper.innerHTML = '';
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

  let restart = createButton('|<', 'jump', 0);
  let skip10 = createButton('+10', 'skip', 10);
  let skip110 = createButton('+1m40s', 'skip', 110);
  let skip300 = createButton('+5m', 'skip', 300);

  wrapper.appendChild(restart);
  wrapper.appendChild(skip10);
  wrapper.appendChild(skip110);
  wrapper.appendChild(skip300);
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
