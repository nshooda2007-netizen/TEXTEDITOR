import React from 'react';
import { FaFont, FaImage, FaMusic, FaVideo } from 'react-icons/fa';
import './MediaToolbar.css';

const MediaToolbar = ({ onAddText, onAddImage, onAddAudio, onAddVideo }) => {
  return (
    <div className="media-toolbar">
      <button
        className="toolbar-btn"
        onClick={onAddText}
        title="Add Text"
      >
        <FaFont />
        <span>Text</span>
      </button>
      <button
        className="toolbar-btn"
        onClick={onAddImage}
        title="Add Image"
      >
        <FaImage />
        <span>Image</span>
      </button>
      <button
        className="toolbar-btn"
        onClick={onAddAudio}
        title="Add Audio"
      >
        <FaMusic />
        <span>Audio</span>
      </button>
      <button
        className="toolbar-btn"
        onClick={onAddVideo}
        title="Add Video"
      >
        <FaVideo />
        <span>Video</span>
      </button>
    </div>
  );
};

export default MediaToolbar;
