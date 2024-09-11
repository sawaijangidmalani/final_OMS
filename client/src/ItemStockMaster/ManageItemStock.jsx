import styled from "styled-components";
import { useState,useEffect } from "react";
import { BiPackage, BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import AddItem from "../Item-Master/AddItem";
import ItemStockDetail from "./ItemStockDetail";
import ItemPrice from "../Item-Master/ItemPrice";
import axios from "axios";

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


function ManageItemStock() {

  const [items, setItem] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpenItem, setDropdownOpenItem] = useState(false);
  const [dropdownOpenSupplier, setDropdownOpenSupplier] = useState(false);

  useEffect(()=>{
    axios.get("http://localhost:8000/item/getItems").then((data)=>{
      setItem(data.data.data)      
    }).catch(()=>{
      console.log("not done")
    })
  },[])

  const handleSearch = () => {
    const filteredItem = items.filter((item) =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setItem(filteredItem);
  };

  const handleDelete = (id) => {
    const updatedItem = items.filter((item) => item.id !== id);
    setItem(updatedItem);
  };

  const handleAddCustomer = () => {
    setShowModal((show) => !show);
  };

  const handleItemdetail = () => {
    setShowStock((show) => !show);
  };

  const handleEdit = () => {
    setShowEdit((show) => !show);
  };

  const closeModel = () => {
    setShowEdit(false);
  };

  const toggleDropdownItem = () => {
    setDropdownOpenItem(!dropdownOpenItem);
  };

  const toggleDropdownSupplier = () => {
    setDropdownOpenSupplier(!dropdownOpenSupplier);
  };

  const handleOptionClickItem = (option) => {
    setSearchTerm(option);
    setDropdownOpenItem(false);
  };

  const handleOptionClickSupplier = (option) => {
    setSearchTerm(option);
    setDropdownOpenSupplier(false);
  };
  return (
    <>
      <h1>Manage Items Stock:</h1>
      <StyledDiv>
        <div className="conatainer d-flex">
          <DropdownContainer>
            <DropdownButton onClick={toggleDropdownItem}>
              {searchTerm || "Item"}
            </DropdownButton>
            {dropdownOpenItem && (
              <DropdownOptions>
                {items.map((item) => (
                  <Option key={item.name} onClick={() => handleOptionClickItem(item.item)}>
                    {item.item}
                  </Option>
                ))}
              </DropdownOptions>
            )}
          </DropdownContainer>
          <DropdownContainer>
            <DropdownButton onClick={toggleDropdownSupplier}>
              {searchTerm || "Supplier Name"}
            </DropdownButton>
            {dropdownOpenSupplier && (
              <DropdownOptions>
                {items.map((item) => (
                  <Option key={item.id} onClick={() => handleOptionClickSupplier(item.supplier)}>
                    {item.supplier}
                  </Option>
                ))}
              </DropdownOptions>
            )}
          </DropdownContainer>
        </div>
        <ButtonContainer>
          <StyledButton onClick={handleSearch}>Search</StyledButton>
          <StyledButton onClick={handleAddCustomer}>Add Item Stock</StyledButton>
        </ButtonContainer>
      </StyledDiv>
      <div>
        <h3>Item List:</h3>
        <div>
          <table className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th>Item Name</th>
                <th>Supplier</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Unit</th>
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
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>
                    <div className="buttons-group">
                      <button className="btns" onClick={handleEdit}>
                        <BiSolidEdit />
                      </button>
                      <button
                        className="btns"
                        onClick={() => handleDelete(item.id)}
                      >
                        <MdDelete />
                      </button>
                      <button className="btns" onClick={handleItemdetail}>
                        <BiPackage />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && <AddItem items={items} setItem={setItem} />}
      {showStock && <ItemStockDetail items={items} setItem={setItem} />}
      {showEdit && <ItemPrice onClose={closeModel} />}
    </>
  );
}

export default ManageItemStock;
