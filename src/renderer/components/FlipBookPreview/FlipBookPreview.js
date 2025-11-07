import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import './FlipBookPreview.css';

const FlipBookPreview = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Keyboard navigation
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Home') goToFirstPage();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < book.pages.length - 1 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setAnimating(false);
      }, 600);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setAnimating(false);
      }, 600);
    }
  };

  const goToFirstPage = () => {
    if (currentPage !== 0 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentPage(0);
        setAnimating(false);
      }, 600);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderElement = (element) => {
    const elementStyle = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height
    };

    // Apply animation if specified
    let animationClass = '';
    if (element.animation) {
      animationClass = `animate-${element.animation}`;
    }

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            className={`preview-text ${animationClass}`}
            style={{
              ...elementStyle,
              fontSize: element.fontSize || 24,
              fontFamily: element.fontFamily || 'Comic Sans MS',
              color: element.color || '#000000',
              fontWeight: element.bold ? 'bold' : 'normal',
              fontStyle: element.italic ? 'italic' : 'normal',
              textDecoration: element.underline ? 'underline' : 'none',
              textAlign: element.align || 'left',
              padding: '8px',
              overflow: 'auto'
            }}
          >
            {element.text}
          </div>
        );

      case 'image':
        return element.src ? (
          <img
            key={element.id}
            src={element.src}
            alt=""
            className={`preview-image ${animationClass}`}
            style={{
              ...elementStyle,
              objectFit: 'contain'
            }}
          />
        ) : null;

      case 'audio':
        return element.src ? (
          <audio
            key={element.id}
            controls
            className={`preview-audio ${animationClass}`}
            style={elementStyle}
          >
            <source src={element.src} type="audio/mpeg" />
          </audio>
        ) : null;

      case 'video':
        return element.src ? (
          <video
            key={element.id}
            controls
            className={`preview-video ${animationClass}`}
            style={elementStyle}
          >
            <source src={element.src} type="video/mp4" />
          </video>
        ) : null;

      default:
        return null;
    }
  };

  const currentPageData = book.pages[currentPage];

  return (
    <div className={`flipbook-preview ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="preview-header">
        <div className="header-left">
          <h2>{book.title}</h2>
          <span className="page-indicator">
            Page {currentPage + 1} of {book.pages.length}
          </span>
        </div>
        <div className="header-right">
          <button
            className="btn-icon-preview"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
          <button className="btn-icon-preview" onClick={onClose} title="Close Preview">
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Book Display */}
      <div className="preview-content">
        <div className={`book-container ${animating ? 'turning' : ''}`}>
          <div
            className="book-page"
            style={{
              backgroundColor: currentPageData.backgroundColor || '#ffffff'
            }}
          >
            {currentPageData.elements.map(element => renderElement(element))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="preview-controls">
        <button
          className="btn btn-secondary control-btn"
          onClick={prevPage}
          disabled={currentPage === 0 || animating}
        >
          <FaArrowLeft /> Previous
        </button>

        <button className="btn btn-secondary control-btn" onClick={goToFirstPage}>
          <FaHome /> Home
        </button>

        <button
          className="btn btn-secondary control-btn"
          onClick={nextPage}
          disabled={currentPage === book.pages.length - 1 || animating}
        >
          Next <FaArrowRight />
        </button>
      </div>

      {/* Instructions */}
      <div className="preview-instructions">
        <span>Use arrow keys to navigate • Press ESC to exit</span>
      </div>
    </div>
  );
};

export default FlipBookPreview;
