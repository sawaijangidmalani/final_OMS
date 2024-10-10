import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PurchaseOrder from "./PurchaseOrder";
import EditPurchaseOrder from "./EditPurchaseOrder";
import { BiEdit, BiTrash } from "react-icons/bi";
import axios from "axios";
import { BiSearch, BiAddToQueue } from "react-icons/bi";
import { Popconfirm, Tooltip } from "antd";

const initialSuppliers = [
  {
    id: 1,
    name: "Admin",
    email: "supplier1@example.com",
    phone: "123-456-7890",
    area: "Area 1",
    status: "Active",
  },
  {
    id: 2,
    name: "Test",
    email: "supplier2@example.com",
    phone: "234-567-8901",
    area: "Area 2",
    status: "Inactive",
  },
];

const initialPurchaseOrders = ["PO 01", "PO 02", "PO 03"];
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
  height: 100vh;
  background-color: none;
  backdrop-filter: blur(2px);
`;

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledSelect = styled.select`
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

const Option = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

function ManagePurchase() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [purchaseOrders] = useState(initialPurchaseOrders);
  const [customerPOs] = useState(initialCustomerPOs);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [purchaseData, setPurchaseData] = useState([]);
  const [selectedPurchaseIndex, setSelectedPurchaseIndex] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPurchaseData, setSelectedPurchaseData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    axios
      .get("https://final-oms.onrender.com/po/getpo")
      .then((response) => {
        setPurchaseData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
    const storedPurchaseData = localStorage.getItem("purchaseData");
    if (storedPurchaseData) {
      setPurchaseData(JSON.parse(storedPurchaseData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("purchaseData", JSON.stringify(purchaseData));
  }, [purchaseData]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddPurchaseOrder = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSearch = () => {};

  const handlePurchaseOrder = () => {
    setShowModal(true);
  };

  const handlePurchaseData = (data) => {
    if (selectedPurchaseIndex !== null) {
      const updatedPurchaseData = [...purchaseData];
      updatedPurchaseData[selectedPurchaseIndex] = data;
      setPurchaseData(updatedPurchaseData);
      setSelectedPurchaseIndex(null);
    } else {
      setPurchaseData([...purchaseData, data]);
    }
    setShowModal(false);
    setEditModalVisible(false);
  };

  const handleEdit = (index) => {
    setSelectedPurchaseIndex(index);
    setSelectedPurchaseData(purchaseData[index]);
    setEditModalVisible(true);
  };

  const handleDelete = async (status, name) => {
    try {
      const response = await axios.delete(
        "https://final-oms.onrender.com/po/deletepo",
        {
          data: { name, status },
        }
      );
      console.log("Success:", response.data);
    } catch (error) {
      console.error(
        "Error deleting purchase order:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setSelectedPurchaseIndex(null);
    setSelectedPurchaseData(null);
  };

  return (
    <>
      <div className="container">
        <h1>Manage Purchases</h1>
        <div className="StyledDiv">
          <div className="ButtonContainer">
            <div>
              <input
                className="StyledIn"
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search"
              />
              <button className="StyledButtonSearch" onClick={handleSearch}>
                <BiSearch /> Search
              </button>
            </div>
            <button
              className="StyledButtonAdd"
              onClick={handleAddPurchaseOrder}
            >
              <BiAddToQueue /> Add Purchase Order
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <h2>Purchase List</h2>
          <table className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th>Customer Name</th>
                <th>Purchase Order </th>
                <th>Customer PO</th>
                <th>Date</th>
                <th>Total Purchase</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {purchaseData.map((purchase, index) => (
                <tr key={index}>
                  <td>{purchase.customer}</td>
                  <td>{purchase.po}</td>
                  <td>{purchase.co}</td>
                  <td>{purchase.date}</td>
                  <td>{purchase.totalpurchase}</td>
                  {/* <td>
                    {purchase.item && purchase.item[0]
                      ? purchase.item[0].price
                      : "N/A"}
                  </td> */}
                  <td>{purchase.status}</td>
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
                        <button
                          onClick={() => handleEdit(index)}
                          className="btns"
                        >
                          <BiEdit />
                        </button>
                      </Tooltip>
                      <Tooltip
                        title="Delete"
                        overlayInnerStyle={{
                          backgroundColor: "rgb(244, 10, 10)",
                          color: "white",
                          borderRadius: "10%",
                        }}
                      >
                        <Popconfirm
                        placement="topleft"
                        description="Are you sure to delete this PO"
                        onConfirm={() => handleDelete(purchase.ana, purchase.customer)}
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
              <PurchaseOrder
                onPurchaseData={handlePurchaseData}
                purchaseData={
                  selectedPurchaseIndex !== null
                    ? purchaseData[selectedPurchaseIndex]
                    : null
                }
              />
            </Modal>
          </StyledModel>
        )}
        {editModalVisible && selectedPurchaseData && (
          <StyledModel>
            <Modal>
              <EditPurchaseOrder
                suppliers={suppliers}
                purchaseOrders={purchaseOrders}
                customerPOs={customerPOs}
                initialData={selectedPurchaseData}
                onSave={handlePurchaseData}
                onCancel={handleCancelEdit}
              />
            </Modal>
          </StyledModel>
        )}
      </div>
    </>
  );
}

export default ManagePurchase;
