import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: String,
  likes: [{ type: Schema.Types.ObjectId, ref: "likePost" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "commentPost" }],
  userId: Number,
  image: String,
  date: { type: Date, default: Date.now },
});

const commentPostSchema = new Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: Number,
  content: String,
  likes: [{ type: Schema.Types.ObjectId, ref: "likeComment" }],
  parentId: Number,
});

commentPostSchema.pre("save", async function (next) {
  try {
    await models.post.findOneAndUpdate(
      { _id: this.postId },
      { $push: { comments: this._id } },
      { new: true }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const likePostSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "post" },
  userId: Number,
});

likePostSchema.pre("save", async function (next) {
  try {
    await models.post.findOneAndUpdate(
      { _id: this.postId },
      { $push: { likes: this._id } },
      { new: true }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const likeEventSchema = new Schema({
  eventId: Number,
  userId: Number,
});

const likeCommentSchema = new Schema({
  commentId: { type: Schema.Types.ObjectId, ref: "commentPost" },
  userId: Number,
});

likeCommentSchema.pre("save", async function (next) {
  try {
    await models.commentPost.findOneAndUpdate(
      { _id: this.commentId },
      { $push: { likes: this._id } },
      { new: true }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const imageSchema = new Schema({
  url: String,
  postId: Number,
});

const chatSchema = new Schema({
  name: String,
  user_id: Number,
  contact_id: Number,
  accepted: Boolean

});

const messageSchema = new Schema({
  chat_id: { type: Schema.Types.ObjectId, ref: "chat" },
  content: String,
  user_id: Number,
  sent_at: { type: Date, default: Date.now },
  read_at: { type: Date, default: null },
  state: { type: String, enum: ['enviado', 'recibido', 'leido'] }
});

const models = {
  post: mongoose.model("post", postSchema),
  commentPost: mongoose.model("commentPost", commentPostSchema),
  likePost: mongoose.model("likePost", likePostSchema),
  likeEvent: mongoose.model("likeEvent", likeEventSchema),
  likeComment: mongoose.model("likeComment", likeCommentSchema),
  image: mongoose.model("image", imageSchema),
  chat: mongoose.model("chat", chatSchema),
  message: mongoose.model("message", messageSchema)
};

export default models;
