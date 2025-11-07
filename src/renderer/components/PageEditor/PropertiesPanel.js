import React from 'react';
import './PropertiesPanel.css';

const PropertiesPanel = ({ selectedElement, currentPage, onUpdateElement, onUpdatePage }) => {
  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <div className="properties-header">
          <h3>Properties</h3>
        </div>
        <div className="properties-content">
          <p className="no-selection">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleChange = (property, value) => {
    onUpdateElement(selectedElement.id, { [property]: value });
  };

  return (
    <div className="properties-panel">
      <div className="properties-header">
        <h3>Properties</h3>
        <span className="element-type">{selectedElement.type.toUpperCase()}</span>
      </div>

      <div className="properties-content">
        {/* Common Properties */}
        <div className="property-section">
          <h4>Position & Size</h4>
          <div className="property-row">
            <label>X:</label>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => handleChange('x', parseInt(e.target.value) || 0)}
              min="0"
              max="800"
            />
          </div>
          <div className="property-row">
            <label>Y:</label>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => handleChange('y', parseInt(e.target.value) || 0)}
              min="0"
              max="600"
            />
          </div>
          <div className="property-row">
            <label>Width:</label>
            <input
              type="number"
              value={Math.round(selectedElement.width)}
              onChange={(e) => handleChange('width', parseInt(e.target.value) || 50)}
              min="50"
              max="800"
            />
          </div>
          <div className="property-row">
            <label>Height:</label>
            <input
              type="number"
              value={Math.round(selectedElement.height)}
              onChange={(e) => handleChange('height', parseInt(e.target.value) || 50)}
              min="50"
              max="600"
            />
          </div>
        </div>

        {/* Text-specific Properties */}
        {selectedElement.type === 'text' && (
          <>
            <div className="property-section">
              <h4>Text Content</h4>
              <textarea
                value={selectedElement.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                rows="4"
                className="text-content-input"
              />
            </div>

            <div className="property-section">
              <h4>Text Formatting</h4>
              <div className="property-row">
                <label>Font:</label>
                <select
                  value={selectedElement.fontFamily || 'Comic Sans MS'}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                >
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Impact">Impact</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Noto Sans">Noto Sans (Hindi)</option>
                  <option value="Mangal">Mangal (Hindi)</option>
                </select>
              </div>

              <div className="property-row">
                <label>Size:</label>
                <input
                  type="number"
                  value={selectedElement.fontSize || 24}
                  onChange={(e) => handleChange('fontSize', parseInt(e.target.value) || 12)}
                  min="8"
                  max="120"
                />
              </div>

              <div className="property-row">
                <label>Color:</label>
                <input
                  type="color"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="color-picker"
                />
              </div>

              <div className="property-row">
                <label>Align:</label>
                <select
                  value={selectedElement.align || 'left'}
                  onChange={(e) => handleChange('align', e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>

              <div className="property-row checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedElement.bold || false}
                    onChange={(e) => handleChange('bold', e.target.checked)}
                  />
                  Bold
                </label>
              </div>

              <div className="property-row checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedElement.italic || false}
                    onChange={(e) => handleChange('italic', e.target.checked)}
                  />
                  Italic
                </label>
              </div>

              <div className="property-row checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedElement.underline || false}
                    onChange={(e) => handleChange('underline', e.target.checked)}
                  />
                  Underline
                </label>
              </div>
            </div>
          </>
        )}

        {/* Image-specific Properties */}
        {selectedElement.type === 'image' && selectedElement.src && (
          <div className="property-section">
            <h4>Image</h4>
            <div className="image-preview">
              <img src={selectedElement.src} alt="Preview" />
            </div>
          </div>
        )}

        {/* Interactive Properties */}
        <div className="property-section">
          <h4>Interactive</h4>
          <div className="property-row">
            <label>Animation:</label>
            <select
              value={selectedElement.animation || 'none'}
              onChange={(e) => handleChange('animation', e.target.value)}
            >
              <option value="none">None</option>
              <option value="fade-in">Fade In</option>
              <option value="slide-in">Slide In</option>
              <option value="bounce">Bounce</option>
              <option value="zoom">Zoom</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
