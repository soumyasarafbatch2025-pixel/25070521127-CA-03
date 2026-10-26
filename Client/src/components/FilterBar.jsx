import React from 'react';
import {
  Search,
  X,
  BookOpen,
  Laptop,
  PenTool,
  AlertTriangle,
  Grid,
  CheckCircle2,
  Filter,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Categories', icon: Grid },
  { id: 'Books', label: 'Books & Notes', icon: BookOpen },
  { id: 'Electronics', label: 'Electronics & Gadgets', icon: Laptop },
  { id: 'Stationery', label: 'Stationery & Drawing', icon: PenTool },
  { id: 'Lost & Found', label: 'Lost & Found', icon: AlertTriangle },
];

const TYPES = ['All', 'Exchange', 'Borrow', 'Lost & Found'];

export default function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  listingType,
  setListingType,
  status,
  setStatus,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="filter-toolbar">
      {/* Search Input and Sort Dropdown */}
      <div className="search-and-sort">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search listings by title, campus location, hostel, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="clear-search-btn"
              onClick={() => setSearch('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Toggle Filter */}
        <div className="sort-select-wrapper">
          <span className="sort-label">Status:</span>
          <select
            className="sort-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available Only</option>
            <option value="Resolved">Resolved / Claimed</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="sort-select-wrapper">
          <span className="sort-label">Sort:</span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title_asc">Title (A - Z)</option>
            <option value="price_low">Price (Low to High)</option>
            <option value="price_high">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Categories & Type Filters */}
      <div className="filter-pills-row">
        {/* Category Pills */}
        <div className="category-pills">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                className={`filter-pill ${isActive ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Listing Type Filter Switcher */}
        <div className="type-filter-group">
          {TYPES.map((t) => (
            <button
              key={t}
              className={`type-btn ${listingType === t ? 'active' : ''}`}
              onClick={() => setListingType(t)}
            >
              {t === 'All' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
