import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterBar from './components/FilterBar';
import ListingCard from './components/ListingCard';
import ListingFormModal from './components/ListingFormModal';
import ListingDetailModal from './components/ListingDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import MongoHelpModal from './components/MongoHelpModal';
import Toast from './components/Toast';
import { apiService } from './services/api';
import {
  Inbox,
  AlertTriangle,
  PlusCircle,
  Database,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  // Main Data States
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    exchange: 0,
    borrow: 0,
    lostAndFound: 0,
  });
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [listingType, setListingType] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [deletingListing, setDeletingListing] = useState(null);
  const [isMongoHelpOpen, setIsMongoHelpOpen] = useState(false);

  // Submitting / Deleting Loaders
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check Database and Backend Health
  const checkHealth = useCallback(async () => {
    try {
      const data = await apiService.checkHealth();
      if (data && data.database) {
        setDbStatus(data.database.status);
      } else {
        setDbStatus('Disconnected');
      }
    } catch {
      setDbStatus('Disconnected');
    }
  }, []);

  // Fetch Stats from Backend
  const loadStats = useCallback(async () => {
    try {
      const res = await apiService.getStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err);
    }
  }, []);

  // Fetch Listings with Filters from MongoDB API
  const loadListings = useCallback(
    async (showSilent = false) => {
      if (!showSilent) setLoading(true);
      setErrorMessage('');

      try {
        const res = await apiService.getListings({
          search,
          category,
          listingType,
          status,
          sortBy,
        });

        if (res.success) {
          setListings(res.listings || []);
          setDbStatus('Connected');
        } else {
          setErrorMessage(res.error || 'Failed to load listings');
        }
      } catch (err) {
        setErrorMessage(
          err.message || 'Error connecting to backend API. Please make sure the backend server is running.'
        );
        checkHealth();
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [search, category, listingType, status, sortBy, checkHealth]
  );

  // Initial load
  useEffect(() => {
    checkHealth();
    loadStats();
    loadListings();
  }, []);

  // Reload when filters change (debounced for search)
  useEffect(() => {
    const handler = setTimeout(() => {
      loadListings();
    }, 250);

    return () => clearTimeout(handler);
  }, [search, category, listingType, status, sortBy, loadListings]);

  // Handle Manual Refresh
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    checkHealth();
    loadStats();
    loadListings(true);
    addToast('Listings refreshed from MongoDB', 'info');
  };

  // Handle Create Listing
  const handleCreateSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await apiService.createListing(formData);
      if (res.success) {
        addToast('Listing published successfully to MongoDB!', 'success');
        setIsCreateOpen(false);
        loadListings();
        loadStats();
      } else {
        addToast(res.error || 'Failed to create listing', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Could not save listing to database', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Listing
  const handleUpdateSubmit = async (formData) => {
    if (!editingListing?._id) return;
    setIsSubmitting(true);
    try {
      const res = await apiService.updateListing(editingListing._id, formData);
      if (res.success) {
        addToast('Listing updated successfully!', 'success');
        setEditingListing(null);
        // Also update selected listing if currently open
        if (selectedListing && selectedListing._id === editingListing._id) {
          setSelectedListing(res.listing);
        }
        loadListings();
        loadStats();
      } else {
        addToast(res.error || 'Failed to update listing', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Could not update listing in database', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Listing
  const handleDeleteConfirm = async () => {
    if (!deletingListing?._id) return;
    setIsDeleting(true);
    try {
      const res = await apiService.deleteListing(deletingListing._id);
      if (res.success) {
        addToast(`"${deletingListing.title}" deleted from MongoDB`, 'success');
        setDeletingListing(null);
        if (selectedListing && selectedListing._id === deletingListing._id) {
          setSelectedListing(null);
        }
        loadListings();
        loadStats();
      } else {
        addToast(res.error || 'Failed to delete listing', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Could not delete listing', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Toggle Status (Available <-> Resolved)
  const handleToggleStatus = async (item) => {
    const isCurrentlyResolved = item.status === 'Resolved' || item.status === 'Claimed';
    const newStatus = isCurrentlyResolved ? 'Available' : 'Resolved';

    try {
      const res = await apiService.updateListing(item._id, { status: newStatus });
      if (res.success) {
        addToast(
          `Listing marked as ${newStatus}!`,
          newStatus === 'Available' ? 'info' : 'success'
        );
        loadListings();
        loadStats();
        if (selectedListing && selectedListing._id === item._id) {
          setSelectedListing(res.listing);
        }
      } else {
        addToast('Failed to update status', 'error');
      }
    } catch (err) {
      addToast('Error updating listing status: ' + err.message, 'error');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setListingType('All');
    setStatus('All');
    setSortBy('newest');
  };

  return (
    <div className="app-container">
      {/* Sticky Top Navbar */}
      <Navbar
        dbStatus={dbStatus}
        onOpenCreate={() => {
          setEditingListing(null);
          setIsCreateOpen(true);
        }}
        onOpenMongoHelp={() => setIsMongoHelpOpen(true)}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace Content */}
      <main className="main-content">
        {/* Offline / Connection Alert if MongoDB is not reachable */}
        {dbStatus !== 'Connected' && (
          <div
            style={{
              padding: '14px 20px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 12,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={20} color="#f87171" />
              <div>
                <strong style={{ color: '#ffffff' }}>MongoDB is currently disconnected.</strong>
                <span style={{ color: '#cbd5e1', fontSize: '0.88rem', marginLeft: 6 }}>
                  Start your local MongoDB service or configure MONGO_URI in backend/.env to persist records.
                </span>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsMongoHelpOpen(true)}
            >
              <Database size={14} />
              <span>Compass Guide</span>
            </button>
          </div>
        )}

        {/* Hero Banner with Metric Cards */}
        <HeroBanner
          stats={stats}
          onOpenCreate={() => {
            setEditingListing(null);
            setIsCreateOpen(true);
          }}
          onSelectType={(type) => setListingType(type)}
        />

        {/* Filter Toolbar (Search, Categories, Types, Sorting) */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          listingType={listingType}
          setListingType={setListingType}
          status={status}
          setStatus={setStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Listings Section Header */}
        <div className="listings-header">
          <div className="listings-count">
            Showing <strong>{listings.length}</strong> {listings.length === 1 ? 'listing' : 'listings'}
            {category !== 'All' && <span> in <strong>{category}</strong></span>}
            {listingType !== 'All' && <span> ({listingType})</span>}
            {search && <span> matching "<strong>{search}</strong>"</span>}
          </div>

          {(category !== 'All' || listingType !== 'All' || status !== 'All' || search) && (
            <button
              className="btn btn-outline btn-sm"
              onClick={handleResetFilters}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Main Content: Loading, Error, Empty, or Cards Grid */}
        {loading ? (
          <div className="loading-center">
            <div className="spinner spinner-lg"></div>
            <p>Loading live campus listings from MongoDB...</p>
          </div>
        ) : errorMessage ? (
          <div className="empty-state">
            <AlertTriangle className="empty-icon" style={{ color: '#f87171' }} />
            <h3 className="empty-title">Connection Error</h3>
            <p className="empty-desc">{errorMessage}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-primary btn-sm" onClick={() => loadListings()}>
                <RefreshCw size={15} />
                <span>Retry Connection</span>
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsMongoHelpOpen(true)}>
                <span>MongoDB Help</span>
              </button>
            </div>
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <Inbox className="empty-icon" />
            <h3 className="empty-title">No listings found</h3>
            <p className="empty-desc">
              {search || category !== 'All' || listingType !== 'All'
                ? 'Try broadening your search query or selecting a different category filter.'
                : 'No campus items have been listed yet. Be the first student to publish one!'}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              {(search || category !== 'All' || listingType !== 'All') && (
                <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
                  Reset All Filters
                </button>
              )}
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditingListing(null);
                  setIsCreateOpen(true);
                }}
              >
                <PlusCircle size={16} />
                <span>Post a Listing</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="cards-grid">
            {listings.map((item) => (
              <ListingCard
                key={item._id}
                listing={item}
                onOpenDetails={(listing) => setSelectedListing(listing)}
                onOpenEdit={(listing) => setEditingListing(listing)}
                onOpenDelete={(listing) => setDeletingListing(listing)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <strong>CampusLoop Lite</strong> — Designed for high-trust peer-to-peer campus exchange & lost-and-found.
          </div>
          <div className="footer-links">
            <span
              className="footer-link"
              onClick={() => setIsMongoHelpOpen(true)}
            >
              MongoDB Compass Guide
            </span>
            <span>•</span>
            <span
              className="footer-link"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top ↑
            </span>
          </div>
        </div>
      </footer>

      {/* Create Listing Modal */}
      <ListingFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        initialData={null}
        isSubmitting={isSubmitting}
      />

      {/* Edit Listing Modal */}
      <ListingFormModal
        isOpen={Boolean(editingListing)}
        onClose={() => setEditingListing(null)}
        onSubmit={handleUpdateSubmit}
        initialData={editingListing}
        isSubmitting={isSubmitting}
      />

      {/* Item Detail / Contact Modal */}
      <ListingDetailModal
        listing={selectedListing}
        isOpen={Boolean(selectedListing)}
        onClose={() => setSelectedListing(null)}
        onOpenEdit={(listing) => setEditingListing(listing)}
        onOpenDelete={(listing) => setDeletingListing(listing)}
        onToggleStatus={handleToggleStatus}
        onCopyText={(msg) => addToast(msg, 'success')}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingListing)}
        onClose={() => setDeletingListing(null)}
        onConfirm={handleDeleteConfirm}
        listingTitle={deletingListing?.title || ''}
        isDeleting={isDeleting}
      />

      {/* MongoDB Compass Beginner Guide Modal */}
      <MongoHelpModal
        isOpen={isMongoHelpOpen}
        onClose={() => setIsMongoHelpOpen(false)}
        dbStatus={dbStatus}
      />

      {/* Toast Notification Overlay */}
      <Toast toasts={toasts} onCloseToast={removeToast} />
    </div>
  );
}
