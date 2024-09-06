import { expect } from "chai";
import sinon from "sinon";
import {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../../src/services/customer.service.js";
import Customer from "../../src/models/customer.model.js";

describe("Customer services tests", () => {
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

  afterEach(() => {
    sinon.restore();
  });

  describe("Add customer tests", () => {
    let addCustomerStub;

    beforeEach(() => {
      addCustomerStub = sinon.stub(Customer.prototype, "save");
    });

    it("should add a valid customer", async () => {
      // Arrange
      addCustomerStub.resolves(testCustomer);
      // Act
      const result = await addCustomer(testCustomer);
      // Assert
      expect(result).to.equal(testCustomer);
    });

    it("should throw an error when save fails", async () => {
      // Arrange
      const error = new Error("Test error");
      addCustomerStub.throws(error);
      // Act
      try {
        await addCustomer({});
        assert.fails("Expected error was not thrown");
      } catch (e) {
        // Assert
        expect(e).to.equal(error);
      }
    });
  });

  describe("getCustomers tests", () => {
    let getCustomersStub;

    beforeEach(() => {
      getCustomersStub = sinon.stub(Customer, "find");
    });

    it("should get all customers", async () => {
      // Arrange
      const allCustomers = [
        testCustomer,
        {
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
      getCustomersStub.resolves(allCustomers);
      // Act
      const result = await getCustomers(allCustomers);
      // Assert
      expect(result).to.equal(allCustomers);
    });

    it("should throw an error when there is no customer", async () => {
      // Arrange
      const error = new Error("No customer found");
      getCustomersStub.throws(error);
      // Act
      try {
        await getCustomersStub({});
        assert.fails("Expected error was not thrown");
      } catch (e) {
        // Assert
        expect(e).to.equal(error);
      }
    });
  });

  describe("updateCustomer tests", () => {
    let findCustomerStub;
    let updateCustomerStub;

    beforeEach(() => {
      findCustomerStub = sinon.stub(Customer, "findById");
      updateCustomerStub = sinon.stub(Customer, "findByIdAndUpdate");
    });

    it("should update the customer", async () => {
      // Arrange
      findCustomerStub.resolves(testCustomer);
      updateCustomerStub.resolves(testCustomer);
      // Act
      const result = await updateCustomer(testCustomer, "testId");
      // Assert
      expect(result).to.equal(testCustomer);
    });

    it("should throw an error when invalid ID is provided", async () => {
      // Arrange
      const error = new Error("Enquiry not found");
      findCustomerStub.throws(error);
      // Act
      try {
        await updateCustomer(testCustomer, null);
      } catch (e) {
        // Assert
        expect(e).to.equal(error);
      }
    });
  });

  describe("deleteCustomer tests", () => {
    let findCustomerStub;
    let deleteCustomerStub;

    beforeEach(() => {
      findCustomerStub = sinon.stub(Customer, "findById");
      deleteCustomerStub = sinon.stub(Customer, "findByIdAndDelete");
    });

    it("should delete the customer", async () => {
      // Arrange
      findCustomerStub.resolves(testCustomer);
      deleteCustomerStub.resolves(testCustomer);
      // Act
      const result = await deleteCustomer("testId");
      // Assert
      expect(result).to.equal(testCustomer);
    });

    it("should throw an error when invalid ID is provided", async () => {
      // Arrange
      const error = new Error("Customer not found");
      findCustomerStub.throws(error);
      // Act
      try {
        await deleteCustomerStub(null);
      } catch (e) {
        // Assert
        expect(e).to.equal(error);
      }
    });
  });
});
