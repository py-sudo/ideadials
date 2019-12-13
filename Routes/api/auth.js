const router = require("express").Router();
const User = require("../../Models/User");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

//@route    GET api/auth
//@desc     Test route
//@access    Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route    POST api/auth
//@desc     login user route
//@access    Public


const checkInfo = [
  check("email", "Please Include email").isEmail(),
  check("password", "Please enter a password with 6 or more chars").exists()
];



router.post("/", checkInfo, async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }

  const { email, password } = req.body;

  // See if user exits
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });



    //return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 36000
      },
      (err, token) => {
        if (err) throw err;

        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
});

module.exports = router;
