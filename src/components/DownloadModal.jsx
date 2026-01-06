import React, { useState } from 'react';

const DownloadModal = ({ isOpen, onClose, onDownload }) => {
    const [filename, setFilename] = useState('tasks');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onDownload(filename);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">Download Tasks</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <input
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="Enter filename"
                            autoFocus
                        />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        .csv will be appended automatically
                    </p>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Download
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DownloadModal;
