import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Save, PlusCircle } from 'lucide-react';

const PRESET_IMAGES = [
  { label: '📚 Textbook', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80' },
  { label: '💻 Laptop', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80' },
  { label: '🔢 Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80' },
  { label: '📐 Drafting Kit', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80' },
  { label: '🎧 Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { label: '👛 Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80' },
  { label: '💧 Flask', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80' },
  { label: '⚡ Arduino Kit', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80' },
];

export default function ListingFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const isEditing = Boolean(initialData && initialData._id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Books',
    listingType: 'Exchange',
    price: 0,
    itemCondition: 'Gently Used',
    status: 'Available',
    name: '',
    email: '',
    phone: '',
    campusLocation: '',
    itemLocation: '',
    imageUrl: '',
    tags: '',
  });

  const [error, setError] = useState('');

  // Sync initial data when editing or opening
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Books',
        listingType: initialData.listingType || 'Exchange',
        price: initialData.price || 0,
        itemCondition: initialData.itemCondition || 'Gently Used',
        status: initialData.status || 'Available',
        name: initialData.contactDetails?.name || '',
        email: initialData.contactDetails?.email || '',
        phone: initialData.contactDetails?.phone || '',
        campusLocation: initialData.contactDetails?.campusLocation || '',
        itemLocation: initialData.itemLocation || '',
        imageUrl: initialData.imageUrl || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Books',
        listingType: 'Exchange',
        price: 0,
        itemCondition: 'Gently Used',
        status: 'Available',
        name: '',
        email: '',
        phone: '',
        campusLocation: '',
        itemLocation: '',
        imageUrl: '',
        tags: '',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPreset = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!formData.title.trim()) {
      setError('Please provide an item title.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description.');
      return;
    }
    if (!formData.name.trim()) {
      setError('Contact person name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Contact email address is required.');
      return;
    }
    if (!formData.campusLocation.trim()) {
      setError('Campus location (Hostel / Dept / Library) is required.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      listingType: formData.listingType,
      price: formData.price ? Number(formData.price) : 0,
      itemCondition: formData.itemCondition,
      status: formData.status,
      contactDetails: {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        campusLocation: formData.campusLocation.trim(),
      },
      itemLocation: formData.itemLocation.trim(),
      imageUrl: formData.imageUrl.trim(),
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2>{isEditing ? 'Edit Campus Listing' : 'Post New Campus Listing'}</h2>
            <p>
              {isEditing
                ? 'Update listing details and contact information'
                : 'Share an exchange, borrow item, or report a lost/found article'}
            </p>
          </div>
          <button
            className="btn btn-icon"
            onClick={onClose}
            title="Close dialog"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="form-error-banner">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                <span>Title <span className="required">*</span></span>
                <span className="form-hint">E.g., "Engineering Mathematics Book" or "Lost Sony Earbuds"</span>
              </label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="Brief, descriptive title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category & Listing Type */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  <span>Category <span className="required">*</span></span>
                </label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Books">Books & Course Notes</option>
                  <option value="Electronics">Electronics & Gadgets</option>
                  <option value="Stationery">Stationery & Tools</option>
                  <option value="Lost & Found">Lost & Found</option>
                  <option value="Other">Other Miscellaneous</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Listing Type <span className="required">*</span></span>
                </label>
                <select
                  name="listingType"
                  className="form-select"
                  value={formData.listingType}
                  onChange={handleChange}
                >
                  <option value="Exchange">Exchange (Peer Trade)</option>
                  <option value="Borrow">Borrow (Term / Temporary)</option>
                  <option value="Lost & Found">Lost & Found</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                <span>Description <span className="required">*</span></span>
                <span className="form-hint">Detail edition, condition, course codes, or how to identify</span>
              </label>
              <textarea
                name="description"
                className="form-textarea"
                rows={3}
                placeholder="Include relevant details (e.g., edition, specs, where lost/found)..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price / Fee & Item Condition */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  <span>Price / Security Deposit (₹)</span>
                  <span className="form-hint">Enter 0 for free</span>
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  className="form-input"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Condition</span>
                </label>
                <select
                  name="itemCondition"
                  className="form-select"
                  value={formData.itemCondition}
                  onChange={handleChange}
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Gently Used">Gently Used</option>
                  <option value="Fair">Fair / Usable</option>
                  <option value="N/A">Not Applicable (Lost & Found)</option>
                </select>
              </div>
            </div>

            {/* Status (especially when editing) */}
            {isEditing && (
              <div className="form-group">
                <label className="form-label">
                  <span>Listing Status</span>
                </label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="Resolved">Resolved (Item returned/completed)</option>
                  <option value="Claimed">Claimed</option>
                  <option value="Borrowed">Currently Borrowed</option>
                </select>
              </div>
            )}

            {/* Image URL & Quick Presets */}
            <div className="form-group">
              <label className="form-label">
                <span>Image URL (Optional)</span>
                <span className="form-hint">Paste link or click a preset below</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                className="form-input"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <div style={{ marginTop: 8 }}>
                <div className="preset-picker-label">Quick Campus Image Presets:</div>
                <div className="preset-buttons">
                  {PRESET_IMAGES.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      className="preset-chip"
                      onClick={() => handleSelectPreset(preset.url)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Divider: Contact Details */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#c7d2fe', marginBottom: 12, fontWeight: 700 }}>
                Student Contact & Campus Location
              </h4>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    <span>Contact Name <span className="required">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>University Email <span className="required">*</span></span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="student@campus.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Phone Number (Optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Campus Location / Hostel <span className="required">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="campusLocation"
                    className="form-input"
                    placeholder="E.g., Aryabhatta Hostel, Room 204"
                    value={formData.campusLocation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Item Location & Tags */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  <span>Item Drop/Found Spot</span>
                  <span className="form-hint">E.g., Central Library 2nd floor</span>
                </label>
                <input
                  type="text"
                  name="itemLocation"
                  className="form-input"
                  placeholder="Specific room or building lobby"
                  value={formData.itemLocation}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Tags</span>
                  <span className="form-hint">Comma separated</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  className="form-input"
                  placeholder="CS, Semester 3, Drafter, Urgent"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Saving to MongoDB...</span>
                </>
              ) : isEditing ? (
                <>
                  <Save size={16} />
                  <span>Update Listing</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Publish Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
