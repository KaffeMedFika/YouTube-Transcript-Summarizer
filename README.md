# YouTube Transcript Summarizer

A powerful Chrome extension that uses Venice AI to summarize YouTube video transcripts and answer questions about video content - all without watching the entire video!

![YouTube Transcript Summarizer](icons/icon128.png)

## Features

- **Quick Summaries**: Get a concise 3-5 sentence summary of any YouTube video
- **Detailed Analysis**: Expand summaries for more in-depth content breakdowns
- **Ask Questions**: Query specific information about the video content
- **Theme Support**: Automatically adapts to YouTube's light or dark mode
- **User-Friendly**: Simple, intuitive interface that integrates seamlessly with YouTube

## Installation Guide

### Step 1: Download the Extension

1. Clone this repository or download it as a ZIP file
2. Extract all files to a folder on your computer
3. Ensure the folder contains all necessary files:
   - manifest.json
   - background.js
   - content.js
   - options.html
   - options.js
   - styles.css
   - icons folder

### Step 2: Install in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked"
4. Select the folder containing the extension files
5. The extension is now installed!

### Step 3: Set Up Your Venice AI API Key

1. Create an account at [Venice AI](https://venice.ai/chat?ref=QMAqSM) if you don't have one
2. Access your account settings to generate an API key
3. Click the extension icon in Chrome's toolbar
4. Select "Options"
5. Paste your Venice AI API key in the field provided
6. Select your preferred theme (Auto, Light, or Dark)
7. Click "Save"

## How to Use

### Get a Video Summary

1. Navigate to any YouTube video
2. Locate the "Get Summary" button below the video
3. Click the button and wait briefly while the transcript is processed
4. Read the concise summary that appears!

### Ask Questions About the Video

1. Type your question in the "Ask about the video..." input field
2. Press Enter or click the "Ask" button
3. View the detailed answer based on the video's content

### Get a Detailed Analysis

1. After viewing the basic summary, click "Expand Summary"
2. Review the comprehensive breakdown with key points and insights

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No transcript available" | The video doesn't have auto-generated captions. Try a different video. |
| "Please add your Venice AI API key" | Go to extension options and add your API key. |
| Summary isn't relevant | Ensure the video has accurate captions and try again. |
| Extension not appearing | Refresh the YouTube page or reinstall the extension. |

## Privacy & Data Usage

- Your Venice AI API key is stored securely in your browser
- Video transcripts are processed through the Venice AI API
- No data is stored on external servers beyond what's necessary for processing
- API usage may incur costs depending on your Venice AI account plan

## Technical Details

- Uses the powerful llama-3.3-70b model for accurate summarization
- Extracts video transcripts using YouTube's native transcript functionality
- Implements adaptive UI that matches YouTube's theme preferences
- All API requests are secured with HTTPS and proper authentication

---

If you find this extension useful, consider starring the repository or contributing to its development!

For issues, suggestions, or contributions, please open an issue on GitHub. 