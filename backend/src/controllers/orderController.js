import { v4 as uuidv4 } from "uuid";
import { orders, menuItems } from "../../data/store.js";

const ORDER_STATUSES = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

export const createOrder = (req, res) => {
  const { customer, items } = req.body;

  if (!customer?.name || !customer?.address || !customer?.phone) {
    return res.status(400).json({ success: false, message: "Name, address and phone are required" });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "At least one item is required" });
  }

  for (const item of items) {
    if (!item.menuItemId || !item.quantity || item.quantity < 1) {
      return res.status(400).json({ success: false, message: "Each item needs a valid menuItemId and quantity" });
    }
    const found = menuItems.find((m) => m.id === item.menuItemId);
    if (!found) {
      return res.status(400).json({ success: false, message: `Menu item ${item.menuItemId} not found` });
    }
  }

  const orderItems = items.map((item) => {
    const menuItem = menuItems.find((m) => m.id === item.menuItemId);
    return {
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
      subtotal: parseFloat((menuItem.price * item.quantity).toFixed(2))
    };
  });

  const total = parseFloat(orderItems.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2));

  const order = {
    id: uuidv4(),
    customer,
    items: orderItems,
    total,
    status: ORDER_STATUSES[0],
    statusIndex: 0,
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  simulateStatusUpdates(order.id);

  res.status(201).json({ success: true, data: order });
};

export const getOrders = (req, res) => {
  res.json({ success: true, data: orders });
};

export const getOrder = (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  res.json({ success: true, data: order });
};

export const updateOrderStatus = (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  order.status = status;
  order.statusIndex = ORDER_STATUSES.indexOf(status);

  res.json({ success: true, data: order });
};

function simulateStatusUpdates(orderId) {
  const delays = [15000, 30000, 60000];
  delays.forEach((delay, index) => {
    setTimeout(() => {
      const order = orders.find((o) => o.id === orderId);
      if (order && order.statusIndex < ORDER_STATUSES.length - 1) {
        order.statusIndex = index + 1;
        order.status = ORDER_STATUSES[index + 1];
      }
    }, delay);
  });
}
