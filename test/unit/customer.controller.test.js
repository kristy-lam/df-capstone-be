import { expect } from "chai";
import sinon from "sinon";
import {
  sendAddCustomerRes,
  sendGetCustomersRes,
  sendUpdateCustomerRes,
  sendDeleteCustomerRes,
} from "../../src/controllers/customer.controller.js";
import Customer from "../../src/models/customer.model.js";

describe("Customer controller tests", () => {
  let req;
  let res;
  let addCustomerStub;
  let getCustomersStub;
  let findCustomerStub;
  let updateCustomerStub;
  let deleteCustomerStub;

  const testCustomer = {
    _id: "testId",
    firstName: "testFirstName",
    middleName: "testMiddleName",
    preferredName: "testName",
    lastName: "testLastName",
    mobile: "07987654321",
    email: "customer@test.com",
    firstLineOfAddress: "testAddress",
    secondLineOfAddress: "",
    postcode: "B1 2LS",
    drivingLicenceNum: "ABCDE123456FG9FG",
    testPreparation: true,
    testDate: null,
    testCentre: null,
    skillsImprovement: false,
    dateAdded: Date.now(),
    enquiries: [],
  };

  const allCustomers = [
    testCustomer,
    {
      _id: "testId2",
      firstName: "testFirstName2",
      middleName: "testMiddleName2",
      preferredName: "testName2",
      lastName: "testLastName2",
      mobile: "07987654322",
      email: "customer2@test.com",
      firstLineOfAddress: "testAddress2",
      secondLineOfAddress: "",
      postcode: "B1 2LS",
      drivingLicenceNum: "ABCDE123456FG9FH",
      testPreparation: true,
      testDate: null,
      testCentre: null,
      skillsImprovement: false,
      dateAdded: Date.now(),
      enquiries: [],
    },
  ];

  beforeEach(() => {
    req = { body: {}, params: { id: "testId" } };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
    };
    addCustomerStub = sinon.stub(Customer.prototype, "save");
    getCustomersStub = sinon.stub(Customer, "find");
    findCustomerStub = sinon.stub(Customer, "findById");
    updateCustomerStub = sinon.stub(Customer, "findByIdAndUpdate");
    deleteCustomerStub = sinon.stub(Customer, "findByIdAndDelete");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("sendAddCustomerRes tests", () => {
    it("should return a 201 status and the customer when a valid customer is added", async () => {
      // Arrange
      addCustomerStub.resolves(testCustomer);
      // Act
      await sendAddCustomerRes(req, res);
      // Assert
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.send.calledWith({ message: "Customer is added" })).to.be.true;
    });

    it("should return a 400 status when an invalid customer is sent", async () => {
      // Arrange
      addCustomerStub.throws(new Error("Invalid customer"));
      // Act
      await sendAddCustomerRes(req, res);
      // Assert
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith({ message: "Invalid customer" })).to.be.true;
    });

    it("should return a 500 status when addCustomer throws an error", async () => {
      // Arrange
      addCustomerStub.throws(new Error("Test error"));
      // Act
      await sendAddCustomerRes(req, res);
      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith({ message: "Test error" })).to.be.true;
    });
  });

  describe("sendGetCustomersRes tests", () => {
    it("should return a 200 status and all customers", async () => {
      // Arrange
      getCustomersStub.resolves(allCustomers);
      // Act
      await sendGetCustomersRes(req, res);
      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(allCustomers)).to.be.true;
    });

    it("should return a 404 status when there is no customer", async () => {
      // Arrange
      getCustomersStub.throws(new Error("No customer found"));
      // Act
      await sendGetCustomersRes(req, res);
      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith({ message: "No customer found" })).to.be.true;
    });

    it("should return a 500 status when getCustomers throws an error", async () => {
      // Arrange
      getCustomersStub.throws(new Error("Test error"));
      // Act
      await sendGetCustomersRes(req, res);
      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith({ message: "Test error" })).to.be.true;
    });
  });

  describe("sendUpdateCustomerRes tests", () => {
    it("should send a 202 status when a valid ID and customer are provided", async () => {
      // Arrange
      findCustomerStub.resolves(testCustomer);
      updateCustomerStub.resolves(testCustomer);
      // Act
      await sendUpdateCustomerRes(req, res);
      // Assert
      expect(res.status.calledWith(202)).to.be.true;
      expect(res.send.calledWith(testCustomer)).to.be.true;
    });

    it("should return a 404 status when the customer is not found", async () => {
      // Arrange
      updateCustomerStub.throws(new Error("Customer not found"));
      // Act
      await sendUpdateCustomerRes(req, res);
      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith({ message: "Customer not found" })).to.be.true;
    });

    it("should send a 500 status when updateCustomer throws an error", async () => {
      // Arrange
      findCustomerStub.resolves(true);
      updateCustomerStub.throws(new Error("Test error"));
      // Act
      await sendUpdateCustomerRes(req, res);
      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith({ message: "Test error" })).to.be.true;
    });
  });

  describe("sendDeleteCustomerRes tests", () => {
    it("should send a 200 status when a valid ID is provided", async () => {
      // Arrange
      findCustomerStub.resolves(testCustomer);
      deleteCustomerStub.resolves(testCustomer);
      // Act
      await sendDeleteCustomerRes(req, res);
      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ message: "Customer deleted" })).to.be.true;
    });

    it("should return a 404 status when the customer is not found", async () => {
      // Arrange
      deleteCustomerStub.throws(new Error("Customer not found"));
      // Act
      await sendDeleteCustomerRes(req, res);
      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith({ message: "Customer not found" })).to.be.true;
    });

    it("should send a 500 status when updateCustomer throws an error", async () => {
      // Arrange
      findCustomerStub.resolves(true);
      deleteCustomerStub.throws(new Error("Test error"));
      // Act
      await sendDeleteCustomerRes(req, res);
      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith({ message: "Test error" })).to.be.true;
    });
  });
});
