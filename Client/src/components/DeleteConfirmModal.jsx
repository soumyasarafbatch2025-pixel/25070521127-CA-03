import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  listingTitle,
  isDeleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2>Delete Listing?</h2>
              <p>This action cannot be undone</p>
            </div>
          </div>
          <button className="btn btn-icon" onClick={onClose} disabled={isDeleting}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: 12 }}>
          <p style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>
            Are you sure you want to permanently delete{' '}
            <strong style={{ color: '#ffffff' }}>"{listingTitle}"</strong> from CampusLoop Lite
            and MongoDB?
          </p>
          <div
            style={{
              padding: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 8,
              fontSize: '0.8rem',
              color: '#94a3b8',
              border: '1px solid var(--border-subtle)',
            }}
          >
            💡 Note: If the item was successfully exchanged or claimed, you can also mark it as
            "Resolved" instead of deleting it.
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="spinner"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Yes, Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
