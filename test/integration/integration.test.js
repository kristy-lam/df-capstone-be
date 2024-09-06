import { expect } from "chai";
import sinon from "sinon";
import supertest from "supertest";

import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connectToDatabase, disconnectFromDatabase } from "../../src/db/db.js";
import loadConfig from "../../src/config/config.js";
import authRouter from "../../src/routes/auth.routes.js";
import enqRouter from "../../src/routes/enq.routes.js";
import customerRouter from "../../src/routes/customer.routes.js";
import User from "../../src/models/user.model.js";
import testUser from "../data/testUser.js";
import Enq from "../../src/models/enq.model.js";
import Customer from "../../src/models/customer.model.js";
import testEnq from "../data/testEnq.js";
import testNewEnq from "../data/testNewEnq.js";
import testUpdatedEnq from "../data/testUpdatedEnq.js";
import testCustomer from "../data/testCustomer.js";
import testNewCustomer from "../data/testNewCustomer.js";
import testUpdatedCustomer from "../data/testUpdatedCustomer.js";

describe("Integration tests", () => {
  let server;
  let req;

  before(async () => {
    loadConfig();
    connectToDatabase();
    const app = express();
    app.use(cors());
    app.use(morgan(`tiny`));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/auth", authRouter);
    app.use("/enq", enqRouter);
    app.use("/customers", customerRouter);
    const port = process.env.PORT;
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    req = supertest(app);
  });

  after(async () => {
    await server.close();
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    try {
      await User.deleteMany();
      console.log("Database users collection cleared");
      await Enq.deleteMany();
      console.log("Database enquiries collection cleared");
      await Customer.deleteMany();
      console.log("Database customers collection cleared");
    } catch (e) {
      console.log(e.message);
      console.log("Error clearing");
      throw new Error();
    }
    try {
      await User.insertMany(testUser);
      console.log("Database populated with test user");
      await Enq.insertMany(testEnq);
      console.log("Database populated with test enquiry");
      await Customer.insertMany(testCustomer);
      console.log("Database populated with test customer");
    } catch (e) {
      console.log(e.message);
      console.log("Error inserting");
      throw new Error();
    }
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("POST requests to '/auth/login' on authRoutes", () => {
    it("should send a 200 status when user is authenticated", async () => {
      // Arrange
      const validUser = { username: "admin", password: "Password123!" };
      // Act
      const res = await req.post("/auth/login").send(validUser);
      // Assert
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Login success");
    });

    it("should send a 404 status when user is not found", async () => {
      // Arrange
      const invalidUser = {
        username: "no-such-user",
        password: "Password123!",
      };
      // Act
      const res = await req.post("/auth/login").send(invalidUser);
      // Assert
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("User not found");
    });

    it("should send a 401 status when user is not found", async () => {
      // Arrange
      const invalidUser = {
        username: "admin",
        password: "WrongPassword123!",
      };
      // Act
      const res = await req.post("/auth/login").send(invalidUser);
      // Assert
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal("Unauthorised");
    });

    it("should send a 500 status when there is an error", async () => {
      // Arrange
      const authenticateUserStub = sinon.stub(User, "findOne");
      authenticateUserStub.throws(new Error("Test error"));
      const validUser = {
        username: "admin",
        password: "Password123!",
      };
      // Act
      const res = await req.post("/auth/login").send(validUser);
      // Assert
      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Test error");
    });
  });

  describe("POST requests to '/enq/add' on enqRoutes", () => {
    it("should send a 201 status when a valid enquiry is sent", async () => {
      // Act
      const res = await req.post("/enq/add").send(testNewEnq);
      // Assert
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal("Enquiry is added");
    });

    it("should send a 400 status when an empty enquiry is sent", async () => {
      // Act
      const res = await req.post("/enq/add").send({});
      // Assert
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid enquiry");
    });

    it("should send a 400 status when preferred name is missing", async () => {
      // Arrange
      const invalidEnq = {
        preferredName: "",
        mobile: "07123456789",
        email: "test@email.com",
        postcode: "A12 3BC",
        testPreparation: true,
        skillsImprovement: false,
        enqMessage: "testing",
        enqDate: "2024-06-21T20:42:56.922Z",
        replied: false,
        replyDate: "",
        replyMessage: "",
      };
      // Act
      const res = await req.post("/enq/add").send(invalidEnq);
      // Assert
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid enquiry");
    });

    it("should send a 400 status when mobile is missing", async () => {
      // Arrange
      const invalidEnq = {
        preferredName: "testName",
        mobile: "",
        email: "test@email.com",
        postcode: "A12 3BC",
        testPreparation: true,
        skillsImprovement: false,
        enqMessage: "testing",
        enqDate: "2024-06-21T20:42:56.922Z",
        replied: false,
        replyDate: "",
        replyMessage: "",
      };
      // Act
      const res = await req.post("/enq/add").send(invalidEnq);
      // Assert
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid enquiry");
    });

    it("should send a 400 status when email is missing", async () => {
      // Arrange
      const invalidEnq = {
        preferredName: "testName",
        mobile: "07123456789",
        email: "",
        postcode: "A12 3BC",
        testPreparation: true,
        skillsImprovement: false,
        enqMessage: "testing",
        enqDate: "2024-06-21T20:42:56.922Z",
        replied: false,
        replyDate: "",
        replyMessage: "",
      };
      // Act
      const res = await req.post("/enq/add").send(invalidEnq);
      // Assert
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid enquiry");
    });

    it("should send a 400 status when email is invalid", async () => {
      // Arrange
      const invalidEnq = {
        preferredName: "testName",
        mobile: "07123456789",
        email: "test-email",
        postcode: "A12 3BC",
        testPreparation: true,
        skillsImprovement: false,
        enqMessage: "testing",
        enqDate: "2024-06-21T20:42:56.922Z",
        replied: false,
        replyDate: "",
        replyMessage: "",
      };
      // Act
      const res = await req.post("/enq/add").send(invalidEnq);
      // Assert
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid enquiry");
    });

    it("should send a 400 status when postcode is missing", async () => {
      // Arrange
      const invalidEnq = {
        preferredName: "testName",
        mobile: "07123456789",
        email: "test@email.com",
        postcode: "",
        testPreparation: true,
        skillsImprovement: false,
        enqMessage: "testing",
        enqDate: "2024-06-21T20:42:56.922Z",
        replied: false,
        replyDate: "",
        replyMessage: "",
      };
      // Act
      const res = await req.post("/enq/add").send(invalidEnq);
      // Assert
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid enquiry");
    });

    it("should send a 400 status when postcode is invalid", async () => {
      // Arrange
      const invalidEnq = {
        preferredName: "testName",
        mobile: "07123456789",
        email: "test@email.com",
        postcode: "test post code",
        testPreparation: true,
        skillsImprovement: false,
        enqMessage: "testing",
        enqDate: "2024-06-21T20:42:56.922Z",
        replied: false,
        replyDate: "",
        replyMessage: "",
      };
      // Act
      const res = await req.post("/enq/add").send(invalidEnq);
      // Assert
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid enquiry");
    });

    it("should send a 500 status when there is an error", async () => {
      // Arrange
      const addEnqStub = sinon.stub(Enq.prototype, "save");
      addEnqStub.throws(new Error("Test error"));
      // Act
      const res = await req.post("/enq/add").send(testNewEnq);
      // Assert
      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Test error");
    });
  });

  describe("GET requests to '/enq/all' on enqRoutes", () => {
    describe("Tests after successful login", () => {
      let getRes;
      let token;
      before(async () => {
        // Arrange
        const validUser = { username: "admin", password: "Password123!" };
        const loginRes = await req.post("/auth/login").send(validUser);
        token = loginRes.headers["authorization"];
      });

      it("should send a 200 status when enquiry is updated", async () => {
        // Act
        getRes = await req.get("/enq/all").set("authorization", token);
        // Assert
        expect(getRes.status).to.equal(200);
        const { __v, replyDate, ...testUpdatedEnq } = getRes.body[0];
        testUpdatedEnq.replyDate = ""; // Mongoose changes the default date of "" to null
        expect(testUpdatedEnq).to.deep.equal(testEnq);
        expect(replyDate).to.equal(null);
      });

      it("should send a 404 status when no enquiry is found", async () => {
        // Arrange
        try {
          await Enq.deleteMany();
          console.log("Database enquiries collection cleared");
        } catch (e) {
          console.log(e.message);
          console.log("Error clearing");
          throw new Error();
        }
        // Act
        getRes = await req.get("/enq/all").set("authorization", token);
        // Assert
        expect(getRes.status).to.equal(404);
        expect(getRes.body.message).to.equal("No enquiry found");
      });

      it("should send a 500 status when there is an error", async () => {
        // Arrange
        sinon.stub(Enq, "find").throws(new Error("Test error"));
        // Act
        getRes = await req.get("/enq/all").set("authorization", token);
        // Assert
        expect(getRes.status).to.equal(500);
        expect(getRes.body.message).to.equal("Test error");
      });

      describe("Tests without logging in", () => {
        it("should return a 403 status when no token is provided", async () => {
          // Act
          getRes = await req.get("/enq/all");
          // Assert
          expect(getRes.status).to.equal(403);
          expect(getRes.body.message).to.equal("No token provided");
        });

        it("should return a 401 status when an invalid token is provided", async () => {
          // Arrange
          const invalidToken = "invalidToken";
          // Act
          getRes = await req.get("/enq/all").set("authorization", invalidToken);
          // Assert
          expect(getRes.status).to.equal(401);
          expect(getRes.body.message).to.equal("Unauthorised");
        });
      });
    });
  });

  describe("PATCH requests to '/enq/:id' on enqRoutes", () => {
    describe("Tests after successful login", () => {
      let updateRes;
      let token;
      before(async () => {
        // Arrange
        const validUser = { username: "admin", password: "Password123!" };
        const loginRes = await req.post("/auth/login").send(validUser);
        token = loginRes.headers["authorization"];
      });

      it("should send a 202 status when enquiry is updated", async () => {
        // Act
        updateRes = await req
          .patch(`/enq/${testUpdatedEnq._id}`)
          .set("authorization", token)
          .send(testUpdatedEnq);
        // Assert
        expect(updateRes.status).to.equal(202);
        const { __v, ...testUpdatedEnqWithoutV } = updateRes.body;
        expect(testUpdatedEnqWithoutV).to.deep.equal(testUpdatedEnq);
      });

      it("should send a 404 status when enquiry ID is not found", async () => {
        // Arrange
        const enqWithInvalidID = {
          _id: "667595289f30b44aa2a7ec39",
          preferredName: "testName",
          mobile: "07123456789",
          email: "test@email.com",
          postcode: "A12 3BC",
          testPreparation: true,
          skillsImprovement: false,
          enqMessage: "testing",
          enqDate: "2024-06-21T20:42:56.922Z",
          replied: false,
          replyDate: "",
          replyMessage: "",
        };
        // Act
        updateRes = await req
          .patch(`/enq/${enqWithInvalidID._id}`)
          .set("authorization", token)
          .send(enqWithInvalidID);
        // Assert
        expect(updateRes.status).to.equal(404);
        expect(updateRes.body.message).to.equal("Enquiry not found");
      });

      it("should send a 400 status when an invalid enquiry is provided", async () => {
        // Arrange
        const enqWithInvalidName = {
          _id: "667595289f30b44aa2a7ec33",
          preferredName: "",
          mobile: "07123456789",
          email: "test@email.com",
          postcode: "A12 3BC",
          testPreparation: true,
          skillsImprovement: false,
          enqMessage: "testing",
          enqDate: "2024-06-21T20:42:56.922Z",
          replied: false,
          replyDate: "",
          replyMessage: "",
        };
        // Act
        updateRes = await req
          .patch(`/enq/${enqWithInvalidName._id}`)
          .set("authorization", token)
          .send(enqWithInvalidName);
        // Assert
        expect(updateRes.status).to.equal(400);
        expect(updateRes.body.message).to.equal("Invalid enquiry");
      });

      it("should send a 500 status when there is an error", async () => {
        // Arrange
        sinon.stub(Enq, "findById").resolves(true);
        sinon.stub(Enq, "findByIdAndUpdate").throws(new Error("Test error"));
        // Act
        updateRes = await req
          .patch(`/enq/${testUpdatedEnq._id}`)
          .set("authorization", token)
          .send(testUpdatedEnq);
        // Assert
        expect(updateRes.status).to.equal(500);
        expect(updateRes.body.message).to.equal("Test error");
      });

      describe("Tests without logging in", () => {
        it("should return a 403 status when no token is provided", async () => {
          // Act
          const updateRes = await req
            .patch(`/enq/${testUpdatedEnq._id}`)
            .send(testUpdatedEnq);
          // Assert
          expect(updateRes.status).to.equal(403);
          expect(updateRes.body.message).to.equal("No token provided");
        });

        it("should return a 401 status when an invalid token is provided", async () => {
          // Arrange
          const invalidToken = "invalidToken";
          // Act
          const updateRes = await req
            .patch(`/enq/${testUpdatedEnq._id}`)
            .set("authorization", invalidToken)
            .send(testUpdatedEnq);
          // Assert
          expect(updateRes.status).to.equal(401);
          expect(updateRes.body.message).to.equal("Unauthorised");
        });
      });
    });

    describe("DELETE requests to '/enq/:id' on enqRoutes", () => {
      describe("Tests after successful login", () => {
        let deleteRes;
        let token;
        before(async () => {
          // Arrange
          const validUser = { username: "admin", password: "Password123!" };
          const loginRes = await req.post("/auth/login").send(validUser);
          token = loginRes.headers["authorization"];
        });

        it("should send a 200 status when enquiry is deleted", async () => {
          // Act
          deleteRes = await req
            .delete(`/enq/${testEnq._id}`)
            .set("authorization", token)
            .send(testEnq._id);
          // Assert
          expect(deleteRes.status).to.equal(200);
          expect(deleteRes.body.message).to.equal("Enquiry deleted");
        });

        it("should send a 404 status when enquiry ID is not found", async () => {
          // Arrange
          const enqWithInvalidID = {
            _id: "667595289f30b44aa2a7ec39",
            preferredName: "testName",
            mobile: "07123456789",
            email: "test@email.com",
            postcode: "A12 3BC",
            testPreparation: true,
            skillsImprovement: false,
            enqMessage: "testing",
            enqDate: "2024-06-21T20:42:56.922Z",
            replied: false,
            replyDate: "",
            replyMessage: "",
          };
          // Act
          deleteRes = await req
            .delete(`/enq/${enqWithInvalidID._id}`)
            .set("authorization", token)
            .send(enqWithInvalidID._id);
          // Assert
          expect(deleteRes.status).to.equal(404);
          expect(deleteRes.body.message).to.equal("Enquiry not found");
        });

        it("should send a 500 status when there is an error", async () => {
          // Arrange
          sinon.stub(Enq, "findById").resolves(true);
          sinon.stub(Enq, "findByIdAndDelete").throws(new Error("Test error"));
          // Act
          deleteRes = await req
            .delete(`/enq/${testEnq._id}`)
            .set("authorization", token)
            .send(testEnq._id);
          // Assert
          expect(deleteRes.status).to.equal(500);
          expect(deleteRes.body.message).to.equal("Test error");
        });

        describe("Tests without logging in", () => {
          it("should return a 403 status when no token is provided", async () => {
            // Act
            const deleteRes = await req
              .patch(`/enq/${testEnq._id}`)
              .send(testEnq._id);
            // Assert
            expect(deleteRes.status).to.equal(403);
            expect(deleteRes.body.message).to.equal("No token provided");
          });

          it("should return a 401 status when an invalid token is provided", async () => {
            // Arrange
            const invalidToken = "invalidToken";
            // Act
            const deleteRes = await req
              .patch(`/enq/${testEnq._id}`)
              .set("authorization", invalidToken)
              .send(testEnq._id);
            // Assert
            expect(deleteRes.status).to.equal(401);
            expect(deleteRes.body.message).to.equal("Unauthorised");
          });
        });
      });
    });
  });

  describe("POST requests to '/customers/add' on customerRoutes", () => {
    describe("Tests after successful login", () => {
      let addRes;
      let token;
      before(async () => {
        // Arrange
        const validUser = { username: "admin", password: "Password123!" };
        const loginRes = await req.post("/auth/login").send(validUser);
        token = loginRes.headers["authorization"];
      });

      it("should return a 201 status when a valid customer is added", async () => {
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(testNewCustomer);
        // Assert
        expect(addRes.status).to.equal(201);
        expect(addRes.body.message).to.equal("Customer is added");
      });

      it("should send a 400 status when an empty customer is sent", async () => {
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send({});
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when first name is missing", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.firstName = null;
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when last name is missing", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.lastName = null;
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when preferred name is missing", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.preferredName = null;
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when mobile is missing", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.mobile = null;
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when email is missing", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.email = null;
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when email is invalid", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.email = "invalidEmail";
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when first line of address is missing", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.firstLineOfAddress = null;
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when first line of postcode is missing", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.postcode = null;
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when first line of postcode is missing", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.postcode = null;
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when first line of postcode is invalid", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.postcode = "1234";
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when driving licence number is missing", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.drivingLicenceNum = null;
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when driving licence number is invalid", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.drivingLicenceNum = "123";
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 400 status when enquiries are invalid", async () => {
        // Arrange
        let invalidCustomer = { ...testCustomer };
        invalidCustomer.enquiries = "some enquiries";
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(invalidCustomer);
        // Assert
        expect(addRes.status).to.equal(400);
        expect(addRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 500 status when there is an error", async () => {
        // Arrange
        sinon.stub(Customer.prototype, "save").throws(new Error("Test error"));
        // Act
        addRes = await req
          .post("/customers/add")
          .set("authorization", token)
          .send(testNewCustomer);
        // Assert
        expect(addRes.status).to.equal(500);
        expect(addRes.body.message).to.equal("Test error");
      });
    });

    describe("Tests without logging in", () => {
      it("should return a 403 status when no token is provided", async () => {
        // Act
        const res = await req.post("/customers/add").send(testNewCustomer);
        // Assert
        expect(res.status).to.equal(403);
        expect(res.body.message).to.equal("No token provided");
      });

      it("should return a 401 status when an invalid token is provided", async () => {
        // Arrange
        const invalidToken = "invalidToken";
        // Act
        const res = await req
          .post("/customers/add")
          .set("authorization", invalidToken)
          .send(testNewCustomer);
        // Assert
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal("Unauthorised");
      });
    });
  });

  describe("GET requests to '/customers/all' on customerRoutes", () => {
    describe("Tests after successful login", () => {
      let token;
      before(async () => {
        // Arrange
        const validUser = { username: "admin", password: "Password123!" };
        const loginRes = await req.post("/auth/login").send(validUser);
        token = loginRes.headers["authorization"];
      });

      it("should return a 200 status when there are customers", async () => {
        // Act
        const res = await req.get("/customers/all").set("authorization", token);
        // Assert
        expect(res.status).to.equal(200);
        const { __v, ...testCustomerWithoutV } = res.body[0];
        expect(testCustomerWithoutV).to.deep.equal(testCustomer);
      });

      it("should send a 404 status when there is no customer", async () => {
        // Arrange
        try {
          await Customer.deleteMany();
          console.log("Database customer collection cleared");
        } catch (e) {
          console.log(e.message);
          console.log("Error clearing");
          throw new Error();
        }
        // Act
        const res = await req.get("/customers/all").set("authorization", token);
        // Assert
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("No customer found");
      });

      it("should send a 500 status when there is an error", async () => {
        // Arrange
        sinon.stub(Customer, "find").throws(new Error("Test error"));
        // Act
        const res = await req.get("/customers/all").set("authorization", token);
        // Assert
        expect(res.status).to.equal(500);
        expect(res.body.message).to.equal("Test error");
      });
    });

    describe("Tests without logging in", () => {
      it("should return a 403 status when no token is provided", async () => {
        // Act
        const res = await req.get("/customers/all");
        // Assert
        expect(res.status).to.equal(403);
        expect(res.body.message).to.equal("No token provided");
      });

      it("should return a 401 status when an invalid token is provided", async () => {
        // Arrange
        const invalidToken = "invalidToken";
        // Act
        const res = await req
          .get("/customers/all")
          .set("authorization", invalidToken);
        // Assert
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal("Unauthorised");
      });
    });
  });

  describe("PATCH requests to '/customers/:id' on customerRoutes", () => {
    describe("Tests after successful login", () => {
      let updateRes;
      let token;
      before(async () => {
        // Arrange
        const validUser = { username: "admin", password: "Password123!" };
        const loginRes = await req.post("/auth/login").send(validUser);
        token = loginRes.headers["authorization"];
      });

      it("should send a 202 status when the customer is updated", async () => {
        // Act
        updateRes = await req
          .patch(`/customers/${testUpdatedCustomer._id}`)
          .set("authorization", token)
          .send(testUpdatedCustomer);
        // Assert
        expect(updateRes.status).to.equal(202);
        const { __v, ...testUpdatedCustomerWithoutV } = updateRes.body;
        expect(testUpdatedCustomerWithoutV).to.deep.equal(testUpdatedCustomer);
      });

      it("should send a 404 status when customer ID is not found", async () => {
        // Arrange
        const customerWithInvalidID = { ...testUpdatedCustomer };
        customerWithInvalidID._id = "667595289f30b44aa2a7ec66"; // ID of new customer
        // Act
        updateRes = await req
          .patch(`/customers/${customerWithInvalidID._id}`)
          .set("authorization", token)
          .send(customerWithInvalidID);
        // Assert
        expect(updateRes.status).to.equal(404);
        expect(updateRes.body.message).to.equal("Customer not found");
      });

      it("should send a 400 status when an invalid customer is provided", async () => {
        // Arrange
        const customerWithInvalidEmail = { ...testUpdatedCustomer };
        customerWithInvalidEmail.email = "invalidEmail";
        // Act
        updateRes = await req
          .patch(`/customers/${customerWithInvalidEmail._id}`)
          .set("authorization", token)
          .send(customerWithInvalidEmail);
        // Assert
        expect(updateRes.status).to.equal(400);
        expect(updateRes.body.message).to.equal("Invalid customer");
      });

      it("should send a 500 status when there is an error", async () => {
        // Arrange
        sinon.stub(Customer, "findById").resolves(true);
        sinon
          .stub(Customer, "findByIdAndUpdate")
          .throws(new Error("Test error"));
        // Act
        updateRes = await req
          .patch(`/customers/${testUpdatedCustomer._id}`)
          .set("authorization", token)
          .send(testUpdatedCustomer);
        // Assert
        expect(updateRes.status).to.equal(500);
        expect(updateRes.body.message).to.equal("Test error");
      });
    });

    describe("Tests without logging in", () => {
      it("should return a 403 status when no token is provided", async () => {
        // Act
        const updateRes = await req
          .patch(`/customers/${testUpdatedCustomer._id}`)
          .send(testUpdatedCustomer);
        // Assert
        expect(updateRes.status).to.equal(403);
        expect(updateRes.body.message).to.equal("No token provided");
      });

      it("should return a 401 status when an invalid token is provided", async () => {
        // Arrange
        const invalidToken = "invalidToken";
        // Act
        const updateRes = await req
          .patch(`/customers/${testUpdatedCustomer._id}`)
          .set("authorization", invalidToken)
          .send(testUpdatedCustomer);
        // Assert
        expect(updateRes.status).to.equal(401);
        expect(updateRes.body.message).to.equal("Unauthorised");
      });
    });
  });

  describe("DELETE requests to '/customers/:id' on customerRoutes", () => {
    let deleteRes;
    describe("Tests after successful login", () => {
      let token;
      before(async () => {
        // Arrange
        const validUser = { username: "admin", password: "Password123!" };
        const loginRes = await req.post("/auth/login").send(validUser);
        token = loginRes.headers["authorization"];
      });

      it("should send a 200 status when customer is deleted", async () => {
        // Act
        deleteRes = await req
          .delete(`/customers/${testCustomer._id}`)
          .set("authorization", token)
          .send(testCustomer._id);
        // Assert
        expect(deleteRes.status).to.equal(200);
        expect(deleteRes.body.message).to.equal("Customer deleted");
      });

      it("should send a 404 status when customer ID is not found", async () => {
        // Arrange
        const customerWithInvalidID = { ...testCustomer };
        customerWithInvalidID._id = "667595289f30b44aa2a7ec66"; // ID of new customer
        // Act
        deleteRes = await req
          .delete(`/customers/${customerWithInvalidID._id}`)
          .set("authorization", token)
          .send(customerWithInvalidID._id);
        // Assert
        expect(deleteRes.status).to.equal(404);
        expect(deleteRes.body.message).to.equal("Customer not found");
      });

      it("should send a 500 status when there is an error", async () => {
        // Arrange
        sinon.stub(Customer, "findById").resolves(true);
        sinon
          .stub(Customer, "findByIdAndDelete")
          .throws(new Error("Test error"));
        // Act
        deleteRes = await req
          .delete(`/customers/${testCustomer._id}`)
          .set("authorization", token)
          .send(testCustomer._id);
        console.log(deleteRes.body);
        // Assert
        expect(deleteRes.status).to.equal(500);
        expect(deleteRes.body.message).to.equal("Test error");
      });
    });

    describe("Tests without logging in", () => {
      it("should return a 403 status when no token is provided", async () => {
        // Act
        deleteRes = await req
          .delete(`/customers/${testCustomer._id}`)
          .send(testCustomer._id);
        // Assert
        expect(deleteRes.status).to.equal(403);
        expect(deleteRes.body.message).to.equal("No token provided");
      });

      it("should return a 401 status when an invalid token is provided", async () => {
        // Arrange
        const invalidToken = "invalidToken";
        // Act
        deleteRes = await req
          .delete(`/customers/${testCustomer._id}`)
          .set("authorization", invalidToken)
          .send(testCustomer._id);
        // Assert
        expect(deleteRes.status).to.equal(401);
        expect(deleteRes.body.message).to.equal("Unauthorised");
      });
    });
  });
});
