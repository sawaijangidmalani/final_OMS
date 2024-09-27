import { useState, useEffect } from "react";
import styled from "styled-components";
import "./Customer.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 30%;
  border-radius: 20px;
`;

const StyledModel = styled.div`
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: none;
  backdrop-filter: blur(3px);
`;

function AddCustomer({ customers, closeModal, editingCustomer, updateCustomerList }) {
  const navigate=useNavigate();
  const initialData = {
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    city: "",
    status: "",
    gstn: "",
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (editingCustomer) {
      setFormData(editingCustomer);
    } else {
      setFormData({ ...initialData });
    }
  }, [editingCustomer]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (editingCustomer) {
      axios.post("https://final-oms.onrender.com/customer/updateCustomer", formData)
        .then(response => {
          alert("User updated");
          navigate("/customer");  
        })
        .catch(error => {
          alert("Something went wrong. Try again.");
          console.error('Error updating customer:', error);
        });
    } else {
      axios.post("https://final-oms.onrender.com/customer/add_customer", formData)
        .then(response => {
          alert("Customer saved successfully");
          window.location.reload();
        })
        .catch(error => {
          alert("Something went wrong.");
          console.error('Error adding customer:', error);
        });
    }
  
    setShowForm(false); 
    closeModal();        
  };
  

  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div>
      {showForm && (
        <StyledModel>
          <Modal>
            <form onSubmit={handleSubmit} className="customer-form">
              <h3 className="form-heading">{editingCustomer ? "Edit Customer" : "Add Customer"}</h3>
              <label className="customer-form__label">
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                />
              </label>
              <label className="customer-form__label">
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                />
              </label>
              <label className="customer-form__label">
                Phone:
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                />
              </label>
              <label className="customer-form__label">
                Address:
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="customer-form__input"
                />
              </label>
              <label className="customer-form__label">
                Area:
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="customer-form__input"
                />
              </label>
              <label className="customer-form__label">
                City:
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="customer-form__input"
                />
              </label>
              <label className="customer-form__label">
                Status:
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="customer-form__input"
                />
              </label>
              <label className="customer-form__label">
                GSTN:
                <input
                  type="text"
                  name="gstn"
                  value={formData.gstn}
                  onChange={handleInputChange}
                  className="customer-form__input"
                />
              </label>
              <div className="customer-form__button-container">
                <button type="submit" value="submit" className="customer-form__button">
                  Save
                </button>
                <button type="button" onClick={handleCancel} className="customer-form__button">
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        </StyledModel>
      )}
    </div>
  );
}

export default AddCustomer;
