const verifyPassword = require("../models/verifyPassword");
const setUserPassword = require("../models/setUserPassword");
const bcrypt = require("bcrypt");

const setUserPasswordController = async (req, res) => {
  const user = req.user;
  const oldPass = req.body.password;
  const newPass = req.body.newPass;
  const newPass2 = req.body.newPass2;

  if (!oldPass) {
    res.status(400).send("password required");
    return;
  }

  if (!newPass || !(newPass === newPass2)) {
    res.status(400).send("pass to short or doesn't match");
    return;
  }

  try {
    if (!(await verifyPassword(user, oldPass))) {
      res.status(400).send("wrong pass");
      return;
    }

    const hashedPass = await bcrypt.hash(newPass, 10);

    const result = await setUserPassword(user.id, hashedPass);

    res.end(`${result}`); // redirect to something norml later
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = setUserPasswordController;
