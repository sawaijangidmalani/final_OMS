import { useState, useEffect } from "react";
import AddSuppliers from "./AddSuppliers";
import { BiAddToQueue, BiSolidEdit, BiSearch, BiUpArrowAlt, BiDownArrowAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { Tooltip, Pagination, Modal, Popconfirm } from "antd";
import "../Style/Manage.css";

function ManageSupplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSuppliers, setEditingSuppliers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  
  const [sortConfig, setSortConfig] = useState({ key: "", order: "asc" });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data } = await axios.get(
          "https://final-oms.onrender.com/supplier/getSuppliers"
        );
        if (data?.status) {
          setSuppliers(data.data);
          setFilteredSuppliers(data.data);
        } else {
          alert("Failed to fetch supplier data");
        }
      } catch (e) {
        console.error(e);
        alert("An error occurred while fetching the supplier data");
      }
    };

    fetchSuppliers();
  }, []);

  const handleSearch = () => {
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.includes(searchTerm)
    );
    setFilteredSuppliers(filtered);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredSuppliers(suppliers);
      setCurrentPage(1);
    } else {
      handleSearch();
    }
  };

  const handleSort = (key) => {
    const newOrder = sortConfig.order === "asc" ? "desc" : "asc";
    setSortConfig({ key, order: newOrder });

    const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
      if (a[key] < b[key]) return newOrder === "asc" ? -1 : 1;
      if (a[key] > b[key]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredSuppliers(sortedSuppliers);
  };

  const handleDelete = (email) => {
    axios
      .delete("https://final-oms.onrender.com/supplier/deleteSupplier", {
        data: { email },
      })
      .then(() => {
        alert("Supplier deleted successfully");
        setSuppliers((prev) => prev.filter((s) => s.email !== email));
        setFilteredSuppliers((prev) => prev.filter((s) => s.email !== email));
      })
      .catch((error) => {
        console.error("There was an error deleting the supplier!", error);
      });
  };

  const handleAddSupplier = () => {
    setEditingSuppliers(null);
    setShowModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSuppliers(supplier);
    setShowModal(true);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const updateSupplierList = (newSupplier) => {
    setSuppliers((prev) =>
      editingSuppliers
        ? prev.map((s) => (s.id === newSupplier.id ? newSupplier : s))
        : [...prev, newSupplier]
    );
    setFilteredSuppliers((prev) =>
      editingSuppliers
        ? prev.map((s) => (s.id === newSupplier.id ? newSupplier : s))
        : [...prev, newSupplier]
    );
    setShowModal(false);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedSuppliers = filteredSuppliers.slice(
    startIndex,
    startIndex + pageSize
  );

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.order === "asc" ? <BiUpArrowAlt /> : <BiDownArrowAlt />;
    }
    return null;
  };

  return (
    <>
      <div className="container">
        <h1>Manage Suppliers</h1>
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
            <button className="StyledButtonAdd" onClick={handleAddSupplier}>
              <BiAddToQueue /> Add Supplier
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <h2>Suppliers List</h2>
          <table className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th onClick={() => handleSort("name")}>
                  Name {getSortArrow("name")}
                </th>
                <th onClick={() => handleSort("email")}>
                  Email {getSortArrow("email")}
                </th>
                <th onClick={() => handleSort("phone")}>
                  Phone {getSortArrow("phone")}
                </th>
                <th>Area</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSuppliers.map((supplier) => (
                <tr key={supplier.email}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.area}</td>
                  <td>{supplier.status}</td>
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
                          className="btns1"
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <BiSolidEdit />
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
                          description="Are you sure to delete this supplier?"
                          onConfirm={() => handleDelete(supplier.email)}
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
            total={filteredSuppliers.length}
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
          <AddSuppliers
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            closeModal={closeModal}
            editingSuppliers={editingSuppliers}
            updateSupplierList={updateSupplierList}
          />
        )}
      </div>
    </>
  );
}

export default ManageSupplier;
