import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { count } = useCart();
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>
        <span className={styles.logo}>QB</span>
        <span className={styles.brandName}>QuickBite</span>
      </Link>
      <div className={styles.actions}>
        <Link to="/cart" className={`${styles.cartBtn} ${location.pathname === "/cart" ? styles.active : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>Cart</span>
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </Link>
      </div>
    </nav>
  );
}
