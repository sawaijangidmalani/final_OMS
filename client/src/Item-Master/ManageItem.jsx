import React, { useState,useEffect } from "react";
import styled from "styled-components";
import AddItem from "./AddItem";
import ItemStockUtilization from "./ItemStockUtilization";
import ItemPrice from "./ItemPrice";
import { BiInfoCircle, BiPackage, BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { Tooltip } from "antd";

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  gap: 15px;
`;

const StyledButton = styled.button`
  font-size: 16px;
  color: #ffffff;
  background-color: #4e647b;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  width: 200px;
  height: 40px;
  background-color: white;
  color: #333;
  padding-left: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const DropdownOptions = styled.div`
  position: absolute;
  width: 200px;
  max-height: 150px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const Option = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

function ManageItem() {

  const [items, setItems] = useState([]);
  
  useEffect(()=>{
    axios.get("https://final-oms.onrender.com/item/getItems").then((data)=>{
      if(!data?.data?.error){
        setItems(data?.data?.data)  
        // return console.log("good request ");
      }
    })
    // console.log("hello")
  },[])

  const [showModal, setShowModal] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [showStocks, setShowStocks] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const handleSearch = () => {
    const filteredItems = items.filter((item) =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setItems(filteredItems);
  };

  const handleDelete = (name) => {
    axios.delete("https://final-oms.onrender.com/item/deleteItems", {
      data: { id: name }
  })
  .then(() => {
      console.log("Item deleted successfully");
      alert("Item deleted")
  })
  .catch(err => {
      console.error("Error deleting item:", err);
  });
    };

  const handleAddItem = () => {
    setEditItem(null);
    setShowModal(true); 
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleStock = () => {
    setShowStock(true);
  };

  const handleStocks = () => {
    setShowStocks(true);
  };

  const handleClose = () => {
    setShowStocks(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleItemDropdown = () => {
    setIsItemDropdownOpen(!isItemDropdownOpen);
    setIsSupplierDropdownOpen(false); // Close the supplier dropdown
  };

  const toggleSupplierDropdown = () => {
    setIsSupplierDropdownOpen(!isSupplierDropdownOpen);
    setIsItemDropdownOpen(false); // Close the item dropdown
  };

  const handleItemOptionClick = (option) => {
    setSelectedItem(option);
    setSearchTerm(option);
    setIsItemDropdownOpen(false);
  };

  const handleSupplierOptionClick = (option) => {
    setSelectedSupplier(option);
    setIsSupplierDropdownOpen(false);
  };

  return (
    <>
      <h1>Manage Items</h1>
      <StyledDiv>
        <DropdownContainer>
          <DropdownButton onClick={toggleItemDropdown}>
            {selectedItem || "Item Name"}
          </DropdownButton>
          {isItemDropdownOpen && (
            <DropdownOptions>
              {items.map((item) => (
                <Option key={item.id} onClick={() => handleItemOptionClick(item.item)}>
                  {item.item}
                </Option>
              ))}
            </DropdownOptions>
          )}
        </DropdownContainer>
        <DropdownContainer>
          <DropdownButton onClick={toggleSupplierDropdown}>
            {selectedSupplier || "Supplier Name"}
          </DropdownButton>
          {isSupplierDropdownOpen && (
            <DropdownOptions>
              {items.map((item) => (
                <Option key={item.id} onClick={() => handleSupplierOptionClick(item.supplier)}>
                  {item.supplier}
                </Option>
              ))}
            </DropdownOptions>
          )}
        </DropdownContainer>
        <ButtonContainer>
          <StyledButton onClick={handleSearch}>Search</StyledButton>
          <StyledButton onClick={handleAddItem}>Add Item</StyledButton>
        </ButtonContainer>
      </StyledDiv>
      <div className="conentdetails">
        <h2>Item List</h2>
        <div>
          <table className="table table-bordered table-striped table-hover shadow mt-4">
            <thead className="table-secondary">
              <tr>
                <th>Item Name</th>
                <th>Supplier</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Description</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.supplier}</td>
                  <td>{item.category}</td>
                  <td>{item.brand}</td>
                  <td>{item.description}</td>
                  <td>{item.unit}</td>
                  <td>{item.status}</td>
                  <td>
                    <div className="buttons-group">
                      <Tooltip
                      title="Edit"
                      overlayInnerStyle={{
                        backgroundColor: "rgb(41, 10, 244)",
                        color: "white",
                        borderRadius: "10%",
                      }}
                      >
                      <button className="btns" onClick={() => handleEditItem(item)}>
                        <BiSolidEdit />
                      </button>
                      </Tooltip>
                      <button className="btns" onClick={handleStocks}>
                        <BiPackage />
                      </button>
                      <Tooltip
                      title="Delete"
                      overlayInnerStyle={{
                        backgroundColor: "rgb(244, 10, 10)",
                        color: "white",
                        borderRadius: "10%",
                      }}
                      >
                      <button className="btns" onClick={() => handleDelete(item.name)}>
                        <MdDelete />
                      </button>
                      </Tooltip>
                      <button className="btns" onClick={handleStock}>
                        <BiInfoCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <AddItem items={items} setItems={setItems} editItem={editItem} closeModal={closeModal} />
      )}
      {showStock && <ItemStockUtilization items={items} />}
      {showStocks && <ItemPrice handleClose={handleClose} />}
    </>
  );
}

export default ManageItem;
