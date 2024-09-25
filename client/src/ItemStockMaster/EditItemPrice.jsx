import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  backdrop-filter: blur(2px);
`;

function EditItemPrice() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    date: "",
    quantity: "",  // new field for quantity
  });

  const [data, setData] = useState([
    { date: "30-Apr-2024", price: 40, quantity: 10 },
    { date: "30-Mar-2024", price: 39, quantity: 20 },
    { date: "25-Feb-2024", price: 35, quantity: 15 },
  ]);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setData([...data, formData]);
    console.log(formData)
    setFormData({ name: "", price: "", date: "", quantity: "" });
  };

  const handleEdit = (index) => {
    const itemToEdit = data[index];
    setFormData(itemToEdit);
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
            <h3 className="form-heading">Add / Edit Item price</h3>
            <label className="customer-form__label">
              Item Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="customer-form__input"
              />
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
              Quantity:
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="customer-form__input"
              />
            </label>

            <table className="item-price-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.price}</td>
                    <td>{row.quantity}</td>
                    <td>
                      <button
                        type="button"
                        className="button-edit-delete"
                        onClick={() => handleEdit(index)}
                      >
                        <BiEdit />
                      </button>
                      <button
                        type="button"
                        className="button-edit-delete"
                        onClick={() => handleDelete(index)}
                      >
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
              <button type="button" className="customer-form__button" onClick={() => navigate("/itemstock")}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </StyledModel>
    </>
  );
}

export default EditItemPrice;
