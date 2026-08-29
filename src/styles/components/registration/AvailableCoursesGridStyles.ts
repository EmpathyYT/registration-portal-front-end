export const cardHoverStyle = (hovered: boolean, selected: boolean) => ({
    borderRadius: '1rem',
    boxShadow: hovered || selected ? '0 16px 48px rgba(15,23,42,0.13)' : '0 4px 20px rgba(15,23,42,0.07)',
    transform: hovered && !selected ? 'translateY(-5px)' : 'none',
    transition: 'all 0.3s ease',
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: selected ? '' : '1px solid rgba(255,255,255,0.6)',
});

export const btnTransitionStyle = { transition: 'all 0.2s ease' } as const;

export const styles = {
    wrapper: 'mb-5',
    heading: 'text-center mb-4',
    headingTitle: 'fw-bolder mb-0',
    headingSubtitle: 'text-muted small mb-0 mt-1',
    emptyAlert: 'alert bg-white border-0 shadow-sm rounded-4 p-5 text-center',
    emptyText: 'text-muted fw-bold',
    grid: 'row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4',
    col: 'col section-enter',
    card: (selected: boolean) => `card h-100 interactive-card${selected ? ' border border-2 border-success' : ' border-0'}`,
    cardBody: 'card-body p-4 d-flex flex-column text-center',
    badgeWrap: 'mb-3',
    idBadge: 'badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-2 fw-bold',
    courseName: 'card-title fw-bolder text-dark mb-2',
    credits: 'card-text text-muted small fw-semibold mb-4',
    btnWrap: 'mt-auto',
    selectBtn: (selected: boolean, hovered: boolean) =>
        `btn w-100 fw-bold rounded-3 py-2 pressable-btn${selected ? ' btn-success shadow-sm' : hovered ? ' btn-outline-success' : ' btn-light text-success'}`,
};
