export function statusClass(status: string): string {
    const map: Record<string, string> = {
        Active:     'status-active',
        Recruiting: 'status-recruiting',
        Completed:  'status-completed',
    };
    return map[status] ?? 'status-default';
}

export const styles = {
    card: 'card border-0 mb-5 fade-up supervisor-card',
    body: 'card-body p-4',
    row: 'd-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4',
    identityWrap: 'd-flex align-items-center gap-3',
    icon: 'icon-box-sup',
    supervisorName: 'fw-bolder supervisor-name',
    supervisorBadge: 'badge fw-bold mt-1 badge-supervisor',
    selectWrap: 'team-select-wrap',
    selectLabel: 'form-label fw-bold text-muted small section-label mb-1',
    select: 'form-select fw-semibold border-0 input-animated autofill-fix team-select',
    statsStrip: 'd-flex flex-wrap gap-2 mt-4 pt-3 stats-strip',
    membersBadge: 'badge fw-semibold badge-stat badge-stat-blue',
    statusBadge: (status: string) => `badge fw-semibold badge-stat ${statusClass(status)}`,
    countBadge: 'badge fw-semibold badge-stat badge-stat-purple ms-auto',
};
