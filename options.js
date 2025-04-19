// YouTube Transcript Summarizer - Options Page Script
// This handles saving and loading the API key and theme settings

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Get references to elements
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');
  const themeOptions = document.querySelectorAll('input[name="theme"]');
  
  // Load saved settings when page opens
  loadSettings();
  
  // Add event listener for save button
  saveButton.addEventListener('click', saveSettings);
  
  // Function to load settings from storage
  function loadSettings() {
    chrome.storage.sync.get(['veniceApiKey', 'theme'], (data) => {
      // If we have a saved API key, show it in the input field
      if (data.veniceApiKey) {
        apiKeyInput.value = data.veniceApiKey;
      }
      
      // Set the theme radio button
      if (data.theme) {
        const themeRadio = document.querySelector(`input[name="theme"][value="${data.theme}"]`);
        if (themeRadio) {
          themeRadio.checked = true;
        }
      }
    });
  }
  
  // Function to save settings to storage
  function saveSettings() {
    const apiKey = apiKeyInput.value.trim();
    
    // Validate API key (basic check - not empty)
    if (!apiKey) {
      showStatus('Please enter a valid API key.', 'error');
      return;
    }
    
    // Get selected theme
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    
    // Save to Chrome's sync storage
    chrome.storage.sync.set({ 
      veniceApiKey: apiKey,
      theme: selectedTheme
    }, () => {
      if (chrome.runtime.lastError) {
        showStatus('Error saving settings: ' + chrome.runtime.lastError.message, 'error');
      } else {
        showStatus('Settings saved successfully!', 'success');
      }
    });
  }
  
  // Function to show status messages
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    statusDiv.style.display = 'block';
    
    // Hide status message after 3 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}); 