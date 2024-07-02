import mongoose from "mongoose";

const Enq = mongoose.model(
  "Enq",
  new mongoose.Schema({
    preferredName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    postcode: { type: String, required: true },
    testPreparation: { type: Boolean, required: true },
    skillsImprovement: { type: Boolean, required: true },
    enqMessage: String,
    enqDate: { type: Date, default: Date.now },
    replied: { type: Boolean, default: false },
    replyDate: { type: Date, default: "" },
    replyMessage: { type: String, default: "" },
  })
);

export default Enq;
