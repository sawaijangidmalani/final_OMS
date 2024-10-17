import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "../Style/Add.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

function AddCustomer({
  customers,
  closeModal,
  editingCustomer,
  updateCustomerList,
}) {
  const navigate = useNavigate();
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
  const modalRef = useRef(null); // Create a ref for the modal

  useEffect(() => {
    if (editingCustomer) {
      setFormData(editingCustomer);
    } else {
      setFormData({ ...initialData });
    }
  }, [editingCustomer]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal(); // Close the modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, closeModal]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.name || !formData.phone) {
      alert("Please fill out all required fields.");
      return;
    }

    if (editingCustomer) {
      axios
        .post(
          "https://final-oms.onrender.com/customer/updateCustomer",
          formData
        )
        .then((response) => {
          alert("Customer updated successfully");
          window.location.reload();
          navigate("/customer");
        })
        .catch((error) => {
          alert("Something went wrong. Try again.");
          console.error("Error updating customer:", error);
        });
    } else {
      axios
        .post("https://final-oms.onrender.com/customer/add_customer", formData)
        .then((response) => {
          alert("Customer saved successfully");
          window.location.reload();
          navigate("/customer");
        })
        .catch((error) => {
          alert("Something went wrong.");
          console.error("Error adding customer:", error);
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
        <div className="style-model">
          <Modal ref={modalRef}>
            <div className="body-container">
              <form onSubmit={handleSubmit} className="customer-form">
                <h3 className="form-heading">
                  {editingCustomer ? "Edit Customer" : "Add Customer"}
                </h3>
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
                    pattern="[0-9]{10}"
                    maxLength="10"
                    title="Please enter a valid 10-digit phone number"
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
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
                <label className="customer-form__label">
                  GSTN:
                  <input
                    type="text"
                    name="gstn"
                    value={formData.gstn}
                    onChange={handleInputChange}
                    className="customer-form__input"
                    required
                    pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$"
                    maxLength="15"
                    title="Please enter a valid 15-character GSTIN (e.g., 22AAAAA0000A1Z5)"
                  />
                </label>
                <div className="customer-form__button-container">
                  <button
                    type="submit"
                    value="submit"
                    className="customer-form__button"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="customer-form__button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default AddCustomer;
