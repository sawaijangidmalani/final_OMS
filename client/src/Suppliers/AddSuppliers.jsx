import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "../Style/Add.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

function AddSuppliers({
  suppliers,
  closeModal,
  editingSuppliers,
  updateSupplierList,
}) {
  const navigate = useNavigate();
  const modalRef = useRef(); // Reference for the modal container

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
    if (editingSuppliers) {
      setFormData(editingSuppliers);
    } else {
      setFormData({ ...initialData });
    }
  }, [editingSuppliers]);

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
  }, [closeModal]);

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

 
    const url = editingSuppliers
    ? "https://final-oms.onrender.com/supplier/updateSupplier"
    : "https://final-oms.onrender.com/supplier/addSupplier";
 
 const method = editingSuppliers ? 'put' : 'post';
 
 axios[method](url, formData)
    .then(response => {
      console.log("API Response:", response.data);
      alert("Supplier saved successfully");
      updateSupplierList(response.data);
      closeModal();
      window.location.reload();
    })
    .catch(error => {
      console.error("API error:", error);
      alert("Supplier not saved");
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
                  {editingSuppliers ? "Edit Supplier" : "Add Supplier"}
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
                    <option value="select">Select Status</option>
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
                    title="Please enter a valid 15-character GSTIN"
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

export default AddSuppliers;
