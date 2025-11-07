import React, { useState, useEffect, useRef } from 'react';
import {
  FaArrowLeft, FaSave, FaEye, FaPlus, FaImage, FaFont,
  FaMusic, FaVideo, FaTrash, FaFileExport
} from 'react-icons/fa';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PageThumbnails from './PageThumbnails';
import Canvas from './Canvas';
import TextFormatting from './TextFormatting';
import MediaToolbar from './MediaToolbar';
import PropertiesPanel from './PropertiesPanel';
import './PageEditor.css';

const { ipcRenderer } = window.require('electron');

const PageEditor = ({ book, onSave, onBack, onPreview }) => {
  const [currentBook, setCurrentBook] = useState(book);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, error
  const [lastSaved, setLastSaved] = useState(new Date());
  const autoSaveTimer = useRef(null);

  useEffect(() => {
    // Auto-save every 30 seconds
    autoSaveTimer.current = setInterval(() => {
      handleAutoSave();
    }, 30000);

    return () => {
      if (autoSaveTimer.current) {
        clearInterval(autoSaveTimer.current);
      }
    };
  }, [currentBook]);

  const handleAutoSave = async () => {
    setSaveStatus('saving');
    const result = await onSave(currentBook);
    if (result.success) {
      setSaveStatus('saved');
      setLastSaved(new Date());
    } else {
      setSaveStatus('error');
    }
  };

  const handleManualSave = async () => {
    await handleAutoSave();
  };

  const updateCurrentPage = (updates) => {
    const updatedPages = [...currentBook.pages];
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      ...updates
    };
    setCurrentBook({
      ...currentBook,
      pages: updatedPages
    });
  };

  const addNewPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      backgroundColor: '#ffffff',
      elements: []
    };
    setCurrentBook({
      ...currentBook,
      pages: [...currentBook.pages, newPage]
    });
    setCurrentPageIndex(currentBook.pages.length);
  };

  const deletePage = (pageIndex) => {
    if (currentBook.pages.length <= 1) {
      alert('You must have at least one page in your book.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this page?')) {
      const updatedPages = currentBook.pages.filter((_, index) => index !== pageIndex);
      setCurrentBook({
        ...currentBook,
        pages: updatedPages
      });
      if (currentPageIndex >= updatedPages.length) {
        setCurrentPageIndex(updatedPages.length - 1);
      }
    }
  };

  const duplicatePage = (pageIndex) => {
    const pageToDuplicate = currentBook.pages[pageIndex];
    const duplicatedPage = {
      ...pageToDuplicate,
      id: `page-${Date.now()}`,
      elements: pageToDuplicate.elements.map(el => ({
        ...el,
        id: `${el.type}-${Date.now()}-${Math.random()}`
      }))
    };
    const updatedPages = [
      ...currentBook.pages.slice(0, pageIndex + 1),
      duplicatedPage,
      ...currentBook.pages.slice(pageIndex + 1)
    ];
    setCurrentBook({
      ...currentBook,
      pages: updatedPages
    });
    setCurrentPageIndex(pageIndex + 1);
  };

  const reorderPages = (fromIndex, toIndex) => {
    const updatedPages = [...currentBook.pages];
    const [movedPage] = updatedPages.splice(fromIndex, 1);
    updatedPages.splice(toIndex, 0, movedPage);
    setCurrentBook({
      ...currentBook,
      pages: updatedPages
    });
    setCurrentPageIndex(toIndex);
  };

  const addElement = (type) => {
    const newElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'text' ? 300 : 200,
      height: type === 'text' ? 100 : 150
    };

    if (type === 'text') {
      newElement.text = 'Double click to edit';
      newElement.fontSize = 24;
      newElement.fontFamily = 'Comic Sans MS';
      newElement.color = '#000000';
      newElement.bold = false;
      newElement.italic = false;
      newElement.underline = false;
      newElement.align = 'left';
    }

    updateCurrentPage({
      elements: [...currentBook.pages[currentPageIndex].elements, newElement]
    });
    setSelectedElement(newElement);
  };

  const updateElement = (elementId, updates) => {
    const updatedElements = currentBook.pages[currentPageIndex].elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    updateCurrentPage({ elements: updatedElements });
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
  };

  const deleteElement = (elementId) => {
    const updatedElements = currentBook.pages[currentPageIndex].elements.filter(
      el => el.id !== elementId
    );
    updateCurrentPage({ elements: updatedElements });
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
  };

  const handleExport = async () => {
    setSaveStatus('saving');
    await onSave(currentBook);
    const result = await ipcRenderer.invoke('export-book', { book: currentBook });
    if (result.success) {
      alert(`Book exported successfully to:\n${result.path}`);
    } else {
      alert(`Export failed: ${result.error}`);
    }
    setSaveStatus('saved');
  };

  const currentPage = currentBook.pages[currentPageIndex];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page-editor">
        {/* Top Toolbar */}
        <div className="editor-toolbar">
          <div className="toolbar-left">
            <button className="btn btn-secondary" onClick={onBack} title="Back to Dashboard">
              <FaArrowLeft /> Back
            </button>
            <h2 className="book-title-header">{currentBook.title}</h2>
          </div>

          <div className="toolbar-center">
            <MediaToolbar
              onAddText={() => addElement('text')}
              onAddImage={() => addElement('image')}
              onAddAudio={() => addElement('audio')}
              onAddVideo={() => addElement('video')}
            />
          </div>

          <div className="toolbar-right">
            <button className="btn btn-secondary" onClick={onPreview} title="Preview">
              <FaEye /> Preview
            </button>
            <button className="btn btn-success" onClick={handleManualSave} title="Save">
              <FaSave /> Save
            </button>
            <button className="btn btn-primary" onClick={handleExport} title="Export">
              <FaFileExport /> Export
            </button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="editor-main">
          {/* Left Sidebar - Page Thumbnails */}
          <PageThumbnails
            pages={currentBook.pages}
            currentPageIndex={currentPageIndex}
            onSelectPage={setCurrentPageIndex}
            onAddPage={addNewPage}
            onDeletePage={deletePage}
            onDuplicatePage={duplicatePage}
            onReorderPages={reorderPages}
          />

          {/* Center - Canvas */}
          <div className="editor-canvas-container">
            <Canvas
              page={currentPage}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
              onUpdatePage={updateCurrentPage}
            />
          </div>

          {/* Right Sidebar - Properties */}
          <PropertiesPanel
            selectedElement={selectedElement}
            currentPage={currentPage}
            onUpdateElement={updateElement}
            onUpdatePage={updateCurrentPage}
          />
        </div>

        {/* Bottom Status Bar */}
        <div className="editor-status-bar">
          <div className="status-left">
            <span className="status-item">
              Page {currentPageIndex + 1} of {currentBook.pages.length}
            </span>
            <span className="status-item">
              {currentBook.pages[currentPageIndex].elements.length} elements
            </span>
          </div>
          <div className="status-right">
            <span className={`status-indicator ${saveStatus}`}></span>
            <span className="status-text">
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && `Saved at ${lastSaved.toLocaleTimeString()}`}
              {saveStatus === 'error' && 'Error saving'}
            </span>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default PageEditor;
