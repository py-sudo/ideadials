import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {deleteComment} from '../../action/post'
import Moment from "react-moment";

const CommentItem = props => {
  const {
    postId,
    comment: { _id, text, name, avatar, user, date },
    auth,
    deleteComment
  } = props;

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user.id}`}>
          <img className="round-img" src={avatar} alt="avatar" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>
        {!auth.loading && user===auth.user._id && (
          <button className="btn btn-danger" onClick={e=>deleteComment(postId,_id)}>
            <i class="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment:PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {deleteComment})(CommentItem);
