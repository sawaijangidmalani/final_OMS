import { Input } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";

// function isDateString(dateString) {
//   return !isNaN(Date.parse(dateString));
// }

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const StyledDv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  gap: 10px;
`;

const StyledTable = styled.table`
  width: 370px;
  font-size: 18px;
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

function Dashboard() {
  const [purchase, setItem] = useState([]);
  const [sales, setSale] = useState([]);
  const [rems, setRem] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/po/getpo")
      .then((res) => {
        setItem(res.data);
      })
      .catch((error) => {
        console.error("Error fetching purchase orders:", error);
      });

    axios
      .get("http://localhost:8000/customerPo/getCustomerPo")
      .then((res) => {
        setSale(res.data);
      })
      .catch((error) => {
        console.error("Error fetching customer POs:", error);
      });
    axios
      .get("http://localhost:8000/customerPo/getRemainingPurchaseOrder")
      .then((res) => {
        if (res.data.success) {
          setRem(res.data.data);
        } else {
          console.error("Error: No data found");
          setRem([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching remaining purchase orders:", error);
        setRem([]);
      });
  }, []);

  // const purchaseAmount = purchase.reduce((total, po) => {
  //   return (
  //     total + po.item.reduce((itemTotal, item) => itemTotal + item.price, 0)
  //   );
  // }, 0);
  
  const orderAmount = sales.reduce(
    (total, sale) => total + (parseFloat(sale.cost) || 0),
    0
  );

  const RemAmount = rems.reduce((acc, rem) => acc + rem.price, 0);

  function handleDateChange(event) {
    const selectedDate = event.target.value;
    if (isDateString(selectedDate)) {
      console.log("Valid date:", selectedDate);
    } else {
      console.log("Invalid date:", selectedDate);
    }
  }

  const todayDate = getTodayDate();

  const [dropdownOpenCustomer, setDropdownOpenCustomer] = useState(false);
  const [dropdownOpenPO, setDropdownOpenPO] = useState(false);
  const [dropdownOpenCustomerPO, setDropdownOpenCustomerPO] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPO, setSelectedPO] = useState("");
  const [selectedCustomerPO, setSelectedCustomerPO] = useState("");

  const toggleDropdownCustomer = () => {
    setDropdownOpenCustomer(!dropdownOpenCustomer);
  };

  const toggleDropdownPO = () => {
    setDropdownOpenPO(!dropdownOpenPO);
  };

  const toggleDropdownCustomerPO = () => {
    setDropdownOpenCustomerPO(!dropdownOpenCustomerPO);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setDropdownOpenCustomer(false);
  };

  const handlePOSelect = (po) => {
    setSelectedPO(po);
    setDropdownOpenPO(false);
  };

  const handleCustomerPOSelect = (customerPO) => {
    setSelectedCustomerPO(customerPO);
    setDropdownOpenCustomerPO(false);
  };

  return (
    <>
      <div className="container">
        <h1>Dashboard - Profit & Loss</h1>
        <div className="StyledDiv">
          <div className="LeftContainer">
            <div className="dropdowncontainer">
              <div className="StyledIn" onClick={toggleDropdownCustomer}>
                {selectedCustomer || "Customer Name"}
              </div>
              {dropdownOpenCustomer && (
                <div className="dropdownoption">
                  {sales.map((sale) => (
                    <div
                      className="option"
                      key={sale.id}
                      onClick={() => handleCustomerSelect(sale.des)}
                    >
                      {sale.des}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="dropdowncontainer">
              <div className="StyledIn" onClick={toggleDropdownCustomerPO}>
                {selectedCustomerPO || "Customer PO"}
              </div>
              {dropdownOpenCustomerPO && (
                <div className="dropdownoption">
                  {sales.map((sale) => (
                    <div
                      className="option"
                      key={sale.id}
                      onClick={() => handleCustomerPOSelect(sale.des)}
                    >
                      {sale.des}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="dropdowncontainer">
              <div className="StyledIn" onClick={toggleDropdownPO}>
                {selectedPO || "Purchase Order"}
              </div>
              {dropdownOpenPO && (
                <div className="dropdownoption">
                  {purchase.map((item) => (
                    <div
                      className="option"
                      key={item.id}
                      onClick={() => handlePOSelect(item.des)}
                    >
                      {item.des}
                    </div>
                  ))}
                </div>
              )}
            </div>
            Start Date
            <input
              type="date"
              id="orderDate"
              onChange={handleDateChange}
              max={todayDate}
              className="StyledIn"
            />
            End Date
            <input
              type="date"
              id="endDate"
              onChange={handleDateChange}
              max={todayDate}
              className="StyledIn"
            />
          </div>

          <button
            className="StyledButtonSearch"
            // onClick={handleSearch}
            style={{ marginLeft: "10px" }}
          >
            <BiSearch />
            Search
          </button>
        </div>

        <StyledDv>
          <div className="tables">
            <h3>Customer PO Details</h3>
            <StyledTable className="table table-bordered table-striped table-hover shadow">
              <thead className="table-secondary">
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale, index) => (
                  <tr key={sale.id || index}>
                    <td>{sale.name}</td>
                    <td>{sale.quantity}</td>
                    <td>{sale.cost}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>

            <h3>Order Amount: {Number(orderAmount || 0).toFixed(2)}</h3>
          </div>
          <div>
            <h3>Purchase Order</h3>
            <StyledTable className="table table-bordered table-striped table-hover shadow">
              <thead className="table-secondary">
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {purchase.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item?.item?.[0]?.customer ? item.item[0].customer : ""}
                    </td>
                    <td>
                      {item?.item?.[0]?.qtyAllocated
                        ? item.item[0].qtyAllocated
                        : ""}
                    </td>
                    <td>
                      {item?.item?.[0]?.price
                        ? Number(item.item[0].price).toFixed(2)
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            {/* <h3>Purchase Amount: {purchaseAmount.toFixed(2)}</h3> */}
          </div>
          <div>
            <h3>Remaining Purchase Order</h3>
            <StyledTable className="table table-bordered table-striped table-hover shadow">
              <thead className="table-secondary">
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {rems.map((rem, index) => (
                  <tr key={index}>
                    <td>{rem.name}</td>
                    <td>{rem.qty}</td>

                    <td>{Number(rem.price || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>

            <h3>Remaining Purchase: {parseFloat(RemAmount || 0).toFixed(2)}</h3>
          </div>
        </StyledDv>

        {/* <h2>Profit/Loss: {(orderAmount - purchaseAmount).toFixed(2)}</h2> */}
      </div>
    </>
  );
}

export default Dashboard;
