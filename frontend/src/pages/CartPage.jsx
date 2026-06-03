import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../utils/api";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{7,15}$/.test(form.phone.replace(/\s|-/g, ""))) e.phone = "Enter a valid phone number";
    return e;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleCheckout = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const payload = {
        customer: form,
        items: cart.map((i) => ({ menuItemId: i.id, quantity: i.quantity }))
      };
      const order = await placeOrder(payload);
      clearCart();
      navigate(`/order/${order.id}`);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some delicious items from our menu</p>
        <Link to="/" className={styles.browseBtn}>Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Order</h1>
        <Link to="/" className={styles.back}>← Back to menu</Link>
      </div>

      <div className={styles.layout}>
        <div className={styles.items}>
          <h2 className={styles.sectionTitle}>Items</h2>
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <img src={item.image} alt={item.name} className={styles.itemImg} />
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className={styles.qtyRow}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={styles.qBtn}>−</button>
                <span className={styles.qNum}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={styles.qBtn}>+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className={styles.removeBtn} aria-label="Remove">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className={styles.checkout}>
          <h2 className={styles.sectionTitle}>Delivery Details</h2>
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className={`${styles.input} ${errors.name ? styles.inputErr : ""}`} placeholder="John Doe" />
              {errors.name && <span className={styles.err}>{errors.name}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Delivery Address</label>
              <input name="address" value={form.address} onChange={handleChange} className={`${styles.input} ${errors.address ? styles.inputErr : ""}`} placeholder="123 Main Street, City" />
              {errors.address && <span className={styles.err}>{errors.address}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} className={`${styles.input} ${errors.phone ? styles.inputErr : ""}`} placeholder="9876543210" />
              {errors.phone && <span className={styles.err}>{errors.phone}</span>}
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span className={styles.free}>Free</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {errors.submit && <span className={styles.err}>{errors.submit}</span>}
            <button onClick={handleCheckout} disabled={loading} className={styles.placeBtn}>
              {loading ? "Placing Order..." : `Place Order · $${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
