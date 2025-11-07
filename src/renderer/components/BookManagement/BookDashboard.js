import React, { useState } from 'react';
import { FaPlus, FaBook, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import CreateBookModal from './CreateBookModal';
import './BookDashboard.css';

const BookDashboard = ({ books, loading, onCreateBook, onOpenBook, onDeleteBook }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteBook = (e, bookId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      onDeleteBook(bookId);
    }
  };

  return (
    <div className="book-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <FaBook className="title-icon" />
            KidsRead eBook Creator
          </h1>
          <p className="dashboard-subtitle">Create engaging interactive ebooks for children</p>
        </div>
        <button className="btn btn-primary btn-create" onClick={() => setShowCreateModal(true)}>
          <FaPlus /> Create New Book
        </button>
      </div>

      <div className="dashboard-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <label>Filter by Age:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Ages</option>
            <option value="0-7">Age 0-7</option>
            <option value="8-14">Age 8-14</option>
            <option value="15-21">Age 15-21</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.length === 0 ? (
            <div className="empty-state">
              <FaBook className="empty-icon" />
              <h2>No books yet</h2>
              <p>Create your first interactive ebook to get started</p>
              <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                <FaPlus /> Create First Book
              </button>
            </div>
          ) : (
            filteredBooks.map(book => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => onOpenBook(book.id)}
              >
                <div className="book-thumbnail">
                  {book.thumbnail ? (
                    <img src={book.thumbnail} alt={book.title} />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <FaBook />
                    </div>
                  )}
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-category">Age {book.category}</p>
                  <p className="book-pages">{book.pages.length} pages</p>
                  <p className="book-date">
                    Updated: {new Date(book.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="book-actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBook(book.id);
                    }}
                    title="Edit book"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={(e) => handleDeleteBook(e, book.id)}
                    title="Delete book"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="dashboard-footer">
        <p>Total Books: {filteredBooks.length}</p>
        <p>KidsRead eBook Creator v1.0.0</p>
      </div>

      {showCreateModal && (
        <CreateBookModal
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreateBook}
        />
      )}
    </div>
  );
};

export default BookDashboard;
