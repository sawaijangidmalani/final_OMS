import React, { useState, useEffect } from "react";
import AddItem from "./AddItem";
import ItemStockUtilization from "./ItemStockUtilization.jsx";
import ItemPrice from "./ItemPrice";
import {
  BiInfoCircle,
  BiPackage,
  BiSolidEdit,
  BiSearch,
  BiAddToQueue,
  BiUpArrowAlt,
  BiDownArrowAlt,
} from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { Tooltip, Pagination, Popconfirm } from "antd";
import "../Style/Customer.css";

function ManageItem() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [searchTermItem, setSearchTermItem] = useState("");
  const [searchTermSupplier, setSearchTermSupplier] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [showStocks, setShowStocks] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", order: "asc" });

  useEffect(() => {
    axios.get("https://final-oms.onrender.com/item/getItems").then((data) => {
      if (!data?.data?.error) {
        setItems(data?.data?.data);
        setFilteredItems(data?.data?.data);
      }
    });
  }, []);

  const handleShowStock = (item) => {
    setSelectedItemName(item.name);
    setShowStocks(true);
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredItems(items);
      setCurrentPage(1);
    } else {
      handleSearch();
    }
  };

  const handleItemSelect = (itemName) => {
    setSelectedItem(itemName);
    setIsItemDropdownOpen(false);
    filterItems(itemName, selectedSupplier);
  };

  const handleSupplierSelect = (supplierName) => {
    setSelectedSupplier(supplierName);
    setIsSupplierDropdownOpen(false);
    filterItems(selectedItem, supplierName);
  };

  const handleSearch = () => {
    const filtered = items.filter(
      (item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.includes(searchTerm) ||
        item.unit.includes(searchTerm)
    );

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const filterItems = (itemName, supplierName) => {
    const filtered = items.filter(
      (item) =>
        (itemName ? item.name === itemName : true) &&
        (supplierName ? item.supplier === supplierName : true)
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleSearchChangeItem = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTermItem(value);

    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(value)
    );

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleSearchChangeSupplier = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTermSupplier(value);

    const filtered = items.filter((item) =>
      item.supplier.toLowerCase().includes(value)
    );

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.order === "asc" ? <BiUpArrowAlt /> : <BiDownArrowAlt />;
    }
    return null;
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = filteredItems.slice(startIndex, startIndex + pageSize);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    const newOrder = sortConfig.order === "asc" ? "desc" : "asc";
    setSortConfig({ key, order: newOrder });

    const sortedItems = [...filteredItems].sort((a, b) => {
      if (a[key] < b[key]) return newOrder === "asc" ? -1 : 1;
      if (a[key] > b[key]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredItems(sortedItems);
  };

  const handleDelete = (name) => {
    axios
      .delete("https://final-oms.onrender.com/item/deleteItems", {
        data: { name: name },
      })
      .then(() => {
        alert("Item deleted successfully");
        setItems((prevItems) => prevItems.filter((item) => item.name !== name));
        setFilteredItems((prevItems) =>
          prevItems.filter((item) => item.name !== name)
        );
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
        alert("Failed to delete item");
      });
  };

  const toggleSupplierDropdown = () => {
    setIsSupplierDropdownOpen(!isSupplierDropdownOpen);
    setIsItemDropdownOpen(false);
  };

  const toggleItemDropdown = () => {
    setIsItemDropdownOpen(!isItemDropdownOpen);
    setIsSupplierDropdownOpen(false);
  };

  const handleAddItem = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="container">
        <h1>Manage Items</h1>
        <div className="StyledDiv">
          <div className="LeftContainer">
            <div className="dropdowncontainer">
              <button className="dropdownbutton" onClick={toggleItemDropdown}>
                {selectedItem || "Select Item"}
              </button>
              {isItemDropdownOpen && (
                <div className="dropdownoption">
                  <input
                    type="text"
                    placeholder="Search Item..."
                    value={searchTermItem}
                    onChange={handleSearchChangeItem}
                    className="search-input"
                  />
                  {items
                    .filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(searchTermItem.toLowerCase())
                    )
                    .map((item) => (
                      <div
                        className="option"
                        key={item.id}
                        onClick={() => handleItemSelect(item.name)}
                      >
                        {item.name}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="dropdowncontainer">
              <button
                className="dropdownbutton"
                onClick={toggleSupplierDropdown}
              >
                {selectedSupplier || "Select Supplier"}
              </button>
              {isSupplierDropdownOpen && (
                <div className="dropdownoption">
                  <input
                    type="text"
                    placeholder="Search Supplier..."
                    value={searchTermSupplier}
                    onChange={handleSearchChangeSupplier}
                    className="search-input"
                  />
                  {items
                    .filter((item) =>
                      item.supplier
                        .toLowerCase()
                        .includes(searchTermSupplier.toLowerCase())
                    )
                    .map((item) => (
                      <div
                        className="option"
                        key={item.id}
                        onClick={() => handleSupplierSelect(item.supplier)}
                      >
                        {item.supplier}
                      </div>
                    ))}
                </div>
              )}
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
          </div>
          <div className="RightContainer">
            <button className="StyledButtonAdd" onClick={handleAddItem}>
              <BiAddToQueue /> Add Item
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <h2>Item List</h2>
          <table className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th onClick={() => handleSort("item name")}>
                  Item Name {getSortArrow("item name")}
                </th>

                <th onClick={() => handleSort("supplier")}>
                  Supplier {getSortArrow("supplier")}
                </th>
                <th onClick={() => handleSort("category")}>
                  Category {getSortArrow("category")}
                </th>

                <th onClick={() => handleSort("brand")}>
                  Brand {getSortArrow("brand")}
                </th>

                <th onClick={() => handleSort("description")}>
                  Description {getSortArrow("description")}
                </th>

                <th onClick={() => handleSort("unit")}>
                  Unit {getSortArrow("unit")}
                </th>

                <th onClick={() => handleSort("status")}>
                  Status {getSortArrow("status")}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
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
                          borderRadius: "5px",
                        }}
                      >
                        <button
                          className="btns1"
                          onClick={() => handleEditItem(item)}
                        >
                          <BiSolidEdit />
                        </button>
                      </Tooltip>
                      <Tooltip
                        title="Stock"
                        overlayInnerStyle={{
                          backgroundColor: "rgb(41, 10, 244)",
                          color: "white",
                          borderRadius: "5px",
                        }}
                      >
                        <button
                          className="btns1"
                          onClick={() => handleShowStock(item)}
                        >
                          <BiPackage />
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
                          description="Are you sure to delete this item?"
                          onConfirm={() => handleDelete(item.name)}
                          okText="Delete"
                        >
                          <button className="btns1">
                            <MdDelete />
                          </button>
                        </Popconfirm>
                      </Tooltip>

                      <Tooltip
                        title="Stock Utilization"
                        overlayInnerStyle={{
                          backgroundColor: "rgb(41, 10, 244)",
                          color: "white",
                          borderRadius: "5px",
                        }}
                      >
                        <button
                          className="btns1"
                          onClick={() => setShowStock(true)}
                        >
                          <BiInfoCircle />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredItems.length}
            onChange={onPageChange}
          />
        </div>
      </div>
      {showModal && (
        <AddItem
          visible={showModal}
          editItem={editItem}
          onClose={handleClose}
          closeModal={closeModal}
        />
      )}
      {showStock && <ItemStockUtilization />}
      {showStocks && (
        <ItemPrice
          handleClose={() => setShowStocks(false)}
          selectedItemName={selectedItemName}
        />
      )}
    </>
  );
}

export default ManageItem;
