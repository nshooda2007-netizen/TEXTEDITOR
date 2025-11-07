import React, { useState, useRef, useEffect } from 'react';
import { FaTrash, FaExpand } from 'react-icons/fa';
import './Canvas.css';

const { ipcRenderer } = window.require('electron');

const Canvas = ({
  page,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onUpdatePage
}) => {
  const [draggedElement, setDraggedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState(null);
  const canvasRef = useRef(null);

  const handleMouseDown = (e, element) => {
    if (e.target.classList.contains('resize-handle')) {
      return;
    }
    e.stopPropagation();
    onSelectElement(element);
    setDraggedElement(element);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (draggedElement && !resizing) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;

      onUpdateElement(draggedElement.id, {
        x: Math.max(0, Math.min(newX, 800 - draggedElement.width)),
        y: Math.max(0, Math.min(newY, 600 - draggedElement.height))
      });
    }

    if (resizing) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newWidth = e.clientX - canvasRect.left - resizing.element.x;
      const newHeight = e.clientY - canvasRect.top - resizing.element.y;

      onUpdateElement(resizing.element.id, {
        width: Math.max(50, Math.min(newWidth, 800 - resizing.element.x)),
        height: Math.max(50, Math.min(newHeight, 600 - resizing.element.y))
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
    setResizing(null);
  };

  const handleResizeStart = (e, element) => {
    e.stopPropagation();
    setResizing({ element });
  };

  const handleTextDoubleClick = (element) => {
    const newText = prompt('Edit text:', element.text);
    if (newText !== null) {
      onUpdateElement(element.id, { text: newText });
    }
  };

  const handleAddImage = async (element) => {
    const result = await ipcRenderer.invoke('open-file-dialog', {
      title: 'Select Image',
      filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }
      ],
      properties: ['openFile']
    });

    if (result.success) {
      onUpdateElement(element.id, { src: result.data });
    }
  };

  const handleAddAudio = async (element) => {
    const result = await ipcRenderer.invoke('open-file-dialog', {
      title: 'Select Audio',
      filters: [
        { name: 'Audio', extensions: ['mp3', 'wav'] }
      ],
      properties: ['openFile']
    });

    if (result.success) {
      onUpdateElement(element.id, { src: result.data });
    }
  };

  const handleAddVideo = async (element) => {
    const result = await ipcRenderer.invoke('open-file-dialog', {
      title: 'Select Video',
      filters: [
        { name: 'Video', extensions: ['mp4'] }
      ],
      properties: ['openFile']
    });

    if (result.success) {
      onUpdateElement(element.id, { src: result.data });
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedElement, resizing]);

  const handleBackgroundColorChange = (color) => {
    onUpdatePage({ backgroundColor: color });
  };

  return (
    <div className="canvas-wrapper">
      <div className="canvas-controls">
        <div className="control-group">
          <label>Page Background:</label>
          <input
            type="color"
            value={page.backgroundColor || '#ffffff'}
            onChange={(e) => handleBackgroundColorChange(e.target.value)}
            className="color-picker"
          />
          <span className="color-value">{page.backgroundColor || '#ffffff'}</span>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="canvas"
        style={{ backgroundColor: page.backgroundColor || '#ffffff' }}
        onClick={() => onSelectElement(null)}
      >
        {page.elements.map(element => (
          <div
            key={element.id}
            className={`canvas-element ${selectedElement?.id === element.id ? 'selected' : ''}`}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              cursor: 'move'
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            {element.type === 'text' && (
              <div
                className="text-element"
                style={{
                  fontSize: element.fontSize || 24,
                  fontFamily: element.fontFamily || 'Comic Sans MS',
                  color: element.color || '#000000',
                  fontWeight: element.bold ? 'bold' : 'normal',
                  fontStyle: element.italic ? 'italic' : 'normal',
                  textDecoration: element.underline ? 'underline' : 'none',
                  textAlign: element.align || 'left',
                  width: '100%',
                  height: '100%',
                  overflow: 'auto',
                  padding: '8px'
                }}
                onDoubleClick={() => handleTextDoubleClick(element)}
              >
                {element.text || 'Double click to edit'}
              </div>
            )}

            {element.type === 'image' && (
              <>
                {element.src ? (
                  <img
                    src={element.src}
                    alt="Element"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div
                    className="placeholder-element"
                    onClick={() => handleAddImage(element)}
                  >
                    Click to add image
                  </div>
                )}
              </>
            )}

            {element.type === 'audio' && (
              <>
                {element.src ? (
                  <audio controls style={{ width: '100%' }}>
                    <source src={element.src} type="audio/mpeg" />
                  </audio>
                ) : (
                  <div
                    className="placeholder-element"
                    onClick={() => handleAddAudio(element)}
                  >
                    Click to add audio
                  </div>
                )}
              </>
            )}

            {element.type === 'video' && (
              <>
                {element.src ? (
                  <video controls style={{ width: '100%', height: '100%' }}>
                    <source src={element.src} type="video/mp4" />
                  </video>
                ) : (
                  <div
                    className="placeholder-element"
                    onClick={() => handleAddVideo(element)}
                  >
                    Click to add video
                  </div>
                )}
              </>
            )}

            {selectedElement?.id === element.id && (
              <>
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleResizeStart(e, element)}
                />
                <button
                  className="delete-element-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement(element.id);
                  }}
                >
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
