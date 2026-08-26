

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShippingDetails = () => {
  const [shippingData, setShippingData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setShippingData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can process the payment here or store the shipping data
    alert("Shipping details submitted!");
    navigate("/payment"); // Redirect to payment page (assuming it's created)
  };

  return (
    <div className="containerSe" style={{ paddingTop: 96 }}>
        <div className="checkout-steps">
          <div className="step done"><span className="step-circle">✓</span> Cart</div>
          <div className="step-divider"></div>
          <div className="step active"><span className="step-circle">2</span> Shipping</div>
          <div className="step-divider"></div>
          <div className="step"><span className="step-circle">3</span> Payment</div>
        </div>
        <div className="row">
          <div className="offset-md-3 col-md-6">
              <h1>Shipping Details</h1>
              <p className="page-subtitle">Tell us where to send your order.</p>
              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={shippingData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={shippingData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="postalCode"
                    name="postalCode"
                    value={shippingData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={shippingData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Submit
                </button>
              </form>
            </div>
        </div>
    </div>
  );
};

export default ShippingDetails;