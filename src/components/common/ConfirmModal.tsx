import styles from './ConfirmModal.module.css';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.confirm}`} onClick={onConfirm} type="button">
            Yes, delete
          </button>
          <button className={`${styles.btn} ${styles.cancel}`} onClick={onCancel} type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
