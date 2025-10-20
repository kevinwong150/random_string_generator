// Background service worker for the extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Random String Generator extension installed');
  
  // Set default settings if not already set
  chrome.storage.sync.get(['length', 'seed'], (result) => {
    if (!result.length) {
      chrome.storage.sync.set({
        length: 32,
        seed: ''
      });
    }
  });
});
