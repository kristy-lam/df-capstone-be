import mongoose from "mongoose";

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    preferredName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    firstLineOfAddress: { type: String, required: true },
    secondLineOfAddress: { type: String },
    postcode: { type: String, required: true },
    drivingLicenceNum: { type: String, required: true },
    testPreparation: { type: Boolean, required: true },
    testDate: { type: Date },
    testCentre: { type: String },
    skillsImprovement: { type: Boolean, required: true },
    dateAdded: { type: Date, default: Date.now },
    enquiries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Enq" }],
  })
);

export default Customer;
