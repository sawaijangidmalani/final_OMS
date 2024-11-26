import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 20%;
  left: 35%;
  border-radius: 20px;
`;

const AddOrEdit = ({ onPurchaseData, onClose, itemToEdit, refreshItemsData }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [invoice, setInvoice] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/item/getItems");
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (itemToEdit && products.length > 0) {
      setSelectedProduct(products.find((p) => p.ItemID === itemToEdit.ItemID));
      setPurchaseQty(itemToEdit.PurchaseQty);
      setUnitCost(itemToEdit.UnitCost);
      setPurchasePrice(itemToEdit.PurchasePrice);
      setInvoice(itemToEdit.InvoiceNumber);
      setDate(itemToEdit.InvoiceDate);
    }
  }, [itemToEdit, products]);



  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const purchaseOrderItem = {
      ItemID: selectedProduct?.ItemID || null,
      PurchaseQty: parseFloat(purchaseQty) || 0,
      UnitCost: parseFloat(unitCost) || 0,
      PurchasePrice: parseFloat(purchasePrice) || 0,
      InvoiceNumber: invoice || "",
      InvoiceDate: date || null,
      PurchaseOrderID: itemToEdit?.PurchaseOrderID || 1,
    };
  
    if (
      !purchaseOrderItem.ItemID ||
      !purchaseOrderItem.PurchaseQty ||
      !purchaseOrderItem.UnitCost ||
      !purchaseOrderItem.PurchasePrice ||
      !purchaseOrderItem.PurchaseOrderID
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      let response;
  
      if (itemToEdit && itemToEdit.ItemID) {
        response = await axios.put(
          "http://localhost:8000/po/editpurchaseorderitems",
          {
            ...purchaseOrderItem,
            ItemID: itemToEdit.ItemID,
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:8000/po/addpurchaseorderitems",
          purchaseOrderItem
        );
  
        if (response.status === 201) {
          alert(response.data.message || "Item added successfully.");
        }
      }
  
      onPurchaseData(purchaseOrderItem);
      refreshItemsData();
  
      setSelectedProduct(null);
      setPurchaseQty("");
      setUnitCost("");
      setPurchasePrice("");
      setInvoice("");
      setDate("");
      onClose();
    } catch (error) {
      console.error("Error submitting purchase order item:", error);
      alert("Error: " + error.message);
    }
  };
  

  const handleProductChange = (event) => {
    const productName = event.target.value;
    const product = products.find((p) => p.Name === productName);
    if (product) {
      setSelectedProduct(product);
      setUnitCost(product.UnitCost || 0);
      setPurchasePrice(product.PurchasePrice || 0);
    }
  };

  const calculatePurchasePrice = (qty, cost) => {
    return (qty * cost).toFixed(2);
  };

  const handlePurchaseQtyChange = (e) => {
    const qty = e.target.value;
    setPurchaseQty(qty);
    setPurchasePrice(calculatePurchasePrice(qty, unitCost));
  };

  const handleUnitCostChange = (e) => {
    const cost = e.target.value;
    setUnitCost(cost);
    setPurchasePrice(calculatePurchasePrice(purchaseQty, cost));
  };

  return (
    <Modal>
      <div className="body-container">
        <form onSubmit={handleSubmit} className="customer-form">
          <h3 className="form-heading">
            {itemToEdit ? "Edit" : "Add"} Purchase Order Item
          </h3>

          <label htmlFor="item" className="customer-form__label">
            Item:
            <select
              id="item"
              value={selectedProduct?.Name || ""}
              onChange={handleProductChange}
              className="customer-form__input"
              required
            >
              <option value="">Select an Item</option>
              {products.map((product) => (
                <option key={product.ItemID} value={product.Name}>
                  {product.Name}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="quantity" className="customer-form__label">
            Quantity:
            <input
              id="quantity"
              type="number"
              value={purchaseQty}
              onChange={handlePurchaseQtyChange}
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="unitCost" className="customer-form__label">
            Unit Cost:
            <input
              id="unitCost"
              type="number"
              value={unitCost}
              onChange={handleUnitCostChange}
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="purchasePrice" className="customer-form__label">
            Purchase Price:
            <input
              id="purchasePrice"
              type="number"
              value={purchasePrice}
              readOnly
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="invoice" className="customer-form__label">
            Invoice Number:
            <input
              type="text"
              id="invoice"
              value={invoice}
              onChange={(event) => setInvoice(event.target.value)}
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="date" className="customer-form__label">
            Invoice Date:
            <input
              type="date"
              id="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="customer-form__input"
              required
            />
          </label>

          <div className="customer-form__button-container">
            <button type="submit" className="customer-form__button">
              Save
            </button>
            <button
              type="button"
              className="customer-form__button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddOrEdit;
