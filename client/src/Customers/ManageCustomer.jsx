import { useEffect, useState } from "react";
import styled from "styled-components";
import AddCustomer from "./AddCustomer";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
`;

const StyledIn = styled.input`
  width: 200px;
  height: 45px;
  margin-top: 20px;
  
`;

const StyledSelect = styled.select`
  width: 200px;
  height: 40px;
  background-color: white;
  color: #333;
  /* padding-left: 10px; */
  font-size: 16px;
  border: none;
  border-radius: 5px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  margin-top: 15px;
  height: 50px;
  border: none;
  padding: 5px;
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

function ManageCustomer() {
  const [customers, setCustomers] = useState([]);
  useEffect(()=>{
     axios.get("http://localhost:8000/customer/getCustomerData").then((result)=>{
      setCustomers(result.data)
     }).catch((err)=>{
      console.log(err)
     })
  },[])

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    const filteredCustomers = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCustomers(filteredCustomers);
  };
  const handleDelete = (email) => {
    axios.post("http://localhost:8000/customer/deleteCustomer",{email}).then((result)=>{
      alert("User deleted successfully");
      window.location.reload();
      console.log(result)
    }).catch((err)=>{
      console.log(err)
    })
    return console.log(email)
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const updateCustomerList = (newCustomer) => {
    setCustomers((prevCustomers) => {
      if (editingCustomer) {
        return prevCustomers.map((customer) =>
          customer.id === newCustomer.id ? newCustomer : customer
        );
      } else {
        return [...prevCustomers, newCustomer];
      }
    });
    setShowModal(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setDropdownOpen(false);
  };

  return (
    <>
      <div className="">
        <h1>Manage Customers</h1>
        <StyledDiv>
          <DropdownContainer>
            <DropdownButton onClick={toggleDropdown}>
              {searchTerm || "Customer Name"}
            </DropdownButton>
            {dropdownOpen && (
              <DropdownOptions>
                {customers.map((customer) => (
                  <Option key={customer.id} onClick={() => handleOptionClick(customer.name)}>
                    {customer.name}
                  </Option>
                ))}
              </DropdownOptions>
            )}
          </DropdownContainer>
          <ButtonContainer>
            <StyledIn
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search by name..."
            />
            <StyledButton onClick={handleSearch}>Search</StyledButton>
            <StyledButton onClick={handleAddCustomer}>Add Customer</StyledButton>
          </ButtonContainer>
        </StyledDiv>

        <div className="conentdetails">
          <h2>Customer List:</h2>
          <table className="table table-bordered table-striped table-hover shadow mt-5">
            <thead className="table-secondary">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Area</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.email}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.area}</td>
                  <td>{customer.status}</td>
                  <td>
                    <div className="buttons-group">
                      <button className="btns" onClick={() => handleEditCustomer(customer)}>
                        <BiSolidEdit />
                      </button>
                      <button className="btns" onClick={() => handleDelete(customer.email)}>
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <AddCustomer
            customers={customers}
            setCustomers={setCustomers}
            closeModal={closeModal}
            editingCustomer={editingCustomer}
            updateCustomerList={updateCustomerList}
          />
        )}
      </div>
    </>
  );
}

export default ManageCustomer;
