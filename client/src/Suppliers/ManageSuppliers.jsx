// import { useState, useEffect } from "react";
// import AddSuppliers from "./AddSuppliers";
// import { BiAddToQueue, BiSolidEdit } from "react-icons/bi";
// import { MdDelete } from "react-icons/md";
// import { BiSearch } from 'react-icons/bi';
// import axios from "axios";
// import { Tooltip, Pagination, Modal, Popconfirm } from "antd";
// import "../Style/Manage.css";


// function ManageSupplier() {
//   const [suppliers, setSuppliers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [visible, setVisible] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [editingSuppliers, setEditingSuppliers] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(8); 

//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const { data } = await axios.get(
//           "https://final-oms.onrender.com/supplier/getSuppliers"
//         );
//         if (data?.status) {
//           setSuppliers(data.data);
//         } else {
//           alert("Failed to fetch supplier data");
//         }
//       } catch (e) {
//         console.error(e);
//         alert("An error occurred while fetching the supplier data");
//       }
//     };

//     fetchSuppliers();
//   }, []);

//   const handleSearch = () => {
//     const filteredSuppliers = suppliers.filter((supplier) =>
//       supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setSuppliers(filteredSuppliers);
//   };

//   const handleInputChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleDelete = (email) => {
//     axios
//       .delete("https://final-oms.onrender.com/supplier/deleteSupplier", {
//         data: { email },
//       })
//       .then((response) => {
//         alert("Supplier deleted successfully");
//         window.location.reload();
//       })
//       .catch((error) => {
//         console.error("There was an error deleting the supplier!", error);
//       });
//   };

//   const handleAddSupplier = () => {
//     setEditingSuppliers(null);
//     setShowModal(true);
//   };

//   const handleEditSupplier = (supplier) => {
//     setEditingSuppliers(supplier);
//     setShowModal(true);
//   };

//   const onPageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   const updateSupplierList = (newSupplier) => {
//     setSuppliers((prevSuppliers) => {
//       if (editingSuppliers) {
//         return prevSuppliers.map((supplier) =>
//           supplier.id === newSupplier.id ? newSupplier : supplier
//         );
//       } else {
//         return [...prevSuppliers, newSupplier];
//       }
//     });
//     setShowModal(false);
//   };

 
//   const startIndex = (currentPage - 1) * pageSize;
//   const paginatedSuppliers = suppliers.slice(startIndex, startIndex + pageSize);

//   return (
//     <>
//       <div className="container">
//         <h1>Manage Suppliers</h1>
//         <div className="StyledDiv">
//           <div className="ButtonContainer">
//             <div>
//               <input
//                 className="StyledIn"
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleInputChange}
//                 placeholder="Search"
//               />
//               {/* <button className="StyledButton" onClick={handleSearch}>
//                 Search
//               </button> */}

// <button className="StyledButton" onClick={handleSearch}> 
//       <BiSearch /> Search
//     </button>

//             </div>
//             {/* <button className="StyledButton" onClick={handleAddSupplier}>
//               Add Supplier
//             </button> */}

// <button className="StyledButton" onClick={handleAddSupplier}>
//         <BiAddToQueue /> Add Supplier
//       </button>
//           </div>
//         </div>

//         <div className="table-responsive">
//           <h2>Suppliers List</h2>
//           <table className="table table-bordered table-striped table-hover shadow">
//             <thead className="table-secondary">
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Area</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedSuppliers.map((supplier) => (
//                 <tr key={supplier.email}>
//                   <td>{supplier.name}</td>
//                   <td>{supplier.email}</td>
//                   <td>{supplier.phone}</td>
//                   <td>{supplier.area}</td>
//                   <td>{supplier.status}</td>
//                   <td>
//                     <div className="button-group">
//                       <Tooltip
//                         title="Edit"
//                         overlayInnerStyle={{
//                           backgroundColor: "rgb(41, 10, 244)",
//                           color: "white",
//                           borderRadius: "10%",
//                         }}
//                       >
//                         <button
//                           className="btns1"
//                           onClick={() => handleEditSupplier(supplier)}
//                         >
//                           <BiSolidEdit />
//                         </button>
//                       </Tooltip>
//                       <Tooltip
//                         title="Delete"
//                         overlayInnerStyle={{
//                           backgroundColor: "rgb(244, 10, 10)",
//                           color: "white",
//                           borderRadius: "10%",
//                         }}
//                       >
//                         <Popconfirm
//                           placement="topLeft"
//                           description="Are you sure to delete this supplier?"
//                           onConfirm={() => handleDelete(supplier.email)}
//                           okText="Delete"
//                         >
//                           <button className="btns2">
//                             <MdDelete />
//                           </button>
//                         </Popconfirm>
//                       </Tooltip>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <Pagination
//             current={currentPage}
//             total={suppliers.length}
//             pageSize={pageSize}
//             onChange={onPageChange}
//             showSizeChanger={false}
//           />
//         </div>

//         <Modal
//           open={visible}
//           onOk={() => setVisible(false)}
//           onCancel={() => setVisible(false)}
//           footer={null}
//         ></Modal>

//         {showModal && (
//           <AddSuppliers
//             suppliers={suppliers}
//             setSuppliers={setSuppliers}
//             closeModal={closeModal}
//             editingSuppliers={editingSuppliers}
//             updateSupplierList={updateSupplierList}
//           />
//         )}
//       </div>
//     </>
//   );
// }

// export default ManageSupplier;


import { useState, useEffect } from "react";
import AddSuppliers from "./AddSuppliers";
import { BiAddToQueue, BiSolidEdit, BiSearch } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { Tooltip, Pagination, Modal, Popconfirm } from "antd";
import "../Style/Manage.css";

function ManageSupplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSuppliers, setEditingSuppliers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data } = await axios.get(
          "https://final-oms.onrender.com/supplier/getSuppliers"
        );
        if (data?.status) {
          setSuppliers(data.data);
          setFilteredSuppliers(data.data);
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

  const handleSearch = () => {
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.includes(searchTerm)
    );
    setFilteredSuppliers(filtered);
    setCurrentPage(1);
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (value === '') {
      // Reset the filtered suppliers list when the search term is cleared
      setFilteredSuppliers(suppliers);
      setCurrentPage(1);
    } else {
      handleSearch(); // Call handleSearch to filter suppliers
    }
  };
  

  const handleDelete = (email) => {
    axios
      .delete("https://final-oms.onrender.com/supplier/deleteSupplier", {
        data: { email },
      })
      .then((response) => {
        alert("Supplier deleted successfully");
        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter((s) => s.email !== email)
        );
        setFilteredSuppliers((prevFiltered) =>
          prevFiltered.filter((s) => s.email !== email)
        );
      })
      .catch((error) => {
        console.error("There was an error deleting the supplier!", error);
      });
  };

  const handleAddSupplier = () => {
    setEditingSuppliers(null);
    setShowModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSuppliers(supplier);
    setShowModal(true);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
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
    setFilteredSuppliers((prevFiltered) => {
      if (editingSuppliers) {
        return prevFiltered.map((supplier) =>
          supplier.id === newSupplier.id ? newSupplier : supplier
        );
      } else {
        return [...prevFiltered, newSupplier];
      }
    });
    setShowModal(false);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedSuppliers = filteredSuppliers.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <>
      <div className="container">
        <h1>Manage Suppliers</h1>
        <div className="StyledDiv">
          <div className="ButtonContainer">
            <div>
              <input
                className="StyledIn"
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search"
              />
              <button className="StyledButtonSearch" onClick={handleSearch}>
                <BiSearch /> Search
              </button>
            </div>
            <button className="StyledButtonAdd" onClick={handleAddSupplier}>
              <BiAddToQueue /> Add Supplier
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <h2>Suppliers List</h2>
          <table className="table table-bordered table-striped table-hover shadow">
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
              {paginatedSuppliers.map((supplier) => (
                <tr key={supplier.email}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.area}</td>
                  <td>{supplier.status}</td>
                  <td>
                    <div className="button-group">
                      <Tooltip
                        title="Edit"
                        overlayInnerStyle={{
                          backgroundColor: "rgb(41, 10, 244)",
                          color: "white",
                          borderRadius: "10%",
                        }}
                      >
                        <button
                          className="btns1"
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <BiSolidEdit />
                        </button>
                      </Tooltip>
                      <Tooltip
                        title="Delete"
                        overlayInnerStyle={{
                          backgroundColor: "rgb(244, 10, 10)",
                          color: "white",
                          borderRadius: "10%",
                        }}
                      >
                        <Popconfirm
                          placement="topLeft"
                          description="Are you sure to delete this supplier?"
                          onConfirm={() => handleDelete(supplier.email)}
                          okText="Delete"
                        >
                          <button className="btns2">
                            <MdDelete />
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
            total={filteredSuppliers.length}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>

        <Modal
          open={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          footer={null}
        ></Modal>

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