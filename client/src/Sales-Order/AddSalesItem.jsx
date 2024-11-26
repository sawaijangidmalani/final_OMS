import { BiEdit, BiTrash } from "react-icons/bi";
import axios from "axios";
import { useState, useEffect } from "react";
import "../Style/Customer.css";
import { Tooltip, Popconfirm, Pagination } from "antd";
import AddorEditCustomer from "./AddorEditCustomer.jsx";

function AddSalesItem() {
  const [itemsData, setItemsData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItemsData();
  }, []);

  const fetchItemsData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/customerpo/getcustomersalesorderitems"
      );
      if (res.data && res.data.data) {
        setItemsData(res.data.data);
        calculateTotal(res.data.data);
      } else {
        console.error("No data found in the response.");
      }
    } catch (err) {
      console.error("Error fetching items data:", err);
    }
  };

  const calculateTotal = (items) => {
    const newTotal = items.reduce((acc, item) => {
      const unitCost = parseFloat(item.UnitCost) || 0;
      const tax = parseFloat(item.Tax) || 0;
      const salesQty = parseFloat(item.SalesQty) || 0;

      const itemTotal = salesQty * (unitCost + (unitCost * tax) / 100);
      return acc + itemTotal;
    }, 0);

    setTotal(newTotal.toFixed(2));
  };

  const handleDelete = async (itemID) => {
    try {
      await axios.delete(
        `http://localhost:8000/customerpo/deleteItem/${itemID}`
      );
      fetchItemsData();
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item! Please try again.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUpdate = (item) => {
    setEditingItem(item);
  };

  const paginatedData = itemsData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover shadow">
        <thead className="table-secondary">
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Cost</th>
            <th>Tax (%)</th>
            <th>Sales Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.ItemName}</td>
              <td>{item.SalesQty}</td>
              <td>{item.UnitCost}</td>
              <td>{item.Tax}</td>
              <td>{item.SalesPrice}</td>
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
                      onClick={() => handleUpdate(item)}
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
                      description="Are you sure to delete this item?"
                      onConfirm={() => handleDelete(item.ItemID)}
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

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={itemsData.length}
        onChange={handlePageChange}
      />
      <div>
        <p>
          <b>Total:</b> <span style={{ paddingLeft: "15px" }}>{total}</span>
        </p>
      </div>

      {editingItem && (
        <AddorEditCustomer
          onClose={() => setEditingItem(false)}
          onSalesOrderItemData={fetchItemsData}
          refreshItemsData={fetchItemsData}
          itemToEdit={editingItem}
        />
      )}
    </div>
  );
}

export default AddSalesItem;
