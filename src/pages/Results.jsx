import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Terminal, Code, Cpu } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import ResultCard from '../components/ResultCard';
import Loader from '../components/Loader';
import DocumentModal from '../components/DocumentModal';
import './Results.css';

const API_URL = 'http://127.0.0.1:8000';

const Results = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [metrics, setMetrics] = useState({ time: 0, scanned: 0 });
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setIsLoading(true);
      setResults([]);
      const startTime = performance.now();

      try {
        const [searchRes, docsRes] = await Promise.all([
          fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`),
          fetch(`${API_URL}/documents`)
        ]);

        if (searchRes.ok && docsRes.ok) {
          const searchData = await searchRes.json();
          const docsData = await docsRes.json();
          
          setResults(searchData.results || []);
          
          const endTime = performance.now();
          setMetrics({
            time: ((endTime - startTime) / 1000).toFixed(3),
            scanned: docsData.total_documents || 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch from backend:", err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1200);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (newQuery) => {
    if (newQuery !== query) {
      window.location.href = `/search?q=${encodeURIComponent(newQuery)}`;
    }
  };

  return (
    <div className="dsa-results-container">
      <header className="results-header">
        <div className="header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
            <Link to="/" className="brand-link">
              <Terminal size={24} className="brand-icon" />
              <span className="brand-text">DSSearch</span>
            </Link>
            <div className="header-search">
              <SearchBar initialQuery={query} onSearch={handleSearch} size="small" />
            </div>
          </div>
          
          <div className="header-actions">
            {user ? (
              <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user.name || user.username}</span>
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => window.location.href = '/login'}
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="results-main">
        {isLoading ? (
          <div className="loader-wrapper">
            <Loader />
          </div>
        ) : (
          <div className="results-content">
            <div className="results-metrics">
              <div className="metric">
                <Cpu size={16} />
                <span>Computed in {metrics.time}s</span>
              </div>
              <div className="metric">
                <Code size={16} />
                <span>Scanned {metrics.scanned} documents in memory</span>
              </div>
            </div>

            <div className="results-list">
              {results.map((result, index) => (
                <ResultCard 
                  key={result.document} 
                  result={result} 
                  rank={index + 1} 
                  onOpenDoc={() => setSelectedFile(result.document)}
                />
              ))}
              
              {results.length === 0 && (
                <div className="no-results">
                  <p>No documents contained the requested string.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {selectedFile && (
        <DocumentModal 
          filename={selectedFile} 
          searchQuery={query}
          onClose={() => setSelectedFile(null)} 
        />
      )}
    </div>
  );
};

export default Results;
