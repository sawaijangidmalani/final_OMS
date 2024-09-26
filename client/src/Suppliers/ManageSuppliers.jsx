import { useState , useEffect} from "react";
import styled from "styled-components";
import AddSuppliers from "./AddSuppliers";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const StyledIn = styled.input`
  width: 200px;
  height: 45px;
  margin-top: 15px;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  width: 200px;
  height: 40px;
  background-color: white;
  color: #333;
  padding-left: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const DropdownOptions = styled.div`
  position: absolute;
  width: 200px;
  max-height: 150px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const Option = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

function ManageSupplier() {

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/supplier/getSuppliers");
        if (data?.status) {
          setSuppliers(data.data);
        } else {
          alert("Failed to fetch supplier data");
        }
      } catch (e) {
        console.error(e);
        alert("An error occurred while fetching the supplier data");
      }
    };

    fetchSuppliers();
  }, []);
  const [suppliers, setSuppliers] = useState([
    
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSuppliers, setEditingSuppliers] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = () => {
    const filteredSuppliers = suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSuppliers(filteredSuppliers);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    axios.delete("http://localhost:8000/supplier/deleteSupplier", { data: { id } })
      .then(response => {

        alert("Deleted")
      })
      .catch(error => {
        console.error("There was an error deleting the supplier!", error);
      });
  };
    
  const handleAddSupplier = () => {

    setEditingSuppliers(null);
    setShowModal(true);
  };

  const handleEditCustomer = (supplier) => {
    setEditingSuppliers(supplier);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const updateSupplierList = (newSupplier) => {
    setSuppliers((prevSuppliers) => {
      if (editingSuppliers) {
        return prevSuppliers.map((supplier) =>
          supplier.id === newSupplier.id ? newSupplier : supplier
        );
      } else {
        return [...prevSuppliers, newSupplier];
      }
    });
    setShowModal(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setDropdownOpen(false);
  };

  return (
    <>
      <div>
        <h1>Manage Suppliers</h1>
        <StyledDiv>
          <DropdownContainer>
            <DropdownButton onClick={toggleDropdown}>
              {searchTerm || "Supplier Name"}
            </DropdownButton>
            {dropdownOpen && (
              <DropdownOptions>
                {suppliers.map((supplier) => (
                  <Option key={supplier.id} onClick={() => handleOptionClick(supplier.name)}>
                    {supplier.name}
                  </Option>
                ))}
              </DropdownOptions>
            )}
          </DropdownContainer>
          <ButtonContainer>
            <StyledIn
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search by name..."
            />
            <StyledButton onClick={handleSearch}>Search</StyledButton>
            <StyledButton onClick={handleAddSupplier}>Add Supplier</StyledButton>
          </ButtonContainer>
        </StyledDiv>

        <div className="conentdetails">
          <h2>Suppliers List:</h2>
          <table className="table table-bordered table-striped table-hover shadow mt-5">
            <thead className="table-secondary">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Area</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              
              {suppliers.map((supplier) => (
                <tr key={supplier.email}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.area}</td>
                  <td>{supplier.status}</td>
                  <td>
                    <div className="buttons-group">
                      <button className="btns" onClick={() => handleEditCustomer(supplier)}>
                        <BiSolidEdit />
                      </button>{" "}
                      <button
                        className="btns"
                        onClick={() => handleDelete(supplier.email)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <AddSuppliers
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            closeModal={closeModal}
            editingSuppliers={editingSuppliers}
            updateSupplierList={updateSupplierList}
          />
        )}
      </div>
    </>
  );
}
export default ManageSupplier;
