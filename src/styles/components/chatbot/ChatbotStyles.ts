export const styles = {
    overlay: 'position-fixed bottom-0 end-0 m-3 m-md-4 d-flex flex-column shadow-lg bg-white overflow-hidden animate-slide-fade',
    header: 'bg-primary text-white p-3 d-flex justify-content-between align-items-center',
    headerTitle: 'fw-bold mb-0 d-flex align-items-center gap-2',
    closeBtn: 'btn-close btn-close-white',
    body: 'p-3 overflow-auto d-flex flex-column gap-3',
    messageRow: (isUser: boolean) => `d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}`,
    messageBubble: (isUser: boolean) => `p-2 px-3 ${isUser ? 'bg-primary text-white' : 'bg-light text-dark'}`,
    footer: 'p-3 border-top bg-white',
    form: 'd-flex gap-2',
    input: 'form-control rounded-pill bg-light border-0',
    sendBtn: 'btn btn-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0',
};

export const inlineStyles = {
    overlay: { width: '360px', height: '500px', maxHeight: 'calc(100vh - 100px)', zIndex: 1050, borderRadius: '1.25rem' },
    body: { flex: '1 1 auto', scrollBehavior: 'smooth' as const },
    messageBubble: { borderRadius: '1rem', maxWidth: '85%' },
    messageText: { whiteSpace: 'pre-wrap' as const, fontSize: '0.9rem', margin: 0 },
    sendIcon: { width: '18px', height: '18px' },
};
