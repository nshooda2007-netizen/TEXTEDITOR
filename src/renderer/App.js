import React, { useState, useEffect } from 'react';
import BookDashboard from './components/BookManagement/BookDashboard';
import PageEditor from './components/PageEditor/PageEditor';
import FlipBookPreview from './components/FlipBookPreview/FlipBookPreview';
import './styles/App.css';

const { ipcRenderer } = window.require('electron');

function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, editor, preview
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllBooks();
  }, []);

  const loadAllBooks = async () => {
    setLoading(true);
    const result = await ipcRenderer.invoke('get-all-books');
    if (result.success) {
      setBooks(result.books);
    }
    setLoading(false);
  };

  const createNewBook = (bookData) => {
    const newBook = {
      id: Date.now().toString(),
      title: bookData.title,
      category: bookData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: null,
      pages: [
        {
          id: 'page-1',
          backgroundColor: '#ffffff',
          elements: []
        }
      ]
    };
    setCurrentBook(newBook);
    setCurrentView('editor');
  };

  const openBook = async (bookId) => {
    const result = await ipcRenderer.invoke('load-book', bookId);
    if (result.success) {
      setCurrentBook(result.data);
      setCurrentView('editor');
    }
  };

  const deleteBook = async (bookId) => {
    const result = await ipcRenderer.invoke('delete-book', bookId);
    if (result.success) {
      await loadAllBooks();
    }
  };

  const saveBook = async (book) => {
    const updatedBook = {
      ...book,
      updatedAt: new Date().toISOString()
    };
    const result = await ipcRenderer.invoke('save-book', updatedBook);
    if (result.success) {
      setCurrentBook(updatedBook);
      await loadAllBooks();
    }
    return result;
  };

  const goToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentBook(null);
    loadAllBooks();
  };

  const openPreview = () => {
    setCurrentView('preview');
  };

  const closePreview = () => {
    setCurrentView('editor');
  };

  return (
    <div className="app">
      {currentView === 'dashboard' && (
        <BookDashboard
          books={books}
          loading={loading}
          onCreateBook={createNewBook}
          onOpenBook={openBook}
          onDeleteBook={deleteBook}
        />
      )}

      {currentView === 'editor' && currentBook && (
        <PageEditor
          book={currentBook}
          onSave={saveBook}
          onBack={goToDashboard}
          onPreview={openPreview}
        />
      )}

      {currentView === 'preview' && currentBook && (
        <FlipBookPreview
          book={currentBook}
          onClose={closePreview}
        />
      )}
    </div>
  );
}

export default App;
