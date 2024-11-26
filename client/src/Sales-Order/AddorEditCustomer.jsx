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

const AddorEditCustomer = ({
  onClose,
  onSalesOrderItemData,
  refreshItemsData,
  itemToEdit,
}) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [salesQty, setSalesQty] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  const [tax, setTax] = useState("");

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
      setSalesQty(itemToEdit.SalesQty);
      setUnitCost(itemToEdit.UnitCost);
      setSalesPrice(itemToEdit.SalesPrice);
      setTax(itemToEdit.Tax);
    }
  }, [itemToEdit, products]);

  const handleProductChange = (event) => {
    const productName = event.target.value;
    const product = products.find((p) => p.Name === productName);
    if (product) {
      setSelectedProduct(product);
      setUnitCost(product.UnitCost || 0);
      setSalesPrice(product.SalesPrice || 0);
    }
  };

  const calculateSalesPrice = (qty, cost, tax) => {
    return (qty * cost * (1 + tax / 100)).toFixed(2);
  };

  const handleSalesQtyChange = (e) => {
    const qty = e.target.value;
    setSalesQty(qty);
    setSalesPrice(calculateSalesPrice(qty, unitCost, tax));
  };

  const handleUnitCostChange = (e) => {
    const cost = e.target.value;
    setUnitCost(cost);
    setSalesPrice(calculateSalesPrice(salesQty, cost, tax));
  };

  const handleTaxChange = (e) => {
    const taxValue = e.target.value;
    setTax(taxValue);
    setSalesPrice(calculateSalesPrice(salesQty, unitCost, taxValue));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const salesOrderItem = {
      ItemID: selectedProduct?.ItemID || null,
      SalesQty: parseFloat(salesQty) || 0,
      UnitCost: parseFloat(unitCost) || 0,
      SalesPrice: parseFloat(salesPrice) || 0,
      Tax: parseFloat(tax) || 0,
      CustomerSalesOrderID: 1,
    };

    try {
      let response;

      if (itemToEdit && itemToEdit.ItemID) {
        response = await axios.put(
          "http://localhost:8000/customerpo/editcustomersalesorderitems",
          {
            ...salesOrderItem,
            ItemID: itemToEdit.ItemID,
          }
        );

        if (response.status === 200) {
          alert(response.data.message || "Item updated successfully.");
        }
      } else {
        // Add new item
        response = await axios.post(
          "http://localhost:8000/customerpo/addcustomersalesorderitems",
          salesOrderItem
        );
        console.log("Add Response:", response.data);

        if (response.status === 201) {
          alert(response.data.message || "Item added successfully.");
        }
      }

      onSalesOrderItemData(salesOrderItem);
      refreshItemsData();

      setSelectedProduct(null);
      setSalesQty("");
      setUnitCost("");
      setSalesPrice("");
      setTax("");
      onClose();
    } catch (error) {
      console.error("Error submitting sales order item:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <Modal>
      <div className="body-container">
        <form onSubmit={handleSubmit} className="customer-form">
          <h3 className="form-heading">
            {itemToEdit ? "Edit" : "Add"} Sales Order Item
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
              value={salesQty}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 1) {
                  handleSalesQtyChange(e);
                }
              }}
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
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 1) {
                  handleUnitCostChange(e);
                }
              }}
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="tax" className="customer-form__label">
            Tax (%):
            <input
              id="tax"
              type="number"
              value={tax}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 1) {
                  handleTaxChange(e);
                }
              }}
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="salesPrice" className="customer-form__label">
            Sales Price:
            <input
              id="salesPrice"
              type="number"
              value={salesPrice}
              readOnly
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

export default AddorEditCustomer;
