import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Database, FileText, Terminal, UploadCloud } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import DocumentModal from '../components/DocumentModal';
import WelcomeModal from '../components/WelcomeModal';
import './Home.css';

const API_URL = 'http://127.0.0.1:8000';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [loadedFiles, setLoadedFiles] = useState([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_URL}/documents`);
      if (res.ok) {
        const data = await res.json();
        const docs = data.documents.map(docName => ({
          name: docName,
          words: 'Loaded in memory' 
        }));
        setLoadedFiles(docs);
        setIsBackendConnected(true);
      }
    } catch (err) {
      console.error("Failed to connect to backend", err);
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (location.state?.showWelcome) {
      setShowWelcomeModal(true);
      // Clean up the location state so modal doesn't reappear on reload
      navigate('/', { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    try {
      const res = await fetch(`${API_URL}/upload_documents`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        await fetchDocuments();
      } else {
        alert("Failed to upload documents.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading documents. Is the backend running?");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="home-dashboard">
      <header className="home-header">
        <div className="brand">
          <Terminal className="brand-icon" size={28} />
          <h1>Group 12 Search Engine</h1>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className={`status-badge ${isBackendConnected ? '' : 'disconnected'}`}>
            <Database size={14} />
            <span>{isBackendConnected ? 'Backend Connected' : 'Backend Disconnected'}</span>
          </div>
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
              onClick={() => navigate('/login')}
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
      </header>

      <main className="home-content">
        <div className="hero-section">
          <h2>Text Search & Ranking System</h2>
          <p>A high-performance algorithmic text search engine. Queries are matched against loaded documents, ranked by term frequency.</p>
        </div>

        <div className="search-widget">
          <SearchBar onSearch={handleSearch} autoFocus={true} size="large" />
          <p className="search-hint mono-text">Try searching: "binary tree", "data structures", "algorithm"</p>
        </div>

        <div className="memory-state">
          <div className="memory-header">
            <h3>Documents In Memory</h3>
            <div className="memory-actions">
              <span className="badge badge-indigo">{loadedFiles.length} files loaded</span>
              <input 
                type="file" 
                multiple 
                accept=".txt" 
                style={{ display: 'none' }} 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button 
                className="upload-btn" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <UploadCloud size={16} />
                {isUploading ? 'Uploading...' : 'Load .txt Files'}
              </button>
            </div>
          </div>
          
          <div className="files-grid">
            {loadedFiles.length === 0 ? (
              <p className="mono-text" style={{color: 'var(--text-tertiary)'}}>
                {isBackendConnected ? 'No files loaded. Click "Load .txt Files" to begin.' : 'Backend unreachable. Please start the FastAPI server on port 8000.'}
              </p>
            ) : (
              loadedFiles.map((file, idx) => (
                <div 
                  key={idx} 
                  className="file-card" 
                  onClick={() => setSelectedFile(file.name)}
                  style={{cursor: 'pointer'}}
                  title="Click to view file contents"
                >
                  <FileText className="file-icon" size={20} />
                  <div className="file-info">
                    <span className="file-name mono-text">{file.name}</span>
                    <span className="file-words">{file.words}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {selectedFile && (
        <DocumentModal 
          filename={selectedFile} 
          onClose={() => setSelectedFile(null)} 
        />
      )}

      {showWelcomeModal && (
        <WelcomeModal
          user={user}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}
    </div>
  );
};

export default Home;
