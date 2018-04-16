function listen() {
  document.addEventListener("click", (e) => {
    function seek(tabs) {
      var command = {};
      if (e.target.classList.contains('skip')) {
        command.command = 'skip';
        command.duration = e.target.value;
      } else if (e.target.classList.contains('jump')) {
        command.command = 'jump';
        command.timestamp = e.target.value;
      }

      browser.tabs.sendMessage(tabs[0].id, command);
    }

    function onError(error) {
      console.error(`MLB TV Controls: ${error}`);
    }

    browser.tabs.query({active: true, currentWindow: true})
      .then(seek)
      .catch(onError);
  });
}

function onScriptError(error) {
  document.querySelector('#popup-content').classList.add('hidden');
  document.querySelector('#error-content').classList.remove('hidden');
  console.error(`Failed to execute MLB TV Content script: ${error.message}`);
}

browser.tabs.executeScript({file: '/content_scripts/controls.js'})
  .then(listen)
  .catch(onScriptError);
