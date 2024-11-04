import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

const AddOrEditCustomer = ({ onPurchaseData, onClose }) => {
  const [products, setProducts] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState(null); 

  useEffect(() => {
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
    <div>
      <div className="style-model">
        <Modal>
        <div className="body-container">
        <form onSubmit={handleSubmit} className="customer-form">
        <h3 className="form-heading">Add / Edit Item</h3>
        
        <label className="customer-form__label">
          Item Name:
        
        <select
          id="customer"
          value={customer}
          onChange={handleProductChange}
          className="customer-form__input"
        >
          <option value="">Select a Product</option>
          {products.map((product, index) => (
            <option key={index} value={product.Name}>
              {product.Name}
            </option>
          ))}
        </select>
        </label>
        
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
                    onClick={onClose}
                    className="customer-form__button"
                  >
                    Cancel
                  </button>
                </div>

      </form>
      </div>
      </Modal>
      </div>
    </div>
  );
};

export default AddOrEditCustomer;