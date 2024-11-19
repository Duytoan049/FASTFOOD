const UsersServices = require("../services/users.service");
const CustomersServices = require("../services/customers.service"); // Import dịch vụ khách hàng
const ApiError = require("../api-error");
const JSend = require("../jsend");
const bcrypt = require("bcrypt");
async function createUser(req, res) {
  try {
    const user = await UsersServices.createUser(req.body);
    const lastUser = await UsersServices.getLastUser();
    const lastUserId = lastUser.id;
    const customerData = {
      id: lastUserId,
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      gender: req.body.gender,
      avatar: req.body.avatar,
    };

    await CustomersServices.createCustomer(customerData);

    return res
      .status(201)
      .json(JSend.success({ user, customer: customerData }));
  } catch (error) {
    return res.status(500).json(JSend.error({ message: error.message }));
  }
}

async function getUserByUsername(req, res) {
  try {
    const { username, password } = req.body;
    const user = await UsersServices.findUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // So sánh mật khẩu đã hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    req.session.user = {
      id: user.id,
      username: user.username,
      user_role: user.user_role,
      password: user.password,
    };
    return res.json({
      message: "Login successfully!",
      user: {
        id: user.id,
        username: user.username,
        user_role: user.user_role,
        password: user.password,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: error.message });
  }
}
async function logout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.clearCookie("connect.sid"); // Xóa cookie phiên
      return res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
module.exports = {
  createUser,
  getUserByUsername,
  logout,
};
