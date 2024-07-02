import bcrypt from "bcrypt";

const testUser = {
  _id: "66756c4ba852590245b52768",
  username: "admin",
  password: bcrypt.hashSync("Password123!", 10),
};

export default testUser;
