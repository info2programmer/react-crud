import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
class App extends Component {
  state = {
    books: []
  };

  componentWillMount() {
    axios
      .get("https://www.bebongstore.com/Manage_api/getList")
      .then(response => {
        console.log(response.data);
        this.setState({
          books: response.data
        });
      });
  }
  render() {
    let books = this.state.books.map(book => {
      return(
        <tr key={book.id}>
          <td>{book.id}</td>
          <td>{book.name}</td>
          <td>{book.skucode}</td>
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
    return (
      <div className="container">
        <Button variant="success" className="m-2">
          <i className="fa fa-plus mr-1" />
          Add New Product
        </Button>
        <Table variant="dark">
          <thead>
            <tr>
              <td>#</td>
              <td>Title</td>
              <td>Rating</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>{books}</tbody>
        </Table>
      </div>
    );
  }
}

export default App;
