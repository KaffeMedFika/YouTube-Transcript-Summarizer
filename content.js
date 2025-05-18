// YouTube Transcript Summarizer - Content Script
// This script runs on YouTube video pages and handles transcript extraction and UI

// Wait for page to fully load before running our code
document.addEventListener('DOMContentLoaded', initExtension);
window.addEventListener('load', initExtension);
window.addEventListener('yt-navigate-finish', initExtension);
window.addEventListener('popstate', initExtension); // Handle browser back/forward navigation

// Add URL change detection using History API
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // YouTube has navigated to a new page
    if (isYouTubeVideoPage()) {
      console.log('YouTube navigation detected to video page');
      // Delay slightly to ensure YouTube's UI has updated
      setTimeout(initExtension, 1000);
    }
  }
}).observe(document, {subtree: true, childList: true});

// Override YouTube's pushState and replaceState to detect navigation
const originalPushState = history.pushState;
history.pushState = function() {
  originalPushState.apply(this, arguments);
  if (isYouTubeVideoPage()) {
    console.log('YouTube pushState detected to video page');
    setTimeout(initExtension, 1000);
  }
};

const originalReplaceState = history.replaceState;
history.replaceState = function() {
  originalReplaceState.apply(this, arguments);
  if (isYouTubeVideoPage()) {
    console.log('YouTube replaceState detected to video page');
    setTimeout(initExtension, 1000);
  }
};

// Main initialization function
function initExtension() {
  // Check if we're on a YouTube video page
  if (!isYouTubeVideoPage()) return;

  console.log('Initializing extension on YouTube video page');

  // Remove any existing extension elements to prevent duplicates
  removeExistingElements();
  
  // Add our UI once the video info has loaded
  waitForVideoInfo().then(() => {
    addSummaryButton();
    checkAndApplyTheme();
  });
}

// Function to remove any existing extension elements to prevent duplicates
function removeExistingElements() {
  const existingContainer = document.querySelector('#venice-summary-container');
  if (existingContainer) {
    existingContainer.remove();
  }
  
  const existingResults = document.querySelector('#venice-summary-results');
  if (existingResults && existingResults.parentElement) {
    existingResults.parentElement.remove();
  }
}

// Check if the current URL is a YouTube video page
function isYouTubeVideoPage() {
  return window.location.href.includes('youtube.com/watch?v=');
}

// Wait for YouTube video info to load
function waitForVideoInfo() {
  return new Promise((resolve) => {
    // If the video title already exists, resolve immediately
    if (document.querySelector('#title h1')) {
      resolve();
      return;
    }

    // Otherwise, set up a mutation observer to watch for changes
    const observer = new MutationObserver((mutations, obs) => {
      if (document.querySelector('#title h1')) {
        obs.disconnect();
        resolve();
      }
    });

    // Start observing the page for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Failsafe: resolve after 3 seconds even if title not found
    setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 3000);
  });
}

// Check user theme preference and YouTube theme, then apply the appropriate theme
function checkAndApplyTheme() {
  chrome.storage.sync.get('theme', (data) => {
    const userThemePreference = data.theme || 'auto';
    const container = document.querySelector('#venice-summary-container');
    
    if (!container) return;
    
    // Get references to the other elements
    const button = document.querySelector('#venice-summary-button');
    const resultsArea = document.querySelector('#venice-summary-results');
    const closeButton = document.querySelector('#venice-close-button');
    const expandButton = document.querySelector('#venice-expand-button');
    const askInput = document.querySelector('#venice-ask-input');
    const askButton = document.querySelector('#venice-ask-button');
    const poweredBy = document.querySelector('#venice-powered-by');
    
    // Remove any existing theme classes
    document.body.classList.remove('venice-dark-theme', 'venice-light-theme');
    container.classList.remove('venice-dark-mode', 'venice-light-mode');
    if (button) button.classList.remove('venice-dark-mode', 'venice-light-mode');
    if (resultsArea) resultsArea.classList.remove('venice-dark-mode', 'venice-light-mode');
    if (closeButton) closeButton.classList.remove('venice-dark-mode', 'venice-light-mode');
    if (expandButton) expandButton.classList.remove('venice-dark-mode', 'venice-light-mode');
    if (askInput) askInput.classList.remove('venice-dark-mode', 'venice-light-mode');
    if (askButton) askButton.classList.remove('venice-dark-mode', 'venice-light-mode');
    if (poweredBy) poweredBy.classList.remove('venice-dark-mode', 'venice-light-mode');
    
    if (userThemePreference === 'auto') {
      // Auto mode - detect YouTube's current theme
      if (isYouTubeDarkMode()) {
        // Apply dark theme
        document.body.classList.add('venice-dark-theme');
        container.classList.add('venice-dark-mode');
        if (button) button.classList.add('venice-dark-mode');
        if (resultsArea) resultsArea.classList.add('venice-dark-mode');
        if (closeButton) closeButton.classList.add('venice-dark-mode');
        if (expandButton) expandButton.classList.add('venice-dark-mode');
        if (askInput) askInput.classList.add('venice-dark-mode');
        if (askButton) askButton.classList.add('venice-dark-mode');
        if (poweredBy) poweredBy.classList.add('venice-dark-mode');
      } else {
        // Apply light theme
        document.body.classList.add('venice-light-theme');
        container.classList.add('venice-light-mode');
        if (button) button.classList.add('venice-light-mode');
        if (resultsArea) resultsArea.classList.add('venice-light-mode');
        if (closeButton) closeButton.classList.add('venice-light-mode');
        if (expandButton) expandButton.classList.add('venice-light-mode');
        if (askInput) askInput.classList.add('venice-light-mode');
        if (askButton) askButton.classList.add('venice-light-mode');
        if (poweredBy) poweredBy.classList.add('venice-light-mode');
      }
    } else if (userThemePreference === 'dark') {
      // User prefers dark mode
      document.body.classList.add('venice-dark-theme');
      container.classList.add('venice-dark-mode');
      if (button) button.classList.add('venice-dark-mode');
      if (resultsArea) resultsArea.classList.add('venice-dark-mode');
      if (closeButton) closeButton.classList.add('venice-dark-mode');
      if (expandButton) expandButton.classList.add('venice-dark-mode');
      if (askInput) askInput.classList.add('venice-dark-mode');
      if (askButton) askButton.classList.add('venice-dark-mode');
      if (poweredBy) poweredBy.classList.add('venice-dark-mode');
    } else {
      // User prefers light mode
      document.body.classList.add('venice-light-theme');
      container.classList.add('venice-light-mode');
      if (button) button.classList.add('venice-light-mode');
      if (resultsArea) resultsArea.classList.add('venice-light-mode');
      if (closeButton) closeButton.classList.add('venice-light-mode');
      if (expandButton) expandButton.classList.add('venice-light-mode');
      if (askInput) askInput.classList.add('venice-light-mode');
      if (askButton) askButton.classList.add('venice-light-mode');
      if (poweredBy) poweredBy.classList.add('venice-light-mode');
    }
  });
  
  // Also watch for theme changes on YouTube
  observeYouTubeThemeChanges();
}

// Detect if YouTube is in dark mode
function isYouTubeDarkMode() {
  // There are several ways to detect YouTube's dark theme
  
  // Method 1: Check for dark attributes on the html element
  const htmlElement = document.documentElement;
  if (htmlElement.hasAttribute('dark') || 
      htmlElement.hasAttribute('dark-theme') || 
      document.querySelector('html[dark]') !== null) {
    return true;
  }
  
  // Method 2: Check for dark mode class on body
  if (document.body.classList.contains('dark-theme') || 
      document.body.classList.contains('dark')) {
    return true;
  }
  
  // Method 3: Check YouTube's app theme by looking at background color of a known element
  const appElement = document.querySelector('ytd-app') || document.querySelector('#content');
  if (appElement) {
    const bgColor = window.getComputedStyle(appElement).backgroundColor;
    // Dark backgrounds typically have low RGB values
    if (bgColor && bgColor !== 'transparent') {
      const isLowRGB = bgColor.includes('rgb(') && 
                       !bgColor.includes('255') && 
                       !bgColor.includes('240');
      if (isLowRGB) return true;
    }
  }
  
  // Method 4: Check the main content area background color
  const mainContent = document.querySelector('#primary');
  if (mainContent) {
    const bgColor = window.getComputedStyle(mainContent).backgroundColor;
    if (bgColor && bgColor !== 'transparent') {
      // Convert rgb format to numbers and check if they're low (dark theme)
      const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
      if (rgbMatch) {
        const [_, r, g, b] = rgbMatch.map(Number);
        const brightness = (r + g + b) / 3;
        if (brightness < 100) return true; // Dark theme has low brightness
      }
    }
  }
  
  // Default to light mode if no dark mode indicators found
  return false;
}

// Watch for YouTube theme changes and update our theme accordingly
function observeYouTubeThemeChanges() {
  // Set up a mutation observer to watch for attribute changes on the html element
  const observer = new MutationObserver(() => {
    chrome.storage.sync.get('theme', (data) => {
      // Only auto-update if user has selected 'auto' theme
      if (data.theme === 'auto' || !data.theme) {
        // Remove existing theme classes first
        document.body.classList.remove('venice-dark-theme', 'venice-light-theme');
        checkAndApplyTheme();
      }
    });
  });
  
  // Start observing the html element for attribute changes
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['dark', 'dark-theme', 'class']
  });
}

// Add the "Get Summary" button below the video player
function addSummaryButton() {
  // Check if we need to wait for the target element to be ready
  const targetElement = document.querySelector('#below');
  if (!targetElement) {
    console.log('Target element not ready, waiting...');
    setTimeout(addSummaryButton, 500);
    return;
  }

  // If our button already exists, don't add it again
  if (document.querySelector('#venice-summary-container')) {
    checkAndApplyTheme(); // Ensure theme is applied even if container already exists
    return;
  }

  console.log('Adding summary button to page');

  // Create container for our UI (initially it won't have styling)
  const container = document.createElement('div');
  container.id = 'venice-summary-container';
  container.style.margin = '10px 0';
  container.style.border = 'none';
  container.style.background = 'transparent';
  container.style.padding = '0';
  container.style.display = 'flex';
  container.style.justifyContent = 'space-between';
  container.style.alignItems = 'center';
  container.style.marginRight = '0px';
  
  // Create left side container for summary button
  const leftContainer = document.createElement('div');
  leftContainer.style.display = 'flex';
  leftContainer.style.alignItems = 'center';
  
  // Create "Get Summary" button
  const button = document.createElement('button');
  button.id = 'venice-summary-button';
  button.textContent = 'Get Summary';
  button.addEventListener('click', handleSummaryRequest);
  
  // Create "Powered by" text
  const poweredByText = document.createElement('span');
  poweredByText.id = 'venice-powered-by';
  poweredByText.textContent = 'Powered by Venice AI';
  poweredByText.style.marginLeft = '10px';
  poweredByText.style.fontSize = '12px';
  poweredByText.style.opacity = '0.8';
  
  // Add summary button and powered by text to left container
  leftContainer.appendChild(button);
  leftContainer.appendChild(poweredByText);
  
  // Create right side container for ask components
  const rightContainer = document.createElement('div');
  rightContainer.style.display = 'flex';
  rightContainer.style.justifyContent = 'flex-end';
  
  // Create the ask box container
  const askContainer = document.createElement('div');
  askContainer.id = 'venice-ask-container';
  
  // Create the ask input
  const askInput = document.createElement('input');
  askInput.id = 'venice-ask-input';
  askInput.type = 'text';
  askInput.placeholder = 'Ask about the video...';
  
  // Add event listener for Enter key on input
  askInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleAskRequest();
    }
  });
  
  // Add event listener to clear text when clicked after answering
  askInput.addEventListener('click', () => {
    // Check if there's an answer displayed and input has text
    const resultsArea = document.querySelector('#venice-summary-results');
    if (resultsArea && 
        resultsArea.style.display === 'block' && 
        resultsArea.innerHTML.includes('Answer to:') && 
        askInput.value.trim() !== '') {
      askInput.value = '';
    }
  });
  
  // Create the ask button
  const askButton = document.createElement('button');
  askButton.id = 'venice-ask-button';
  askButton.textContent = 'Ask';
  askButton.addEventListener('click', handleAskRequest);
  
  // Add elements to ask container
  askContainer.appendChild(askInput);
  askContainer.appendChild(askButton);
  
  // Add ask container to right container
  rightContainer.appendChild(askContainer);
  
  // Create summary results area (initially hidden)
  const resultsArea = document.createElement('div');
  resultsArea.id = 'venice-summary-results';
  resultsArea.style.display = 'none';
  resultsArea.style.width = '100%';
  
  // Add left and right containers to main container
  container.appendChild(leftContainer);
  container.appendChild(rightContainer);
  
  // Add results area after the flex container for buttons
  const resultsContainer = document.createElement('div');
  resultsContainer.style.marginRight = '0px';
  resultsContainer.appendChild(resultsArea);
  
  // Insert container below video info section
  if (targetElement) {
    targetElement.prepend(resultsContainer);
    targetElement.prepend(container);
    // Apply theme immediately after adding to DOM
    checkAndApplyTheme();
  }
}

// Function to add a close button to the results area
function addCloseButton(resultsArea) {
  // Create a container for the buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.textAlign = 'left';
  buttonContainer.style.marginTop = '15px';
  buttonContainer.style.display = 'flex';
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.id = 'venice-close-button';
  closeButton.textContent = 'Close Summary';
  closeButton.addEventListener('click', () => {
    // Hide the results area
    resultsArea.style.display = 'none';
    
    // Reset container to minimal styling
    const container = document.querySelector('#venice-summary-container');
    if (container) {
      container.style.border = 'none';
      container.style.background = 'transparent';
      container.style.padding = '0';
    }
    
    // Reset results container margin
    const resultsContainer = resultsArea.parentElement;
    if (resultsContainer) {
      resultsContainer.style.marginTop = '0';
    }
    
    // Re-enable the summary button if it was disabled
    const summaryButton = document.querySelector('#venice-summary-button');
    if (summaryButton) {
      summaryButton.disabled = false;
    }
    
    // Re-enable ask elements and clear input text
    const askInput = document.querySelector('#venice-ask-input');
    const askButton = document.querySelector('#venice-ask-button');
    if (askInput) {
      askInput.disabled = false;
      askInput.value = '';  // Clear the input text
    }
    if (askButton) {
      askButton.disabled = false;
    }
  });
  
  // Create expand button
  const expandButton = document.createElement('button');
  expandButton.id = 'venice-expand-button';
  expandButton.textContent = 'Expand Summary';
  expandButton.addEventListener('click', handleExpandSummary);
  
  // Store the current transcript in a data attribute for the expand button to use
  // We'll extract the transcript when the expand button is clicked
  expandButton.setAttribute('data-video-id', new URLSearchParams(window.location.search).get('v'));
  
  // Add buttons to container
  buttonContainer.appendChild(closeButton);
  buttonContainer.appendChild(expandButton);
  
  // Add to results area
  resultsArea.appendChild(buttonContainer);
}

// Create a function to apply formatting to the normal summary
function formatSummary(text) {
  // Check if already contains HTML formatting
  if (text.includes('<h') || text.includes('<p>') || text.includes('<li>')) {
    return text;
  }

  // Convert bold markdown to HTML tags
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace line breaks with <br> if present
  formatted = formatted.replace(/\n/g, '<br>');
  
  // Add paragraph spacing by detecting sentence endings
  formatted = formatted.replace(/([.!?])\s+/g, '$1</p><p>');
  
  // Remove any empty paragraphs
  formatted = formatted.replace(/<p><\/p>/g, '');
  
  // Wrap in paragraph if not already wrapped
  if (!formatted.startsWith('<p>')) {
    formatted = `<p>${formatted}</p>`;
  }
  
  // Make sure it ends with a closing paragraph tag
  if (!formatted.endsWith('</p>')) {
    formatted = `${formatted}</p>`;
  }
  
  return formatted;
}

// Update the handleSummaryRequest function to use the formatSummary function
async function handleSummaryRequest() {
  const container = document.querySelector('#venice-summary-container');
  const resultsArea = document.querySelector('#venice-summary-results');
  const resultsContainer = resultsArea.parentElement;
  const button = document.querySelector('#venice-summary-button');
  const askInput = document.querySelector('#venice-ask-input');
  const askButton = document.querySelector('#venice-ask-button');
  
  // Apply full styling to the container when button is clicked
  container.style.border = '';
  container.style.background = '';
  container.style.padding = '10px';
  container.style.borderRadius = '8px';
  
  // Apply styling to results container
  if (resultsContainer) {
    resultsContainer.style.marginTop = '10px';
  }
  
  // Show "Loading..." message with spinner
  resultsArea.style.display = 'block';
  resultsArea.innerHTML = '<div class="venice-loading-spinner"></div><p class="venice-loading-text">Loading transcript and generating summary...</p>';
  
  // Disable buttons during processing
  button.disabled = true;
  if (askButton) askButton.disabled = true;
  if (askInput) askInput.disabled = true;
  
  // Make sure theme is correctly applied to loading state
  checkAndApplyTheme();
  
  try {
    // 1. Extract the video ID from the URL
    const videoId = new URLSearchParams(window.location.search).get('v');
    
    // 2. Get the transcript
    const transcript = await getTranscript(videoId);
    
    if (!transcript) {
      resultsArea.innerHTML = '<p class="venice-error">No transcript available for this video. The video might not have auto-generated captions.</p>';
      button.disabled = false;
      if (askButton) askButton.disabled = false;
      if (askInput) askInput.disabled = false;
      addCloseButton(resultsArea);
      checkAndApplyTheme(); // Apply theme after content changes
      return;
    }
    
    // 3. Send transcript to background script to get summary from Venice AI
    chrome.runtime.sendMessage(
      { action: 'summarize', transcript },
      (response) => {
        button.disabled = false;
        if (askButton) askButton.disabled = false;
        if (askInput) askInput.disabled = false;
        
        if (response.error) {
          // Handle error
          if (response.error === 'NO_API_KEY') {
            resultsArea.innerHTML = '<p class="venice-error">Please add your Venice AI API key in the extension settings.</p>';
          } else {
            resultsArea.innerHTML = `<p class="venice-error">Oops, something went wrong. ${response.error}</p>`;
          }
          addCloseButton(resultsArea);
        } else {
          // Show summary with improved formatting
          resultsArea.innerHTML = `
            <h3>Video Summary</h3>
            <div class="venice-summary">${formatSummary(response.summary)}</div>
          `;
          addCloseButton(resultsArea);
        }
        
        // Apply theme after content has been updated
        checkAndApplyTheme();
      }
    );
    
  } catch (error) {
    resultsArea.innerHTML = `<p class="venice-error">Oops, something went wrong. ${error.message}</p>`;
    button.disabled = false;
    if (askButton) askButton.disabled = false;
    if (askInput) askInput.disabled = false;
    addCloseButton(resultsArea);
    checkAndApplyTheme(); // Apply theme after error content
  }
}

// Function to handle asking questions about the video
async function handleAskRequest() {
  const container = document.querySelector('#venice-summary-container');
  const resultsArea = document.querySelector('#venice-summary-results');
  const resultsContainer = resultsArea.parentElement;
  const askInput = document.querySelector('#venice-ask-input');
  const askButton = document.querySelector('#venice-ask-button');
  const summaryButton = document.querySelector('#venice-summary-button');
  
  // Get the question from the input
  const question = askInput.value.trim();
  
  // Validate question
  if (!question) {
    return;
  }
  
  // Apply full styling to the container if not already applied
  container.style.border = '';
  container.style.background = '';
  container.style.padding = '10px';
  container.style.borderRadius = '8px';
  
  // Apply styling to results container
  if (resultsContainer) {
    resultsContainer.style.marginTop = '10px';
  }
  
  // Show "Loading..." message with spinner
  resultsArea.style.display = 'block';
  resultsArea.innerHTML = '<div class="venice-loading-spinner"></div><p class="venice-loading-text">Getting answer to your question...</p>';
  
  // Disable input and buttons during processing
  askInput.disabled = true;
  askButton.disabled = true;
  summaryButton.disabled = true;
  
  // Make sure theme is correctly applied to loading state
  checkAndApplyTheme();
  
  try {
    // 1. Extract the video ID from the URL
    const videoId = new URLSearchParams(window.location.search).get('v');
    
    // 2. Get the transcript
    const transcript = await getTranscript(videoId);
    
    if (!transcript) {
      resultsArea.innerHTML = '<p class="venice-error">No transcript available for this video. The video might not have auto-generated captions.</p>';
      askInput.disabled = false;
      askButton.disabled = false;
      summaryButton.disabled = false;
      addCloseButton(resultsArea);
      checkAndApplyTheme(); // Apply theme after content changes
      return;
    }
    
    // 3. Send question and transcript to background script to get answer from Venice AI
    chrome.runtime.sendMessage(
      { action: 'ask', question, transcript },
      (response) => {
        // Re-enable controls
        askInput.disabled = false;
        askButton.disabled = false;
        summaryButton.disabled = false;
        
        if (response.error) {
          // Handle error
          if (response.error === 'NO_API_KEY') {
            resultsArea.innerHTML = '<p class="venice-error">Please add your Venice AI API key in the extension settings.</p>';
          } else {
            resultsArea.innerHTML = `<p class="venice-error">Oops, something went wrong. ${response.error}</p>`;
          }
        } else {
          // Show answer with improved formatting
          resultsArea.innerHTML = `
            <h3>Answer to: "${question}"</h3>
            <div class="venice-summary">${formatSummary(response.answer)}</div>
          `;
        }
        
        // Add close button
        addCloseButton(resultsArea);
        
        // Apply theme after content has been updated
        checkAndApplyTheme();
      }
    );
    
  } catch (error) {
    resultsArea.innerHTML = `<p class="venice-error">Oops, something went wrong. ${error.message}</p>`;
    askInput.disabled = false;
    askButton.disabled = false;
    summaryButton.disabled = false;
    addCloseButton(resultsArea);
    checkAndApplyTheme(); // Apply theme after error content
  }
}

// Function to extract transcript from YouTube video
async function getTranscript(videoId) {
  try {
    // Try to fetch transcript directly through YouTube's API
    const directTranscript = await fetchTranscriptDirectly(videoId);
    if (directTranscript) {
      return directTranscript;
    }
    
    // If direct fetching fails, try to extract it invisibly
    const transcriptButton = findTranscriptButton();
    if (transcriptButton) {
      return await getTranscriptInvisibly(transcriptButton);
    }
    
    // If all methods fail, return null
    return null;
  } catch (error) {
    console.error('Error getting transcript:', error);
    return null;
  }
}

// Try to get the transcript directly using YouTube's API
async function fetchTranscriptDirectly(videoId) {
  try {
    // This is a more precise way to get the timedtext URL
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();
    
    // Look for the captions track URL in the page source
    const captionsRegex = /"captionTracks":\[\{"baseUrl":"([^"]+)"/;
    const match = html.match(captionsRegex);
    
    if (match && match[1]) {
      // Found a captions URL, now fetch it
      const captionsUrl = match[1].replace(/\\u0026/g, '&');
      const captionsResponse = await fetch(captionsUrl);
      const captionsXml = await captionsResponse.text();
      
      // Parse XML to extract text
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(captionsXml, "text/xml");
      const textElements = xmlDoc.getElementsByTagName("text");
      
      // Extract and join all transcript pieces
      let transcriptText = "";
      for (let i = 0; i < textElements.length; i++) {
        transcriptText += " " + textElements[i].textContent;
      }
      
      return transcriptText.trim();
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching transcript directly:', error);
    return null;
  }
}

// Find the "Show transcript" button in the YouTube page
function findTranscriptButton() {
  // Look for "Show transcript" button in various places
  const buttons = Array.from(document.querySelectorAll('button'));
  return buttons.find(button => 
    button.textContent.toLowerCase().includes('transcript') ||
    button.getAttribute('aria-label')?.toLowerCase().includes('transcript')
  );
}

// Get transcript without visibly showing the panel to the user
async function getTranscriptInvisibly(transcriptButton) {
  return new Promise((resolve) => {
    // Create a container to hide the transcript panel
    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.visibility = 'hidden';
    hiddenContainer.style.height = '0';
    hiddenContainer.style.overflow = 'hidden';
    document.body.appendChild(hiddenContainer);
    
    // Store the original parent to restore the elements later
    const originalPanel = transcriptButton.closest('.ytd-video-secondary-info-renderer');
    let transcriptPanel = null;
    
    if (originalPanel) {
      // Move the panel to our hidden container temporarily
      transcriptPanel = originalPanel.cloneNode(true);
      hiddenContainer.appendChild(transcriptPanel);
      
      // Find and click the transcript button in our hidden copy
      const hiddenButton = transcriptPanel.querySelector('button[aria-label*="transcript" i], button:contains("transcript")');
      if (hiddenButton) {
        hiddenButton.click();
      }
    } else {
      // If we can't isolate the panel, try clicking and hiding quickly
      transcriptButton.click();
    }
    
    // Wait for transcript panel to load
    setTimeout(() => {
      // Try to find transcript items in our hidden panel first
      let transcriptItems = hiddenContainer.querySelectorAll('yt-formatted-string.segment-text');
      
      // If not found in hidden panel, try the main document
      if (transcriptItems.length === 0) {
        transcriptItems = document.querySelectorAll('yt-formatted-string.segment-text');
      }
      
      if (transcriptItems.length === 0) {
        // Clean up
        document.body.removeChild(hiddenContainer);
        // Close the panel if it's open in the main document
        if (!transcriptPanel) {
          transcriptButton.click();
        }
        resolve(null);
        return;
      }
      
      // Extract and join transcript text
      const transcriptText = Array.from(transcriptItems)
        .map(item => item.textContent.trim())
        .join(' ');
      
      // Clean up
      document.body.removeChild(hiddenContainer);
      
      // Close the panel if it's open in the main document
      if (!transcriptPanel) {
        transcriptButton.click();
      }
      
      resolve(transcriptText);
    }, 1000); // Wait 1 second for panel to load
  });
}

// Fetch transcript using YouTube's hidden API (fallback)
async function fetchTranscriptFromYouTubeApi(videoId) {
  try {
    // Try to extract caption track data from the page
    const captionTracks = await extractCaptionTracks(videoId);
    if (captionTracks && captionTracks.length > 0) {
      // Get English captions or the first available
      const track = captionTracks.find(track => track.languageCode === 'en') || captionTracks[0];
      
      // Fetch the actual transcript data
      const response = await fetch(track.baseUrl);
      const data = await response.text();
      
      // Parse XML to extract text
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const textElements = xmlDoc.getElementsByTagName("text");
      
      // Extract and join all transcript pieces
      let transcriptText = "";
      for (let i = 0; i < textElements.length; i++) {
        transcriptText += " " + textElements[i].textContent;
      }
      
      return transcriptText.trim();
    }
    
    return null;
  } catch (error) {
    console.error('Error in YouTubeAPI fetch:', error);
    return null;
  }
}

// Helper function to extract caption tracks data from YouTube page
async function extractCaptionTracks(videoId) {
  // This function tries to extract caption data from YouTube's page data
  // Note: This is an advanced approach and might break if YouTube changes their structure
  try {
    const scriptElements = document.querySelectorAll('script');
    
    for (const script of scriptElements) {
      const text = script.textContent;
      if (text && text.includes('captionTracks')) {
        const captionTracksMatch = text.match(/"captionTracks":\s*(\[.*?\])/);
        if (captionTracksMatch && captionTracksMatch[1]) {
          try {
            // Try to parse the JSON data
            const tracksJson = captionTracksMatch[1].replace(/\\"/g, '"')
              .replace(/\\u0026/g, '&');
            const tracks = JSON.parse(tracksJson);
            return tracks;
          } catch (e) {
            console.error('Failed to parse caption tracks:', e);
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting caption tracks:', error);
    return null;
  }
}

// Handle clicking the "Expand Summary" button
async function handleExpandSummary(event) {
  const resultsArea = document.querySelector('#venice-summary-results');
  const expandButton = event.currentTarget;
  const closeButton = document.querySelector('#venice-close-button');
  const summaryButton = document.querySelector('#venice-summary-button');
  const askInput = document.querySelector('#venice-ask-input');
  const askButton = document.querySelector('#venice-ask-button');
  
  // Disable buttons during processing
  expandButton.disabled = true;
  if (closeButton) closeButton.disabled = true;
  if (summaryButton) summaryButton.disabled = true;
  if (askButton) askButton.disabled = true;
  if (askInput) askInput.disabled = true;
  
  // Show loading message with spinner
  const originalContent = resultsArea.innerHTML;
  resultsArea.innerHTML = '<div class="venice-loading-spinner"></div><p class="venice-loading-text">Generating detailed analysis of the video content...</p>';
  
  try {
    // Get the video ID from the button data attribute
    const videoId = expandButton.getAttribute('data-video-id');
    
    // Get the transcript
    const transcript = await getTranscript(videoId);
    
    if (!transcript) {
      resultsArea.innerHTML = originalContent;
      expandButton.disabled = false;
      if (closeButton) closeButton.disabled = false;
      alert('Unable to get the video transcript for detailed analysis.');
      return;
    }
    
    // Send transcript to background script to get expanded summary from Venice AI
    chrome.runtime.sendMessage(
      { action: 'expandSummary', transcript },
      (response) => {
        // Re-enable buttons
        expandButton.disabled = false;
        if (closeButton) closeButton.disabled = false;
        if (summaryButton) summaryButton.disabled = false;
        if (askButton) askButton.disabled = false;
        if (askInput) askInput.disabled = false;
        
        if (response.error) {
          // Handle error
          if (response.error === 'NO_API_KEY') {
            alert('Please add your Venice AI API key in the extension settings.');
          } else {
            alert(`Error generating detailed analysis: ${response.error}`);
          }
          resultsArea.innerHTML = originalContent;
        } else {
          // Show expanded summary with enhanced formatting
          resultsArea.innerHTML = `
            <h3>Detailed Video Analysis</h3>
            <div class="venice-expanded-summary">${formatExpandedSummary(response.expandedSummary)}</div>
          `;
          addCloseButton(resultsArea);
        }
        
        // Apply theme after content has been updated
        checkAndApplyTheme();
      }
    );
    
  } catch (error) {
    resultsArea.innerHTML = originalContent;
    expandButton.disabled = false;
    if (closeButton) closeButton.disabled = false;
    alert(`Error: ${error.message}`);
  }
}

// Format the expanded summary to enhance readability
function formatExpandedSummary(text) {
  // Check if already contains HTML formatting
  if (text.includes('<h') || text.includes('<p>') || text.includes('<li>')) {
    return text;
  }
  
  // Convert bold markdown to HTML tags first
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace markdown style headers with HTML
  formatted = formatted.replace(/#{1,6}\s+(.*?)(?:\n|$)/g, (match, title) => {
    const level = match.trim().indexOf(' ');
    return `<h4>${title}</h4>`;
  });
  
  // Replace double line breaks with paragraph tags
  formatted = formatted.replace(/\n\n/g, '</p><p>');
  
  // Replace single line breaks with <br>
  formatted = formatted.replace(/\n/g, '<br>');
  
  // Handle italic
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Handle bulleted lists
  formatted = formatted.replace(/- (.*?)(?:\n|$)/g, '<li>$1</li>');
  formatted = formatted.replace(/<li>(.*?)<\/li>(?:\s*<li>)/g, '<li>$1</li><li>');
  formatted = formatted.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
  
  // Wrap in paragraph if not already wrapped
  if (!formatted.startsWith('<p>')) {
    formatted = `<p>${formatted}</p>`;
  }
  
  return formatted;
} 