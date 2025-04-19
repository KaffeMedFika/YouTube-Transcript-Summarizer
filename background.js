// YouTube Transcript Summarizer - Background Script
// This script runs in the background and handles API calls to Venice AI

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle 'summarize' action from content script
  if (request.action === 'summarize') {
    getVeniceApiKey()
      .then(apiKey => {
        // Check if API key exists
        if (!apiKey) {
          sendResponse({ error: 'NO_API_KEY' });
          return;
        }

        // Call Venice AI API with the transcript
        summarizeTranscript(apiKey, request.transcript)
          .then(summary => {
            sendResponse({ summary });
          })
          .catch(error => {
            console.error('Error calling Venice AI API:', error);
            sendResponse({ error: error.message || 'Failed to generate summary' });
          });
      })
      .catch(error => {
        console.error('Error getting API key:', error);
        sendResponse({ error: 'Failed to access API key' });
      });

    // Return true to indicate we will send a response asynchronously
    return true;
  }
  
  // Handle 'expandSummary' action for detailed analysis
  if (request.action === 'expandSummary') {
    getVeniceApiKey()
      .then(apiKey => {
        // Check if API key exists
        if (!apiKey) {
          sendResponse({ error: 'NO_API_KEY' });
          return;
        }

        // Call Venice AI API with the transcript for expanded summary
        expandDetailedSummary(apiKey, request.transcript)
          .then(expandedSummary => {
            sendResponse({ expandedSummary });
          })
          .catch(error => {
            console.error('Error calling Venice AI API:', error);
            sendResponse({ error: error.message || 'Failed to generate expanded summary' });
          });
      })
      .catch(error => {
        console.error('Error getting API key:', error);
        sendResponse({ error: 'Failed to access API key' });
      });

    // Return true to indicate we will send a response asynchronously
    return true;
  }
  
  // Handle 'ask' action from content script
  if (request.action === 'ask') {
    getVeniceApiKey()
      .then(apiKey => {
        // Check if API key exists
        if (!apiKey) {
          sendResponse({ error: 'NO_API_KEY' });
          return;
        }

        // Call Venice AI API with the question and transcript
        askAboutTranscript(apiKey, request.question, request.transcript)
          .then(answer => {
            sendResponse({ answer });
          })
          .catch(error => {
            console.error('Error calling Venice AI API:', error);
            sendResponse({ error: error.message || 'Failed to answer question' });
          });
      })
      .catch(error => {
        console.error('Error getting API key:', error);
        sendResponse({ error: 'Failed to access API key' });
      });

    // Return true to indicate we will send a response asynchronously
    return true;
  }
});

// Get the Venice AI API key from storage
function getVeniceApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('veniceApiKey', (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(data.veniceApiKey || '');
      }
    });
  });
}

// Call Venice AI API to summarize the transcript
async function summarizeTranscript(apiKey, transcript) {
  try {
    // Prepare request options following the provided format
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        venice_parameters: {
          include_venice_system_prompt: true
        },
        frequency_penalty: 0,
        presence_penalty: 0,
        n: 1,
        temperature: 0.15,
        top_p: 0.9,
        parallel_tool_calls: true,
        model: 'llama-3.3-70b',
        messages: [
          {
            role: 'user',
            content: `Please summarize the following text in 3-5 sentences: ${transcript}`
          }
        ]
      })
    };

    // Make the request to Venice AI API
    const response = await fetch('https://api.venice.ai/api/v1/chat/completions', options);
    
    // Check if response is OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }
    
    // Parse response
    const data = await response.json();
    
    // Extract summary from response
    const summary = data.choices[0].message.content;
    return summary;
    
  } catch (error) {
    console.error('Venice AI API error:', error);
    throw error;
  }
}

// Call Venice AI API to create an expanded, detailed summary
async function expandDetailedSummary(apiKey, transcript) {
  try {
    // Prepare request options for detailed analysis
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        venice_parameters: {
          include_venice_system_prompt: true
        },
        frequency_penalty: 0,
        presence_penalty: 0,
        n: 1,
        temperature: 0.25,
        top_p: 0.9,
        parallel_tool_calls: true,
        model: 'llama-3.3-70b',
        messages: [
          {
            role: 'system',
            content: 'You are a skilled content analyst that provides detailed, insightful summaries of video content. Focus on key themes, important points, and valuable insights.'
          },
          {
            role: 'user',
            content: `Please provide a detailed analysis of this video transcript. Include main topics, key insights, and important details. Structure your response with appropriate formatting for readability: ${transcript}`
          }
        ]
      })
    };

    // Make the request to Venice AI API
    const response = await fetch('https://api.venice.ai/api/v1/chat/completions', options);
    
    // Check if response is OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }
    
    // Parse response
    const data = await response.json();
    
    // Extract expanded summary from response
    const expandedSummary = data.choices[0].message.content;
    return expandedSummary;
    
  } catch (error) {
    console.error('Venice AI API error:', error);
    throw error;
  }
}

// Call Venice AI API to answer questions about the transcript
async function askAboutTranscript(apiKey, question, transcript) {
  try {
    // Prepare request options following the provided format
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        venice_parameters: {
          include_venice_system_prompt: true
        },
        frequency_penalty: 0,
        presence_penalty: 0,
        n: 1,
        temperature: 0.3,
        top_p: 0.9,
        parallel_tool_calls: true,
        model: 'llama-3.3-70b',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that answers questions about video content based on its transcript. Be concise, accurate, and only answer what you can directly infer from the transcript text.'
          },
          {
            role: 'user',
            content: `Transcript: ${transcript}\n\nQuestion: ${question}`
          }
        ]
      })
    };

    // Make the request to Venice AI API
    const response = await fetch('https://api.venice.ai/api/v1/chat/completions', options);
    
    // Check if response is OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }
    
    // Parse response
    const data = await response.json();
    
    // Extract answer from response
    const answer = data.choices[0].message.content;
    return answer;
    
  } catch (error) {
    console.error('Venice AI API error:', error);
    throw error;
  }
} 