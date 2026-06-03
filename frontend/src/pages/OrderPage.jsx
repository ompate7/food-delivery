import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOrder } from "../utils/api";
import OrderStatus from "../components/OrderStatus";
import styles from "./OrderPage.module.css";

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const load = () => {
      fetchOrder(id)
        .then((data) => {
          setOrder(data);
          if (data.status === "Delivered") {
            clearInterval(intervalRef.current);
          }
        })
        .catch((e) => setError(e.message));
    };

    load();
    intervalRef.current = setInterval(load, 5000);
    return () => clearInterval(intervalRef.current);
  }, [id]);

  if (error) return <div className={styles.state}>Order not found: {error}</div>;
  if (!order) return <div className={styles.state}>Loading order...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Order Tracking</p>
          <h1 className={styles.title}>Order Confirmed!</h1>
        </div>
        <Link to="/" className={styles.newOrder}>+ New Order</Link>
      </div>

      <div className={styles.statusCard}>
        <div className={styles.statusTop}>
          <h2 className={styles.currentStatus}>{order.status}</h2>
          <span className={styles.statusPulse} />
        </div>
        <p className={styles.statusSub}>Updates every 5 seconds</p>
        <OrderStatus status={order.status} />
      </div>

      <div className={styles.details}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Order Summary</h3>
          {order.items.map((item) => (
            <div key={item.menuItemId} className={styles.orderItem}>
              <span className={styles.orderName}>{item.name} <span className={styles.qty}>× {item.quantity}</span></span>
              <span className={styles.orderPrice}>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className={styles.totalLine}>
            <span>Total</span>
            <span className={styles.total}>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Delivery To</h3>
          <p className={styles.info}>{order.customer.name}</p>
          <p className={styles.infoMuted}>{order.customer.address}</p>
          <p className={styles.infoMuted}>{order.customer.phone}</p>
          <p className={styles.orderId}>Order ID: <span>{order.id.slice(0, 8)}...</span></p>
        </div>
      </div>
    </div>
  );
}
