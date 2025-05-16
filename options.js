// YouTube Transcript Summarizer - Options Page Script
// This handles saving and loading the API key and theme settings

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Get references to elements
  const apiKeyInput = document.getElementById('apiKey');
  const toggleApiKeyBtn = document.getElementById('toggleApiKey');
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');
  const themeOptions = document.querySelectorAll('input[name="theme"]');
  const modelOptions = document.querySelectorAll('input[name="model"]');
  
  // Load saved settings when page opens
  loadSettings();
  
  // Add event listener for save button
  saveButton.addEventListener('click', saveSettings);
  
  // Add event listeners for option cards
  setupOptionCards();
  
  // Add event listener for API key toggle
  if (toggleApiKeyBtn) {
    toggleApiKeyBtn.addEventListener('click', toggleApiKeyVisibility);
  }
  
  // Function to toggle API key visibility
  function toggleApiKeyVisibility() {
    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      toggleApiKeyBtn.classList.add('showing');
    } else {
      apiKeyInput.type = 'password';
      toggleApiKeyBtn.classList.remove('showing');
    }
    // Focus on the input after toggling
    apiKeyInput.focus();
  }
  
  // Function to setup option cards
  function setupOptionCards() {
    // Add event listeners for theme options
    themeOptions.forEach(radio => {
      radio.addEventListener('change', () => {
        // Remove selected class from all theme cards
        document.querySelectorAll('.theme-options .option-card').forEach(card => {
          card.classList.remove('selected');
        });
        // Add selected class to the checked card
        if (radio.checked) {
          radio.closest('.option-card').classList.add('selected');
        }
      });
    });
    
    // Add event listeners for model options
    modelOptions.forEach(radio => {
      radio.addEventListener('change', () => {
        // Remove selected class from all model cards
        document.querySelectorAll('.model-options .option-card').forEach(card => {
          card.classList.remove('selected');
        });
        // Add selected class to the checked card
        if (radio.checked) {
          radio.closest('.option-card').classList.add('selected');
        }
      });
    });
  }
  
  // Function to load settings from storage
  function loadSettings() {
    chrome.storage.sync.get(['veniceApiKey', 'theme', 'model'], (data) => {
      // If we have a saved API key, show it in the input field
      if (data.veniceApiKey) {
        apiKeyInput.value = data.veniceApiKey;
        
        // Show a placeholder instead of the actual key
        if (apiKeyInput.type === 'password') {
          // Keep the actual key accessible for saving
          apiKeyInput.setAttribute('data-original-key', data.veniceApiKey);
        }
      }
      
      // Set the theme radio button
      if (data.theme) {
        const themeRadio = document.querySelector(`input[name="theme"][value="${data.theme}"]`);
        if (themeRadio) {
          themeRadio.checked = true;
          // Add selected class to the parent card
          themeRadio.closest('.option-card').classList.add('selected');
        }
      } else {
        // If no theme is set, mark Auto as selected
        const autoTheme = document.querySelector('input[name="theme"][value="auto"]');
        if (autoTheme) {
          autoTheme.checked = true;
          autoTheme.closest('.option-card').classList.add('selected');
        }
      }
      
      // Set the model radio button
      if (data.model) {
        const modelRadio = document.querySelector(`input[name="model"][value="${data.model}"]`);
        if (modelRadio) {
          modelRadio.checked = true;
          // Add selected class to the parent card
          modelRadio.closest('.option-card').classList.add('selected');
        }
      } else {
        // If no model is set, mark mistral-31-24b as selected
        const defaultModel = document.querySelector('input[name="model"][value="mistral-31-24b"]');
        if (defaultModel) {
          defaultModel.checked = true;
          defaultModel.closest('.option-card').classList.add('selected');
        }
      }
    });
  }
  
  // Function to save settings to storage
  function saveSettings() {
    let apiKey = apiKeyInput.value.trim();
    
    // If the input is empty but we have an original key stored, use that
    if (!apiKey && apiKeyInput.getAttribute('data-original-key')) {
      apiKey = apiKeyInput.getAttribute('data-original-key');
    }
    
    // Validate API key (basic check - not empty)
    if (!apiKey) {
      showStatus('Please enter a valid API key.', 'error');
      return;
    }
    
    // Get selected theme and model
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    const selectedModel = document.querySelector('input[name="model"]:checked').value;
    
    // Save to Chrome's sync storage
    chrome.storage.sync.set({ 
      veniceApiKey: apiKey,
      theme: selectedTheme,
      model: selectedModel
    }, () => {
      if (chrome.runtime.lastError) {
        showStatus('Error saving settings: ' + chrome.runtime.lastError.message, 'error');
      } else {
        // Store the original key in data attribute
        apiKeyInput.setAttribute('data-original-key', apiKey);
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