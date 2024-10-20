import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SalesOrder from "./SalesOrder";
import { BiEdit, BiTrash } from "react-icons/bi";
import EditCustomerPO from "../Sales-Order/EditCustomePO";
import axios from "axios";
import "../Style/Customer.css";

const initialCustomers = [
  {
    id: 1,
    name: "Test",
    email: "customer1@example.com",
    phone: "123-456-7890",
    area: "Area 1",
    status: "Active",
  },
  {
    id: 2,
    name: "Admin",
    email: "customer2@example.com",
    phone: "234-567-8901",
    area: "Area 2",
    status: "Inactive",
  },
];

const initialInvoices = ["IN0001", "IN0002"];
const initialCustomerPOs = ["CPO 001", "CPO 002", "CPO 003"];

const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
`;

const StyledModel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-size: 16px;
  margin: 10px;
`;

const StyledInput = styled.input`
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
`;






const Option = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

function Sales() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [customerPOs, setCustomerPOs] = useState(initialCustomerPOs);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.name);
  const [selectedCustomerPO, setSelectedCustomerPO] = useState(customerPOs[0]);
  const [salesData, setSalesData] = useState([]);
  const [dropdownOpenCustomerPO, setDropdownOpenCustomerPO] = useState(false);
  const [selectedSaleIndex, setSelectedSaleIndex] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    area: "",
    status: "Active",
  });

  const [newInvoice, setNewInvoice] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve data from local storage
        const storedSalesData = localStorage.getItem("salesData");

        // If there's stored data, set it as initial state
        if (storedSalesData) {
          setSalesData(JSON.parse(storedSalesData));
        }

        // Fetch new data from the API
        const response = await axios.get(
          "https://final-oms.onrender.com/po/getpo"
        );
        const fetchedData = response.data;

        // Update state and local storage with the fetched data
        setSalesData(fetchedData);
        localStorage.setItem("salesData", JSON.stringify(fetchedData));
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchData();
  }, []);
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleCustomerChange = (event) => {
    setSelectedCustomer(event.target.value);
  };

  const handleCustomerPOChange = (event) => {
    setSelectedCustomerPO(event.target.value);
  };

  const handleSearch = () => {};

  const handleSaleOrder = () => {
    setSelectedSaleIndex(null);
    setShowModal(true);
  };

  const handleSalesData = (data) => {
    if (selectedSaleIndex !== null) {
      const updatedSalesData = [...salesData];
      updatedSalesData[selectedSaleIndex] = data;
      setSalesData(updatedSalesData);
      setSelectedSaleIndex(null);
    } else {
      setSalesData([...salesData, data]);
    }
    setShowModal(false);
  };

  const handleEdit = (index) => {
    setSelectedSaleIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    const updatedSalesData = [...salesData];
    updatedSalesData.splice(index, 1);
    setSalesData(updatedSalesData);
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const addCustomer = (customerName) => {
    const newCustomer = {
      id: customers.length + 1,
      name: customerName,
      email: "",
      phone: "",
      area: "",
      status: "Active",
    };
    setCustomers([...customers, newCustomer]);
  };

  const addInvoice = (invoiceNumber) => {
    setInvoices([...invoices, invoiceNumber]);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setDropdownOpen(false);
  };

  const toggleDropdownCustomerPO = () => {
    setDropdownOpenCustomerPO(!dropdownOpenCustomerPO);
  };

  const handleCustomerPOSelect = (customerPO) => {
    setSelectedCustomerPO(customerPO);
    setDropdownOpenCustomerPO(false);
  };

  return (
    <>
      <div className="container">
        <h1>Manage Customer PO</h1>
        <div className="StyledDiv">
          <div className="LeftContainer">
            <div className="dropdowncontainer">
              <button className="dropdownbutton" onClick={toggleDropdown}>
                {selectedCustomer || "Customer Name"}
              </button>

              {dropdownOpen && (
                <div className="dropdownoption">
                  {customers.map((customer) => (
                    <div
                    className="option"
                      key={customer.id}
                      onClick={() => handleOptionClick(customer.name)}
                    >
                      {customer.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <StyledLabel htmlFor="orderDate">Order Date:</StyledLabel>
            <StyledInput
              type="date"
              id="orderDate"
              value={selectedDate}
              onChange={handleDateChange}
            />

            <div className="dropdowncontainer">
              <button
                className="dropdownbutton"
                onClick={toggleDropdownCustomerPO}
              >
                {selectedCustomerPO || "Customer PO"}
              </button>
              {dropdownOpenCustomerPO && (
                <div className="dropdownoption">
                  {customerPOs.map((customerPO, index) => (
                    <div
                    className="option"
                      key={index}
                      onClick={() => handleCustomerPOSelect(customerPO)}
                    >
                      {customerPO}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="RightContainer">
              <button className="StyledButtonSearch" onClick={handleSearch}>
                Search
              </button>
              <button className="StyledButtonAdd" onClick={handleSaleOrder}>
                Add Cus. PO
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <h3>Customer PO List:</h3>
          <table className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th>Customer Name</th>
                <th>Customer PO</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(salesData) &&
                salesData.map((sale, index) => (
                  <React.Fragment key={index}>
                    {Array.isArray(sale.item) &&
                      sale.item.map((item, itemIndex) => (
                        <tr key={`${index}-${itemIndex}`}>
                          <td>{itemIndex === 0 ? sale.customer : ""}</td>
                          <td>{itemIndex === 0 ? sale.po : ""}</td>
                          <td>{itemIndex === 0 ? sale.date : ""}</td>
                          <td>{item.price}</td>
                          <td>{itemIndex === 0 ? sale.status : ""}</td>
                          <td>
                            {itemIndex === 0 && (
                              <div className="buttons-group">
                                <button
                                  onClick={() => handleEdit(index)}
                                  className="btns1"
                                >
                                  <BiEdit />
                                </button>
                                <button
                                  onClick={() => handleDelete(index)}
                                  className="btns2"
                                >
                                  <BiTrash />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <StyledModel>
            <Modal>
              {selectedSaleIndex !== null ? (
                <EditCustomerPO
                  onSalesData={handleSalesData}
                  saleData={salesData[selectedSaleIndex]}
                  customers={customers}
                />
              ) : (
                <SalesOrder
                  onSalesData={handleSalesData}
                  addCustomer={addCustomer}
                  addInvoice={addInvoice}
                  onClose={handleClose}
                />
              )}
            </Modal>
          </StyledModel>
        )}
      </div>
    </>
  );
}

export default Sales;
