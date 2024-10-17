import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AddPurchaseItem from "./AddPurchaseItem";
import AddOrEdit from "./AddOrEdit";
import axios from "axios";

const PurchaseOrder = ({ onPurchaseData }) => {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [customerpo, setCustomerpo] = useState("CPO 001");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Draft");
  const [purchaseOrder, setPurchaseOrder] = useState("PO 01");
  const [items, setItems] = useState([]);
  const [showAddOrEdit, setShowAddOrEdit] = useState(false);
  const [Default, setDefault] = useState("param");

  const navigate = useNavigate(); // Create the navigate function

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { customer, customerpo, date, status, purchaseOrder, items };
    await axios.post("https://final-oms.onrender.com/po/insertpo", data);
    alert("PO inserted");
    console.log(data);
    onPurchaseData(data);
    setCustomer("");
    setCustomerpo("");
    setDate("");
    setStatus("Draft");
    setPurchaseOrder("");
    setItems([]);

    navigate("/purchaseorder");
    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/customer/getCustomerData"
        );
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddItemClick = () => {
    setShowAddOrEdit(true);
  };

  const handleAddItem = (item) => {
    setItems([...items, item]);
    setShowAddOrEdit(false);
  };

  const handleCancel = () => {
    setShowAddOrEdit(false);
    resetpurchaseform();
  };

  return (
    <div>
      {showAddOrEdit ? (
        <AddOrEdit onPurchaseData={handleAddItem} onCancel={handleCancel} />
      ) : (
        
        <div className="body-container">
        <form onSubmit={handleSubmit} className="customer-form">
          <h3 className="form-heading">Add / Edit Purchase Order</h3>
          <label htmlFor="customer" className="customer-salesorder_label">
            Customer:
          </label>
          {/* <select
            id="customer"
            value={Default}
            onChange={(event) => setCustomer(event.target.value)}
            className="customer-salesorder_input"
          >
            <option value="param">Select a Customer</option>
            {customers.map((cust) => (
              <option key={cust.name} value={cust.name}>{cust.name}</option>
            ))}
          </select> */}

          <select
            id="customer"
            value={Default}
            onChange={(event) => setCustomer(event.target.value)}
            className="customer-salesorder_input"
          >
            <option value="param">Select a Customer</option>
            {(Array.isArray(customers) ? customers : []).map((cust) => (
              <option key={cust.name} value={cust.name}>
                {cust.name}
              </option>
            ))}
          </select>

          <label htmlFor="purchaseOrder" className="purchase-order-label">
            Purchase Order:
          </label>
          <select
            id="purchaseOrder"
            value={purchaseOrder}
            onChange={(event) => setPurchaseOrder(event.target.value)}
            className="purchase-order-input"
          >
            <option value="PO 01">PO 01</option>
            <option value="PO 02">PO 02</option>
          </select>
          <label htmlFor="customerpo" className="customer-po-label">
            Customer PO:
          </label>
          <select
            id="customerPO"
            value={customerpo}
            onChange={(event) => setCustomerpo(event.target.value)}
            className="customer-po-input"
          >
            <option value="PO1">CPO 001</option>
            <option value="PO2">CPO 002</option>
          </select>
          <label htmlFor="date" className="date-salesorder_label">
            Date:
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="date-salesorder_input"
          />
          <label htmlFor="status" className="status-salesorder_label">
            Status:
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="status-salesorder_input"
          >
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
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
       
      )}
    </div>
  );
};

export default PurchaseOrder;
