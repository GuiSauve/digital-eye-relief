// Offscreen document for playing audio in Manifest V3
// Service workers cannot play audio directly, so we use an offscreen document

const audioPlayer = document.getElementById('audio-player');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'playSound') {
    playSound(message.sound, message.volume ?? 70);
    sendResponse({ success: true });
  }
  return true;
});

function playSound(soundFile, volume = 70) {
  audioPlayer.src = soundFile;
  audioPlayer.volume = volume / 100;
  audioPlayer.play().catch(error => {
    console.error('Error playing sound:', error);
  });
}
