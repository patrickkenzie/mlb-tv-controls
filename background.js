var controlPort;
browser.runtime.onConnect.addListener(function (port) {
  controlPort = port;
});

browser.commands.onCommand.addListener(function (command) {
  if (controlPort) {
    controlPort.postMessage({command: command});
  }
});

