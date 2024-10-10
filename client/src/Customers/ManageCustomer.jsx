import { useEffect, useState } from "react";
import AddCustomer from "./AddCustomer";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { BiSearch, BiAddToQueue } from "react-icons/bi";
import axios from "axios";
import { Tooltip, Pagination, Modal, Popconfirm } from "antd";
import "../Style/Customer.css";

function ManageCustomer() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Fetch customer data from API
  useEffect(() => {
    axios
      .get("https://final-oms.onrender.com/customer/getCustomerData")
      .then((result) => {
        setCustomers(result.data);
        setFilteredCustomers(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredCustomers(customers);
      setCurrentPage(1);
    } else {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = filteredCustomers.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleDelete = (email) => {
    axios
      .post("https://final-oms.onrender.com/customer/deleteCustomer", { email })
      .then((result) => {
        alert("Customer deleted successfully");
        setCustomers(customers.filter((customer) => customer.email !== email));
        setFilteredCustomers(
          filteredCustomers.filter((customer) => customer.email !== email)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
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
    setFilteredCustomers((prevCustomers) => {
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

  return (
    <>
      <div className="container">
        <h1>Manage Customers</h1>
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
            <button className="StyledButtonAdd" onClick={handleAddCustomer}>
              <BiAddToQueue /> Add Customer
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <h2>Customer List</h2>
          <table className="table table-bordered table-striped table-hover shadow">
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
              {currentData.map((customer) => (
                <tr key={customer.email}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.area}</td>
                  <td>{customer.status}</td>
                  <td>
                    <div className="button-group">
                      <Tooltip
                        title="Edit"
                        overlayInnerStyle={{
                          backgroundColor: "rgb(41, 10, 244)",
                          color: "white",
                          borderRadius: "10%",
                        }}
                      >
                        <button
                          className="btns1"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <BiSolidEdit />
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
                          placement="topLeft"
                          description="Are you sure to delete this customer?"
                          onConfirm={() => handleDelete(customer.email)}
                          okText="Delete"
                        >
                          <button className="btns2">
                            <MdDelete />
                          </button>
                        </Popconfirm>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            current={currentPage}
            total={filteredCustomers.length}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>

        <Modal
          open={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          footer={null}
        ></Modal>

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
