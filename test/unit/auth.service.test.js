import { expect } from "chai";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sinon from "sinon";

import authenticateUser from "../../src/services/auth.service.js";
import User from "../../src/models/user.model.js";

describe("authenticateUser tests", () => {
  let authenticateUserStub;
  let compareSyncStub;
  let signStub;

  const validUser = {
    username: "admin",
    password: "Password123!",
  };

  const invalidUser = {
    username: "no-such-user",
    password: "Password123!",
  };

  beforeEach(() => {
    authenticateUserStub = sinon.stub(User, "findOne");
    compareSyncStub = sinon.stub(bcrypt, "compareSync");
    signStub = sinon.stub(jwt, "sign");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should call authenticateUser on the User model", async () => {
    // Assign
    compareSyncStub.returns(true);
    signStub.returns("");
    authenticateUserStub
      .withArgs({ username: validUser.username })
      .resolves({});
    // Act
    await authenticateUser(validUser);
    // Assert
    expect(authenticateUserStub.calledOnce).to.be.true;
  });

  it("should return the result of calling authenticateUser on the User model", async () => {
    //Assign
    compareSyncStub.returns(true);
    const testToken = signStub.returns("testToken");
    authenticateUserStub.withArgs({ username: validUser.username }).resolves({
      _id: "testId",
      username: validUser.username,
      accessToken: testToken,
    });
    // Act
    const result = await authenticateUser(validUser);
    // Assert
    expect(result).to.deep.equal({
      _id: "testId",
      username: "admin",
      accessToken: "testToken",
    });
  });

  it("should throw an error when username is not found", async () => {
    // Assign
    const error = new Error("User not found");
    authenticateUserStub.throws(error);
    // Act
    try {
      await authenticateUser(invalidUser);
      assert.fail("Expected error was not thrown");
    } catch (e) {
      // Assert
      expect(e.message).to.equal(error.message);
    }
  });

  it("should throw an error when password is invalid", async () => {
    // Assign
    compareSyncStub.returns(true);
    const error = new Error("Unauthorised");
    authenticateUserStub.throws(error);
    // Act
    try {
      await authenticateUser(invalidUser);
      assert.fail("Expected error was not thrown");
    } catch (e) {
      // Assert
      expect(e.message).to.equal(error.message);
    }
  });
});
