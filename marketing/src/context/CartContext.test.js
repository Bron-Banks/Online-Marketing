import { act, renderHook } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const product = (overrides = {}) => ({
  id: "p1",
  name: "Widget",
  price: 10,
  image: "widget.png",
  ...overrides,
});

beforeEach(() => {
  window.localStorage.clear();
});

test("starts empty when there is nothing in storage", () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  expect(result.current.items).toEqual([]);
  expect(result.current.itemCount).toBe(0);
  expect(result.current.total).toBe(0);
});

test("addToCart adds a new item and increments quantity on repeat adds", () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => result.current.addToCart(product()));
  expect(result.current.items).toEqual([
    { id: "p1", name: "Widget", price: 10, image: "widget.png", quantity: 1 },
  ]);

  act(() => result.current.addToCart(product(), 2));
  expect(result.current.items[0].quantity).toBe(3);
});

test("removeFromCart removes the matching item", () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => result.current.addToCart(product()));
  act(() => result.current.removeFromCart("p1"));

  expect(result.current.items).toEqual([]);
});

test("updateQuantity updates quantity, and drops the item at zero or below", () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => result.current.addToCart(product()));
  act(() => result.current.updateQuantity("p1", 5));
  expect(result.current.items[0].quantity).toBe(5);

  act(() => result.current.updateQuantity("p1", 0));
  expect(result.current.items).toEqual([]);
});

test("clearCart empties the cart", () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => result.current.addToCart(product()));
  act(() => result.current.addToCart(product({ id: "p2" })));
  act(() => result.current.clearCart());

  expect(result.current.items).toEqual([]);
});

test("computes subtotal, shipping, tax and total from items", () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => result.current.addToCart(product({ price: 10 }), 2));

  expect(result.current.itemCount).toBe(2);
  expect(result.current.subtotal).toBe(20);
  expect(result.current.shippingEstimate).toBe(9.99);
  expect(result.current.tax).toBeCloseTo(1.6);
  expect(result.current.total).toBeCloseTo(31.59);
});

test("shipping is free when the cart is empty", () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  expect(result.current.shippingEstimate).toBe(0);
});

test("persists items to localStorage and reloads them on next mount", () => {
  const { result, unmount } = renderHook(() => useCart(), { wrapper });

  act(() => result.current.addToCart(product()));
  unmount();

  const { result: result2 } = renderHook(() => useCart(), { wrapper });
  expect(result2.current.items).toEqual([
    { id: "p1", name: "Widget", price: 10, image: "widget.png", quantity: 1 },
  ]);
});

test("ignores corrupt cart data in storage instead of throwing", () => {
  window.localStorage.setItem("cart", "not valid json");

  const { result } = renderHook(() => useCart(), { wrapper });

  expect(result.current.items).toEqual([]);
});
