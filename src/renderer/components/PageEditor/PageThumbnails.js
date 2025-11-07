import React from 'react';
import { FaPlus, FaTrash, FaCopy } from 'react-icons/fa';
import './PageThumbnails.css';

const PageThumbnails = ({
  pages,
  currentPageIndex,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
  onReorderPages
}) => {
  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/html'));
    if (fromIndex !== toIndex) {
      onReorderPages(fromIndex, toIndex);
    }
  };

  return (
    <div className="page-thumbnails">
      <div className="thumbnails-header">
        <h3>Pages</h3>
        <button
          className="btn-icon btn-add-page"
          onClick={onAddPage}
          title="Add new page"
        >
          <FaPlus />
        </button>
      </div>

      <div className="thumbnails-list">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={`thumbnail-item ${index === currentPageIndex ? 'active' : ''}`}
            onClick={() => onSelectPage(index)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div
              className="thumbnail-preview"
              style={{ backgroundColor: page.backgroundColor }}
            >
              <div className="thumbnail-content">
                {page.elements.map(element => (
                  <div
                    key={element.id}
                    className="thumbnail-element"
                    style={{
                      position: 'absolute',
                      left: `${(element.x / 800) * 100}%`,
                      top: `${(element.y / 600) * 100}%`,
                      width: `${(element.width / 800) * 100}%`,
                      height: `${(element.height / 600) * 100}%`
                    }}
                  >
                    {element.type === 'text' && (
                      <div
                        style={{
                          fontSize: '4px',
                          overflow: 'hidden',
                          color: element.color || '#000'
                        }}
                      >
                        {element.text}
                      </div>
                    )}
                    {element.type === 'image' && element.src && (
                      <img
                        src={element.src}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="thumbnail-info">
              <span className="page-number">{index + 1}</span>
              <div className="thumbnail-actions">
                <button
                  className="btn-icon-tiny"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicatePage(index);
                  }}
                  title="Duplicate page"
                >
                  <FaCopy />
                </button>
                <button
                  className="btn-icon-tiny btn-delete-tiny"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePage(index);
                  }}
                  title="Delete page"
                  disabled={pages.length <= 1}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageThumbnails;
