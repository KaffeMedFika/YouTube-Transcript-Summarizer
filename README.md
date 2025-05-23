# YouTube Transcript Summarizer (Venice AI)

A powerful Chrome extension that uses Venice AI to summarize YouTube video transcripts and answer questions about video content - all without watching the entire video!

![YouTube Transcript Summarizer](icons/icon128.png)

## 🚀 Features

- **Quick Summaries**: Get a concise 3-5 sentence summary of any YouTube video
- **Detailed Analysis**: Expand summaries for more in-depth content breakdowns with structured formatting
- **Ask Questions**: Query specific information about the video content using natural language
- **Multiple AI Models**: Choose between Mistral 31B (faster) or Qwen 3 235B (more advanced)
- **Theme Support**: Automatically adapts to YouTube's light or dark mode, or set your preference
- **User-Friendly**: Simple, intuitive interface that integrates seamlessly with YouTube
- **Real-time Processing**: Fast transcript extraction and AI-powered analysis

## 📦 Installation

### Option 1: Chrome Web Store (Recommended)

**[Available in the Chrome Web Store](https://chromewebstore.google.com/detail/youtube-transcript-summar/kjgilndeigblbaddnekobiapfcckaoij)**

![Available in the Chrome Web Store](https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/tbyBjqi7Zu733AAKA5n4.png)

### Option 2: Manual Installation (Developer Mode)

#### Step 1: Download the Extension
1. Clone this repository or download it as a ZIP file:
   ```bash
   git clone https://github.com/KaffeMedFika/YouTube-Transcript-Summarizer.git
   ```
2. Extract all files to a folder on your computer
3. Ensure the folder contains all necessary files:
   - `manifest.json`
   - `background.js`
   - `content.js` 
   - `options.html`
   - `options.js`
   - `styles.css`
   - `icons/` folder

#### Step 2: Install in Chrome
1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked"
4. Select the folder containing the extension files
5. The extension is now installed!

## ⚙️ Setup

### Get Your Venice AI API Key
1. Create an account at [Venice AI](https://venice.ai/chat?ref=QMAqSM) if you don't have one
2. Navigate to your account settings to generate an API key
3. Copy your API key

### Configure the Extension
1. Click the extension icon in Chrome's toolbar
2. Select "Options" or right-click and choose "Options"
3. Paste your Venice AI API key in the field provided
4. Choose your preferred settings:
   - **Theme**: Auto (matches YouTube), Light, or Dark
   - **AI Model**: 
     - Mistral 31B (faster, uses fewer credits, 128k context)
     - Qwen 3 235B (more advanced, uses more credits, 32k context)
5. Click "Save Settings"

## 🎯 How to Use

### Get a Video Summary
1. Navigate to any YouTube video with captions/transcript
2. Locate the "Get Summary" button below the video player
3. Click the button and wait while the transcript is processed
4. Read the concise summary that appears!

### Ask Questions About the Video
1. Type your question in the "Ask about the video..." input field (right side)
2. Press Enter or click the "Ask" button
3. View the AI-generated answer based on the video's content

### Get a Detailed Analysis
1. After viewing the basic summary, click "Expand Summary"
2. Review the comprehensive breakdown with key points, themes, and insights
3. The detailed analysis includes structured formatting for better readability

### Managing Results
- Click "Close Summary" to hide results and reset the interface
- The extension remembers your theme and model preferences
- Input fields are automatically cleared after successful operations

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "No transcript available" | The video doesn't have auto-generated captions or manual subtitles. Try a different video. |
| "Please add your Venice AI API key" | Go to extension options and add your API key from Venice AI. |
| Summary isn't relevant | Ensure the video has accurate captions. Some auto-generated captions may be inaccurate. |
| Extension not appearing | Refresh the YouTube page, check if you're on a video page (`youtube.com/watch?v=`), or reinstall the extension. |
| API errors | Check your Venice AI account for sufficient credits/VCU and verify your API key is correct. |
| Theme not updating | The extension auto-detects YouTube's theme. Try manually setting your preference in options. |

## 🔒 Privacy & Data Usage

- **Local Storage**: Your Venice AI API key is stored securely in your browser's sync storage
- **API Processing**: Video transcripts are sent to Venice AI's API for processing only
- **No Data Retention**: No video data or transcripts are stored on external servers beyond processing
- **Secure Communication**: All API requests use HTTPS encryption
- **Cost Consideration**: API usage consumes Venice AI credits (VCU) based on your account plan

## 🛠️ Technical Details

- **AI Models**: 
  - Mistral 31B 24B (default): Faster processing, lower cost, 128k context window
  - Qwen 3 235B: More advanced reasoning, higher cost, 32k context window
- **Transcript Extraction**: Uses YouTube's native transcript/caption functionality
- **Framework**: Vanilla JavaScript with Chrome Extension Manifest V3
- **Theme System**: Adaptive UI that automatically detects and matches YouTube's current theme
- **API Integration**: Venice AI Chat Completions API with optimized parameters
- **Security**: Content Security Policy compliant, minimal permissions required

## 📊 Model Comparison

| Feature | Mistral 31B | Qwen 3 235B |
|---------|-------------|-------------|
| Speed | ⚡ Faster | 🐌 Slower |
| Quality | ✅ Good | 🌟 Excellent |
| Cost | 💰 Lower | 💸 Higher |
| Context Window | 128k tokens | 32k tokens |
| Best For | Quick summaries | Detailed analysis |

## 🌐 Links

- **[Chrome Web Store](https://chromewebstore.google.com/detail/youtube-transcript-summar/kjgilndeigblbaddnekobiapfcckaoij)** - Install the extension
- **[GitHub Repository](https://github.com/KaffeMedFika/YouTube-Transcript-Summarizer)** - Source code and issues
- **[Official Website](https://kaffe.fyi/youtube-transcript-summarizer/)** - Documentation and updates
- **[Venice AI](https://venice.ai/chat?ref=QMAqSM)** - Get your API key

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Report bugs or suggest features via GitHub Issues
- Submit pull requests for improvements
- Share feedback and usage experiences
- Help with documentation and translations

## 📝 License

This project is open source. Please check the repository for license details.

---

**Version**: 1.3  
**Last Updated**: 2025

If you find this extension useful, please consider:
- ⭐ Starring the GitHub repository
- 📝 Leaving a review on the Chrome Web Store  
- 🐛 Reporting any issues you encounter
- 💡 Suggesting new features 