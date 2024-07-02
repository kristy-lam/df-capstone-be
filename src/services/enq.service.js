import Enq from "../models/enq.model.js";

const addEnq = async (newEnq) => {
  let enq;
  try {
    enq = new Enq(newEnq);
  } catch (e) {
    throw new Error("Invalid enquiry");
  }
  return await enq.save();
};

const getEnqs = async () => {
  const allEnqs = await Enq.find({});
  if (allEnqs.length === 0) {
    throw new Error("No enquiry found");
  } else {
    return allEnqs;
  }
};

const updateEnq = async (updatedEnq, id) => {
  const enq = await Enq.findById(id);
  if (!enq) {
    throw new Error("Enquiry not found");
  } else {
    return await Enq.findByIdAndUpdate(id, updatedEnq, { new: true });
  }
};

const deleteEnq = async (id) => {
  const enq = await Enq.findById(id);
  if (!enq) {
    throw new Error("Enquiry not found");
  } else {
    return await Enq.findByIdAndDelete(id);
  }
};

export { addEnq, getEnqs, updateEnq, deleteEnq };
