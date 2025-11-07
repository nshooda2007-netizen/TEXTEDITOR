import React from 'react';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import './TextFormatting.css';

const TextFormatting = ({ selectedElement, onUpdateElement }) => {
  if (!selectedElement || selectedElement.type !== 'text') {
    return null;
  }

  const toggleStyle = (style) => {
    onUpdateElement(selectedElement.id, { [style]: !selectedElement[style] });
  };

  return (
    <div className="text-formatting">
      <button
        className={`format-btn ${selectedElement.bold ? 'active' : ''}`}
        onClick={() => toggleStyle('bold')}
        title="Bold"
      >
        <FaBold />
      </button>
      <button
        className={`format-btn ${selectedElement.italic ? 'active' : ''}`}
        onClick={() => toggleStyle('italic')}
        title="Italic"
      >
        <FaItalic />
      </button>
      <button
        className={`format-btn ${selectedElement.underline ? 'active' : ''}`}
        onClick={() => toggleStyle('underline')}
        title="Underline"
      >
        <FaUnderline />
      </button>
    </div>
  );
};

export default TextFormatting;
