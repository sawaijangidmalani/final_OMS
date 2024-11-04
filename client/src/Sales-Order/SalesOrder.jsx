import React, { useState, useEffect } from "react";
import "../Style/salesorder.css";
import AddSalesItem from "./AddSalesItem";
import AddOrEditCustomer from "./AddorEditCustomer";
import axios from "axios";
import "../Style/Add.css";

const SalesOrder = ({ onClose }) => {
  const [customerData, setCustomerData] = useState([]);
  const [formData, setFormData] = useState({
    CustomerID: "",
    ProviderID:  "1",
    SalesOrderNumber: "",
    SalesDate: "",
    Status: "",
    SalesTotalPrice: 0.0,
  });
  const [salesOrderItems, setSalesOrderItems] = useState([]);
  const [addClick, setAddClick] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const res = await axios.get(
        "http://localhost:8000/customer/getCustomerData"
      );
      setCustomerData(res.data);
    };

    fetchCustomerData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSaleItem = (newItem) => {
    const updatedItems = [...salesOrderItems, newItem];
    setSalesOrderItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.qty * item.unitCost,
      0
    );
    setFormData((prev) => ({ ...prev, SalesTotalPrice: total }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      ...formData,
    };

    try {
      await axios.post(
        "http://localhost:8000/customerpo/insertCustomerPo",
        data
      );
      alert("Sales Order created successfully!");
      window.location.reload();
      onClose();
      resetForm();
    } catch (err) {
      console.error(
        "Error creating sales order:",
        err.response ? err.response.data : err.message
      );
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = salesOrderItems.filter((_, i) => i !== index);
    setSalesOrderItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const handleAdd = () => {
    setAddClick(true);
  };

  const handleCancel = () => {
    setAddClick(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      CustomerID: "",
      ProviderID: "1",
      SalesOrderNumber: "",
      SalesDate: "",
      Status: 1,
      SalesTotalPrice: 0.0,
    });
    setSalesOrderItems([]);
  };

  return (
    <>
      {addClick ? (
        <AddOrEditCustomer
          onClose={handleCancel}
          onPurchaseData={handleAddSaleItem}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="salesorder-form">
            <h3 className="salesorder-form-heading">Add / Edit Sales Order</h3>

            <label htmlFor="customer">
              Customer:
              <select
                id="customer"
                name="CustomerID"
                value={formData.CustomerID}
                onChange={handleInputChange}
                className="customer-salesorder_input"
                required
              >
                <option value="">Select Customer</option>
                {customerData.map((customer) => (
                  <option key={customer.CustomerID} value={customer.CustomerID}>
                    {customer.Name}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="salesOrderNumber">
              Sales Order Number:
              <input
                type="text"
                id="salesOrderNumber"
                name="SalesOrderNumber"
                value={formData.SalesOrderNumber}
                onChange={handleInputChange}
                className="salesorder_input"
                required
              />
            </label>

            {/* <label htmlFor="salesDate">
              Sales Date:
              <input
                type="date"
                id="salesDate"
                name="SalesDate"
                value={formData.SalesDate}
                onChange={handleInputChange}
                className="salesorder_input"
                required
              />
            </label> */}

            <label htmlFor="salesDate">
            Sales Date:
            <input
             type="date"
             id="salesDate"
             name="SalesDate"
            onChange={handleInputChange}
                className="salesorder_input"
            />
          </label>

            <label htmlFor="status">
              Status:
              <select
                id="status"
                name="Status"
                value={formData.Status}
                onChange={handleInputChange}
                className="status-salesorder_input"
              >
                <option >Select Status</option>
                <option value={1}>Draft</option>
                <option value={0}>Approved</option>
              </select>
            </label>

            <button type="button" onClick={handleAdd} className="add-item">
              Add Item
            </button>
          </form>

          <AddSalesItem
            items={salesOrderItems}
            handleDeleteItem={handleDeleteItem}
          />

          <div className="customer-form__button-container">
            <button
              type="submit"
              className="customer-form__button"
              onClick={handleSubmit}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="customer-form__button"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default SalesOrder;
