import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import classNames from 'classnames';
import './SearchBar.css';

const SearchBar = ({ initialQuery = '', onSearch, autoFocus = false, size = 'large' }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form 
      className={classNames('dsa-search-bar', { 
        'size-large': size === 'large',
        'size-small': size === 'small'
      })}
      onSubmit={handleSubmit}
    >
      <div className="search-icon-wrapper">
        <Search size={20} className="search-icon" />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="dsa-search-input mono-text"
        placeholder="Enter query string..."
        autoFocus={autoFocus}
      />
      
      {query && (
        <button 
          type="button" 
          onClick={handleClear} 
          className="clear-btn"
          aria-label="Clear"
        >
          <X size={18} />
        </button>
      )}
      
      <button type="submit" className="submit-btn mono-text">
        EXECUTE
      </button>
    </form>
  );
};

export default SearchBar;
