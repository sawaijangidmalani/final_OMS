import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddPurchaseItem from "./AddPurchaseItem";
import AddOrEdit from "./AddOrEdit";
import axios from "axios";
import "../Style/Add.css";
import "../Style/salesorder.css";

const PurchaseOrder = ({ onClose, editData }) => {
  const [customerID, setCustomerID] = useState("");
  const [customerPO, setCustomerPO] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
  const [items, setItems] = useState([]);
  const [showAddOrEdit, setShowAddOrEdit] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/customerpo/getCustomerPo"
        );
        const updatedData = response.data.map((item) => ({
          CustomerSalesOrderID: item.CustomerSalesOrderID,
          CustomerName: item.CustomerName,
          SalesOrderNumber: item.SalesOrderNumber,
        }));
        setSalesData(updatedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSalesData();
  }, []);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/customer/getCustomerData"
        );
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    fetchCustomerData();
  }, []);

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    const data = {
      PurchaseOrderID: editData ? editData.PurchaseOrderID : "",
      CustomerSalesOrderID: customerPO || null,
      CustomerID: customerID || null,
      ProviderID: 1,
      PurchaseOrderNumber: purchaseOrderNumber,
      PurchaseDate: date,
      Status: status,
      PurchaseTotalPrice: calculateTotalPrice(items),
      items,
    };

    console.log("Data to be sent:", data);

    try {
      let response;

      if (editData && editData.PurchaseOrderNumber) {
        response = await axios.put(
          `http://localhost:8000/po/updatepo/${editData.PurchaseOrderNumber}`,
          data
        );

        if (response.status === 200 || response.status === 201) {
          console.log("Response:", response);
          alert("Purchase order updated successfully");
        }
      } else {
        response = await axios.post("http://localhost:8000/po/insertpo", data);

        if (response.status === 200 || response.status === 201) {
          console.log("Response:", response);
          alert("Purchase order Saved successfully");
        }
      }

      window.location.reload();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error inserting/updating purchase order:", error);
    }
  };

  useEffect(() => {
    if (editData) {
      setCustomerID(editData.CustomerID);
      setCustomerPO(editData.CustomerSalesOrderID);
      setDate(editData.PurchaseDate);
      setStatus(editData.Status);
      setPurchaseOrderNumber(editData.PurchaseOrderNumber);
      setItems(editData.items);
    }
  }, [editData]);

  const handleAddItemClick = () => {
    setShowAddOrEdit(true);
  };

  const handleAddItem = (item) => {
    setItems([...items, item]);
    setShowAddOrEdit(false);
    resetForm();
  };

  const handleCancel = () => {
    setShowAddOrEdit(false);
    setCustomerID("");
    setCustomerPO("");
    setDate("");
    setStatus(1);
    setPurchaseOrderNumber("");
    setItems([]);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "CustomerID") setCustomerID(value);
    else if (name === "CustomerPO") setCustomerPO(value);
    else if (name === "PurchaseOrderNumber") setPurchaseOrderNumber(value);
    else if (name === "Date") setDate(value);
    else if (name === "Status") setStatus(value);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = purchaseOrderItems.filter((_, i) => i !== index);
    setPurchaseOrderItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  return (
    <div>
      {showAddOrEdit ? (
        <AddOrEdit onPurchaseData={handleAddItem} onClose={handleCancel} />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="salesorder-form">
            <h3 className="salesorder-form-heading">
              {editData ? "Edit Purchase Order" : "Add Purchase Order"}
            </h3>

            <label htmlFor="customer">
              Customer:
              <select
                id="customer"
                name="CustomerID"
                value={customerID}
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

            <label htmlFor="date">
              Date:
              <input
                type="date"
                id="date"
                name="Date"
                value={date}
                onChange={handleInputChange}
                className="customer-salesorder_input"
                required
              />
            </label>

            <label htmlFor="customerpo">
              Customer PO:
              <select
                id="customerPO"
                name="CustomerPO"
                value={customerPO}
                onChange={handleInputChange}
                className="customer-salesorder_input"
              >
                <option value="">Select CPO</option>
                {salesData.map((item) => (
                  <option
                    key={item.CustomerSalesOrderID}
                    value={item.CustomerSalesOrderID}
                  >
                    {item.SalesOrderNumber}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="purchaseOrderNumber">
              Purchase Order Number:
              <input
                id="purchaseOrderNumber"
                name="PurchaseOrderNumber"
                value={purchaseOrderNumber}
                onChange={handleInputChange}
                className="customer-salesorder_input"
                required
              />
            </label>

            <label htmlFor="status">
              Status:
              <select
                id="status"
                name="Status"
                value={status}
                onChange={handleInputChange}
                className="status-salesorder_input"
              >
                <option>Select Status</option>
                <option value={1}>Draft</option>
                <option value={0}>Approved</option>
              </select>
            </label>

            <button
              type="button"
              onClick={handleAddItemClick}
              className="add-item"
            >
              Add Item
            </button>
          </form>

          <AddPurchaseItem
            items={purchaseOrderItems}
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
    </div>
  );
};

export default PurchaseOrder;
