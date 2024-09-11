import { useNavigate } from "react-router-dom";
import styled from "styled-components";
const Modal = styled.div`
  position: relative;
  z-index: 100;
  top: 25%;
  left: 25%;
  width: 800px;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  background-color: #f5f8f9;
`;
const StyledModel = styled.div`
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: none;
  backdrop-filter: blur(2px);
`;
const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 800px;
`;
const StyledItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;
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

function ItemStockUtilization({ items }) {
  const navigate = useNavigate();
  const stocks = [
    { id: 1,name:"tv", cat:"elc",brand:"samsung", date: "12.02.2024", qty: 22, unit: "pcs", po: "PC0001" },
    
  ];

  return (
    <>
      <StyledModel>
        <Modal>
          <StyledDiv>
            <h4 style={{ textAlign: "center" }}>Item Stock Utilization</h4>
            <StyledItem>
              {stocks.map((item) => (
                <>
                  <span>Item Name :{item.name}</span>
                  <span>Item Category :{item.cat}</span>
                <span>Brand :{item.brand}</span>
                </>
              ))}
            </StyledItem>
            <StyledItem>
              <div>
                <h4>Item Stock</h4>
                <Table>
                  <thead>
                    <HeadTr>
                      <Th>Date</Th>
                      <Th>Qty</Th>
                      <Th>Unit</Th>
                      <Th>Purchase Price</Th>
                    </HeadTr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <Tr key={item.id}>
                        <Td>{item.date}</Td>
                        <Td>{item.qty}</Td>
                        <Td>{item.unit}</Td>
                        <Td>{item.price}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div>
                <h4>Item Utilization</h4>
                <Table>
                  <thead>
                    <HeadTr>
                      <Th>PO Date</Th>
                      <Th>Qty</Th>
                      <Th>Unit</Th>
                      <Th>Purchase Order</Th>
                    </HeadTr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => (
                      <Tr key={stock.id}>
                        <Td>{stock.date}</Td>
                        <Td>{stock.qty}</Td>
                        <Td>{stock.unit}</Td>
                        <Td>{stock.po}</Td>
                        
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </StyledItem>
            <StyledItem>
              <span>Total Item Stock :</span>
              <span>Item Utilization :</span>
              <span>Available Stock :</span>
              <button className="btns" onClick={() => navigate("/dashboard")}>
                CLOSE
              </button>
            </StyledItem>
          </StyledDiv>
        </Modal>
      </StyledModel>
    </>
  );
}
export default ItemStockUtilization;
