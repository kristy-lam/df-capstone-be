import { expect } from "chai";
import sinon from "sinon";
import {
  sendAddEnqRes,
  sendGetEnqsRes,
  sendDeleteEnqRes,
  sendUpdateEnqRes,
} from "../../src/controllers/enq.controller.js";
import Enq from "../../src/models/enq.model.js";

describe("Enquiries controller tests", () => {
  let req;
  let res;
  let addEnqStub;
  let getEnqsStub;
  let findEnqStub;
  let updateEnqStub;
  let deleteEnqStub;

  const validEnq = {
    _id: "testId",
    preferredName: "testEnquirer",
    mobile: "07123456789",
    email: "test@email.com",
    postcode: "A12 3BC",
    testPreparation: true,
    skillsImprovement: false,
    enqMessage: "testing",
    enqDate: Date.now(),
    replied: false,
    replyDate: null,
    replyMessage: "",
  };

  const allEnqs = [
    {
      preferredName: "testEnquirer1",
      mobile: "07123456789",
      email: "test@email.com",
      postcode: "A12 3BC",
      testPreparation: true,
      skillsImprovement: false,
      enqMessage: "testing",
      enqDate: Date.now(),
      replied: false,
      replyDate: null,
      replyMessage: "",
    },
    {
      preferredName: "testEnquirer2",
      mobile: "07123456789",
      email: "test@email.com",
      postcode: "A12 3BC",
      testPreparation: true,
      skillsImprovement: false,
      enqMessage: "testing",
      enqDate: Date.now(),
      replied: false,
      replyDate: null,
      replyMessage: "",
    },
  ];

  beforeEach(() => {
    req = { body: {}, params: { id: "testId" } };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
    };
    addEnqStub = sinon.stub(Enq.prototype, "save");
    getEnqsStub = sinon.stub(Enq, "find");
    findEnqStub = sinon.stub(Enq, "findById");
    updateEnqStub = sinon.stub(Enq, "findByIdAndUpdate");
    deleteEnqStub = sinon.stub(Enq, "findByIdAndDelete");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("sendAddEnqRes tests", () => {
    it("should return a 201 status and the enquiry when a valid enquiry is added", async () => {
      // Assign
      addEnqStub.resolves(validEnq);
      // Act
      await sendAddEnqRes(req, res);
      // Assert
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.send.calledWith({ message: "Enquiry is added" })).to.be.true;
    });

    it("should return a 400 status when an invalid enquiry is sent", async () => {
      // Assign
      addEnqStub.throws(new Error("Invalid enquiry"));
      // Act
      await sendAddEnqRes(req, res);
      // Assert
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith({ message: "Invalid enquiry" })).to.be.true;
    });

    it("should return a 500 status when addEnquiry throws an error", async () => {
      // Assign
      addEnqStub.throws(new Error("Test error"));
      // Act
      await sendAddEnqRes(req, res);
      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith({ message: "Test error" })).to.be.true;
    });
  });

  describe("sendGetEnqsRes tests", () => {
    it("should return a 200 status and all enquiries", async () => {
      // Assign
      getEnqsStub.resolves(allEnqs);
      // Act
      await sendGetEnqsRes(req, res);
      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(allEnqs)).to.be.true;
    });

    it("should return a 404 status when there is no enquiry", async () => {
      // Assign
      getEnqsStub.throws(new Error("No enquiry found"));
      // Act
      await sendGetEnqsRes(req, res);
      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith({ message: "No enquiry found" })).to.be.true;
    });

    it("should return a 500 status when getEnqs throws an error", async () => {
      // Assign
      getEnqsStub.throws(new Error("Test error"));
      // Act
      await sendGetEnqsRes(req, res);
      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith({ message: "Test error" })).to.be.true;
    });
  });

  describe("sendUpdateEnqRes tests", () => {
    it("should send a 202 status when a valid ID and enquiry are provided", async () => {
      // Assign
      findEnqStub.resolves(validEnq);
      updateEnqStub.resolves(validEnq);
      // Act
      await sendUpdateEnqRes(req, res);
      // Assert
      expect(res.status.calledWith(202)).to.be.true;
      expect(res.send.calledWith(validEnq)).to.be.true;
    });

    it("should return a 404 status when an enquiry is not found", async () => {
      // Assign
      updateEnqStub.throws(new Error("Enquiry not found"));
      // Act
      await sendUpdateEnqRes(req, res);
      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith({ message: "Enquiry not found" })).to.be.true;
    });

    it("should send a 500 status when updateEnq throws an error", async () => {
      // Assign
      findEnqStub.resolves(true);
      updateEnqStub.throws(new Error("Test error"));
      // Act
      await sendUpdateEnqRes(req, res);
      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith({ message: "Test error" })).to.be.true;
    });
  });

  describe("sendDeleteEnqRes tests", () => {
    it("should send a 200 status when a valid ID is provided", async () => {
      // Assign
      findEnqStub.resolves(validEnq);
      deleteEnqStub.resolves(validEnq);
      // Act
      await sendDeleteEnqRes(req, res);
      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ message: "Enquiry deleted" })).to.be.true;
    });

    it("should return a 404 status when an enquiry is not found", async () => {
      // Assign
      deleteEnqStub.throws(new Error("Enquiry not found"));
      // Act
      await sendDeleteEnqRes(req, res);
      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith({ message: "Enquiry not found" })).to.be.true;
    });

    it("should send a 500 status when updateEnq throws an error", async () => {
      // Assign
      findEnqStub.resolves(true);
      deleteEnqStub.throws(new Error("Test error"));
      // Act
      await sendDeleteEnqRes(req, res);
      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith({ message: "Test error" })).to.be.true;
    });
  });
});
