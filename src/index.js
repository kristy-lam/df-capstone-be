import cors from "cors";
import express from "express";
import morgan from "morgan";

import { connectToDatabase } from "./db/db.js";
import loadConfig from "./config/config.js";
import authRouter from "./routes/auth.routes.js";
import enqRouter from "./routes/enq.routes.js";
import customerRouter from "./routes/customer.routes.js";

const corsOptions = {
  exposedHeaders: "Authorization",
};

loadConfig();
connectToDatabase();

const app = express();
app.use(cors(corsOptions));
app.use(morgan(`tiny`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/enq", enqRouter);
app.use("/customers", customerRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke...");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
