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
function showNotification(elementId) {
  const notification = document.getElementById(elementId);
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 2000);
}

// Default settings
const DEFAULT_SETTINGS = {
  length: 32,
  seed: ''
};

// Save settings
async function saveSettings(length, seed) {
  try {
    await chrome.storage.sync.set({
      length: parseInt(length),
      seed: seed
    });
    return true;
  } catch (err) {
    console.error('Failed to save settings:', err);
    return false;
  }
}

// Load settings
async function loadSettings() {
  try {
    const stored = await chrome.storage.sync.get(['length', 'seed']);
    return {
      length: stored.length || DEFAULT_SETTINGS.length,
      seed: stored.seed !== undefined ? stored.seed : DEFAULT_SETTINGS.seed
    };
  } catch (err) {
    console.error('Failed to load settings:', err);
    return DEFAULT_SETTINGS;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const generateBtn = document.getElementById('generateBtn');
  const resultDiv = document.getElementById('result');
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const lengthInput = document.getElementById('lengthInput');
  const seedInput = document.getElementById('seedInput');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Load settings
  let settings = await loadSettings();
  lengthInput.value = settings.length;
  seedInput.value = settings.seed;

  // Generate button click handler
  generateBtn.addEventListener('click', async () => {
    const randomString = generateRandomString(settings.length, settings.seed);
    resultDiv.textContent = randomString;
    resultDiv.classList.remove('hidden');
    
    const copied = await copyToClipboard(randomString);
    if (copied) {
      showNotification('copyNotification');
    }
  });

  // Settings toggle click handler
  settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
    settingsToggle.textContent = settingsPanel.classList.contains('hidden') ? 'Settings' : 'Hide Settings';
  });

  // Save button handler
  saveBtn.addEventListener('click', async () => {
    const length = lengthInput.value;
    const seed = seedInput.value;
    
    if (length < 1 || length > 1000) {
      alert('Length must be between 1 and 1000');
      return;
    }

    const saved = await saveSettings(length, seed);
    if (saved) {
      // Update current settings
      settings.length = parseInt(length);
      settings.seed = seed;
      showNotification('saveNotification');
    }
  });

  // Reset button handler
  resetBtn.addEventListener('click', async () => {
    lengthInput.value = DEFAULT_SETTINGS.length;
    seedInput.value = DEFAULT_SETTINGS.seed;
    
    const saved = await saveSettings(DEFAULT_SETTINGS.length, DEFAULT_SETTINGS.seed);
    if (saved) {
      // Update current settings
      settings.length = DEFAULT_SETTINGS.length;
      settings.seed = DEFAULT_SETTINGS.seed;
      showNotification('saveNotification');
    }
  });
});
