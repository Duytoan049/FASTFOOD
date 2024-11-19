const knex = require("../database/knex");
const bcrypt = require("bcrypt");
function userRepository() {
  return knex("user");
}
function readUser(payload) {
  return {
    username: payload.username,
    password: payload.password,
    user_role: payload.user_role,
    id: payload.id,
  };
}
async function createUser(payload) {
  const user = readUser(payload);
  const hashedPassword = await bcrypt.hash(user.password, 10); // Ma hoa password voi cap do 10
  user.password = hashedPassword;
  const [id] = await userRepository().insert(user);
  return { id, ...user };
}
async function findUserByUsername(username) {
  return userRepository().where("username", username).select("*").first();
}
async function getLastUser() {
  return userRepository().orderBy("id", "desc").first();
}
module.exports = {
  createUser,
  findUserByUsername,
  getLastUser,
};
