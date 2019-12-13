import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostItem from "../posts/PostItem";
import { getPost } from "../../action/post";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
const Post = props => {
  const {
    getPost,
    post: { loading, post },
    match
  } = props;

  useEffect(() => {
    getPost(match.params.id);
  }, [getPost]);

  return (
    <div className="container">
      {loading || post === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/posts" className="btn">
            Go Back
          </Link>
          <PostItem post={post} showActions={false} />
         
          <div className="comments">
            {post.comments.map(comment => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={post._id}
              />
            ))}
          </div>
          <CommentForm postId={post._id} />
        </Fragment>
      )}
    </div>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProp = state => ({
  post: state.post
});
export default connect(mapStateToProp, { getPost })(Post);
