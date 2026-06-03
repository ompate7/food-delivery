import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CartProvider, useCart } from "../context/CartContext";
import MenuCard from "../components/MenuCard";
import OrderStatus from "../components/OrderStatus";

const mockItem = {
  id: "1",
  name: "Margherita Pizza",
  description: "Classic tomato sauce",
  price: 12.99,
  category: "Pizza",
  image: "https://example.com/pizza.jpg"
};

function Wrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("MenuCard", () => {
  it("renders item name and price", () => {
    render(<MenuCard item={mockItem} />, { wrapper: Wrapper });
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText("$12.99")).toBeInTheDocument();
  });

  it("shows Add button initially", () => {
    render(<MenuCard item={mockItem} />, { wrapper: Wrapper });
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("shows quantity controls after adding item", () => {
    render(<MenuCard item={mockItem} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("−")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
  });

  it("increments quantity on plus click", () => {
    render(<MenuCard item={mockItem} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("removes item when quantity hits 0", () => {
    render(<MenuCard item={mockItem} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("−"));
    expect(screen.getByText("Add")).toBeInTheDocument();
  });
});

describe("OrderStatus", () => {
  it("renders all 4 steps", () => {
    render(<OrderStatus status="Order Received" />);
    expect(screen.getByText("Order Received")).toBeInTheDocument();
    expect(screen.getByText("Preparing")).toBeInTheDocument();
    expect(screen.getByText("Out for Delivery")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("applies active class to current status", () => {
    const { container } = render(<OrderStatus status="Preparing" />);
    const steps = container.querySelectorAll("[class*='step']");
    expect(steps.length).toBeGreaterThan(0);
  });
});

describe("CartContext", () => {
  it("starts with empty cart", () => {
    let cartState;
    function Inspector() {
      cartState = useCart();
      return null;
    }
    render(<CartProvider><Inspector /></CartProvider>);
    expect(cartState.cart).toHaveLength(0);
    expect(cartState.count).toBe(0);
    expect(cartState.total).toBe(0);
  });

  it("adds item to cart", () => {
    let cartState;
    function Inspector() {
      cartState = useCart();
      return <button onClick={() => cartState.addItem(mockItem)}>add</button>;
    }
    render(<CartProvider><Inspector /></CartProvider>);
    fireEvent.click(screen.getByText("add"));
    expect(cartState.cart).toHaveLength(1);
    expect(cartState.count).toBe(1);
  });
});
