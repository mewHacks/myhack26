let alarmAudio;

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "PLAY_ALARM") {
    return;
  }
  if (!alarmAudio) {
    alarmAudio = new Audio(chrome.runtime.getURL("alarm.mp3"));
    alarmAudio.preload = "auto";
  }
  alarmAudio.currentTime = 0;
  void alarmAudio.play();
});
