export const cardStyle = {
    borderRadius: '1.5rem',
    boxShadow: '0 8px 32px rgba(15,23,42,0.09)',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.6)',
} as const;

export const cardHeaderStyle = {
    borderRadius: '1.5rem 1.5rem 0 0',
} as const;

export const iconBoxStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    boxShadow: '0 4px 12px rgba(22,163,74,0.28)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
} as const;

export const creditsBadgeTransition = { transition: 'all 0.3s ease' } as const;
export const commitBtnStyle = { transition: 'background-color 0.3s ease, transform 0.2s ease', width: '190px' } as const;
export const dropBtnStyle = { minWidth: '100px' } as const;

export const styles = {
    card: 'card border-0 mb-5 fade-up',
    header: 'card-header bg-transparent border-0 pt-4 pb-3 px-4 px-md-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center',
    headerLeft: 'mb-3 mb-md-0 d-flex align-items-center gap-3',
    title: 'fw-bolder mb-0',
    headerRight: 'd-flex align-items-center gap-3',
    creditsBadge: (over: boolean) =>
        `badge ${over ? 'bg-danger text-danger' : 'bg-success text-success'} bg-opacity-10 rounded-pill px-4 py-2 fw-bold fs-6 shadow-sm`,
    body: 'card-body p-4 p-md-5 pt-0',
    list: 'list-group list-group-flush gap-3',
    emptyState: 'text-center py-5 text-muted fw-bold bg-light rounded-4',
    row: 'list-group-item border-0 p-3 p-md-4 bg-light rounded-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between interactive-card section-enter',
    rowLeft: 'd-flex align-items-center mb-3 mb-md-0',
    courseNameRow: 'fw-bolder text-dark mb-2 text-md-start text-center',
    badgeRow: 'd-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-2',
    idBadge: 'badge bg-white text-secondary border px-2 py-1',
    creditsBadgeSm: 'badge bg-white text-secondary border px-2 py-1',
    instructorRow: 'text-muted small fw-semibold d-flex align-items-center justify-content-center justify-content-md-start gap-2',
    rowRight: 'd-flex flex-column flex-md-row align-items-md-center gap-4',
    scheduleBlock: 'text-center text-md-end',
    daysText: 'fw-bolder text-dark small mb-2',
    timeRow: 'text-muted small d-flex align-items-center justify-content-center justify-content-md-end gap-1',
    separator: 'mx-1 opacity-50 fw-bold',
    dropBtn: 'btn btn-outline-danger fw-bold rounded-3 px-4 py-2 shadow-sm pressable-btn',
};
