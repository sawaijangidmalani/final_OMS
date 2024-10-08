import styled from "styled-components";
import { BiEdit, BiTrash } from "react-icons/bi";
import axios from "axios";
import { useState, useEffect } from "react";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const HeadTr = styled(Tr)`
  background-color: #5c9c5e;
  color: white;
`;

function AddSalesItem({ items, handleDeleteItem }) {
  const [itemsData, setItemsData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Fetch customer PO data when the component mounts
    axios
      .get("https://final-oms.onrender.com/customerpo/getCustomerPo")
      .then((res) => {
        setItemsData(res.data);
        const totalCost = res.data.reduce(
          (acc, item) => acc + (item.cost || 0),
          0
        );
        setTotal(totalCost);
      })
      .catch((error) => {
        console.error("Error fetching customer PO data:", error);
      });
  }, []);

  const handleDelete = (unitcost) => {
    // Call API to delete item by unit cost
    axios
      .delete(`https://final-oms.onrender.com/customerpo/delete`, {
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
    // Handle the update action here (you can implement your own logic)
    console.log(`Edit clicked for Invoice: ${invoice}, Cost: ${cost}`);
    // You can implement modal opening, form for update, or API call
  };

  return (
    <>
      <Table className="table table-bordered table-striped table-hover shadow">
        <thead>
          <HeadTr>
            <Th>Item</Th>
            <Th>Qty</Th>
            <Th>Unit Cost</Th>
            <Th>Tax</Th>
            <Th>Sales Price</Th>
            <Th>Action</Th>
          </HeadTr>
        </thead>
        <tbody>
          {itemsData.map((item, index) => (
            <Tr key={index}>
              <Td>{item.name}</Td>
              <Td>{item.quantity}</Td>
              <Td>{item.unitcost}</Td>
              <Td>{item.tax}</Td>
              <Td>{item.cost}</Td>
              <Td>
                <BiEdit
                  onClick={() => handleUpdate(item.invoice, item.cost)}
                  style={{ marginRight: "10px", cursor: "pointer" }}
                />

                <BiTrash
                  onClick={() => handleDelete(item.unitcost)}
                  style={{ cursor: "pointer" }}
                />
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <div>
        <p>
          Total: <span style={{ paddingLeft: "20px" }}>{total}</span>
        </p>
      </div>
    </>
  );
}

export default AddSalesItem;
