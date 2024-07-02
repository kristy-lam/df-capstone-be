import { expect } from "chai";
import sinon from "sinon";
import {
  addEnq,
  getEnqs,
  deleteEnq,
  updateEnq,
} from "../../src/services/enq.service.js";
import Enq from "../../src/models/enq.model.js";

describe("Enquiries services tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("Add enquiry tests", () => {
    let addEnqStub;

    beforeEach(() => {
      addEnqStub = sinon.stub(Enq.prototype, "save");
    });

    it("should add a valid enquiry", async () => {
      // Assign
      const validEnq = {
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
      addEnqStub.resolves(validEnq);
      // Act
      const result = await addEnq(validEnq);
      // Assert
      expect(result).to.equal(validEnq);
    });

    it("should throw an error when save fails", async () => {
      // Assign
      const error = new Error("Test error");
      addEnqStub.throws(error);
      // Act
      try {
        await addEnq({});
        assert.fails("Expected error was not thrown");
      } catch (e) {
        // Assert
        expect(e).to.equal(error);
      }
    });
  });

  describe("getEnqs tests", () => {
    let getEnqsStub;

    beforeEach(() => {
      getEnqsStub = sinon.stub(Enq, "find");
    });

    it("should get all enquiries", async () => {
      // Assign
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
      getEnqsStub.resolves(allEnqs);
      // Act
      const result = await getEnqs(allEnqs);
      // Assert
      expect(result).to.equal(allEnqs);
    });

    it("should throw an error when there is no enquiry", async () => {
      // Assign
      const error = new Error("No enquiry found");
      getEnqsStub.throws(error);
      // Act
      try {
        await getEnqs({});
        assert.fails("Expected error was not thrown");
      } catch (e) {
        // Assert
        expect(e).to.equal(error);
      }
    });
  });

  describe("updateEnq tests", () => {
    let findEnqStub;
    let updateEnqStub;

    const testUpdatedEnq = {
      _id: "testId",
      preferredName: "testNewEnquirer",
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

    beforeEach(() => {
      findEnqStub = sinon.stub(Enq, "findById");
      updateEnqStub = sinon.stub(Enq, "findByIdAndUpdate");
    });

    it("should update an enquiry", async () => {
      // Assign
      findEnqStub.resolves(testUpdatedEnq);
      updateEnqStub.resolves(testUpdatedEnq);
      // Act
      const result = await updateEnq(testUpdatedEnq, "testId");
      // Assert
      expect(result).to.equal(testUpdatedEnq);
    });

    it("should throw an error when invalid ID is provided", async () => {
      // Assign
      const error = new Error("Enquiry not found");
      findEnqStub.throws(error);
      // Act
      try {
        await updateEnq(testUpdatedEnq, null);
      } catch (e) {
        // Assert
        expect(e).to.equal(error);
      }
    });
  });

  describe("deleteEnq tests", () => {
    let findEnqStub;
    let deleteEnqStub;

    const testEnq = {
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

    beforeEach(() => {
      findEnqStub = sinon.stub(Enq, "findById");
      deleteEnqStub = sinon.stub(Enq, "findByIdAndDelete");
    });

    it("should delete an enquiry", async () => {
      // Assign
      findEnqStub.resolves(testEnq);
      deleteEnqStub.resolves(testEnq);
      // Act
      const result = await deleteEnq("testId");
      // Assert
      expect(result).to.equal(testEnq);
    });

    it("should throw an error when invalid ID is provided", async () => {
      // Assign
      const error = new Error("Enquiry not found");
      findEnqStub.throws(error);
      // Act
      try {
        await deleteEnqStub(null);
      } catch (e) {
        // Assert
        expect(e).to.equal(error);
      }
    });
  });
});
