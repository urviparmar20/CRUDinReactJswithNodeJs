import React, { useState } from "react";
import "./login.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import fetchData from "../../common/fetchData";
import { sign_in } from "../../common/serverUrl";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isError, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await fetchData(
      "post",
      sign_in,
      {},
      {
        email,
        password,
      }
    );
    if (data.status === "1") {
      localStorage.setItem("user_id", data.data[0].id);
      localStorage.setItem("email", data.data[0].email);
      localStorage.setItem("first_name", data.data[0].first_name);
      localStorage.setItem("last_name", data.data[0].last_name);
      localStorage.setItem("roles", JSON.stringify(data.data[0].roles));
      localStorage.setItem("token", data.data[0].accessToken);
      navigate("/books");
    } else {
      setError(true);
      setMessage(data.message);
      setTimeout(() => {
        setError(false);
        setMessage("");
      }, 2000);
    }
  };
  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <div>
      {isError && message !== "" && (
        <ToastContainer className="p-3" position="top-center">
          <Toast>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">
                {isError ? "Error" : "Success"}
              </strong>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
      <div className="container">
        <div>
          <h2 className="loginTxt">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                onChange={(e) => setEmail(e.target.value)}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                minLength="4"
                maxLength="8"
                required
              />
            </Form.Group>
            <div className="registerView">
              <p className="registerText">Don't have an account??</p>
              <Button variant="link" onClick={handleRegister}>
                Register here
              </Button>
            </div>

            <Button variant="success" type="submit">
              Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
