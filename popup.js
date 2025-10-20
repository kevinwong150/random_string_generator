// Simple seeded random number generator using mulberry32
function seededRandom(seed) {
  let state = seed;
  return function() {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate random string
function generateRandomString(length, seed) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  if (seed !== null && seed !== undefined && seed !== '') {
    // Use seeded random
    const rng = seededRandom(parseInt(seed));
    for (let i = 0; i < length; i++) {
      const index = Math.floor(rng() * characters.length);
      result += characters.charAt(index);
    }
  } else {
    // Use crypto random for better randomness
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += characters.charAt(array[i] % characters.length);
    }
  }
  
  return result;
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Show notification
function showNotification() {
  const notification = document.getElementById('copyNotification');
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 2000);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const generateBtn = document.getElementById('generateBtn');
  const resultDiv = document.getElementById('result');
  const settingsLink = document.getElementById('settingsLink');

  // Load settings
  let settings = {
    length: 32,
    seed: ''
  };

  try {
    const stored = await chrome.storage.sync.get(['length', 'seed']);
    if (stored.length) settings.length = stored.length;
    if (stored.seed !== undefined) settings.seed = stored.seed;
  } catch (err) {
    console.log('Using default settings');
  }

  // Generate button click handler
  generateBtn.addEventListener('click', async () => {
    const randomString = generateRandomString(settings.length, settings.seed);
    resultDiv.textContent = randomString;
    resultDiv.classList.remove('hidden');
    
    const copied = await copyToClipboard(randomString);
    if (copied) {
      showNotification();
    }
  });

  // Settings link click handler
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});
