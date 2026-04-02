import React from 'react';

const FormModal = ({ isOpen, onClose, title, onSubmit, saving, children }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3>{title}</h3>
          <button onClick={onClose}>&times;</button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="admin-modal__body">{children}</div>
          <div className="admin-modal__footer">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
