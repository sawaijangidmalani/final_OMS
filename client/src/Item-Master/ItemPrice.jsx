import React, { useState, useEffect } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import "../Style/Customer.css";
import { Tooltip, Popconfirm } from "antd";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

function ItemPrice({ handleClose, selectedItemName }) {
  const [itemPriceData, setItemPriceData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [formData, setFormData] = useState({
    price: "",
    qty: "",
    date: "",
  });

  useEffect(() => {
    const fetchItemPrices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/itemPrice/getItemPrices"
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
    event.preventDefault(); // Prevent the default form submission behavior
    // console.log("Submitting form data:", formData);

    try {
      if (isEditing) {
        // Update existing item price
        const response = await axios.put(
          `http://localhost:8000/itemPrice/updateItemPrice/${editItemId}`, // Ensure this matches the backend route
          formData
        );
        setItemPriceData(
          itemPriceData.map((item) =>
            item.id === editItemId ? response.data : item
          )
        );
        alert("Item price updated successfully!"); // Alert for successful update
      } else {
        // Add new item price
        const response = await axios.post(
          "http://localhost:8000/itemPrice/addItemPrice", // Ensure this matches backend route
          formData
        );
        setItemPriceData([...itemPriceData, response.data]);
        alert("Item price added successfully!"); // Alert for successful addition
      }

      // Reset the form and state
      setFormData({ price: "", qty: "", date: "" });
      setIsEditing(false);
      setEditItemId(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add/update item price: " + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      price: item.price,
      qty: item.qty,
      date: item.date,
    });
    setIsEditing(true);
    setEditItemId(item.id);
  };

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/itemPrice/deleteItemPrice/${id}`
      );
      setItemPriceData(itemPriceData.filter((item) => item.id !== id));
      alert("Item price deleted successfully!"); // Alert for successful deletion
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item price: " + error.message); // Alert for deletion failure
    }
  };

  const handleCancel = () => {
    handleClose();
    setFormData({ price: "", qty: "", date: "" });
    setIsEditing(false);
  };

  return (
    <div className="style-model">
      <Modal>
        <div className="body-container">
          <form onSubmit={handleSubmit} className="item-price-form">
            <h3 className="form-heading">
              {isEditing ? "Edit Item Price" : "Add Item Price"}
            </h3>

            <label className="customer-form__label">
              Item Name: <strong>{selectedItemName}</strong>
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
              <p>Item Price for: {selectedItemName}</p>
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
                    <tr key={item.id}>
                      <td>{item.price}</td>
                      <td>{item.qty}</td>
                      <td>{item.date}</td>
                      <td>
                        <div className="button-group">
                          <Tooltip
                            title="Edit"
                            overlayInnerStyle={{
                              backgroundColor: "rgb(41, 10, 244)",
                              color: "white",
                              borderRadius: "5px",
                            }}
                          >
                            <button
                              className="btns1"
                              onClick={() => handleEditItem(item)}
                            >
                              <BiSolidEdit />
                            </button>
                          </Tooltip>

                          <Tooltip
                            title="Delete"
                            overlayInnerStyle={{
                              backgroundColor: "rgb(244, 10, 10)",
                              color: "white",
                              borderRadius: "5px",
                            }}
                          >
                            <Popconfirm
                              placement="topLeft"
                              description="Are you sure to delete this item Price?"
                              onConfirm={() => handleDelete(item.id)}
                              okText="Delete"
                            >
                              <button className="btns1">
                                <MdDelete />
                              </button>
                            </Popconfirm>
                          </Tooltip>
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
    </div>
  );
}

export default ItemPrice;
