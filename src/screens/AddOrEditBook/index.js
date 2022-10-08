import React, { useEffect, useState } from "react";
import "./addOrEdit.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, useLocation } from "react-router-dom";
import fetchData from "../../common/fetchData";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import {
  create_book,
  update_book,
  get_book_using_id_list,
} from "../../common/serverUrl";

function AddOrEditBook() {
  const location = useLocation();
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [edition, setEdition] = useState("");
  const [price, setPrice] = useState("");
  const [isError, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalView, setModelView] = useState(false);
  const user_id = localStorage.getItem("user_id");
  const accessToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const modelData = {
    isDelete: false,
    title: "Logout User",
    subtitle: "Are you sure you want to logout?",
  };
  useEffect(() => {
    if (location?.state?.isEdit) {
      getBookById(location.state?.book_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const getBookById = async (book_id) => {
    const data = await fetchData(
      "post",
      get_book_using_id_list,
      { "x-access-token": accessToken },
      {
        user_id: user_id,
        book_id: book_id,
        type: "detail",
      }
    );
    if (data.status === "1") {
      const item = data.data[0];
      setBookName(item.name);
      setAuthorName(item.author_name);
      setEdition(item.edition);
      setPrice(item.price);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!location?.state?.isEdit) {
      const data = await fetchData(
        "post",
        create_book,
        { "x-access-token": accessToken },
        {
          user_id: user_id,
          name: bookName,
          author_name: authorName,
          edition,
          price,
          type: "create",
        }
      );
      if (data.status === "1") {
        navigate("/books");
      }
      else {
        setError(true);
        setMessage(data.message);
        setTimeout(() => {
          setError(false);
          setMessage("");
        }, 2000);
      }
    } else {
      const data = await fetchData(
        "post",
        update_book,
        { "x-access-token": accessToken },
        {
          user_id: user_id,
          book_id: location.state?.book_id,
          name: bookName,
          author_name: authorName,
          edition,
          price,
          type: "update",
        }
      );
      if (data.status === "1") {
        navigate("/books");
      }
      else {
        setError(true);
        setMessage(data.message);
        setTimeout(() => {
          setError(false);
          setMessage("");
        }, 2000);
      }
    }
  };
  const logout = () => {
    setModelView(true);
  };
  const handleLogout = () => {
    setModelView(false);
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="p-4">
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
      <div className="rowView ">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb  ps-4">
            <li className="breadcrumb-item">
              <a href="/books">BookList</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add and Edit
            </li>
          </ol>
        </nav>
        <div className="logoutView">
          <h4> Welcome {localStorage.getItem("first_name")} </h4>
          <Button
            type="submit"
            onClick={() => logout()}
            className="logoutButton"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="container">
        <div>
          <h2 className="loginTxt">{!location?.state?.isEdit ? "Add Book" : "Edit Book"}</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Book Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Book Name"
                onChange={(e) => setBookName(e.target.value)}
                required
                value={bookName}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Author Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Author Name"
                onChange={(e) => setAuthorName(e.target.value)}
                required
                value={authorName}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Edition</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Edition"
                onChange={(e) => setEdition(e.target.value)}
                required
                value={edition}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                onChange={(e) => setPrice(e.target.value)}
                required
                value={price}
              />
            </Form.Group>
            {!location?.state?.isEdit ? (
              <Button variant="success" type="submit">
                Add Book
              </Button>
            ) : (
              <Button variant="success" type="submit">
                Edit Book
              </Button>
            )}
          </Form>
        </div>
      </div>
      <Modal show={isModalView} onHide={() => setModelView(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modelData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modelData.subtitle}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModelView(false)}>
            No
          </Button>
          <Button variant="primary" onClick={() => handleLogout()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddOrEditBook;
