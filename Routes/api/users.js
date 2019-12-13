const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const User = require("../../Models/User");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const config = require("config");

const bcrypt = require("bcryptjs");
//@route    GET api/users
//@desc     Register user route
//@access    Public

const checkInfo = [
  check("name", "Name is required")
    .not()
    .isEmpty(),
  check("email", "Please Include email").isEmail(),
  check("password", "Please enter a password with 6 or more chars").isLength({
    min: 6
  })
];

router.post("/", checkInfo, async (req, res) => {
  const err = validationResult(req);
  console.log(req.body);
  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }

  const { name, email, password } = req.body;

  // See if user exits
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "user already exits" }] });
    }
    //get user avatar
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm"
    });

    user = new User({
      name,
      email,
      avatar,
      password
    });
    //encryt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();


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
        //expiresIn: 36000
        expiresIn: "2 days"

      },
      (err, token) => {
        if (err) throw err;

        res.json({ token });
      }
    );

    // res.status(200).send("user registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
});

module.exports = router;
