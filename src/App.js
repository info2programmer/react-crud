import React, { Component } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import Joi from "joi-browser";
import axios from "axios";
import CustomeForm from "./common/customeForm";

class App extends CustomeForm {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      books: [],
      data: { productName: "", productDescription: "" },
      errors: {}
    };

    this.schema = {
      productName: Joi.string()
        .required()
        .label("Product Name"),
      productDescription: Joi.string()
        .required()
        .label("Product Description")
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  doSubmit = async () => {
    const obj = this.state.data;
    const { data: book } = await axios.post(
      "https://www.bebongstore.com/Manage_api/submitList",
      obj
    );
    console.log(book);
    const books = [book, ...this.state.books];
    this.setState({
      books: books,
      data: { productName: "", productDescription: "" }
    });
  };

  async componentWillMount() {
    axios
      .get("https://www.bebongstore.com/Manage_api/getList")
      .then(response => {
        this.setState({
          books: response.data
        });
      });
  }

  render() {
    const books = this.state.books.map((book, i) => {
      return (
        <tr key={book.product_id}>
          <td>{i + 1}</td>
          <td>{book.name}</td>
          <td>
            <p dangerouslySetInnerHTML={{ __html: book.description }} />
          </td>
          <td>
            <Button variant="warning" className="btn-sm m-2">
              <i className="fa fa-edit mr-1" />
              Edit
            </Button>
            <Button variant="danger" className="btn-sm m-2">
              <i className="fa fa-trash mr-1" />
              delete
            </Button>
          </td>
        </tr>
      );
    });
    const { data, errors } = this.state;
    return (
      <div className="container">
        <Button variant="success" className="m-2" onClick={this.handleShow}>
          <i className="fa fa-plus mr-1" />
          Add New Product
        </Button>
        <Table variant="dark">
          <thead>
            <tr>
              <td>#</td>
              <td>Title</td>
              <td>Description</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>{books}</tbody>
        </Table>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Form onSubmit={this.handelSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Product Name"
                  value={data.productName}
                  name="productName"
                  onChange={this.handelInputChange}
                />
                {errors.productName && (
                  <span className="font-weight-bold text-danger">
                    {errors.productName}
                  </span>
                )}
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Product Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  placeholder="Enter Product Description"
                  value={data.productDescription}
                  name="productDescription"
                  onChange={this.handelInputChange}
                />
              </Form.Group>
              {errors.productDescription && (
                <span className="font-weight-bold text-danger">
                  {errors.productDescription}
                </span>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              {this.randerButton("Submit")}
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default App;
