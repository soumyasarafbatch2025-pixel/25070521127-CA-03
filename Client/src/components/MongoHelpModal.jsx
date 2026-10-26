import React, { useState } from 'react';
import {
  X,
  Database,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Layers,
} from 'lucide-react';

export default function MongoHelpModal({ isOpen, onClose, dbStatus }) {
  if (!isOpen) return null;

  const [copiedText, setCopiedText] = useState('');

  const handleCopy = (text, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(id);
      setTimeout(() => setCopiedText(''), 2500);
    }
  };

  const localUri = 'mongodb://127.0.0.1:27017/campusloop_lite';
  const compassLocal = 'mongodb://127.0.0.1:27017';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={22} />
            </div>
            <div>
              <h2>MongoDB & MongoDB Compass Quick Guide</h2>
              <p>Simple step-by-step guide to verify saved records in Compass</p>
            </div>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: 18 }}>
          {/* Status banner */}
          <div
            style={{
              padding: 14,
              backgroundColor: dbStatus === 'Connected' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${dbStatus === 'Connected' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Database
                size={20}
                style={{ color: dbStatus === 'Connected' ? '#34d399' : '#f87171' }}
              />
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.92rem' }}>
                  Database Connection: {dbStatus || 'Checking...'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {dbStatus === 'Connected'
                    ? 'Connected and syncing with MongoDB in real time.'
                    : 'Ensure MongoDB is running locally or provide a free MongoDB Atlas connection string.'}
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Compass Connection */}
          <div
            style={{
              padding: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
            }}
          >
            <h3 style={{ fontSize: '0.95rem', color: '#c7d2fe', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#6366f1', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
              How to Connect MongoDB Compass
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: 10 }}>
              Open MongoDB Compass on your computer. In the connection bar, paste the default connection string and click <strong>Connect</strong>:
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#090d16',
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#38bdf8',
              }}
            >
              <span>{compassLocal}</span>
              <button
                className="btn btn-icon btn-sm"
                onClick={() => handleCopy(compassLocal, 'compassLocal')}
                title="Copy connection string"
              >
                {copiedText === 'compassLocal' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Step 2: Finding Database and Collection */}
          <div
            style={{
              padding: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
            }}
          >
            <h3 style={{ fontSize: '0.95rem', color: '#c7d2fe', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#6366f1', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
              Locating Database & Collection in Compass
            </h3>
            <ul style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, paddingLeft: 20 }}>
              <li>In the left sidebar of Compass, look for database: <code style={{ color: '#818cf8', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>campusloop_lite</code></li>
              <li>Click on the collection named <code style={{ color: '#818cf8', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>listings</code>.</li>
              <li>You will see all documents with fields like <code>title</code>, <code>category</code>, <code>listingType</code>, <code>price</code>, <code>contactDetails</code>, and <code>createdAt</code>.</li>
            </ul>
          </div>

          {/* Step 3: Verifying Changes Live */}
          <div
            style={{
              padding: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
            }}
          >
            <h3 style={{ fontSize: '0.95rem', color: '#c7d2fe', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#6366f1', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
              Live Verification Workflow
            </h3>
            <ol style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, paddingLeft: 20 }}>
              <li><strong>Add Item:</strong> Click "Post Listing" in the app and fill in the details. Go to Compass and click the green <em>Find</em> or refresh button — your new record appears instantly!</li>
              <li><strong>Edit Item:</strong> Edit any title or contact info in the web app — the document in Compass updates in real time.</li>
              <li><strong>Delete Item:</strong> Delete an item in the app — the record disappears from Compass.</li>
              <li><strong>Page Refresh:</strong> Refresh the browser (F5) — all items remain intact because they are loaded directly from MongoDB!</li>
            </ol>
          </div>

          {/* Free Cloud Alternative */}
          <div
            style={{
              padding: 14,
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 10,
              fontSize: '0.84rem',
              color: '#cbd5e1',
            }}
          >
            <strong>💡 Prefer Cloud MongoDB Atlas?</strong>
            <p style={{ marginTop: 4, lineHeight: 1.5 }}>
              If you don't have MongoDB installed locally, you can create a free cluster on MongoDB Atlas (cloud.mongodb.com) and paste your URI into <code style={{ color: '#a5b4fc' }}>backend/.env</code>:
            </p>
            <div style={{ marginTop: 6, fontFamily: 'monospace', color: '#a5b4fc', fontSize: '0.8rem' }}>
              MONGO_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/campusloop_lite
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
