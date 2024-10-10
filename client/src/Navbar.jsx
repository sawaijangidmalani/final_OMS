// import { BiBriefcase, BiUser } from "react-icons/bi";
// import { IoMdHome } from "react-icons/io";
// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <>
//       <div className="navbr">
//         <Link to="/" style={{ textDecoration: "none" }}>
//           <h2 className="logo">
//             <span className="w-logo">W</span>
//             <span className="span">
//               <IoMdHome className="homeicon" size={22} />
//             </span>
//             Order Management
//           </h2>
//         </Link>

//         <nav>
//           <span className="span">
//             <BiUser className="homeicon" size={22} />
//           </span>
//         </nav>
//       </div>
//     </>
//   );
// }

// export default Navbar;

// import { IoMdContact, IoMdHome } from "react-icons/io";

import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div className="navbr">
        <div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2>
              <span className="span">
                <img src="home.svg" alt="home icon" />
              </span>
              Order Management
            </h2>
          </Link>
        </div>

        <div className="signup">
          <Link to="/signin" style={{ textDecoration: "none" }}>
            <h2>
              <FaUserPlus />
              Sign Up
            </h2>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
