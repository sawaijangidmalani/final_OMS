import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Modal = styled.div`
  position: relative;
  z-index: 100;
  top: 5%;
  width:800px;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  left: 20%;
  top:20%;
  border-radius: 5px;
  background-color: #f5f8f9;
  padding: 20px;
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

function ItemStockDetail({ items, setItem }) {
  const navigate = useNavigate();


  return (
    <>
      <div>
        <StyledModel>
          <Modal>
            <h3>Item Stock Detail</h3>
            <Table>
              <HeadTr>
                <Th>Date</Th>
                <Th>Item Name</Th>
                <Th>Item Category</Th>
                <Th>Brand</Th>
                <Th>Qty</Th>
                <Th>Unit</Th>
                <Th>Price</Th>
                <Th>Type</Th>
              </HeadTr>
              {items.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.date}</Td>
                  <Td>{item.item}</Td>
                  <Td>{item.category}</Td>
                  <Td>{item.brand}</Td>
                  <Td>{item.qty}</Td>
                  <Td>{item.unit}</Td>
                  <Td>{item.price}</Td>
                  <Td>
                    In
                  </Td>
                </Tr>
              ))}
            </Table>
            <button
              className="customer-form__button"
              onClick={() => navigate("/items")}
            >
              Close
            </button>
          </Modal>
        </StyledModel>
      </div>
    </>
  );
}

export default ItemStockDetail;
