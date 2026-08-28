import { styles } from '../../styles/components/layout/FloatingNoticeStyles';

export type NoticeType = 'info' | 'success' | 'error';

export type NoticeState = {
    type: NoticeType;
    message: string;
} | null;

type FloatingNoticeProps = {
    notice: NoticeState;
};

export default function FloatingNotice({ notice }: FloatingNoticeProps) {
    if (!notice) return null;

    return (
        <div className={styles.zone} aria-live="polite" aria-atomic="true">
            <div className={styles.notice(notice.type)}>{notice.message}</div>
        </div>
    );
}
