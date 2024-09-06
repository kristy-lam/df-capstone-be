import mongoose from "mongoose";
import {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../services/customer.service.js";

const sendAddCustomerRes = async (req, res) => {
  try {
    await addCustomer(req.body);
    res.status(201).send({ message: "Customer is added" });
  } catch (e) {
    if (
      e.message === "Invalid customer" ||
      e instanceof mongoose.Error.ValidationError
    ) {
      res.status(400).send({ message: "Invalid customer" });
    } else {
      res.status(e.statusCode ?? 500).send({ message: e.message });
    }
  }
};

const sendGetCustomersRes = async (req, res) => {
  try {
    const allCustomers = await getCustomers();
    res.status(200).send(allCustomers);
  } catch (e) {
    if (e.message === "No customer found") {
      res.status(404).send({ message: e.message });
    } else {
      res.status(e.statusCode ?? 500).send({ message: e.message });
    }
  }
};

const sendUpdateCustomerRes = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const updatedCustomer = await updateCustomer(body, id);
    res.status(202).send(updatedCustomer);
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).send({ message: e.message });
    } else {
      res.status(e.statusCode ?? 500).send({ message: e.message });
    }
  }
};

const sendDeleteCustomerRes = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCustomer(id);
    res.status(200).send({ message: "Customer deleted" });
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).send({ message: e.message });
    } else {
      res.status(e.statusCode ?? 500).send({ message: e.message });
    }
  }
};

export {
  sendAddCustomerRes,
  sendGetCustomersRes,
  sendUpdateCustomerRes,
  sendDeleteCustomerRes,
};
