import React, { useState, useEffect } from "react";
import axios from "axios";
import SalesOrder from "./SalesOrder";
import EditCustomerPO from "../Sales-Order/EditCustomePO";
import { BiEdit, BiTrash } from "react-icons/bi";
import {
  Modal,
  StyledModel,
  StyledDiv,
  StyledLabel,
  StyledInput,
  ButtonContainer,
  StyledButton,
  DropdownContainer,
  DropdownButton,
  DropdownOptions,
  Option,
} from "./Sales.styles";

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
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const storedSalesData = localStorage.getItem("salesData");
        if (storedSalesData) {
          setSalesData(JSON.parse(storedSalesData));
        }
        const response = await axios.get("http://localhost:8000/po/getpo");
        const fetchedData = response.data;
        setSalesData(fetchedData);
        localStorage.setItem("salesData", JSON.stringify(fetchedData));
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (event) => setSelectedDate(event.target.value);
  const handleCustomerChange = (event) =>
    setSelectedCustomer(event.target.value);
  const handleCustomerPOChange = (event) =>
    setSelectedCustomerPO(event.target.value);
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

  const handleDelete = async (index) => {
    const confirm = window.confirm("Are you sure you want to delete this PO?");
    if (!confirm) return;

    try {
      const sale = salesData[index];
      await axios.delete(`http://localhost:8000/po/${sale.id}`);
      const updatedSalesData = salesData.filter((_, i) => i !== index);
      setSalesData(updatedSalesData);
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
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

  const addInvoice = (invoiceNumber) =>
    setInvoices([...invoices, invoiceNumber]);

  const handleClose = () => setShowModal(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setDropdownOpen(false);
  };

  const toggleDropdownCustomerPO = () =>
    setDropdownOpenCustomerPO(!dropdownOpenCustomerPO);

  const handleCustomerPOSelect = (customerPO) => {
    setSelectedCustomerPO(customerPO);
    setDropdownOpenCustomerPO(false);
  };

  return (
    <>
      <h1>Manage Customer PO</h1>
      <StyledDiv>
        <DropdownContainer>
          <DropdownButton onClick={toggleDropdown}>
            {selectedCustomer || "Customer Name"}
          </DropdownButton>
          {dropdownOpen && (
            <DropdownOptions>
              {customers.map((customer) => (
                <Option
                  key={customer.id}
                  onClick={() => handleOptionClick(customer.name)}
                >
                  {customer.name}
                </Option>
              ))}
            </DropdownOptions>
          )}
        </DropdownContainer>
        <StyledLabel htmlFor="orderDate">Order Date:</StyledLabel>
        <StyledInput
          type="date"
          id="orderDate"
          value={selectedDate}
          onChange={handleDateChange}
        />
        <DropdownContainer>
          <DropdownButton onClick={toggleDropdownCustomerPO}>
            {selectedCustomerPO || "Customer PO"}
          </DropdownButton>
          {dropdownOpenCustomerPO && (
            <DropdownOptions>
              {customerPOs.map((customerPO, index) => (
                <Option
                  key={index}
                  onClick={() => handleCustomerPOSelect(customerPO)}
                >
                  {customerPO}
                </Option>
              ))}
            </DropdownOptions>
          )}
        </DropdownContainer>
        <ButtonContainer>
          <StyledButton onClick={handleSearch}>Search</StyledButton>
          <StyledButton onClick={handleSaleOrder}>Add Customer PO</StyledButton>
        </ButtonContainer>
      </StyledDiv>
      <div>
        <h3>Customer PO List</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table table-bordered table-striped">
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
              {salesData.map((sale, index) => (
                <React.Fragment key={index}>
                  {sale.item.map((item, itemIndex) => (
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
                              className="btns"
                            >
                              <BiEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(index)}
                              className="btns"
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
        )}
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
    </>
  );
}

export default Sales;
