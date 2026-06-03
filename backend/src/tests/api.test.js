import request from "supertest";
import app from "../src/app.js";
import { orders } from "../data/store.js";

beforeEach(() => {
  orders.length = 0;
});

describe("GET /api/menu", () => {
  it("returns all menu items", async () => {
    const res = await request(app).get("/api/menu");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("each item has required fields", async () => {
    const res = await request(app).get("/api/menu");
    res.body.data.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("price");
      expect(item).toHaveProperty("description");
    });
  });
});

describe("GET /api/menu/:id", () => {
  it("returns a single menu item", async () => {
    const res = await request(app).get("/api/menu/1");
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("1");
  });

  it("returns 404 for unknown item", async () => {
    const res = await request(app).get("/api/menu/999");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/orders", () => {
  const validPayload = {
    customer: { name: "John Doe", address: "123 Main St", phone: "9876543210" },
    items: [{ menuItemId: "1", quantity: 2 }]
  };

  it("creates a new order", async () => {
    const res = await request(app).post("/api/orders").send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.status).toBe("Order Received");
  });

  it("calculates total correctly", async () => {
    const res = await request(app).post("/api/orders").send(validPayload);
    expect(res.body.data.total).toBe(25.98);
  });

  it("rejects missing customer name", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ customer: { address: "123", phone: "123" }, items: [{ menuItemId: "1", quantity: 1 }] });
    expect(res.status).toBe(400);
  });

  it("rejects empty items array", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ customer: { name: "Jane", address: "123", phone: "123" }, items: [] });
    expect(res.status).toBe(400);
  });

  it("rejects invalid menu item id", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ customer: { name: "Jane", address: "123", phone: "123" }, items: [{ menuItemId: "999", quantity: 1 }] });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/orders", () => {
  it("returns all orders", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /api/orders/:id", () => {
  it("returns a single order", async () => {
    const create = await request(app)
      .post("/api/orders")
      .send({
        customer: { name: "Test", address: "Addr", phone: "123" },
        items: [{ menuItemId: "1", quantity: 1 }]
      });
    const id = create.body.data.id;
    const res = await request(app).get(`/api/orders/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it("returns 404 for missing order", async () => {
    const res = await request(app).get("/api/orders/nonexistent-id");
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/orders/:id/status", () => {
  it("updates order status", async () => {
    const create = await request(app)
      .post("/api/orders")
      .send({
        customer: { name: "Test", address: "Addr", phone: "123" },
        items: [{ menuItemId: "1", quantity: 1 }]
      });
    const id = create.body.data.id;
    const res = await request(app).patch(`/api/orders/${id}/status`).send({ status: "Preparing" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("Preparing");
  });

  it("rejects invalid status", async () => {
    const create = await request(app)
      .post("/api/orders")
      .send({
        customer: { name: "Test", address: "Addr", phone: "123" },
        items: [{ menuItemId: "1", quantity: 1 }]
      });
    const id = create.body.data.id;
    const res = await request(app).patch(`/api/orders/${id}/status`).send({ status: "Flying" });
    expect(res.status).toBe(400);
  });
});
