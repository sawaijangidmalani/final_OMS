// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import SalesOrder from "./SalesOrder";
// import { BiEdit, BiTrash } from "react-icons/bi";
// import EditCustomerPO from "./EditCustomePO";
// import axios from "axios";
// import "../Style/Customer.css";

// const Modal = styled.div`
//   position: absolute;
//   top: 45%;
//   left: 50%;
//   background-color: #eceeef;
//   height: auto;
//   position: absolute;
//   box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
//   border-radius: 10px;
// `;

// const StyledModel = styled.div`
//   position: fixed;
//   background-color: rgba(0, 0, 0, 0.5);
//   position: fixed;
//   z-index: 100;
//   top: 5%;
//   left: 35%;
//   border-radius: 20px;
// `;

// const StyledLabel = styled.label`
//   font-size: 16px;
//   margin: 10px;
// `;

// const StyledInput = styled.input`
//   width: 200px;
//   height: 40px;
//   background-color: white;
//   color: #333;
//   padding-left: 10px;
//   font-size: 16px;
//   border: none;
//   border-radius: 5px;
//   margin: 10px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// `;

// function ManageCPO() {
//   const [customers, setCustomers] = useState();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [invoices, setInvoices] = useState();
//   const [customerPOs, setCustomerPOs] = useState();
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState();
//   const [selectedCustomerPO, setSelectedCustomerPO] = useState();
//   const [salesData, setSalesData] = useState([]);
//   const [dropdownOpenCustomerPO, setDropdownOpenCustomerPO] = useState(false);
//   const [selectedSaleIndex, setSelectedSaleIndex] = useState(null);
//   const [newCustomer, setNewCustomer] = useState({
//     id: "",
//     name: "",
//     email: "",
//     phone: "",
//     area: "",
//     status: "Active",
//   });
//   console.log(salesData);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedSalesData = localStorage.getItem("salesData");

//         if (storedSalesData) {
//           setSalesData(JSON.parse(storedSalesData));
//         }

//         const response = await axios.get(
//           "http://localhost:8000/customerpo/getCustomerPo"
//         );
//         const fetchedData = response.data;

//         setSalesData(fetchedData);
//         localStorage.setItem("salesData", JSON.stringify(fetchedData));
//       } catch (error) {
//         console.error("Error fetching sales data:", error);

//         if (error.response) {
//           console.error("Server Response:", error.response.data);
//           console.error("Status Code:", error.response.status);
//         } else if (error.request) {
//           console.error("Request Info:", error.request);
//         } else {
//           console.error("Error Message:", error.message);
//         }
//       }
//     };

//     fetchData();
//   }, []);

//   const handleDateChange = (event) => {
//     setSelectedDate(event.target.value);
//   };

//   const handleCustomerChange = (event) => {
//     setSelectedCustomer(event.target.value);
//   };

//   const handleCustomerPOChange = (event) => {
//     setSelectedCustomerPO(event.target.value);
//   };

//   const handleSearch = () => {};

//   const handleSaleOrder = () => {
//     setSelectedSaleIndex(null);
//     setShowModal(true);
//   };

//   const handleSalesData = (data) => {
//     if (selectedSaleIndex !== null) {
//       const updatedSalesData = [...salesData];
//       updatedSalesData[selectedSaleIndex] = data;
//       setSalesData(updatedSalesData);
//       setSelectedSaleIndex(null);
//     } else {
//       setSalesData([...salesData, data]);
//     }
//     setShowModal(false);
//   };

//   const handleEdit = (index) => {
//     setSelectedSaleIndex(index);
//     setShowModal(true);
//   };

//   const handleDelete = (index) => {
//     const updatedSalesData = [...salesData];
//     updatedSalesData.splice(index, 1);
//     setSalesData(updatedSalesData);
//   };

//   const handleNewCustomerChange = (e) => {
//     const { name, value } = e.target;
//     setNewCustomer({ ...newCustomer, [name]: value });
//   };

//   const addCustomer = (customerName) => {
//     const newCustomer = {
//       id: customers.length + 1,
//       name: customerName,
//       email: "",
//       phone: "",
//       area: "",
//       status: "Active",
//     };
//     setCustomers([...customers, newCustomer]);
//   };

//   const addInvoice = (invoiceNumber) => {
//     setInvoices([...invoices, invoiceNumber]);
//   };

//   const handleClose = () => {
//     setShowModal(false);
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleOptionClick = (option) => {
//     setSearchTerm(option);
//     setDropdownOpen(false);
//   };

//   const toggleDropdownCustomerPO = () => {
//     setDropdownOpenCustomerPO(!dropdownOpenCustomerPO);
//   };

//   const handleCustomerPOSelect = (customerPO) => {
//     setSelectedCustomerPO(customerPO);
//     setDropdownOpenCustomerPO(false);
//   };

//   return (
//     <>
//       <div className="container">
//         <h1>Manage Customer PO</h1>
//         <div className="StyledDiv">
//           <div className="LeftContainer">
//             <div className="dropdowncontainer">
//               <button className="dropdownbutton" onClick={toggleDropdown}>
//                 {selectedCustomer || "Customer Name"}
//               </button>

//               {dropdownOpen && (
//                 <div className="dropdownoption">
//                   {customers.map((customer) => (
//                     <div
//                       className="option"
//                       key={customer.CustomerID}
//                       onClick={() => handleOptionClick(customer.Name)}
//                     >
//                       {customer.Name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="dropdowncontainer">
//               <button
//                 className="dropdownbutton"
//                 onClick={toggleDropdownCustomerPO}
//               >
//                 {selectedCustomerPO || "Customer PO"}
//               </button>
//               {dropdownOpenCustomerPO && (
//                 <div className="dropdownoption">
//                   {customerPOs.map((customerPO, index) => (
//                     <div
//                       className="option"
//                       key={index}
//                       onClick={() => handleCustomerPOSelect(customerPO)}
//                     >
//                       {customerPO}
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <label htmlFor="orderDate">
//                 Order Date:
//                 <input
//                   className="StyledIn"
//                   type="date"
//                   id="orderDate"
//                   value={selectedDate}
//                   onChange={handleDateChange}
//                 />
//               </label>

//               <button className="StyledButtonSearch" onClick={handleSearch}>
//                 Search
//               </button>
//             </div>

//             <div className="RightContainer">
//               <button className="StyledButtonAdd" onClick={handleSaleOrder}>
//                 Add Cus. PO
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="table-responsive">
//           <h3>Customer PO List</h3>
//           <table className="table table-bordered table-striped table-hover shadow">
//             <thead className="table-secondary">
//               <tr>
//                 <th>Customer Name</th>
//                 <th>Customer PO</th>
//                 <th>Date</th>
//                 <th>Total</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {salesData.map((item, itemIndex) => (
//                 <tr key={itemIndex}>
//                   <td>{item.CustomerID}</td>
//                   <td>{item.SalesOrderNumber}</td>
//                   <td>{item.SalesDate}</td>
//                   <td>{item.SalesTotalPrice}</td>
//                   <td>{item.Status === 1 ? "Draft" : "Approval"}</td>
//                   <td>
//                     <div className="buttons-group">
//                       <button
//                         onClick={() => handleEdit(index)}
//                         className="btns1"
//                       >
//                         <BiEdit />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(index)}
//                         className="btns2"
//                       >
//                         <BiTrash />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {showModal && (
//           <StyledModel>
//             <Modal>
//               {selectedSaleIndex !== null ? (
//                 <EditCustomerPO
//                   onSalesData={handleSalesData}
//                   saleData={salesData[selectedSaleIndex]}
//                   customers={customers}
//                 />
//               ) : (
//                 <SalesOrder
//                   onSalesData={handleSalesData}
//                   addCustomer={addCustomer}
//                   addInvoice={addInvoice}
//                   onClose={handleClose}
//                 />
//               )}
//             </Modal>
//           </StyledModel>
//         )}
//       </div>
//     </>
//   );
// }

// export default ManageCPO;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SalesOrder from "./SalesOrder";
import { BiEdit, BiTrash } from "react-icons/bi";
import EditCustomerPO from "./EditCustomePO";
import axios from "axios";
import "../Style/Customer.css";
import { BiSearch, BiAddToQueue } from "react-icons/bi";
import { Tooltip, Popconfirm } from "antd";

const Modal = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  background-color: #eceeef;
  height: auto;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`;

const StyledModel = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

function ManageCPO() {
  const [customers, setCustomers] = useState([]);
  const [customerPOs, setCustomerPOs] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerPO, setSelectedCustomerPO] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSaleIndex, setSelectedSaleIndex] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenCustomerPO, setDropdownOpenCustomerPO] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/customerpo/getCustomerPo"
        );
        setSalesData(response.data);
        setFilteredData(response.data); 
        setCustomers(response.data.map((item) => item.CustomerID)); 
        setCustomerPOs(response.data.map((item) => item.SalesOrderNumber)); 
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (index) => {
    const customerSalesOrderID = filteredData[index].CustomerSalesOrderID; 

    try {
      const response = await fetch(
        "http://localhost:8000/customerpo/deleteCustomerPo",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ CustomerSalesOrderID: customerSalesOrderID }),
        }
      );

      if (response.ok) {
        alert("Sales order deleted successfully.");
        const updatedSalesData = [...salesData];
        updatedSalesData.splice(index, 1);
        setSalesData(updatedSalesData);
        setFilteredData(updatedSalesData);
      } else if (response.status === 404) {
        alert("Sales order not found.");
      } else {
        alert("An error occurred while deleting the sales order.");
      }
    } catch (error) {
      console.error("Error deleting sales order:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setDropdownOpen(false);
  };

  const handleCustomerPOSelect = (customerPO) => {
    setSelectedCustomerPO(customerPO);
    setDropdownOpenCustomerPO(false);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleDropdownCustomerPO = () =>
    setDropdownOpenCustomerPO(!dropdownOpenCustomerPO);

  const handleSearch = () => {
    let filtered = salesData;

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be later than end date!");
      return;
    }

    // Apply date filter
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const saleDate = new Date(item.SalesDate);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
      });
    }

    // Apply customer filter
    if (selectedCustomer) {
      filtered = filtered.filter(
        (item) => item.CustomerID === selectedCustomer
      );
    }

    // Apply customer PO filter
    if (selectedCustomerPO) {
      filtered = filtered.filter(
        (item) => item.SalesOrderNumber === selectedCustomerPO
      );
    }

    setFilteredData(filtered);
  };

  const handleEdit = (index) => {
    setSelectedSaleIndex(index);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="container">
      <h1>Manage Customer PO</h1>
      <div className="StyledDiv">
        <div className="LeftContainer">
          <div className="dropdowncontainer">
            <button className="StyledIn" onClick={toggleDropdown}>
              {selectedCustomer || "Select Customer"}
            </button>
            {dropdownOpen && (
              <div className="dropdownoption">
                {customers.map((customer, index) => (
                  <div
                    key={index}
                    className="option"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    {customer}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dropdowncontainer">
            <button
              // className="dropdownbutton"
              className="StyledIn"
              onClick={toggleDropdownCustomerPO}
            >
              {selectedCustomerPO || "Select CPO"}
            </button>
            {dropdownOpenCustomerPO && (
              <div className="dropdownoption">
                {customerPOs.map((po, index) => (
                  <div
                    key={index}
                    className="option"
                    onClick={() => handleCustomerPOSelect(po)}
                  >
                    {po}
                  </div>
                ))}
              </div>
            )}
          </div>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="StyledIn"
          />
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="StyledIn"
          />
          <button
            className="StyledButtonSearch"
            onClick={handleSearch}
            style={{ marginLeft: "10px" }}
          >
            <BiSearch />
            Search
          </button>
        </div>

        <div className="RightContainer">
          <button
            className="StyledButtonAdd"
            onClick={() => setShowModal(true)}
          >
            <BiAddToQueue /> Add CPO
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <h3>Customer PO List</h3>
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
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.CustomerID}</td>
                <td>{item.SalesOrderNumber}</td>
                {/* <td>{item.SalesDate}</td> */}
                <td>{new Date(item.SalesDate).toLocaleDateString()}</td>
                <td>{item.SalesTotalPrice}</td>
                <td>{item.Status === 1 ? "Draft" : "Approval"}</td>
                <td>
                  <div className="buttons-group">
                    <Tooltip
                      title="Edit"
                      overlayInnerStyle={{
                        backgroundColor: "rgb(41, 10, 244)",
                        color: "white",
                        borderRadius: "5px",
                      }}
                    >
                      <button
                        onClick={() => handleEdit(index)}
                        className="btns1"
                      >
                        <BiEdit />
                      </button>
                    </Tooltip>

                    <Tooltip
                      title="Delete"
                      overlayInnerStyle={{
                        backgroundColor: "rgb(244, 10, 10)",
                        color: "white",
                        borderRadius: "5px",
                      }}
                    >
                      <Popconfirm
                        placement="topLeft"
                        description="Are you sure to delete this CPO?"
                        onConfirm={() => handleDelete(index)}
                        okText="Delete"
                      >
                        <button className="btns2">
                          <BiTrash />
                        </button>
                      </Popconfirm>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <StyledModel>
          <Modal>
            {selectedSaleIndex !== null ? (
              <EditCustomerPO
                onSalesData={(data) => {
                  const updatedSalesData = [...salesData];
                  updatedSalesData[selectedSaleIndex] = data;
                  setSalesData(updatedSalesData);
                  setFilteredData(updatedSalesData);
                  setShowModal(false);
                }}
                saleData={salesData[selectedSaleIndex]}
              />
            ) : (
              <SalesOrder
                onSalesData={(data) => {
                  const newSalesData = [...salesData, data];
                  setSalesData(newSalesData);
                  setFilteredData(newSalesData);
                  setShowModal(false);
                }}
                onClose={handleClose}
              />
            )}
          </Modal>
        </StyledModel>
      )}
    </div>
  );
}

export default ManageCPO;
