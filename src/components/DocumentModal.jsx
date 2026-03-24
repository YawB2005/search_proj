import React, { useState, useEffect } from 'react';
import { X, FileText, Download } from 'lucide-react';
import './DocumentModal.css';

const API_URL = 'http://127.0.0.1:8000';

const DocumentModal = ({ filename, searchQuery, onClose }) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/documents/${encodeURIComponent(filename)}`);
        if (!res.ok) throw new Error('Document not found');

        const data = await res.json();
        setContent(data.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (filename) {
      fetchDocument();
    }
  }, [filename]);

  // Helper to highlight query words in the text
  const renderHighlightedContent = () => {
    if (!content) return null;
    if (!searchQuery) return content;

    const words = searchQuery.trim().split(/\s+/).filter(w => w);
    if (words.length === 0) return content;

    // Create a regex to match all query words case-insensitively
    const regex = new RegExp(`(${words.join('|')})`, 'gi');

    // Split the text by the regex, keeping the matched terms
    const parts = content.split(regex);

    return parts.map((part, i) => {
      if (regex.test(part)) {
        return <mark key={i} className="highlight-match">{part}</mark>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (!filename) return null;

  return (
    <div className="doc-modal-overlay" onClick={onClose}>
      <div className="doc-modal-window animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="doc-modal-header">
          <div className="doc-info">
            <FileText size={20} className="doc-icon" />
            <span className="doc-filename mono-text">{filename}</span>
          </div>
          <div className="doc-actions">
            <button className="icon-btn" title="Close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="doc-modal-body mono-text">
          {isLoading ? (
            <div className="doc-loading">
              <span className="cursor-blink">Fetching file stream from memory...</span>
            </div>
          ) : error ? (
            <div className="doc-error">
              Error: {error}
            </div>
          ) : (
            <pre className="doc-content">
              {renderHighlightedContent()}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
