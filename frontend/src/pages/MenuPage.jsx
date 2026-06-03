import { useState, useEffect } from "react";
import { fetchMenu } from "../utils/api";
import MenuCard from "../components/MenuCard";
import styles from "./MenuPage.module.css";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchMenu()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(items.map((i) => i.category))];
  const filtered = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

  if (loading) return <div className={styles.state}>Loading menu...</div>;
  if (error) return <div className={styles.state}>Could not load menu: {error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Fresh · Fast · Delicious</p>
        <h1 className={styles.heroTitle}>What are you craving<span>?</span></h1>
      </div>

      <div className={styles.filters}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`${styles.filter} ${activeCategory === cat ? styles.filterActive : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
