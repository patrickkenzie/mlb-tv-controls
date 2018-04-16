(function () {
  if (window.hasMlbTvControls) {
    return;
  }

  window.hasMlbTvControls = true;

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

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'skip') {
      skip(message.duration, message.back);
    } else if (message.command === 'jump') {
      jump(message.timestamp);
    }
  });
})();
