import React, { useState, useEffect } from "react";
import axios from "axios";

const AddOrEditCustomer = ({ onPurchaseData, onClose }) => {
  const [products, setProducts] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState(null); 

  useEffect(() => {
    console.log("hello")
    axios.get("http://localhost:8000/item/getItems")
      .then((res) => {
        setProducts(res.data.data); 
        console.log(res.data.data); 
      })
      .catch(err => {
        console.error("Error fetching products:", err);
      });
  }, []);

  const [customer, setCustomer] = useState("");
  const [availableQty, setAvailableQty] = useState("");
  const [qtyAllocated, setQtyAllocated] = useState("");
  const [remainingQty, setRemainingQty] = useState("");
  const [invoice, setInvoice] = useState("");
  const [date, setDate] = useState("");

  const handleProductChange = (event) => {
    const productName = event.target.value;
    setCustomer(productName);

    const product = products.find((p) => p.name === productName);
    
    if (product) {
      setAvailableQty(product.quantity || "");
      setQtyAllocated(""); 
      setRemainingQty(product.quantity || "");
      setSelectedProduct(product);
    }
  };

  const handleQtyAllocatedChange = (event) => {
    const allocatedQty = parseInt(event.target.value, 10);
    setQtyAllocated(allocatedQty);

    if (selectedProduct) {
      const calculatedRemainingQty = (selectedProduct.quantity || 0) - allocatedQty;
      setRemainingQty(calculatedRemainingQty >= 0 ? calculatedRemainingQty : 0);
    }
  };

  // const handleSubmit = async(event) => {
  //   event.preventDefault();
  //   const item = {
  //     customer,
  //     availableQty,
  //     qtyAllocated,
  //     remainingQty,
  //     invoice,
  //     date,
  //   };
  //   console.log("param")
  //   onPurchaseData(item);
  //   setCustomer("");
  //   setAvailableQty("");
  //   setQtyAllocated("");
  //   setRemainingQty("");
  //   setInvoice("");
  //   setDate("");
  //   console.log(item);
  //   await axios.post("http://localhost:8000/customerPo/insertCustomerPo",item).then((res)=>{
  //     console.log(res);
  //   }).then(()=>{
  //     alert("PO inserted")
  //   })
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Calculate remainingTotalCost
    const remainingTotalCost = remainingQty * (selectedProduct?.price || 0);
  
    const item = {
      customer,
      availableQty,
      qtyAllocated,
      remainingQty,
      remainingTotalCost, 
      invoice,
      date,
    };
  
    console.log("param");
    onPurchaseData(item);
  
    setCustomer("");
    setAvailableQty("");
    setQtyAllocated("");
    setRemainingQty("");
    setInvoice("");
    setDate("");
    console.log(item);
  
    await axios.post("http://localhost:8000/customerPo/insertCustomerPo", item)
      .then((res) => {
        console.log(res);
      })
      .then(() => {
        alert("PO inserted");
      });
  };
  

  return (
    <>
      <form onSubmit={handleSubmit} className="salesorder-form">
        <h3 className="salesorder-form-heading">Add / Edit Item</h3>
        
        <label htmlFor="customer" className="customer-salesorder_label">
          Item Name:
        </label>
        <select
          id="customer"
          value={customer}
          onChange={handleProductChange}
          className="customer-salesorder_input"
        >
          <option value="">Select a Product</option>
          {products.map((product, index) => (
            <option key={index} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>
        
        <label htmlFor="availableQty" className="availableQty-salesorder_label">
          Available Qty:
        </label>
        <input
          type="number"
          id="availableQty"
          value={availableQty}
          readOnly
          className="availableQty-salesorder_input"
        />
        
        <label htmlFor="qtyAllocated" className="qtyAllocated-salesorder_label">
          Qty Allocated:
        </label>
        <input
          type="number"
          id="qtyAllocated"
          value={qtyAllocated}
          onChange={handleQtyAllocatedChange}
          className="qtyAllocated-salesorder_input"
        />
        
        <label htmlFor="remainingQty" className="remainingQty-salesorder_label">
          Remaining Qty:
        </label>
        <input
          type="number"
          id="remainingQty"
          value={remainingQty}
          readOnly
          className="remainingQty-salesorder_input"
        />
        
        <label htmlFor="invoice" className="remainingQty-salesorder_label">
          Invoice Number:
        </label>
        <input
          type="number"
          id="invoice"
          value={invoice}
          onChange={(event) => setInvoice(event.target.value)}
          className="remainingQty-salesorder_input"
        />
        
        <label htmlFor="date" className="remainingQty-salesorder_label">
          Invoice Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="remainingQty-salesorder_input"
        />

        <div className="buttons-group">
          <button type="submit" className="btns">
            Save
          </button>
          <button type="button" onClick={onClose} className="btns">
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default AddOrEditCustomer;
