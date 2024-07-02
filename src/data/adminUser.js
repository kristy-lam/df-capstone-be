import bcrypt from "bcrypt";

const adminUser = {
  _id: "66756c4ba852590245b52760",
  username: "admin",
  password: bcrypt.hashSync("Password123!", 10),
};

export default adminUser;
