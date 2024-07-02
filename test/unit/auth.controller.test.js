import { expect } from "chai";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sinon from "sinon";

import sendAuthRes from "../../src/controllers/auth.controller.js";
import User from "../../src/models/user.model.js";

describe("sendAuthRes tests", () => {
  let authenticateUserStub;
  let compareSyncStub;
  let signStub;
  let req;
  let res;

  const validUser = {
    username: "admin",
    password: "Password123!",
  };

  beforeEach(() => {
    authenticateUserStub = sinon.stub(User, "findOne");
    compareSyncStub = sinon.stub(bcrypt, "compareSync");
    signStub = sinon.stub(jwt, "sign");
    req = {
      body: {},
    };
    res = {
      header: sinon.stub().returnsThis(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should send back a 200 status and user details when user is authenticated", async () => {
    //Assign
    compareSyncStub.returns(true);
    const testToken = signStub.returns("testToken");
    authenticateUserStub.withArgs({ username: validUser.username }).resolves({
      _id: "testId",
      username: validUser.username,
      accessToken: testToken,
    });
    // Act
    req.body = validUser;
    await sendAuthRes(req, res);
    // Assert
    expect(res.header.calledWith("Authorization", "testToken")).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.send.calledWith({ message: "Login success" })).to.be.true;
  });

  it("should send back a 404 status when username is not found", async () => {
    //Assign
    authenticateUserStub.throws(new Error("User not found"));
    // Act
    await sendAuthRes(req, res);
    // Assert
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.send.calledWith({ message: "User not found" })).to.be.true;
  });

  it("should send back a 401 status when password is invalid", async () => {
    //Assign
    authenticateUserStub.throws(new Error("Unauthorised"));
    // Act
    await sendAuthRes(req, res);
    // Assert
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.send.calledWith({ message: "Unauthorised" })).to.be.true;
  });

  it("should send back a 500 status when service returns an error", async () => {
    //Assign
    authenticateUserStub.throws(new Error());
    // Act
    await sendAuthRes(req, res);
    // Assert
    expect(res.status.calledWith(500)).to.be.true;
  });
});
