import { menuItems } from "../../data/store.js";

export const getMenu = (req, res) => {
  res.json({ success: true, data: menuItems });
};

export const getMenuItem = (req, res) => {
  const item = menuItems.find((m) => m.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }
  res.json({ success: true, data: item });
};
