// Offscreen document for playing audio in Manifest V3
// Service workers cannot play audio directly, so we use an offscreen document

const audioPlayer = document.getElementById('audio-player');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'playSound') {
    playSound(message.sound);
    sendResponse({ success: true });
  }
  return true;
});

function playSound(soundFile) {
  audioPlayer.src = soundFile;
  audioPlayer.volume = 0.7;
  audioPlayer.play().catch(error => {
    console.error('Error playing sound:', error);
  });
}
