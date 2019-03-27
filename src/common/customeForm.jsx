import React, { Component } from "react";
import Joi from "joi-browser";
import { Button } from "react-bootstrap";

class CustomeForm extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate() {
    const option = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, option);

    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
    // const { data } = this.state;
    // if (data.productName.trim() === "")
    //   errors.productName = "Product Name is Required";
    // if (data.productDescription.trim() === "")
    //   errors.productDescription = "Product Description is Required";
    // return Object.keys(errors).length === 0 ? null : errors;
  }

  validateProperty({ name, value }) {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  }

  handelSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handelInputChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  randerButton(lable) {
    return (
      <Button type="submit" variant="primary" disabled={this.validate()}>
        {lable}
      </Button>
    );
  }
}

export default CustomeForm;
