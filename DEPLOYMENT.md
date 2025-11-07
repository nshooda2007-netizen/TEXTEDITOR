# Deployment Guide

## Overview
This guide will help you package and distribute the KidsRead eBook Creator application for Windows, macOS, and Linux.

## Prerequisites

Before packaging, ensure you have:
- ✅ Node.js 16+ installed
- ✅ All dependencies installed (`npm install`)
- ✅ Application tested in development mode
- ✅ Icon files prepared (256x256 PNG recommended)

## Packaging Commands

### For Windows (.exe installer)
```bash
npm run package:win
```

**Output**: `dist/KidsRead eBook Creator Setup 1.0.0.exe`

**File size**: ~150-200 MB (includes Electron runtime)

**Installation**: Users run the .exe file, which installs the app in Program Files

### For macOS (.dmg disk image)
```bash
npm run package:mac
```

**Output**: `dist/KidsRead eBook Creator-1.0.0.dmg`

**File size**: ~150-200 MB

**Installation**: Users drag the app to Applications folder

**Note**: On Windows/Linux, you may need additional tools for Mac packaging.

### For Linux (AppImage)
```bash
npm run package:linux
```

**Output**: `dist/KidsRead eBook Creator-1.0.0.AppImage`

**File size**: ~150-200 MB

**Installation**: Users make it executable and run directly

### For All Platforms
```bash
npm run package:all
```

Attempts to build for Windows, macOS, and Linux in one command.

## Platform-Specific Notes

### Windows
- **Code Signing**: For production, sign your .exe to avoid Windows Defender warnings
- **Auto-updates**: Consider adding electron-updater for automatic updates
- **Installer Options**: Customize NSIS installer in `package.json` → `build.win`

### macOS
- **Code Signing**: Required for distribution outside Mac App Store
- **Notarization**: Apple requires notarization for macOS 10.15+
- **M1/M2 Support**: Current config supports both Intel and Apple Silicon
- **Build on Mac**: Best results when building on an actual Mac

### Linux
- **AppImage**: No installation required, works on most distros
- **Alternative Formats**: Can also build .deb or .rpm (update package.json)
- **Permissions**: Users need to `chmod +x` the AppImage

## Customization

### Change App Icon
1. Replace `src/assets/icons/icon.png` with your icon (256x256 PNG)
2. For best results, provide icons at multiple sizes:
   - 16x16, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512

### Update App Metadata
Edit `package.json`:
```json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "description": "Your description",
  "author": "Your Name",
  "build": {
    "appId": "com.yourcompany.appname",
    "productName": "Your Product Name"
  }
}
```

### Configure File Associations
To associate .kidsread files with your app, add to `package.json`:
```json
"build": {
  "fileAssociations": [
    {
      "ext": "kidsread",
      "name": "KidsRead eBook",
      "role": "Editor"
    }
  ]
}
```

## Distribution

### Option 1: Direct Download
- Upload installers to your website
- Provide download links for each platform
- Include installation instructions

### Option 2: Microsoft Store (Windows)
- Requires Windows App Certification
- Submit through Partner Center
- Annual developer account fee: $19

### Option 3: Mac App Store
- Requires Apple Developer Account ($99/year)
- Must pass App Review
- Requires specific entitlements and sandboxing

### Option 4: Snap Store / Flathub (Linux)
- Free distribution
- Reaches multiple Linux distros
- Requires creating snap/flatpak configuration

## Automatic Updates

To add auto-update functionality:

1. Install electron-updater:
```bash
npm install electron-updater
```

2. Add to `src/main/main.js`:
```javascript
const { autoUpdater } = require('electron-updater');

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

3. Host releases on GitHub Releases or own server

4. Configure in `package.json`:
```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "your-username",
    "repo": "your-repo"
  }
}
```

## Testing Before Release

### Pre-Release Checklist
- [ ] Test on clean machine (no dev tools installed)
- [ ] Verify all features work in packaged app
- [ ] Test with different file types (images, audio, video)
- [ ] Check auto-save functionality
- [ ] Test export feature thoroughly
- [ ] Verify file associations work
- [ ] Test on multiple OS versions
- [ ] Check app icon displays correctly
- [ ] Verify app metadata (name, version, etc.)
- [ ] Test installation and uninstallation

### Common Issues

**Issue**: App won't start after packaging
**Solution**: Check that all files are included in `package.json` → `files` array

**Issue**: Media files not loading
**Solution**: Ensure file:// protocol is handled correctly in production

**Issue**: Large file size
**Solution**: Consider asar packaging or exclude unnecessary files

## Reducing Package Size

1. **Exclude dev dependencies**:
Already configured - dev dependencies not included

2. **Use asar packaging** (already enabled by default):
Compresses files into single archive

3. **Exclude unnecessary files**:
Add to `package.json`:
```json
"build": {
  "files": [
    "!**/.git",
    "!**/.DS_Store",
    "!**/node_modules/*/test"
  ]
}
```

## License & Legal

### Before Distribution
1. **Review all dependencies** for license compatibility
2. **Include LICENSE file** with your chosen license
3. **Add CREDITS.md** acknowledging open-source libraries
4. **Privacy Policy**: If collecting any data, include privacy policy
5. **Terms of Use**: Consider adding terms for commercial use

### Recommended Licenses
- **MIT**: Most permissive, allows commercial use
- **GPL**: Copyleft, requires derivative works to be open-source
- **Commercial**: Custom license for proprietary software

## Monetization

### Subscription Model (₹199/month suggested)
Implement licensing:
1. Add license key validation
2. Integrate payment gateway (Razorpay for India)
3. Build licensing server
4. Add trial period (7-30 days)

### One-Time Purchase
1. Simpler implementation
2. Use license keys or dongle
3. Typical pricing: ₹2000-5000 one-time

### Freemium Model
- Free: Limited features (e.g., 3 books max)
- Pro: Unlimited books, advanced features
- Enterprise: Custom branding, priority support

## Support & Maintenance

### Update Strategy
- **Patch releases** (1.0.x): Bug fixes, every 2-4 weeks
- **Minor releases** (1.x.0): New features, every 2-3 months
- **Major releases** (x.0.0): Breaking changes, yearly

### Gathering Feedback
- GitHub Issues for bug reports
- User forum or Discord for community
- In-app feedback button
- Analytics (with user consent)

## Marketing Checklist

- [ ] Create product website
- [ ] Make demo video
- [ ] Screenshot gallery
- [ ] Sample eBooks to showcase
- [ ] Social media presence
- [ ] Contact Indian educational institutions
- [ ] List on educational software directories
- [ ] Create tutorial videos (YouTube)
- [ ] Blog posts about features
- [ ] Email newsletter for updates

## Next Steps

1. **Test thoroughly** in packaged form
2. **Get beta testers** for real-world feedback
3. **Prepare marketing materials**
4. **Set up distribution channels**
5. **Launch with documentation**
6. **Monitor for issues**
7. **Plan updates and new features**

---

Good luck with your launch! 🚀
