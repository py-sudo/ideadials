const router = require("express").Router();

const Profile = require("../../Models/Profile");
const User = require("../../Models/User");
const Posts = require('../../Models/Posts')
const auth = require("../../middleware/auth");

const request = require("request");
const config = require("config");
const { check, validationResult } = require("express-validator");

//@route    GET api/profile
//@desc     Test route
//@access    Public

router.get("/me", auth, async (req, res) => {
  try {

    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "no profile for user" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route    POST api/profile
//@desc     create or update user profile
//@access    Private

// create or update profile
const checkInfo = [
  check("status", "status is required")
    .not()
    .isEmpty(),
  check("skills", "skills is required")
    .not()
    .isEmpty()
];

router.post("/", [auth, checkInfo], async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });

  const {
    handle,
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
    skills
  } = req.body;

  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;

  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  // Skills - Spilt into array
  //   if (typeof req.body.skills !== "undefined") {
  //     profileFields.skills = req.body.skills.split(",").trim();
  //   }
  if (skills) {
    profileFields.skills = skills.split(",").map(e => e.trim());
  }
  // Social
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;
  try {
    const profile = await Profile.findOne({user: req.user.id});
    //if found
    if (profile) {
     await Profile.findOneAndUpdate({
        user: req.user.id,
        $set: profileFields,
        new: true
      });

      return res.json(profile);
    }

    // if not found

    profile = new Profile(profileFields);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route    GET api/profile
//@desc     get all profiles
//@access    Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    
    res.json(profiles);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});
//@route    GET api/profile/user/:user_id
//@desc     get profiles by id
//@access    Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("server error");
  }
});

//@route    DELETE api/profile
//@desc     Delete profile,user and posts
//@access    Private

router.delete("/profile", auth, async (req, res) => {
  try {
    //@todo - remove user posts
    const posts = await Posts.deleteMany({user:req.user.id});

    //remove profile
    const profile = await Profile.findOneAndRemove({ user: req.user.id });
    //remove user
    const user = await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "user deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("server error");
  }
});

//@route    PUT api/profile/experience
//@desc     add profile experience
//@access   Private
const checkExp = [
  check("title", "title is required")
    .not()
    .isEmpty(),
  check("company", "company is required")
    .not()
    .isEmpty(),
  check("from", "from is required")
    .not()
    .isEmpty()
];

router.put("/experience", [auth, checkExp], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).send({ errors: errors.array() });
  }

  const { title, company, location, from, to, current, description } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp); //adding to begining of an array

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.msg });
  }
});
//@route    DELETE api/profile/experience/:exp_id
//@desc     delete experience by user id from profile
//@access   Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.msg });
  }
});

//@route    PUT api/profile/education
//@desc     add profile education
//@access   Private
const checkEdu = [
  check("school", "school is required")
    .not()
    .isEmpty(),
  check("degree", "degree is required")
    .not()
    .isEmpty(),
  check("from", "from is required")
    .not()
    .isEmpty(),
  check("fieldofstudy", "fieldofstudy is required")
    .not()
    .isEmpty()
];

router.put("/education", [auth, checkEdu], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).send({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(newEdu); //adding to begining of an array

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.msg });
  }
});

//@route    DELETE api/profile/education/:edu_id
//@desc     delete education by user id from profile
//@access   Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.msg });
  }
});

//@route    GET api/profile/github/:username
//@desc     get user repo from github
//@access   Public

router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&cliend_id=
      ${config.get("githubClientId")}
      &client_secret=
      ${config.get("githubClientSecret")}
      )`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };
    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode !== 200) {
        return res.status(404).send({ msg: "No github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.msg });
  }
});

module.exports = router;
