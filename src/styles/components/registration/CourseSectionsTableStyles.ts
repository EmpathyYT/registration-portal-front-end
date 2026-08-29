export const modalOverlayStyle = {
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 1050,
} as const;

export const modalContentStyle = {
    borderRadius: '1.5rem',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.6)',
} as const;

export const addBtnStyle = { transition: 'all 0.2s ease', minWidth: '100px' } as const;

export const styles = {
    overlay: 'modal d-block',
    dialog: 'modal-dialog modal-dialog-centered modal-lg animate-slide-fade',
    content: 'modal-content border-0 shadow-lg fade-up',
    header: 'modal-header border-0 pt-4 px-4 px-md-5 pb-2 d-flex justify-content-between align-items-start',
    availableBadge: 'badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-bold mb-2',
    courseTitle: 'fw-bolder text-dark mb-0',
    courseId: 'text-muted small fw-semibold mt-1 mb-0',
    closeBtn: 'btn-close bg-light rounded-circle p-2',
    body: 'modal-body p-4 p-md-5 pt-3',
    list: 'list-group list-group-flush gap-3',
    emptyState: 'text-center py-5 text-muted fw-bold bg-light rounded-4',
    row: 'list-group-item border-0 p-3 p-md-4 bg-light rounded-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between interactive-card section-enter',
    rowLeft: 'd-flex align-items-center mb-3 mb-md-0',
    instructorName: 'fw-bolder text-dark mb-1 d-flex align-items-center gap-2',
    metaRow: 'text-muted small fw-semibold d-flex gap-3 mt-2',
    metaBadge: 'badge bg-white text-secondary border px-2 py-1',
    rowRight: 'd-flex flex-column flex-md-row align-items-md-center gap-3 gap-md-4',
    scheduleBlock: 'text-md-end',
    daysText: 'fw-bolder text-dark small mb-2',
    timeRow: 'text-muted small d-flex align-items-center justify-content-md-end gap-1',
    separator: 'mx-1 opacity-50 fw-bold',
    addBtn: 'btn btn-success fw-bold rounded-3 px-4 py-2 shadow-sm d-flex align-items-center justify-content-center gap-2 pressable-btn',
};
