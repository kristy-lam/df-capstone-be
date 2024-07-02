import {
  addEnq,
  getEnqs,
  deleteEnq,
  updateEnq,
} from "../services/enq.service.js";
import mongoose from "mongoose";

const sendAddEnqRes = async (req, res) => {
  try {
    await addEnq(req.body);
    res.status(201).send({ message: "Enquiry is added" });
  } catch (e) {
    if (
      e.message === "Invalid enquiry" ||
      e instanceof mongoose.Error.ValidationError
    ) {
      res.status(400).send({ message: "Invalid enquiry" });
    } else {
      res.status(e.statusCode ?? 500).send({ message: e.message });
    }
  }
};

const sendGetEnqsRes = async (req, res) => {
  try {
    const allEnqs = await getEnqs();
    res.status(200).send(allEnqs);
  } catch (e) {
    if (e.message === "No enquiry found") {
      res.status(404).send({ message: e.message });
    } else {
      res.status(e.statusCode ?? 500).send({ message: e.message });
    }
  }
};

const sendUpdateEnqRes = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const updatedEnq = await updateEnq(body, id);
    res.status(202).send(updatedEnq);
  } catch (e) {
    if (e.message === "Enquiry not found") {
      res.status(404).send({ message: e.message });
    } else {
      res.status(e.statusCode ?? 500).send({ message: e.message });
    }
  }
};

const sendDeleteEnqRes = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteEnq(id);
    res.status(200).send({ message: "Enquiry deleted" });
  } catch (e) {
    if (e.message === "Enquiry not found") {
      res.status(404).send({ message: e.message });
    } else {
      res.status(e.statusCode ?? 500).send({ message: e.message });
    }
  }
};

export { sendAddEnqRes, sendGetEnqsRes, sendUpdateEnqRes, sendDeleteEnqRes };
