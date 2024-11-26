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
  closeModal,
  editingCustomer,
}) {
  const navigate = useNavigate();
  const modalRef = useRef();

  const initialData = {
    CustomerID: null,
    ProviderID: "1",
    Name: "",
    Email: "",
    Phone: "",
    Address: "",
    Area: "",
    City: "",
    State: "",
    Status: "",
    GST: "",
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
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
    if (!formData.Email || !formData.Name || !formData.Phone) {
      alert("Please fill out all required fields.");
      return;
    }

    const apiUrl = editingCustomer
      ? "http://localhost:8000/customer/updateCustomer"
      : "http://localhost:8000/customer/add_customer";

    axios
      .post(apiUrl, formData)
      .then((response) => {
        alert(
          editingCustomer
            ? "Customer updated successfully"
            : "Customer saved successfully"
        );
        window.location.reload();
        navigate("/customer");
      })
      .catch((error) => {
        alert("Something went wrong. Try again.");
        console.error("Error:", error);
      });

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

                {/* <label className="customer-form__label">
                  Provider ID:
                  <input
                    type="number"
                    name="ProviderID"
                    value={formData.ProviderID}
                    onChange={handleInputChange}
                    className="customer-form__input"
                    required
                  />
                </label> */}

                <label className="customer-form__label">
                  Name:
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="customer-form__input"
                    required
                  />
                </label>

                <label className="customer-form__label">
                  Email:
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="customer-form__input"
                    required
                  />
                </label>

                <label className="customer-form__label">
                  Phone:
                  <input
                    type="tel"
                    name="Phone"
                    value={formData.Phone}
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
                    name="Address"
                    value={formData.Address}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  />
                </label>

                <label className="customer-form__label">
                  Area:
                  <input
                    type="text"
                    name="Area"
                    value={formData.Area}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  />
                </label>

                <label className="customer-form__label">
                  City:
                  <input
                    type="text"
                    name="City"
                    value={formData.City}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  />
                </label>

                <label className="customer-form__label">
                  State:
                  <input
                    type="text"
                    name="State"
                    value={formData.State}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  />
                </label>

                <label className="customer-form__label">
                  Status:
                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  >
                    <option>Select Status</option>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </label>

                <label className="customer-form__label">
                  GST:
                  <input
                    type="text"
                    name="GST"
                    value={formData.GST}
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
