import React, { Component } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import Joi from "joi-browser";
import axios from "axios";
class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      books: [],
      submitData: { productName: "", productDescription: "" },
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

  validate() {
    const option = { abortEarly: false };
    const { error } = Joi.validate(this.state.submitData, this.schema, option);

    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
    // const { submitData } = this.state;
    // if (submitData.productName.trim() === "")
    //   errors.productName = "Product Name is Required";
    // if (submitData.productDescription.trim() === "")
    //   errors.productDescription = "Product Description is Required";
    // return Object.keys(errors).length === 0 ? null : errors;
  }

  handelSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    console.log("Submitted", this.state.submitData);
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

  handelInputChange = ({ currentTarget: input }) => {
    const submitData = { ...this.state.submitData };
    submitData[input.name] = input.value;
    this.setState({ submitData });
  };
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
    const { submitData, errors } = this.state;
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
                  value={submitData.productName}
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
                  value={submitData.productDescription}
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
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default App;
