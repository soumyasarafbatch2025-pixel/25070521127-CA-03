import React from 'react';
import {
  X,
  MapPin,
  Mail,
  Phone,
  User,
  Calendar,
  Tag,
  Share2,
  Edit2,
  Trash2,
  CheckCircle,
  RotateCcw,
  BookOpen,
  Laptop,
  PenTool,
  AlertTriangle,
  Building,
} from 'lucide-react';

export default function ListingDetailModal({
  listing,
  isOpen,
  onClose,
  onOpenEdit,
  onOpenDelete,
  onToggleStatus,
  onCopyText,
}) {
  if (!isOpen || !listing) return null;

  const {
    _id,
    title,
    description,
    category,
    listingType,
    price,
    itemCondition,
    status,
    contactDetails,
    itemLocation,
    imageUrl,
    tags,
    createdAt,
  } = listing;

  const isResolved = status === 'Resolved' || status === 'Claimed';

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Books':
        return <BookOpen size={16} />;
      case 'Electronics':
        return <Laptop size={16} />;
      case 'Stationery':
        return <PenTool size={16} />;
      case 'Lost & Found':
        return <AlertTriangle size={16} />;
      default:
        return <Tag size={16} />;
    }
  };

  const handleShare = () => {
    const summary = `${title} (${listingType} - ${category}) at CampusLoop Lite. Contact: ${contactDetails?.name} (${contactDetails?.email}, ${contactDetails?.campusLocation})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      onCopyText('Listing info copied to clipboard!');
    }
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span
                className={`badge ${
                  listingType === 'Exchange'
                    ? 'badge-exchange'
                    : listingType === 'Borrow'
                    ? 'badge-borrow'
                    : 'badge-lostfound'
                }`}
              >
                {listingType}
              </span>
              <span className={`badge ${isResolved ? 'badge-claimed' : 'badge-available'}`}>
                {status}
              </span>
            </div>
            <h2>{title}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Main Media If present */}
          {imageUrl && (
            <div style={{ width: '100%', maxHeight: 260, borderRadius: 12, overflow: 'hidden', background: '#0b0f19' }}>
              <img
                src={imageUrl}
                alt={title}
                style={{ width: '100%', height: '100%', maxHeight: 260, objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Item Description
            </h4>
            <p style={{ fontSize: '0.96rem', color: '#f1f5f9', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {description}
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 12,
              padding: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 10,
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Category</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#e0e7ff', marginTop: 2 }}>
                {getCategoryIcon(category)}
                <span>{category}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Condition</div>
              <div style={{ fontWeight: 600, color: '#e0e7ff', marginTop: 2 }}>
                {itemCondition || 'Gently Used'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {listingType === 'Borrow' ? 'Deposit / Fee' : 'Price'}
              </div>
              <div style={{ fontWeight: 700, color: price > 0 ? '#38bdf8' : '#34d399', marginTop: 2 }}>
                {price > 0 ? `₹${price}` : 'Free / Trade'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Posted On</div>
              <div style={{ fontWeight: 500, color: '#cbd5e1', marginTop: 2 }}>
                {createdAt ? new Date(createdAt).toLocaleDateString() : 'Today'}
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="contact-highlight-box">
            <h4 style={{ fontSize: '0.92rem', color: '#a5b4fc', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={16} />
              <span>Campus Contact & Meeting Spot</span>
            </h4>

            <div className="contact-row">
              <span className="contact-label">
                <User size={14} /> Posted By:
              </span>
              <span className="contact-val">{contactDetails?.name || 'Campus Student'}</span>
            </div>

            <div className="contact-row">
              <span className="contact-label">
                <Mail size={14} /> Email:
              </span>
              <span className="contact-val">
                <a href={`mailto:${contactDetails?.email}`}>{contactDetails?.email}</a>
              </span>
            </div>

            {contactDetails?.phone && (
              <div className="contact-row">
                <span className="contact-label">
                  <Phone size={14} /> Phone / WhatsApp:
                </span>
                <span className="contact-val">
                  <a href={`tel:${contactDetails.phone}`}>{contactDetails.phone}</a>
                </span>
              </div>
            )}

            <div className="contact-row">
              <span className="contact-label">
                <Building size={14} /> Campus Location / Hostel:
              </span>
              <span className="contact-val">{contactDetails?.campusLocation}</span>
            </div>

            {itemLocation && (
              <div className="contact-row">
                <span className="contact-label">
                  <MapPin size={14} /> Exact Spot / Room:
                </span>
                <span className="contact-val">{itemLocation}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Tags:</span>
              {tags.map((tag, idx) => (
                <span key={idx} className="card-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          {/* Share button */}
          <button className="btn btn-secondary btn-sm" onClick={handleShare}>
            <Share2 size={15} />
            <span>Copy Info</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Toggle Status */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onToggleStatus(listing);
                onClose();
              }}
            >
              {isResolved ? (
                <>
                  <RotateCcw size={15} />
                  <span>Mark Available</span>
                </>
              ) : (
                <>
                  <CheckCircle size={15} />
                  <span>Mark Resolved</span>
                </>
              )}
            </button>

            {/* Edit */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onClose();
                onOpenEdit(listing);
              }}
            >
              <Edit2 size={15} />
              <span>Edit</span>
            </button>

            {/* Delete */}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                onClose();
                onOpenDelete(listing);
              }}
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
