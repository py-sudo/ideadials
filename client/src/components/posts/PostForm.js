import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../action/post";

const PostForm = props => {
    const {addPost} = props;
  const [text, setText] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    addPost({ text });
    setText("");
  };

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Share your ideas, let's solve it together...</h3>
      </div>

      <form className="form my-1"onSubmit={e=>onSubmit(e)}>
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Share your ideas here"
          onChange={e => setText(e.target.value)}
          value={text}
          required
        ></textarea>
     
       <input type="submit" className="btn btn-dark my-1" value="Submit" />

      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(null, { addPost })(PostForm);
