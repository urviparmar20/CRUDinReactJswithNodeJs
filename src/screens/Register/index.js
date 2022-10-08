import React, { useState } from "react";
import "./register.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import fetchData from "../../common/fetchData";
import { sign_up } from "../../common/serverUrl";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

function Register() {
  const navigate = useNavigate();
  const [fname, setFname] = useState();
  const [lname, setLname] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isError, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [roles, setRoles] = useState([]);
  const handleChange = (e) => {
    e.persist();
    var updatedList = [...roles];
    if (e.target.checked) {
      updatedList = [...roles, e.target.value];
    } else {
      updatedList.splice(roles.indexOf(e.target.value), 1);
    }
    setRoles(updatedList);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await fetchData("post", sign_up, "", {
      first_name: fname,
      last_name: lname,
      email,
      password,
      roles: roles,
    });

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
  const handleLogin = () => {
    navigate("/");
  };
  return (
    <div className="container p-5">
      <div>
        <h2 className="registerTxt">Register</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter First Name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail1">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Last Name"
              onChange={(e) => setLname(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail2">
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
              minLength="4"
              onChange={(e) => setPassword(e.target.value)}
              maxLength="8"
              required
            />
          </Form.Group>

          {["checkbox"].map((type) => (
            <div key={`default-${type}`} className="mb-3">
              <Form.Check
                type={type}
                id={`default1-${type}`}
                label={`CREATOR`}
                onChange={(e) => handleChange(e)}
                value={"creator"}
              />
              <Form.Check
                type={type}
                label={`VIEWER`}
                id={`default2-${type}`}
                onChange={(e) => handleChange(e)}
                value={"viewer"}
              />
              <Form.Check
                type={type}
                label={`VIEW_ALL`}
                id={`default3-${type}`}
                onChange={(e) => handleChange(e)}
                value={"view_all"}
              />
            </div>
          ))}
          <div className="registerView">
            <p className="loginTxt">Already have an account??</p>
            <Button variant="link" onClick={handleLogin}>
              Please Login
            </Button>
          </div>

          <Button variant="success" type="submit">
            Register
          </Button>
        </Form>
      </div>
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
    </div>
  );
}

export default Register;