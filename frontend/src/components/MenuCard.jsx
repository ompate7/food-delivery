import { useCart } from "../context/CartContext";
import styles from "./MenuCard.module.css";

export default function MenuCard({ item }) {
  const { cart, addItem, updateQuantity } = useCart();
  const cartItem = cart.find((i) => i.id === item.id);

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <img src={item.image} alt={item.name} className={styles.img} loading="lazy" />
        <span className={styles.category}>{item.category}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.desc}>{item.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
          {cartItem ? (
            <div className={styles.qty}>
              <button onClick={() => updateQuantity(item.id, cartItem.quantity - 1)} className={styles.qtyBtn}>−</button>
              <span className={styles.qtyNum}>{cartItem.quantity}</span>
              <button onClick={() => updateQuantity(item.id, cartItem.quantity + 1)} className={styles.qtyBtn}>+</button>
            </div>
          ) : (
            <button onClick={() => addItem(item)} className={styles.addBtn}>Add</button>
          )}
        </div>
      </div>
    </div>
  );
}
