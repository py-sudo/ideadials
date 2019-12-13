const router = require("express").Router();

const Posts = require("../../Models/Posts");
const User = require("../../Models/User");
const Profile = require("../../Models/Profile");

const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

//@route    POST api/posts
//@desc     creat post
//@access    Public

const checkPost = [
  check("text", "text is required")
    .not()
    .isEmpty()
];

router.post("/", [auth, checkPost], async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });

  //get user
  try {
    const user = await User.findById(req.user.id).select("-password");

    const newPost = new Posts({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    await newPost.save();
    res.json(newPost)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route    GET  api/posts
//@desc     GET ALL POSTS
//@access    Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Posts.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route    GET  api/posts/:id
//@desc     get post by id
//@access    Private

router.get("/:id", auth, async (req, res) => {
  try {
    const posts = await Posts.findById(req.params.id);
    if (!posts) return res.status(404).send("post not found");

    res.json(posts);
    
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") return res.status(404).send("post not found");
    res.status(500).send("server error");
  }
});


//@route    GET  api/posts
//@desc     get post by id
//@access    Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) return res.status(404).send("post not found");

    // check on the user
    if (post.user.toString() !== req.user.id) {
      // check if user is the owner of the posts
      return res.status(401).send("not authorized");
    }
    await post.remove();

    res.json(post);

  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") return res.status(404).send("post not found");
    res.status(500).send("server error");
  }
});


//@route    POST  api/posts/like/:id
//@desc     get post by id
//@access    Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    // check if the post has already been liked by this user

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).send({ msg: "You have already liked the post" });
    }
    // take post likes and add to it
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") return res.status(404).send("post not found");
    res.status(500).send("server error");
  }
});



//@route    POST  api/posts/unlike/:id
//@desc    unlike a post
//@access    Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    // check if the post has already been liked by this user

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length = 0
    ) {

      return res.status(400).send({ msg: "You have not yet liked the post" });
    }
    // take post likes and remove user from it

    const removeIndex = post.likes.map(user=>user.id).indexOf(req.user.id)
    post.likes.splice(removeIndex,1);

    await post.save();
    res.json(post.likes);

  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") return res.status(404).send("post not found");
    res.status(500).send("server error");
  }
});


//@route    POST  api/posts/comments/:id
//@desc      post an comment on a post
//@access    Private

const checkComment = [
  check("text", "text is required")
    .not()
    .isEmpty()
];

router.post("/comments/:post_id", [auth, checkComment], async (req, res) => {
    const err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });

  try {
    const post = await Posts.findById(req.params.post_id);
    if (!post) return res.status(400).send({ msg: "Invalid request" });
    const user = await User.findById(req.user.id).select("-password");

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };

    post.comments.unshift(newComment);

    await post.save();
    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") return res.status(404).send("post not found");
    res.status(500).send("server error");
  }
});



//@route    DELETE comment  api/posts/comments/:id
//@desc     delete a comment of a post
//@access    Private

router.delete("/comments/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.post_id);
    // let comment = post.comments.find(cm=>cm.id===req.params.comment_id);
    // if(comment.user.toString()!==req.user.id)return res.status(400).send({ error: "Not authorized" });

    let targetComment = post.comments
    .filter(cm => cm.user.toString() === req.user.id)
    .filter(cm => cm._id === req.params.comment_id);
    if (!targetComment) {
      return res.status(400).send({ error: "Not authorized" });
    }

 
    // take post remove this comment
    let removeIndex = post.comments.indexOf(targetComment);
    post.comments.splice(removeIndex, targetComment);

    await post.save();
    res.json(post.comments);
    
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") return res.status(404).send("post not found");
    res.status(500).send("server error");
  }
});

module.exports = router;
