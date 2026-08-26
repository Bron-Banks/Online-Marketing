import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPal from '../assets/PayPal.webp';
import applepay from '../assets/applepay.png';
import Credit from '../assets/Credit.jpeg';
import { useCart } from "../context/CartContext";

const Payment = () => {
    const navigate = useNavigate();
    const { subtotal, shippingEstimate, tax, total, clearCart } = useCart();
    const [selectedMethod, setSelectedMethod] = useState("card");
    const [cardDetails, setCardDetails] = useState({
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCardDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };

    const handlePaymentSubmit = (e) => {
      e.preventDefault();
      alert("Payment Complete!");
      clearCart();
      navigate("/");
    };
  
    return (
      <div className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
        <div className="checkout-steps">
          <div className="step done"><span className="step-circle">✓</span> Cart</div>
          <div className="step-divider"></div>
          <div className="step done"><span className="step-circle">✓</span> Shipping</div>
          <div className="step-divider"></div>
          <div className="step active"><span className="step-circle">3</span> Payment</div>
        </div>

        <h1>Payment</h1>
        <p className="page-subtitle">Choose a payment method to complete your order.</p>

        {/* Payment Method Selection */}
        <div className="payment-method-row">
          <div
            className={`payment-method-card${selectedMethod === "paypal" ? " selected" : ""}`}
            onClick={() => setSelectedMethod("paypal")}
          >
            <img
              src={PayPal} // PayPal image imported
              alt="PayPal"
              className="payment-method-img"
            />
            <p>PayPal</p>
          </div>
          <div
            className={`payment-method-card${selectedMethod === "applepay" ? " selected" : ""}`}
            onClick={() => setSelectedMethod("applepay")}
          >
            <img
              src={applepay} // Apple Pay image imported
              alt="Apple Pay"
              className="payment-method-img"
            />
            <p>Apple Pay</p>
          </div>
          <div
            className={`payment-method-card${selectedMethod === "card" ? " selected" : ""}`}
            onClick={() => setSelectedMethod("card")}
          >
            <img
              src={Credit} // Credit/Debit image imported
              alt="Credit/Debit"
              className="payment-method-img"
            />
            <p>Credit/Debit</p>
          </div>
        </div>

        {/* Card Details Form */}
        {selectedMethod === "card" && (
        <div className="containerSe" style={{paddingLeft: 60}}>
            <div className="row">
                <div className="offset-md-3 col-md-6">
                  <h3>Card Details</h3>
                  <form onSubmit={handlePaymentSubmit} className="form">
                    <div className="mb-3">
                      <label htmlFor="cardholderName" className="form-label">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardholderName"
                        name="cardholderName"
                        value={cardDetails.cardholderName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
          
                    <div className="mb-3">
                      <label htmlFor="cardNumber" className="form-label">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
          
                    <div className="mb-3">
                      <label htmlFor="expiryDate" className="form-label">
                        Expiry Date
                      </label>
                      <input
                        type="month"
                        className="form-control"
                        id="expiryDate"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
          
                    <div className="mb-3">
                      <label htmlFor="cvv" className="form-label">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cvv"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
          
                    {/* Pricing Section */}
                    <div className="pricing-info mb-4">
                      <p>Subtotal: ${subtotal.toFixed(2)}</p>
                      <p>Shipping: ${shippingEstimate.toFixed(2)}</p>
                      <p>Tax: ${tax.toFixed(2)}</p>
                      <h5>Total: ${total.toFixed(2)}</h5>
                    </div>
          
                    {/* Submit Payment Button */}
                    <button type="submit" className="btn btn-primary">
                      Complete Payment
                    </button>
                  </form>
                </div>
            </div>
        </div>
        )}

        {selectedMethod !== "card" && (
          <div className="containerSe" style={{ paddingLeft: 60 }}>
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <form onSubmit={handlePaymentSubmit} className="form">
                  <p className="page-subtitle" style={{ marginBottom: 20 }}>
                    You'll be redirected to {selectedMethod === "paypal" ? "PayPal" : "Apple Pay"} to complete your purchase securely.
                  </p>
                  <div className="pricing-info mb-4">
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Shipping: ${shippingEstimate.toFixed(2)}</p>
                    <p>Tax: ${tax.toFixed(2)}</p>
                    <h5>Total: ${total.toFixed(2)}</h5>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Complete Payment
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Payment;