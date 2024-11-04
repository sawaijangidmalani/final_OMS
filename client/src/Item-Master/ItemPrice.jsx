import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import "../Style/Customer.css";
import { Tooltip, Popconfirm, Pagination } from "antd";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

function ItemPrice({ handleClose, selectedItemName, selectedItemId }) {
  const [itemPriceData, setItemPriceData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const initialFormState = {
    ItemStockID: "Null",
    ItemID: selectedItemId,
    PurchasePrice: "",
    ProviderID: "1",
    PurchaseDate: "",
    Qty: "",
    RemainingQty: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [sortOrder, setSortOrder] = useState({
    PurchasePrice: "asc",
    Qty: "asc",
    PurchaseDate: "asc",
  });

  const fetchItemPrices = async (itemId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/itemPrice/getItemPrices/${itemId}`
      );
      setItemPriceData(response.data);
    } catch (error) {
      console.error("Error fetching item prices:", error);
    }
  };

  useEffect(() => {
    if (selectedItemId) {
      fetchItemPrices(selectedItemId);
    }
  }, [selectedItemId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8000/itemPrice/updateItemPrice/${editItemId}`,
          formData
        );
        alert("Item price updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8000/itemPrice/addItemPrice",
          formData
        );
        alert("Item price added successfully!");
      }
      fetchItemPrices(selectedItemId);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add/update item price: " + error.message);
    }
  };

  const handleEditItem = (item) => {
    setFormData(item);
    setIsEditing(true);
    setEditItemId(item.ItemStockID);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/itemPrice/deleteItemPrice/${id}`
      );
      setItemPriceData((prev) =>
        prev.filter((item) => item.ItemStockID !== id)
      );
      alert("Item price deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item price: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditItemId(null);
  };

  const handleCancel = () => {
    handleClose();
    resetForm();
  };

  // Sorting function
  const sortedData = itemPriceData.sort((a, b) => {
    const priceComparison =
      sortOrder.PurchasePrice === "asc"
        ? a.PurchasePrice - b.PurchasePrice
        : b.PurchasePrice - a.PurchasePrice;
    if (priceComparison !== 0) return priceComparison;

    const qtyComparison =
      sortOrder.Qty === "asc" ? a.Qty - b.Qty : b.Qty - a.Qty;
    if (qtyComparison !== 0) return qtyComparison;

    const dateA = new Date(a.PurchaseDate);
    const dateB = new Date(b.PurchaseDate);
    return sortOrder.PurchaseDate === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="style-model">
      <Modal>
        <div className="body-container">
          <form onSubmit={handleSubmit} className="item-price-form">
            <h3 className="form-heading">
              {isEditing ? "Edit Item Price" : "Add Item Price"}
            </h3>

            <label>
              Item Name: <strong>{selectedItemName}</strong>
            </label>

            <label>
              Purchase Price:
              <input
                type="text"
                name="PurchasePrice"
                value={formData.PurchasePrice}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Purchase Date:
              <input
                type="date"
                name="PurchaseDate"
                value={formData.PurchaseDate}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Quantity:
              <input
                type="text"
                name="Qty"
                value={formData.Qty}
                onChange={handleInputChange}
                required
              />
            </label>

            <div className="table-responsive">
              <h2>Item Price List: {selectedItemName}</h2>
              <table className="table table-bordered table-striped table-hover shadow">
                <thead className="table-secondary">
                  <tr>
                    <th
                      onClick={() =>
                        setSortOrder((prev) => ({
                          ...prev,
                          PurchasePrice:
                            prev.PurchasePrice === "asc" ? "desc" : "asc",
                        }))
                      }
                    >
                      Price {sortOrder.PurchasePrice === "asc" ? "↑" : "↓"}
                    </th>
                    <th
                      onClick={() =>
                        setSortOrder((prev) => ({
                          ...prev,
                          Qty: prev.Qty === "asc" ? "desc" : "asc",
                        }))
                      }
                    >
                      Quantity {sortOrder.Qty === "asc" ? "↑" : "↓"}
                    </th>
                    <th
                      onClick={() =>
                        setSortOrder((prev) => ({
                          ...prev,
                          PurchaseDate:
                            prev.PurchaseDate === "asc" ? "desc" : "asc",
                        }))
                      }
                    >
                      Date {sortOrder.PurchaseDate === "asc" ? "↑" : "↓"}
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.ItemStockID}>
                      <td>{item.PurchasePrice}</td>
                      <td>{item.Qty}</td>
                      <td>
                        {new Date(item.PurchaseDate).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="buttons-group">
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
                              placement="topRight"
                              description="Are you sure to delete this item Price?"
                              onConfirm={() => handleDelete(item.ItemStockID)}
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

            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={itemPriceData.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />

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
