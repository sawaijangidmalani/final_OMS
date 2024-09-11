import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import styled from "styled-components";
import ApplayOut from "./AppLayOut";
import Navbar from "../Navbar";
import axios from "axios";

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  padding-right: 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Icon = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 12px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

function Home() {
  const [name, setName] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setName({ email: "", password: "" });
  }, []);

  const validForm = () => {
    let valid = true;
    const newError = { ...error };
    if (name.email.trim() === "") {
      newError.email = "*Email is required";
      valid = false;
    } else {
      newError.email = "";
    }
    if (name.password.trim() === "") {
      newError.password = "*Password is required";
      valid = false;
    } else {
      newError.password = "";
    }
    setError(newError);
    return valid;
  };

  const inputEvent = (e) => {
    const { value, name: inputName } = e.target;
    setName((prevValue) => ({
      ...prevValue,
      [inputName]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmits = async (e) => {
    e.preventDefault();
    if (validForm()) {
      try {
        const { data } = await axios.post("http://localhost:8000/auth/login", name);
        if (data?.result) {
          navigate("/dashboard");
        } else {
          alert("Incorrect email or password");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while logging in");
      }
    }
  };

  return (
    <>
      <div className="login">
        <Navbar />
        <StyledDiv>
          <FormContainer>
            <div className="img">
              <img
                src="login-v2.svg"
                alt="login illustration"
                style={{ width: "80%", height: "80vh" }}
              />
            </div>
            <Form onSubmit={onSubmits}>
              <h2>Sign-in</h2>
              <InputGroup>
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={inputEvent}
                  value={name.email}
                />
                <MdEmail className="icon" />
              </InputGroup>
              <ErrorText>{error.email}</ErrorText>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  onChange={inputEvent}
                  value={name.password}
                />
                {showPassword ? (
                  <Icon onClick={togglePasswordVisibility}>
                    <MdVisibilityOff />
                  </Icon>
                ) : (
                  <Icon onClick={togglePasswordVisibility}>
                    <MdVisibility />
                  </Icon>
                )}
              </InputGroup>
              <ErrorText>{error.password}</ErrorText>
              <div className="switch">
                <Link
                  to="/forgot"
                  style={{ textDecoration: "none", float: "right" }}
                >
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit">Sign-in</Button>
            </Form>
          </FormContainer>
        </StyledDiv>
      </div>
    </>
  );
}

export default Home;
