import { BiEdit, BiTrash } from "react-icons/bi";
import axios from "axios";
import { useState, useEffect } from "react";
import "../Style/Customer.css";
import { Tooltip,  Popconfirm } from "antd";

function AddSalesItem({ items, handleDeleteItem }) {
  const [itemsData, setItemsData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:8000/item/getItems")
      .then((res) => {
        // setItemsData(res.data.data); 
        console.log(res.data.data); 
      })
      .catch(err => {
        console.error("Error fetching products:", err);
      });
  }, []);

  const handleDelete = (unitcost) => {
    // Call API to delete item by unit cost
    axios
      .delete(`http://localhost:8000/customerpo/delete`, {
        data: { unitcost },
      })
      .then((response) => {
        console.log("Item deleted successfully");
        // Update state after deletion
        setItemsData((prevItems) =>
          prevItems.filter((item) => item.unitcost !== unitcost)
        );
        const newTotal = itemsData
          .filter((item) => item.unitcost !== unitcost)
          .reduce((acc, item) => acc + (item.cost || 0), 0);
        setTotal(newTotal);
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  const handleUpdate = (invoice, cost) => {
    console.log(`Edit clicked for Invoice: ${invoice}, Cost: ${cost}`);
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover shadow">
      <thead className="table-secondary">
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Cost</th>
            <th>Tax</th>
            <th>Sales Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {itemsData.map((item, index) => (
            <tr key={index}>
              <td>{item.Name}</td>
              <td>{item.quantity}</td>
              <td>{item.unitcost}</td>
              <td>{item.tax}</td>
              <td>{item.cost}</td>
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
                        <button className="btns1"
                  onClick={() => handleUpdate(item.invoice, item.cost)}
                >
                  <BiEdit/>
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
                          onConfirm={() => handleDelete(item.unitcost)}
                          okText="Delete"
                        >

        <button className="btns2">
                <BiTrash/>
                  
                </button>
                </Popconfirm>
                </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p>
          Total: <span style={{ paddingLeft: "20px" }}>{total}</span>
        </p>
      </div>
    </div>
  );
}

export default AddSalesItem;
