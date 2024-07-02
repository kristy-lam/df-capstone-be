import mongoose from "mongoose";
import loadConfig from "../config/config.js";
import Enq from "../models/enq.model.js";
import User from "../models/user.model.js";

loadConfig;

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.enq = Enq;
db.user = User;

const connectToDatabase = async () => {
  try {
    await db.mongoose.connect(process.env.DB_URI);
    return console.log("Database connection was successful");
  } catch (e) {
    console.log("Database connection error:", e);
  }
};

const disconnectFromDatabase = async () => {
  try {
    await db.mongoose.disconnect();
  } catch (e) {
    console.log("Error disconnecting from the database:", e);
  }
};

export { db, connectToDatabase, disconnectFromDatabase };
