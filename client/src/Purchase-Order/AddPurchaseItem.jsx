import React from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import styled from "styled-components";

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

function AddPurchaseItem({ purchaseItems }) {
  return (
    <Table>
      <thead>
        <HeadTr>
          <Th>Item</Th>
          <Th>Qty</Th>
          <Th>Unit Cost</Th>
          <Th>Purchase Price</Th>
          <Th>Invoice No</Th>
          <Th>Invoice Date</Th>
          <Th>Action</Th>
          <Td></Td>
        </HeadTr>
      </thead>
      <tbody>
        {purchaseItems.map((item, index) => (
          <Tr key={index}>
            <Td>{item.customer}</Td>
            <Td>{item.qtyAllocated}</Td>
            <Td>{item.price}</Td>
            <Td>{item.singleQuantityPrice}</Td>
            <Td>{item.invoice}</Td>
            <Td>{item.date}</Td>
            <Td>
              <button className="btns"><BiEdit /></button>
              <button className="btns"><BiTrash /></button>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

export default AddPurchaseItem;

