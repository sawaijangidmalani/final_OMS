import React, { useState, useEffect } from "react";
import "./salesorder.css";
import AddSalesItem from "./AddSalesItem";
import AddOrEditCustomer from "./AddorEditCustomer";
import axios from "axios";

const SalesOrder = ({ onSalesData, addCustomer, addInvoice, saleData, onClose }) => {
  const [customerdata, setCustomerData] = useState([]);
  const [customerPoData, setCustomerPoData] = useState([]);
  const [total, setTotal] = useState(0);
  const [customer, setCustomer] = useState(saleData ? saleData.customer : "test");
  const [invoice, setInvoice] = useState(saleData ? saleData.invoice : "");
  const [date, setDate] = useState(saleData ? saleData.date : "");
  const [status, setStatus] = useState(saleData ? saleData.status : "Draft");
  const [items, setItems] = useState(saleData ? saleData.items : []);
  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [tax, setTax] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [addclick, setAddClick] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/customer/getCustomerData").then((res) => {
      setCustomerData(res.data);
    });

    axios.get("http://localhost:8000/customerpo/getCustomerPo").then((res) => {
      setCustomerPoData(res.data);

      const calculatedTotal = res.data.reduce((acc, po) => acc + po.quantity * po.unitPrice, 0); // Assuming there's a `unitPrice` field in the PO data
      setTotal(calculatedTotal);
      console.log(customerPoData)
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { customer, invoice, date, status, items };
    onSalesData(data);
    addCustomer(customer);
    addInvoice(invoice);
    resetForm();
  };

  const handleAddSaleItem = () => {
    const newItem = {
      item: itemName,
      qty: qty,
      unitCost: unitCost,
      tax: tax,
      purchasePrice: purchasePrice,
    };
    setItems([...items, newItem]);
    resetItemForm();
  };

  const handleSave = () => {
    handleSubmit(new Event("submit"));
  };

  const handleCancel = () => {
    setAddClick(false);
    resetForm();
  };

  const resetForm = () => {
    setCustomer("test");
    setDate("");
    setInvoice("");
    setStatus("Draft");
    setItems([]);
    resetItemForm();
  };

  const handleAdd = () => {
    setAddClick(true);
  };

  const resetItemForm = () => {
    setItemName("");
    setQty("");
    setUnitCost("");
    setTax("");
    setPurchasePrice("");
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <>
      {addclick ? (
        <AddOrEditCustomer onClose={handleCancel} onPurchaseData={handleAddSaleItem} />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="salesorder-form">
            <h3 className="salesorder-form-heading">Add / Edit Customer PO </h3>
            <label htmlFor="customer" className="customer-salesorder_label">
              Customer:
            </label>
            <select
              id="customer"
              value={customer}
              onChange={(event) => setCustomer(event.target.value)}
              className="customer-salesorder_input"
            >
              {customerdata.map((cust) => (
                <option key={cust.id} value={cust.name}>
                  {cust.name}
                </option>
              ))}
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

            <label htmlFor="invoice" className="invoice-salesorder_label">
              Customer PO
            </label>
            <select
              id="invoice"
              value={invoice}
              onChange={(event) => setInvoice(event.target.value)}
              className="invoice-salesorder_input"
            >
              <option value="">Select PO</option>
              <option value="PO123">PO123</option>
              <option value="PO124">PO124</option>
              <option value="PO125">PO125</option>
              <option value="PO126">PO126</option>
            </select>

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
            <button
              type="button"
              onClick={handleAdd}
              className="add-item"
              htmlFor="Add=Item"
            >
              Add Item
            </button>
          </form>

          <AddSalesItem items={customerPoData} handleDeleteItem={handleDeleteItem} />

          <div className="savebotton">
            <button onClick={handleSave} className="btns">
              Save
            </button>
            <button onClick={onClose} className="btns">
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default SalesOrder;
