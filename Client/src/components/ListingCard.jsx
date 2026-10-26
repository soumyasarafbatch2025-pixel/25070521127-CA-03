import React from 'react';
import {
  MapPin,
  Calendar,
  User,
  Edit2,
  Trash2,
  CheckCircle,
  RotateCcw,
  BookOpen,
  Laptop,
  PenTool,
  AlertTriangle,
  Tag,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';

export default function ListingCard({
  listing,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onToggleStatus,
}) {
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

  // Get appropriate category icon
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Books':
        return <BookOpen size={14} />;
      case 'Electronics':
        return <Laptop size={14} />;
      case 'Stationery':
        return <PenTool size={14} />;
      case 'Lost & Found':
        return <AlertTriangle size={14} />;
      default:
        return <Tag size={14} />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`item-card ${isResolved ? 'resolved-card' : ''}`}>
      {/* Media / Image Section */}
      <div className="card-media" onClick={() => onOpenDetails(listing)} style={{ cursor: 'pointer' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="card-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('fallback-shown');
            }}
          />
        ) : (
          <div className="card-media-placeholder">
            <div className="icon">{getCategoryIcon(category)}</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{category}</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="media-badges">
          {/* Listing Type Badge */}
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

          {/* Status Badge */}
          <span className={`badge ${isResolved ? 'badge-claimed' : 'badge-available'}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {/* Category & Date */}
        <div className="card-meta-top">
          <span className="card-category">
            {getCategoryIcon(category)}
            <span>{category}</span>
          </span>
          <span className="card-date" title={createdAt ? new Date(createdAt).toLocaleString() : ''}>
            <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
            {formatDate(createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3
          className="card-title"
          onClick={() => onOpenDetails(listing)}
          style={{ cursor: 'pointer' }}
          title={title}
        >
          {title}
        </h3>

        {/* Description snippet */}
        <p className="card-description">{description}</p>

        {/* Campus Location & Condition */}
        <div className="card-details-row">
          <span className="card-detail-item" title={contactDetails?.campusLocation || 'Campus'}>
            <MapPin size={13} style={{ color: '#f43f5e', flexShrink: 0 }} />
            <span>{contactDetails?.campusLocation || 'Main Campus'}</span>
          </span>

          {itemCondition && itemCondition !== 'N/A' && (
            <span className="card-detail-item" style={{ color: '#94a3b8' }}>
              • {itemCondition}
            </span>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="card-tags">
            {tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="card-tag">
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="card-tag">+{tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Card Footer with Price and Actions */}
        <div className="card-footer">
          {/* Price / Fee Info */}
          <div className="card-price-info">
            {listingType === 'Lost & Found' ? (
              <span className="price-free">Reported Item</span>
            ) : price && price > 0 ? (
              <>
                <span className="price-label">
                  {listingType === 'Borrow' ? 'Deposit / Fee' : 'Price'}
                </span>
                <span className="price-value">₹{price}</span>
              </>
            ) : (
              <span className="price-free">Free / Exchange</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="card-actions">
            {/* Quick Contact Button */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onOpenDetails(listing)}
              title="View full details and contact information"
            >
              <PhoneCall size={14} />
              <span>Contact</span>
            </button>

            {/* Quick Status Toggle */}
            <button
              className="btn btn-icon"
              onClick={() => onToggleStatus(listing)}
              title={isResolved ? 'Mark as Available' : 'Mark as Resolved/Claimed'}
            >
              {isResolved ? (
                <RotateCcw size={15} style={{ color: '#38bdf8' }} />
              ) : (
                <CheckCircle size={15} style={{ color: '#34d399' }} />
              )}
            </button>

            {/* Edit Button */}
            <button
              className="btn btn-icon"
              onClick={() => onOpenEdit(listing)}
              title="Edit listing"
            >
              <Edit2 size={15} />
            </button>

            {/* Delete Button */}
            <button
              className="btn btn-icon btn-danger"
              onClick={() => onOpenDelete(listing)}
              title="Delete listing"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
