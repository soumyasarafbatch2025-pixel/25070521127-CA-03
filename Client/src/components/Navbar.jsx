import React from 'react';
import { PlusCircle, Database, HelpCircle, Layers, RefreshCw } from 'lucide-react';

export default function Navbar({
  dbStatus,
  onOpenCreate,
  onOpenMongoHelp,
  onRefresh,
  isRefreshing,
}) {
  const isConnected = dbStatus === 'Connected';

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Group */}
        <div className="brand-group" onClick={onRefresh} title="Click to refresh data">
          <div className="brand-icon">
            <Layers size={22} strokeWidth={2.4} />
          </div>
          <div className="brand-text">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1>CampusLoop Lite</h1>
              <span className="brand-badge">VIT / Campus</span>
            </div>
            <p>Peer-to-Peer Marketplace & Lost-and-Found</p>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="nav-actions">
          {/* Database Connection Pill */}
          <button
            className="db-pill"
            onClick={onOpenMongoHelp}
            title={`Database Status: ${dbStatus || 'Checking...'}. Click for Compass guide.`}
          >
            <span className={`db-dot ${isConnected ? 'connected' : ''}`}></span>
            <Database size={13} />
            <span>{isConnected ? 'MongoDB Active' : 'MongoDB Offline'}</span>
          </button>

          {/* Refresh Button */}
          <button
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            title="Refresh listings from MongoDB"
            disabled={isRefreshing}
          >
            <RefreshCw size={17} className={isRefreshing ? 'spinner' : ''} />
          </button>

          {/* Compass / Help Guide Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenMongoHelp}
            title="How to configure MongoDB & Compass"
          >
            <HelpCircle size={15} />
            <span>Compass Guide</span>
          </button>

          {/* Post Listing CTA */}
          <button className="btn btn-primary btn-sm" onClick={onOpenCreate}>
            <PlusCircle size={16} />
            <span>Post Listing</span>
          </button>
        </div>
      </div>
    </header>
  );
}
