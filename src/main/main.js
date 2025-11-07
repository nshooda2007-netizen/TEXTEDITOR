const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Create user data directory for storing books
const userDataPath = app.getPath('userData');
const booksDir = path.join(userDataPath, 'books');

// Ensure books directory exists
if (!fs.existsSync(booksDir)) {
  fs.mkdirSync(booksDir, { recursive: true });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, '../assets/icons/icon.png')
  });

  // Load the app
  const startUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for file operations

// Get books directory path
ipcMain.handle('get-books-dir', () => {
  return booksDir;
});

// Save book
ipcMain.handle('save-book', async (event, bookData) => {
  try {
    const bookPath = path.join(booksDir, `${bookData.id}.kidsread`);
    fs.writeFileSync(bookPath, JSON.stringify(bookData, null, 2));
    return { success: true, path: bookPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Load book
ipcMain.handle('load-book', async (event, bookId) => {
  try {
    const bookPath = path.join(booksDir, `${bookId}.kidsread`);
    const data = fs.readFileSync(bookPath, 'utf-8');
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get all books
ipcMain.handle('get-all-books', async () => {
  try {
    const files = fs.readdirSync(booksDir);
    const books = [];

    for (const file of files) {
      if (file.endsWith('.kidsread')) {
        const filePath = path.join(booksDir, file);
        const data = fs.readFileSync(filePath, 'utf-8');
        const book = JSON.parse(data);
        books.push(book);
      }
    }

    return { success: true, books };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Delete book
ipcMain.handle('delete-book', async (event, bookId) => {
  try {
    const bookPath = path.join(booksDir, `${bookId}.kidsread`);
    fs.unlinkSync(bookPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Save media file
ipcMain.handle('save-media', async (event, { fileName, fileData, bookId }) => {
  try {
    const mediaDir = path.join(booksDir, bookId, 'media');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    const filePath = path.join(mediaDir, fileName);

    // Handle base64 data
    if (fileData.startsWith('data:')) {
      const base64Data = fileData.split(',')[1];
      fs.writeFileSync(filePath, base64Data, 'base64');
    } else {
      fs.writeFileSync(filePath, fileData);
    }

    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Open file dialog
ipcMain.handle('open-file-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString('base64');
    const ext = path.extname(filePath);

    let mimeType = 'application/octet-stream';
    if (['.jpg', '.jpeg'].includes(ext)) mimeType = 'image/jpeg';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.mp3') mimeType = 'audio/mpeg';
    else if (ext === '.wav') mimeType = 'audio/wav';
    else if (ext === '.mp4') mimeType = 'video/mp4';

    return {
      success: true,
      fileName: path.basename(filePath),
      data: `data:${mimeType};base64,${base64Data}`,
      mimeType
    };
  }
  return { success: false };
});

// Export book as HTML
ipcMain.handle('export-book', async (event, { book, outputDir }) => {
  try {
    if (!outputDir) {
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'createDirectory']
      });

      if (result.canceled) {
        return { success: false, error: 'Export cancelled' };
      }

      outputDir = result.filePaths[0];
    }

    const exportPath = path.join(outputDir, `${book.title.replace(/[^a-z0-9]/gi, '_')}_export`);

    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    // Copy media files
    const mediaDir = path.join(exportPath, 'media');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    // Generate HTML
    const html = generateFlipbookHTML(book);
    fs.writeFileSync(path.join(exportPath, 'index.html'), html);

    return { success: true, path: exportPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

function generateFlipbookHTML(book) {
  // This will be a complete HTML file with embedded CSS and JS
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${book.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Comic Sans MS', cursive, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    #flipbook-container {
      background: white;
      border-radius: 10px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 20px;
      max-width: 1200px;
      width: 100%;
    }
    .page {
      background: white;
      padding: 40px;
      height: 600px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .controls {
      text-align: center;
      margin-top: 20px;
    }
    button {
      padding: 10px 20px;
      margin: 0 10px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      background: #667eea;
      color: white;
      cursor: pointer;
    }
    button:hover { background: #764ba2; }
    h1 { color: #333; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div id="flipbook-container">
    <div id="flipbook">
      ${book.pages.map((page, index) => `
        <div class="page" style="background-color: ${page.backgroundColor || '#ffffff'}">
          ${generatePageContent(page)}
        </div>
      `).join('')}
    </div>
    <div class="controls">
      <button onclick="prevPage()">← Previous</button>
      <button onclick="nextPage()">Next →</button>
      <button onclick="goToFirstPage()">Home</button>
    </div>
  </div>
  <script>
    let currentPage = 0;
    const pages = document.querySelectorAll('.page');
    const totalPages = pages.length;

    function showPage(n) {
      pages.forEach((page, index) => {
        page.style.display = index === n ? 'flex' : 'none';
      });
      currentPage = n;
    }

    function nextPage() {
      if (currentPage < totalPages - 1) {
        showPage(currentPage + 1);
      }
    }

    function prevPage() {
      if (currentPage > 0) {
        showPage(currentPage - 1);
      }
    }

    function goToFirstPage() {
      showPage(0);
    }

    // Show first page initially
    showPage(0);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Home') goToFirstPage();
    });
  </script>
</body>
</html>`;
}

function generatePageContent(page) {
  let content = '';

  // Add text elements
  if (page.elements) {
    page.elements.forEach(element => {
      if (element.type === 'text') {
        content += `<div style="
          position: absolute;
          left: ${element.x}px;
          top: ${element.y}px;
          width: ${element.width}px;
          font-size: ${element.fontSize || 24}px;
          font-family: ${element.fontFamily || 'Comic Sans MS'};
          color: ${element.color || '#000000'};
          font-weight: ${element.bold ? 'bold' : 'normal'};
          font-style: ${element.italic ? 'italic' : 'normal'};
          text-decoration: ${element.underline ? 'underline' : 'none'};
          text-align: ${element.align || 'left'};
        ">${element.text}</div>`;
      } else if (element.type === 'image') {
        content += `<img src="${element.src}" style="
          position: absolute;
          left: ${element.x}px;
          top: ${element.y}px;
          width: ${element.width}px;
          height: ${element.height}px;
        " />`;
      } else if (element.type === 'audio') {
        content += `<audio controls style="
          position: absolute;
          left: ${element.x}px;
          top: ${element.y}px;
        "><source src="${element.src}" type="audio/mpeg"></audio>`;
      } else if (element.type === 'video') {
        content += `<video controls style="
          position: absolute;
          left: ${element.x}px;
          top: ${element.y}px;
          width: ${element.width}px;
          height: ${element.height}px;
        "><source src="${element.src}" type="video/mp4"></video>`;
      }
    });
  }

  return content;
}
