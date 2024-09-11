import { BiHome, BiUser } from "react-icons/bi";
import { IoMdHome, IoMdLogOut } from "react-icons/io";
import { Link } from "react-router-dom";

function Navbar1() {
  return (
    <>
      <div className="navbr">
        <div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2 className="logo">
              <span className="w-logo">W</span>
              <span className="span">
                <IoMdHome className="homeicon" size={22} />
              </span>
              Order Mangement
            </h2>
            <nav></nav>
          </Link>
        </div>
        <div className="logout">
          <nav>
            <span className="span">
              <BiUser className="homeicon" size={22} />
            </span>
            <Link to="/"><IoMdLogOut /></Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar1;
