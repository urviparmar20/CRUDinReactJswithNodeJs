import _ from "lodash";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import fetchData from "../../common/fetchData";
import "./books.css";
import {
  get_book_list,
  delete_book,
} from "../../common/serverUrl";
import { ArchiveFill, PencilFill } from 'react-bootstrap-icons';

function Books() {
  const navigate = useNavigate();
  const [booksData, setBooksData] = useState();
  const [isModalView, setModelView] = useState(false);
  const [modelData, setModalData] = useState({
    isDelete: true,
    title: "Delete Book",
    subtitle: "Are you sure you want to delete this book?",
  });
  const user_id = localStorage.getItem("user_id");
  const accessToken = localStorage.getItem("token");
  const filterByRole = JSON.parse(localStorage.getItem("roles"));
  const [deleteId, setDeleteId] = useState();

  useEffect(() => {
    getBookList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (id) => {
    setModelView(true);
    setDeleteId(id);
  };
  const handleClose = () => {
    setModelView(false);
  };
  const handleDeleteOk = async () => {
    //call API
    const data = await fetchData(
      "post",
      delete_book,
      { "x-access-token": accessToken },
      {
        book_id: deleteId,
        user_id: user_id,
      }
    );
    if (data.status === "1") {
      getBookList();
    }
    setModelView(false);
  };
  const handleFilter = async (e) => {
    const value = e.target.value;
    const books = await fetchData(
      "post",
      get_book_list + "?" + value + "=1",
      { "x-access-token": accessToken },
      {
        user_id: user_id,
        type: "list",
      }
    );
    if (books.status === "1") {
      setBooksData(books.data);
    }
  };
  const filterData = (filter_name, isAtoZ) => {
    if (isAtoZ) {
      const booksDataTemp = booksData.sort((a, b) =>
        a[filter_name] > b[filter_name] ? 1 : -1
      );
      const fastAndDeepCopy = _.cloneDeep(booksDataTemp);
      setBooksData(fastAndDeepCopy);
    } else {
      const booksDataTemp = booksData.sort((a, b) =>
        a[filter_name] < b[filter_name] ? 1 : -1
      );
      const fastAndDeepCopy = _.cloneDeep(booksDataTemp);
      setBooksData(fastAndDeepCopy);
    }
  };
  const handleSort = async (e) => {
    const sortByName = e.target.value;
    if (sortByName === "aToz") {
      filterData("name", true);
    } else if (sortByName === "zToa") {
      filterData("name", false);
    } else if (sortByName === "aTozA") {
      filterData("author_name", true);
    } else if (sortByName === "zToaA") {
      filterData("author_name", false);
    } else if (sortByName === "aTozE") {
      filterData("edition", true);
    } else if (sortByName === "zToaE") {
      filterData("edition", false);
    } else if (sortByName === "lowToHigh") {
      const booksDataTemp = booksData.sort((a, b) => a?.price - b?.price);
      const fastAndDeepCopy = _.cloneDeep(booksDataTemp);
      setBooksData(fastAndDeepCopy);
    } else if (sortByName === "hightToLow") {
      const booksDataTemp = booksData.sort((a, b) => b?.price - a?.price);
      const fastAndDeepCopy = _.cloneDeep(booksDataTemp);
      setBooksData(fastAndDeepCopy);
    } else {
      getBookList();
    }
  };

  const handleAddOrEdit = async (actionType, id) => {
    if (actionType === "edit") {
      navigate("/add-or-edit", { state: { isEdit: true, book_id: id } });
    }
    if (actionType === "add") {
      navigate("/add-or-edit", { state: { isEdit: false, book_id: "" } });
    }
    localStorage.setItem("action", JSON.stringify(actionType));
  };
  const handleLogout = () => {
    setModelView(false);
    localStorage.clear();
    navigate("/");
  };

  const getBookList = async () => {
    const books = await fetchData(
      "post",
      get_book_list,
      { "x-access-token": accessToken },
      {
        user_id: user_id,
        type: "list",
      }
    );
    if (books.status === "1") {
      setBooksData(books.data);
    }
  };
  const logout = () => {
    setModalData({
      isDelete: false,
      title: "Logout User",
      subtitle: "Are you sure you want to logout?",
    });
    setModelView(true);
  };
  return (
    <div className="containerBooks">
      <div>
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
        <div className="rowView">
          <h2>Book List</h2>
          <div className="filterAddView">
            <div className="selectFilterView">
              Sort By
              {booksData && (
                <Form.Select onChange={(e) => handleSort(e)}>
                  <option value="none">None</option>
                  <option value="aToz">Name: A to Z</option>
                  <option value="zToa">Name: Z to A</option>
                  <option value="aTozA">Author : A to Z</option>
                  <option value="zToaA">Author : Z to A</option>
                  <option value="aTozE">Edition : A to Z</option>
                  <option value="zToaE">Edition : Z to A</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="hightToLow">Price: High to Low</option>
                </Form.Select>
              )}
            </div>
            <div className="selectFilterView">
              Filter
              {booksData && (
                <Form.Select onChange={(e) => handleFilter(e)}>
                  <option value="all">All Data</option>
                  <option value="new">New Data</option>
                  <option value="old">Old Data</option>
                </Form.Select>
              )}
            </div>
            {filterByRole.find((item) => item.name === "creator" || item.name === "viewer") && (
              <Button
                type="submit"
                variant="success"
                onClick={() => handleAddOrEdit("add")}
                className="addBtn"
              >
                Add Book
              </Button>
            )}
          </div>
        </div>
        <div className="centerView">
          {booksData && booksData?.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="tdTxt">#</th>
                  <th className="tdTxt">Book Name</th>
                  <th className="tdTxt">Author Name</th>
                  <th className="tdTxt">Edition</th>
                  <th className="tdTxt">Price</th>
                  {filterByRole.find((item) => item.name === "creator" ) && (
                    <th className="tdTxt">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {booksData?.map((item, index) => (
                  <tr key={index}>
                    <td className="tdTxt">{index + 1}</td>
                    <td className="tdTxt">{item.name}</td>
                    <td className="tdTxt">{item.author_name}</td>
                    <td className="tdTxt">{item.edition}</td>
                    <td className="tdTxt">{item.price}</td>
                    {filterByRole.find((item) => item.name === "creator") && (
                      <td className="tdTxt">
                        <Button
                          type="submit"
                          variant="success"
                          onClick={() => handleAddOrEdit("edit", item._id)}
                        >
                          <PencilFill/>
                        </Button>
                        <Button
                          type="submit"
                          variant="success"
                          className="deleteBtn"
                          onClick={() => handleDelete(item._id)}
                        >
                          <ArchiveFill/>
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <h2>Data Not Found!</h2>
          )}
        </div>
        <Modal show={isModalView} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{modelData.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modelData.subtitle}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              No
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                modelData.isDelete ? handleDeleteOk() : handleLogout()
              }
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Books;
