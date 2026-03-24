import React from 'react';
import { FileText, Activity } from 'lucide-react';
import './ResultCard.css';

const ResultCard = ({ result, rank, onOpenDoc }) => {
  const { document, score } = result;

  return (
    <article className="dsa-result-card">
      <div className="card-header">
        <div className="card-rank">
          <span className="rank-badge">Rank #{rank}</span>
        </div>
        <div className="card-meta">
          <span className="freq-badge" title="Term frequency sum">
            <Activity size={14} />
            Score: {score}
          </span>
        </div>
      </div>
      
      <div className="card-file-info">
        <FileText size={18} className="file-icon" />
        <h3 
          className="file-name mono-text" 
          onClick={onOpenDoc}
          title="Click to view highlighted document"
        >
          {document}
        </h3>
      </div>
    </article>
  );
};

export default ResultCard;
