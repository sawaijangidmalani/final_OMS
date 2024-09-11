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
  backdrop-filter: blur(2px);
`;

function AddSuppliers({
  suppliers = [],
  closeModal,
  editingSuppliers,
  updateSupplierList,
}) {
  const initialData = {
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    city: "",
    status: "",
    GSTN: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [showForm, setShowForm] = useState(true);

  // Populate the form if editing suppliers
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
        // Update existing supplier
        response = await axios.put(
          "http://localhost:8000/supplier/editSupplier",
          formData
        );
      } else {
        // Add new supplier
        response = await axios.post(
          "http://localhost:8000/supplier/addSupplier",
          formData
        );
      }

      const { data } = response;

      if (data?.status) {
        alert("Supplier data saved successfully");

        if (editingSuppliers) {
          updateSupplierList(formData); // Update supplier in the list
        } else {
          const newSupplier = { ...formData, id: suppliers.length + 1 };
          updateSupplierList(newSupplier); // Add new supplier to the list
        }

        setShowForm(false);
        closeModal();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error while saving supplier data:", error);
      alert(
        "An error occurred while saving the supplier data. Please try again."
      );
    }
  };

  return (
    <div>
      {showForm && (
        <StyledModel>
          <Modal>
            <form onSubmit={handleSubmit} className="customer-form">
              <h3 className="form-heading">Add/Edit Suppliers</h3>

              {/* Form fields */}
              {[
                "name",
                "email",
                "phone",
                "address",
                "area",
                "city",
                "status",
                "GSTN",
              ].map((field) => (
                <label key={field} className="customer-form__label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  />
                </label>
              ))}

              {/* Buttons */}
              <div className="customer-form__button-container">
                <button type="submit" className="customer-form__button">
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
