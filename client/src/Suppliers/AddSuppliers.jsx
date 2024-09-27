import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  width: 400px;
  height: 630px;
  top: 5%;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  left: 30%;
  background-color: #f5f8f9;
`;

const StyledModel = styled.div`
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: none;
  backdrop-filter: blur(2px);
`;

function AddSuppliers({ suppliers, closeModal, editingSuppliers, updateSupplierList }) {
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (editingSuppliers) {
        response = await axios.put("https://final-oms.onrender.com/supplier/editSupplier", formData);
      } else {
        response = await axios.post("https://final-oms.onrender.com/supplier/addSupplier", formData);
      }
      
      const { data } = response;
      
      if (data?.status) {
        alert("Supplier data saved successfully");
  
        if (editingSuppliers) {
          updateSupplierList(formData);
        } else {
          formData.id = suppliers.length + 1; 
          updateSupplierList(formData);
        }
  
        setShowForm(false);
        closeModal(); 
      } else {
        alert("Something went wrong");
      }
    } catch (e) {
      console.log(e);
      alert("An error occurred while saving the supplier data");
    }
  };
    return (
    <div>
      {showForm && (
        <StyledModel>
          <Modal>
            <form onSubmit={handleSubmit} className="customer-form">
              <h3 className="form-heading">Add/Edit Suppliers</h3>
              <label className="customer-form__label">
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="customer-form__input"
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
                <button
                  type="submit"
                  value="submit"
                  className="customer-form__button"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="customer-form__button"
                >
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

export default AddSuppliers;
