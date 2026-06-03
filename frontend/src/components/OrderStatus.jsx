import styles from "./OrderStatus.module.css";

const STEPS = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

export default function OrderStatus({ status }) {
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className={styles.wrap}>
      {STEPS.map((step, i) => (
        <div key={step} className={`${styles.step} ${i <= currentIndex ? styles.done : ""} ${i === currentIndex ? styles.active : ""}`}>
          <div className={styles.circle}>
            {i < currentIndex ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          <span className={styles.label}>{step}</span>
          {i < STEPS.length - 1 && <div className={`${styles.line} ${i < currentIndex ? styles.lineDone : ""}`} />}
        </div>
      ))}
    </div>
  );
}
