import React, { useState, useEffect } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import "../Style/Customer.css";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

function ItemPrice({ handleClose, selectedItemName }) {
  const [itemPriceData, setItemPriceData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [formData, setFormData] = useState({
    name: selectedItemName || "",
    price: "",
    qty: "",
    date: "",
  });

  useEffect(() => {
    if (selectedItemName) {
      setFormData((prev) => ({ ...prev, name: selectedItemName }));
    }
  }, [selectedItemName]);

  useEffect(() => {
    const fetchItemPrices = async () => {
      try {
        const response = await axios.get(
          "https://final-oms.onrender.com/item/getItemPrices"
        );
        setItemPriceData(response.data);
      } catch (error) {
        console.error("Error fetching item prices:", error);
      }
    };

    fetchItemPrices();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting form data:", formData); // Log form data
    try {
      if (isEditing) {
        // Update existing item
        await axios.put(
          `https://final-oms.onrender.com/item/editItemPrice/${editItemId}`,
          formData
        );
        setItemPriceData((prevData) =>
          prevData.map((item) =>
            item._id === editItemId ? { ...item, ...formData } : item
          )
        );
      } else {
        // Add new item
        const response = await axios.post(
          "https://final-oms.onrender.com/item/addItemPrice",
          formData
          
        );
        console.log("Add item response:", response.data); // Check response
        setItemPriceData([...itemPriceData, response.data]);
        
      }

      // Reset form and state
      setFormData({
        name: selectedItemName || "",
        price: "",
        qty: "",
        date: "",
      });
      setIsEditing(false);
      setEditItemId(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add item price: " + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      qty: item.qty,
      date: item.date,
    });
    setIsEditing(true);
    setEditItemId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(
        `https://final-oms.onrender.com/item/deleteItemPrice/${id}`
      );
      setItemPriceData(itemPriceData.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleCancel = () => {
    handleClose();
    setFormData({
      name: selectedItemName || "",
      price: "",
      qty: "",
      date: "",
    });
    setIsEditing(false);
  };

  return (
    <Modal>
      <div className="body-container">
        <form onSubmit={handleSubmit} className="customer-form">
          <h3 className="form-heading">
            {isEditing ? "Edit Item Price" : "Add Item Price"}
          </h3>

          <label className="customer-form__label">
            Item Name:
            <p>{selectedItemName}</p>
          </label>

          <label className="customer-form__label">
            Purchase Price:
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="customer-form__input"
              required
            />
          </label>

          <label className="customer-form__label">
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="customer-form__input"
              required
            />
          </label>

          <label className="customer-form__label">
            Quantity:
            <input
              type="text"
              name="qty"
              value={formData.qty}
              onChange={handleInputChange}
              className="customer-form__input"
              required
            />
          </label>

          <div className="table-responsive">
            <h2>Item Price for: {selectedItemName}</h2>
            <table className="table table-bordered table-striped table-hover shadow">
              <thead className="table-secondary">
                <tr>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {itemPriceData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.price}</td>
                    <td>{item.qty}</td>
                    <td>{item.date}</td>
                    <td>
                      <div className="button-group">
                        <button
                          className="btns1"
                          onClick={() => handleEdit(item)}
                        >
                          <BiEdit />
                        </button>
                        <button
                          className="btns2"
                          onClick={() => handleDelete(item._id)}
                        >
                          <BiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="customer-form__button-container">
            <button type="submit" className="customer-form__button">
              {isEditing ? "Update" : "Save"}
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
  );
}

export default ItemPrice;
