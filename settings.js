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

// Show notification
function showNotification() {
  const notification = document.getElementById('saveNotification');
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 2000);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const lengthInput = document.getElementById('lengthInput');
  const seedInput = document.getElementById('seedInput');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Load current settings
  const settings = await loadSettings();
  lengthInput.value = settings.length;
  seedInput.value = settings.seed;

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
      showNotification();
    }
  });

  // Reset button handler
  resetBtn.addEventListener('click', async () => {
    lengthInput.value = DEFAULT_SETTINGS.length;
    seedInput.value = DEFAULT_SETTINGS.seed;
    
    const saved = await saveSettings(DEFAULT_SETTINGS.length, DEFAULT_SETTINGS.seed);
    if (saved) {
      showNotification();
    }
  });
});
