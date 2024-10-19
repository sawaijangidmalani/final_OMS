import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

const AddItem = ({ items, setItem, editItem, closeModal }) => {
  useEffect(() => {}, []);

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
  const modalRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://final-oms.onrender.com/supplier/getSuppliers")
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
    } else {
      setFormData({ ...initialData });
    }
  }, [editItem]);

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editItem) {
      console.log(formData);
      axios
        .put("https://final-oms.onrender.com/item/updateItems", formData)
        .then(() => {
          alert("Item updated successfully");
          window.location.reload();
        })
        .catch((err) => {
          console.error("Error updating item:", err);
        });
    } else {
      axios
        .post("https://final-oms.onrender.com/item/insertItems", formData)
        .then((response) => {
          alert("Item added successfully");
          window.location.reload();
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
        <div className="style-model">
          <Modal ref={modalRef}>
            <form onSubmit={handleSubmit} className="customer-form">
              <h3 className="form-heading">
                {editItem ? "Edit Item" : "Add Item"}
              </h3>
              <label className="customer-form__label">
                Item Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                  // disabled={!!editItem}
                />
              </label>

              <label className="customer-form__label">
                Supplier:
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
              </label>

              <label className="customer-form__label">
                Category:
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                />
              </label>

              <label htmlFor="brand" className="customer-form__label">
                Brand:
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                />
              </label>

              <label htmlFor="description" className="customer-form__label">
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="customer-form__input"
                />
              </label>

              <label htmlFor="unit" className="customer-form__label">
                Unit:
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                >
                  <option value="KG">KG</option>
                  <option value="PCS">PCS</option>
                </select>
              </label>

              <label htmlFor="status" className="customer-form__label">
                Status:
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                >
                  <option value="selectstatus">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

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
        </div>
      )}
    </>
  );
};

export default AddItem;
