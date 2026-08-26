import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal, shippingEstimate, tax, total } = useCart();

  return (
    <div className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
      <div className="checkout-steps">
        <div className="step active"><span className="step-circle">1</span> Cart</div>
        <div className="step-divider"></div>
        <div className="step"><span className="step-circle">2</span> Shipping</div>
        <div className="step-divider"></div>
        <div className="step"><span className="step-circle">3</span> Payment</div>
      </div>

      <h1>Your Cart</h1>

      {items.length > 0 ? (
        <div className="row" style={{ gap: 0, alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 620px", minWidth: 280 }}>
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--color-bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-muted)",
                      flexShrink: 0,
                      fontSize: "0.75rem",
                    }}
                  >
                    No Image
                  </div>
                )}
                <div className="cart-item-info">
                  <h5>{item.name}</h5>
                  <p className="page-subtitle" style={{ marginBottom: 8 }}>
                    ${item.price.toFixed(2)} each
                  </p>
                  <div className="d-flex align-items-center" style={{ gap: 10 }}>
                    <div className="qty-stepper">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0"
                      style={{ fontSize: "0.85rem", textDecoration: "none" }}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fas fa-trash-alt me-1"></i> Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: "0 1 320px", minWidth: 280, position: "sticky" }}>
            <div className="cart-summary">
              <h5 style={{ marginBottom: 16 }}>Order Summary</h5>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping (est.)</span>
                <span>${shippingEstimate.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (est.)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link to="/shipping" className="btn btn-primary w-100 mt-3">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          Your cart is empty.
          <div className="mt-3">
            <Link to="/" className="btn btn-primary">Browse Listings</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
