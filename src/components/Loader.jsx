import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import './Loader.css';

const Loader = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const sequence = [
      "Initializing search sequence...",
      "Resolving query string...",
      "Loading documents into memory...",
      "O(n) string matching sequence initiated...",
      "Calculating term frequency...",
      "Ranking matching documents..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < sequence.length) {
        setLogs(prev => [...prev, sequence[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 400); // 400ms per log line to simulate work

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dsa-loader-container">
      <div className="terminal-header">
        <Terminal size={16} />
        <span className="mono-text">system_process</span>
      </div>
      <div className="terminal-body mono-text">
        {logs.map((log, index) => (
          <div key={index} className="log-line">
            <span className="log-prefix">&gt;</span> {log}
          </div>
        ))}
        <div className="log-line cursor-blink">
          <span className="log-prefix">&gt;</span> _
        </div>
      </div>
    </div>
  );
};

export default Loader;
