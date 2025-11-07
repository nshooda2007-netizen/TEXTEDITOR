# KidsRead eBook Creator

A professional desktop application for creating interactive children's eBooks with flip-book animations, multimedia support, and export capabilities.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Mac%20%7C%20Linux-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📚 Overview

KidsRead eBook Creator is a powerful desktop application built with Electron and React, designed specifically for creating engaging interactive eBooks for children aged 0-21. Perfect for educators, authors, and content creators who want to produce professional-quality interactive books for the Indian market and beyond.

### Key Features

✨ **Intuitive Book Management**
- Create unlimited books organized by age categories (0-7, 8-14, 15-21)
- Search and filter your book library
- Quick access to edit, duplicate, or delete books

🎨 **Professional Page Editor**
- Visual drag-and-drop page builder
- Real-time canvas editing at 800x600 resolution
- Drag elements anywhere on the page
- Resize elements with intuitive handles
- Page thumbnail navigation sidebar
- Unlimited pages per book

📝 **Rich Text Formatting**
- Multiple font families including Hindi support (Noto Sans, Mangal)
- Font sizes from 8pt to 120pt
- Bold, Italic, Underline styles
- Text color picker
- Text alignment (left, center, right, justify)
- Inline text editing

🎬 **Multimedia Support**
- **Images**: JPG, PNG, GIF support
- **Audio**: MP3, WAV for narrations and sound effects
- **Video**: MP4 video embedding
- Drag and drop media positioning
- Full media playback in preview and export

🎭 **Interactive Elements**
- Element animations (Fade In, Slide In, Bounce, Zoom)
- Customizable page backgrounds
- Interactive hotspots
- Auto-play capabilities

📖 **Flip Book Preview**
- Realistic page-turning animations
- Fullscreen mode
- Keyboard navigation (Arrow keys, Home, ESC)
- Test all interactive elements before export

💾 **Auto-Save & File Management**
- Auto-save every 30 seconds
- Manual save with timestamp display
- Custom `.kidsread` file format
- Project backup and restore

📤 **HTML5 Export**
- Export as standalone HTML flipbook
- Mobile-responsive output
- All interactivity preserved
- Embeds all media for offline viewing
- Perfect for web publishing or LMS integration

## 🚀 Installation

### Prerequisites

- **Node.js**: Version 16.x or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For cloning the repository

### Step 1: Clone or Download

```bash
git clone <your-repository-url>
cd kidsread-ebook-creator
```

Or download the ZIP file and extract it.

### Step 2: Install Dependencies

```bash
npm install
```

If you encounter Electron download issues due to network restrictions, use:

```bash
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install
```

Then manually download Electron:

```bash
npm install electron
```

## 🎮 Running the Application

### Development Mode

Start the application in development mode with hot-reloading:

```bash
npm start
```

This will:
1. Start the Webpack dev server on `http://localhost:3000`
2. Launch the Electron window automatically
3. Enable hot module replacement for quick development

### Production Build

Build the React app for production:

```bash
npm run build
```

## 📦 Packaging for Distribution

### Package for Windows (.exe)

```bash
npm run package:win
```

This creates a Windows installer (`.exe`) in the `dist/` folder.

### Package for macOS (.dmg)

```bash
npm run package:mac
```

This creates a macOS disk image (`.dmg`) in the `dist/` folder.

**Note**: Building for macOS on Windows/Linux may require additional setup.

### Package for Linux (AppImage)

```bash
npm run package:linux
```

This creates a Linux AppImage in the `dist/` folder.

### Package for All Platforms

```bash
npm run package:all
```

This attempts to build for Windows, macOS, and Linux simultaneously.

## 📖 User Guide

### Creating Your First Book

1. **Launch the Application**
   - Open KidsRead eBook Creator
   - You'll see the dashboard with your book library

2. **Create a New Book**
   - Click the "Create New Book" button
   - Enter a title (e.g., "The ABC Adventure")
   - Select age category:
     - 0-7: Early Learners
     - 8-14: Middle Grade
     - 15-21: Young Adult
   - Click "Create Book"

3. **Add Content**
   - Use the toolbar to add elements:
     - **Text**: Click "Text" button, then double-click to edit
     - **Image**: Click "Image", then click the placeholder to upload
     - **Audio**: Click "Audio" for narrations or music
     - **Video**: Click "Video" for multimedia content

4. **Format Text**
   - Select a text element
   - Use the Properties Panel (right sidebar) to:
     - Change font family (includes Hindi fonts)
     - Adjust font size
     - Apply bold, italic, underline
     - Change text color
     - Set alignment

5. **Customize Pages**
   - Change background color using the canvas controls
   - Add animations to elements (Fade, Slide, Bounce, Zoom)
   - Drag elements to position them
   - Resize using the corner handle

6. **Add More Pages**
   - Click the "+" button in the left sidebar
   - Or duplicate an existing page for consistency

7. **Preview Your Book**
   - Click the "Preview" button
   - Use arrow keys or buttons to navigate
   - Test all interactive elements
   - Press ESC to exit preview

8. **Save Your Work**
   - The app auto-saves every 30 seconds
   - Click "Save" for manual save
   - Watch the status indicator at the bottom

9. **Export Your Book**
   - Click "Export" when ready
   - Choose a destination folder
   - The app creates an HTML flipbook
   - Share the folder or publish online

### Working with Media Files

**Images**
- Supported formats: JPG, JPEG, PNG, GIF
- Recommended size: Under 2MB for best performance
- Tip: Use high-quality images for print exports

**Audio**
- Supported formats: MP3, WAV
- Perfect for: Narrations, rhymes, sound effects
- Tip: Keep files under 5MB for smooth playback

**Video**
- Supported format: MP4
- Recommended: H.264 codec, 720p resolution
- Tip: Compress videos to reduce file size

### Keyboard Shortcuts

**Editor**
- `Delete`: Remove selected element
- `Ctrl/Cmd + S`: Manual save

**Preview**
- `→` (Right Arrow): Next page
- `←` (Left Arrow): Previous page
- `Home`: Go to first page
- `Esc`: Exit preview

## 🛠️ Technical Architecture

### Technology Stack

- **Electron**: Cross-platform desktop framework
- **React 18**: UI library with hooks
- **Webpack 5**: Module bundler
- **Babel**: JavaScript compiler
- **React DnD**: Drag and drop functionality
- **React Icons**: Icon library

### Project Structure

```
kidsread-ebook-creator/
├── src/
│   ├── main/
│   │   └── main.js              # Electron main process
│   ├── renderer/
│   │   ├── components/
│   │   │   ├── BookManagement/  # Dashboard & book CRUD
│   │   │   ├── PageEditor/      # Main editor workspace
│   │   │   ├── FlipBookPreview/ # Preview with animations
│   │   │   └── Common/          # Shared components
│   │   ├── styles/              # CSS files
│   │   ├── utils/               # Helper functions
│   │   ├── App.js               # Main React component
│   │   └── index.js             # React entry point
│   └── assets/                  # Icons, fonts, images
├── build/                       # Webpack build output
├── dist/                        # Packaged applications
├── package.json                 # Dependencies & scripts
├── webpack.renderer.config.js   # Webpack configuration
└── README.md                    # This file
```

### Data Storage

Books are stored locally on your computer:
- **Location**: `~/Library/Application Support/kidsread-ebook-creator/books/` (Mac)
  or `%APPDATA%/kidsread-ebook-creator/books/` (Windows)
- **Format**: `.kidsread` files (JSON-based)
- **Media**: Stored in `<book-id>/media/` subfolders

## 🌍 Language Support

### English
Full support for English content with kid-friendly fonts like Comic Sans MS, Arial, and more.

### Hindi (हिन्दी)
- **Fonts**: Noto Sans, Mangal
- **Input**: Type directly in Hindi using system input methods
- **Display**: Full Unicode support for Devanagari script

To use Hindi:
1. Enable Hindi keyboard on your system
2. Select "Noto Sans" or "Mangal" font in the editor
3. Type your content in Hindi

## 🎯 Target Audience & Use Cases

### Educators
- Create custom learning materials
- Design interactive lessons
- Build phonics and reading books
- Develop bilingual content

### Authors
- Self-publish children's books
- Create portfolio pieces
- Test book concepts quickly
- Produce digital-first content

### Content Creators
- Develop educational resources
- Create branded content for clients
- Build interactive storytelling experiences
- Monetize with subscription services (₹199/month suggested)

### Parents
- Make personalized storybooks for kids
- Create family photo albums with narration
- Teach alphabet and numbers
- Preserve family stories

## 🐛 Troubleshooting

### Application Won't Start
- Ensure Node.js 16+ is installed
- Run `npm install` again
- Check for port 3000 conflicts
- Try `npm run build` then `npm start`

### Elements Not Dragging
- Click element first to select it
- Ensure you're clicking the element, not the canvas
- Try clicking and holding for a moment before dragging

### Media Not Loading
- Check file format (JPG/PNG for images, MP3/WAV for audio, MP4 for video)
- Ensure file size is reasonable (under 10MB)
- Try a different file
- Check file permissions

### Export Fails
- Ensure you have write permissions to the export folder
- Check available disk space
- Try exporting to a different location
- Save your book before exporting

### Auto-Save Not Working
- Check the status indicator at the bottom
- Ensure you have write permissions
- Manually save using the Save button
- Check available disk space

## 📊 Performance Tips

1. **Optimize Images**: Resize images to appropriate dimensions before importing
2. **Compress Media**: Use compressed audio/video formats
3. **Limit Elements**: Keep elements per page under 20 for best performance
4. **Regular Saves**: Don't rely solely on auto-save, save manually after major changes
5. **Clean Library**: Delete unused books to free up space

## 🔒 Data Privacy

- All data stored locally on your computer
- No cloud sync or external servers
- No telemetry or usage tracking
- Full control over your content
- Export includes all data for portability

## 📄 File Format Specification

### .kidsread Format
```json
{
  "id": "unique-book-id",
  "title": "Book Title",
  "category": "0-7|8-14|15-21",
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp",
  "thumbnail": "base64-encoded-image",
  "pages": [
    {
      "id": "unique-page-id",
      "backgroundColor": "#ffffff",
      "elements": [
        {
          "id": "element-id",
          "type": "text|image|audio|video",
          "x": 100,
          "y": 100,
          "width": 300,
          "height": 200,
          "text": "...",
          "fontSize": 24,
          "fontFamily": "Comic Sans MS",
          "color": "#000000",
          "animation": "fade-in|slide-in|bounce|zoom|none"
        }
      ]
    }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues, questions, or feature requests:
- GitHub Issues: [Create an issue]
- Email: support@kidsread.com (placeholder)
- Documentation: This README

## 🎉 Acknowledgments

- React team for the amazing library
- Electron team for cross-platform capabilities
- The open-source community for dependencies
- Early testers and feedback providers

## 🚀 Roadmap

### Version 1.1 (Planned)
- [ ] Templates library (Rhyme, Picture, ABC, Story books)
- [ ] Advanced animations
- [ ] Audio recording directly in app
- [ ] Cloud sync option
- [ ] Collaboration features
- [ ] PDF export
- [ ] Mobile app companion

### Version 2.0 (Future)
- [ ] AI-powered content suggestions
- [ ] Text-to-speech integration
- [ ] Advanced drawing tools
- [ ] 3D book preview
- [ ] Multi-language UI
- [ ] Publishing marketplace integration

---

**Made with ❤️ for children's education**

Version 1.0.0 | Last Updated: 2025
