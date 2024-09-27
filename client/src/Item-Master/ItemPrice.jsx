import { useState, useEffect } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";

const Modal = styled.div`
  position: relative;
  z-index: 100;
  top: 5%;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  left: 30%;
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

function ItemPrice({ handleClose }) {
  const [names, setNames] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    qty: "",
    date: "",
  });

  const [data, setData] = useState([
    { name: "Item 1", date: "30-Apr-2024", qty: 12, price: 40 },
    { name: "Item 2", date: "30-Mar-2024", qty: 15, price: 39 },
    { name: "Item 3", date: "25-Feb-2024", qty: 20, price: 35 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get("https://final-oms.onrender.com/item/getItems");
        const namesFromResponse = itemsResponse.data.data.map(item => item.name);
        setNames(namesFromResponse);
        
        const editItemDetailsResponse = await axios.get("https://final-oms.onrender.com/item/getEditItemDetails");
        console.log(editItemDetailsResponse.data);
        setData(editItemDetailsResponse.data)
        
        console.log('Items Response Data:', itemsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("https://final-oms.onrender.com/item/editItemStock",formData)

    setData([...data, formData]);

    setFormData({
      name: "",
      price: "",
      qty: "",
      date: "",
    });
  };

  const handleEdit = (index) => {
    const itemToEdit = data[index];

    setFormData({
      name: itemToEdit.name,
      price: itemToEdit.price,
      qty: itemToEdit.qty,
      date: itemToEdit.date,
    });
  };

  const handleDelete = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  };

  return (
    <>
      <StyledModel>
        <Modal>
          <form onSubmit={handleSubmit} className="customer-form">
            <h3 className="form-heading">Add / Edit Item Stock</h3>
            <label className="customer-form__label">
              Item Name:
              <select
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="customer-form__input"
              >
                <option value="">Select an item</option>
                {names.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </label>
            <label className="customer-form__label">
              Purchase Price:
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="customer-form__input"
              />
            </label>
            <label className="customer-form__label">
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="customer-form__input-date"
              />
            </label>
            <label className="customer-form__label">
              Qty:
              <input
                type="text"
                name="qty"
                value={formData.qty}
                onChange={handleInputChange}
                className="customer-form__input"
              />
            </label>
            <table className="item-price-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.date}</td>
                    <td>{row.qty}</td>
                    <td>{row.price}</td>
                    <td>
                      <button className="btns" onClick={() => handleEdit(index)}>
                        <BiEdit />
                      </button>
                      <button className="btns" onClick={() => handleDelete(index)}>
                        <BiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="customer-form__button-container">
              <button type="submit" className="customer-form__button">
                Save
              </button>
              <button type="button" className="customer-form__button" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </StyledModel>
    </>
  );
}

export default ItemPrice;
