import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Modal = styled.div`
  position: relative;
  z-index: 100;
  top: 5%;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  left: 30%;
  border-radius: 20px;
  background-color: #f5f8f9;
  padding: 20px;
`;

const StyledModel = styled.div`
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
`;

const AddItem = ({ items, setItem, editItem, closeModal }) => {
  useEffect(() => {
    console.log("hello");
  }, []);

  const initialData = {
    id: null,
    name: "",
    supplier: "",
    category: "",
    brand: "",
    quantity: 0,
    price: 0,
    description: "",
    unit: "KG",
    status: "",
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [suppliers, setSuppliers] = useState([]);
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/supplier/getSuppliers")
      .then((response) => {
        const suppliersData = response.data.data;
        setSuppliers(suppliersData);

        if (suppliersData.length > 0) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            supplier: suppliersData[0].name,
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching suppliers:", err);
      });

    if (editItem) {
      setFormData(editItem);
    }
  }, [editItem]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "active" : "inactive") : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editItem) {
      console.log(formData);
      axios
        .put("http://localhost:8000/item/updateItems", formData)
        .then(() => {
          alert("Item updated successfully");
        })
        .catch((err) => {
          console.error("Error updating item:", err);
        });
    } else {
      axios
        .post("http://localhost:8000/item/insertItems", formData)
        .then((response) => {
          console.log("Item added:", response.data);
          setItem([...items, { ...formData, id: response.data.itemId }]);
        })
        .catch((err) => {
          console.error(
            "Error adding item:",
            err.response ? err.response.data : err.message
          );
        });
    }

    setFormData({ ...initialData });
    setFormVisible(false);
    closeModal();
  };

  return (
    <>
      {formVisible && (
        <StyledModel>
          <Modal>
            <form onSubmit={handleSubmit} className="customer-form">
              <h3 className="form-heading">Add / Edit Item</h3>

              <label htmlFor="name" className="customer-form__label">
                Item Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="customer-form__input"
                disabled={!!editItem} // Disable the field if editing
              />

              <label htmlFor="supplier" className="customer-form__label">
                Supplier:
              </label>
              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                className="customer-form__input"
              >
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.name}>
                    {supplier.name}
                  </option>
                ))}
              </select>

              <label htmlFor="category" className="customer-form__label">
                Category:
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="customer-form__input"
              />

              <label htmlFor="brand" className="customer-form__label">
                Brand:
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="customer-form__input"
              />

              <label htmlFor="quantity" className="customer-form__label">
                Quantity:
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="customer-form__input"
              />

              <label htmlFor="price" className="customer-form__label">
                Price:
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="customer-form__input"
              />

              <label htmlFor="description" className="customer-form__label">
                Description:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="customer-form__input"
              />

              <label htmlFor="unit" className="customer-form__label">
                Unit:
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="customer-form__input"
              >
                <option value="KG">KG</option>
                <option value="PCS">PCS</option>
              </select>

              <label htmlFor="status" className="customer-form__label">
                Status:
              </label>
              <input
                type="checkbox"
                name="status"
                checked={formData.status === "active"}
                onChange={handleInputChange}
                className="customer-form__input"
              />

              <div className="customer-form__button-container">
                <button type="submit" className="customer-form__button">
                  Save
                </button>
                <button
                  type="button"
                  className="customer-form__button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
              
            </form>
          </Modal>
        </StyledModel>
      )}
    </>
  );
};

export default AddItem;
