import React from 'react';
import { ArrowLeftRight, Clock, HelpCircle, Layers, PlusCircle } from 'lucide-react';

export default function HeroBanner({ stats, onOpenCreate, onSelectType }) {
  const {
    total = 0,
    exchange = 0,
    borrow = 0,
    lostAndFound = 0,
  } = stats || {};

  return (
    <section className="hero-banner">
      <div className="hero-header">
        <div className="hero-tagline">
          <h2 className="hero-title">
            Smart Campus Exchange & <span className="gradient-text">Lost-and-Found</span>
          </h2>
          <p className="hero-description">
            Exchange course textbooks, borrow engineering calculators and lab tools, or report and recover lost belongings across your university campus.
          </p>
        </div>

        <div>
          <button className="btn btn-primary" onClick={onOpenCreate}>
            <PlusCircle size={18} />
            <span>List an Item Now</span>
          </button>
        </div>
      </div>

      {/* Quick Dashboard Stats */}
      <div className="stats-grid">
        <div
          className="stat-card stat-total"
          onClick={() => onSelectType('All')}
          style={{ cursor: 'pointer' }}
          title="Show all campus listings"
        >
          <div className="stat-icon-wrapper">
            <Layers size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Listings</div>
          </div>
        </div>

        <div
          className="stat-card stat-exchange"
          onClick={() => onSelectType('Exchange')}
          style={{ cursor: 'pointer' }}
          title="Filter by Exchange listings"
        >
          <div className="stat-icon-wrapper">
            <ArrowLeftRight size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{exchange}</div>
            <div className="stat-label">Exchange Items</div>
          </div>
        </div>

        <div
          className="stat-card stat-borrow"
          onClick={() => onSelectType('Borrow')}
          style={{ cursor: 'pointer' }}
          title="Filter by Borrow listings"
        >
          <div className="stat-icon-wrapper">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{borrow}</div>
            <div className="stat-label">Borrow for Term</div>
          </div>
        </div>

        <div
          className="stat-card stat-lostfound"
          onClick={() => onSelectType('Lost & Found')}
          style={{ cursor: 'pointer' }}
          title="Filter by Lost & Found items"
        >
          <div className="stat-icon-wrapper">
            <HelpCircle size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{lostAndFound}</div>
            <div className="stat-label">Lost & Found</div>
          </div>
        </div>
      </div>
    </section>
  );
}
