import mongoose from "mongoose";
import models from "./models.js";
import minimist from "minimist";
import express from "express";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Spottunes API",
      version: "1.0.0",
      description: "Spottunes API",
    },
    servers: [
      {
        url: "http://localhost:8086",
      },
    ],
  },
  apis: ["./mongo.js"],
};

const app = express();
app.use(express.static("./imgs"));

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const argv = minimist(process.argv.slice(2));
const host = argv.host || "mongodb";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const hostimgs = argv.host || "localhost";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;

mongoose
  .connect(`mongodb://${mongoUser}:${mongoPassword}@${host}:27017/spottunes`, {
    authSource: "admin",
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *         userId:
 *           type: number
 *         image:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *     CommentPost:
 *       type: object
 *       properties:
 *         postId:
 *           type: string
 *         userId:
 *           type: number
 *         content:
 *           type: string
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         parentId:
 *           type: number
 *     LikePost:
 *       type: object
 *       properties:
 *         postId:
 *           type: string
 *         userId:
 *           type: number
 *     LikeComment:
 *       type: object
 *       properties:
 *         commentId:
 *           type: string
 *         userId:
 *           type: number
 *     Image:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *         postId:
 *           type: number
 *     Chat:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         user_id:
 *           type: number
 *         contact_id:
 *           type: number
 *         accepted:
 *           type: boolean
 *     Message:
 *       type: object
 *       properties:
 *         chat_id:
 *           type: string
 *         content:
 *           type: string
 *         user_id:
 *           type: number
 *         sent_at:
 *           type: string
 *           format: date-time
 *         read_at:
 *           type: string
 *           format: date-time
 *         state:
 *           type: string
 *           enum: ['enviado', 'recibido', 'leido']
 *     LikeEvent:
 *       type: object
 *       properties:
 *         eventId:
 *           type: Number
 *         userId:
 *           type: Number
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crea una nova publicació
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: La publicació creada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Error del servidor
 */
app.post("/posts", async (req, res) => {
  const post = req.body;
  try {
    var createdPost = {
      content: post.content,
      likes: [],
      comments: [],
      userId: post.userId,
      image: post.image,
    };
    res.send(await models.post.create(createdPost));
  } catch (error) {
    console.error("Error:", error);
  }
});

/**
 * @swagger
 * /posts:
 *   delete:
 *     summary: Elimina una publicació
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicació a eliminar
 *     responses:
 *       200:
 *         description: Publicació eliminada amb èxit.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Publicació eliminada amb èxit
 *       500:
 *         description: Error del servidor
 */
app.delete("/posts", async (req, res) => {
  try {
    const post = await models.post.findOneAndDelete({ _id: req.query.postId });

    await models.likePost.deleteMany({ postId: post._id });
    await models.commentPost.deleteMany({ postId: post._id });

    console.log("Post deleted:", post);
    res.send("Post deleted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
});

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obté les publicacions d'un usuari
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de l'usuari per obtenir les seves publicacions
 *     responses:
 *       200:
 *         description: Llista de publicacions de l'usuari
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Error del servidor
 */
app.get("/posts", async (req, res) => {
  try {
    const posts = await models.post.find({ userId: req.query.userId });
    console.log("Posts:", posts);
    res.send(posts);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
});

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Obté una publicació pel seu ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicació per obtenir-la
 *     responses:
 *       200:
 *         description: Publicació trobada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Publicació no trobada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No s'ha trobat la publicació
 *       500:
 *         description: Error del servidor
 */
app.get("/posts/:postId", async (req, res) => {
  try {
    const post = await models.post.findOne({ _id: req.params.postId });
    console.log("Post:", post);
    res.send(post);
  } catch (error) {
    console.error("Error:", error);
    res.status(404).send({ error: error.message });
  }
});

/* EVENTS */
/**
 * @swagger
 * /likeEvent:
 *   post:
 *     summary: Crea un nou like per a un esdeveniment
 *     tags: [LikesEvents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: number
 *               userId:
 *                 type: number
 *     responses:
 *       200:
 *         description: LikeEvent creat amb èxit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikeEvent'
 *       500:
 *         description: Error del servidor
 */

app.post("/likeEvent", async (req, res) => {
  try {
    const likeEvent = await models.likeEvent.create({
      eventId: req.body.eventId,
      userId: req.body.userId,
    });
    console.log("LikeEvent created:", likeEvent);
    res.send(likeEvent);
  } catch (error) {
    console.error("Error:", error);
  }
});

/**
 * @swagger
 * /likeEvents:
 *   get:
 *     summary: Obté els likes d'un usuari per a esdeveniments
 *     tags: [LikesEvents]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de l'usuari per obtenir els seus likes
 *     responses:
 *       200:
 *         description: Llista de likes de l'usuari per a esdeveniments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LikeEvent'
 *       500:
 *         description: Error del servidor
 */
app.get("/likeEvents", async (req, res) => {
  try {
    const likeEvents = await models.likeEvent.find({
      userId: req.query.userId,
    });
    res.send(likeEvents);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
});

/**
 * @swagger
 * /likeEvents/{eventId}:
 *   get:
 *     summary: Obté el nombre de seguidors d'un esdeveniment
 *     tags: [LikesEvents]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'esdeveniment per obtenir el nombre de seguidors
 *     responses:
 *       200:
 *         description: Nombre de seguidors de l'esdeveniment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eventFollowers:
 *                   type: number
 *       404:
 *         description: Esdeveniment no trobat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No s'ha trobat l'esdeveniment
 *       500:
 *         description: Error del servidor
 */

app.get("/likeEvents/:eventId", async (req, res) => {
  try {
    const likeEventCount = await models.likeEvent.countDocuments({
      eventId: req.params.eventId,
    });
    res.send({ eventFollowers: likeEventCount });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).send({ error: error.message });
  }
});

/**
 * @swagger
 * /likeEvents/{eventId}/followers:
 *   get:
 *     summary: Obté els seguidors d'un esdeveniment
 *     tags: [LikesEvents]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'esdeveniment per obtenir els seus seguidors
 *       - in: query
 *         name: p
 *         schema:
 *           type: number
 *         description: Pàgina de resultats (opcional)
 *     responses:
 *       200:
 *         description: Llista de seguidors de l'esdeveniment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LikeEvent'
 *       404:
 *         description: Esdeveniment no trobat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No s'ha trobat l'esdeveniment
 *       500:
 *         description: Error del servidor
 */

app.get("/likeEvents/:eventId/followers", async (req, res) => {
  const page = req.query.p || 0;
  const followersperPage = 10;

  try {
    const likeEventFollowers = await models.likeEvent
      .find({
        eventId: req.params.eventId,
      })
      .skip(page * followersperPage)
      .limit(followersperPage);
    console.log("LikeEvent followers:", likeEventFollowers);
    res.send(likeEventFollowers);
  } catch (error) {
    console.error("Error:", error);
    res.status(404).send({ error: error.message });
  }
});

/**
 * @swagger
 * /likeEvent:
 *   delete:
 *     summary: Elimina un like per a un esdeveniment
 *     tags: [LikesEvents]
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de l'esdeveniment
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de l'usuari
 *     responses:
 *       200:
 *         description: LikeEvent eliminat amb èxit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikeEvent'
 *       500:
 *         description: Error del servidor
 */

app.delete("/likeEvent", async (req, res) => {
  try {
    const likeEvent = await models.likeEvent.findOneAndDelete({
      eventId: req.query.eventId,
      userId: req.query.userId,
    });
    console.log("LikeEvent deleted:", likeEvent);
    res.send(likeEvent);
  } catch (error) {
    console.error("Error:", error);
  }
});

/* LIKES */

/**
 * @swagger
 * /likePost:
 *   post:
 *     summary: Crea un nou like per a una publicació
 *     tags: [LikesPost]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: number
 *               userId:
 *                 type: number
 *     responses:
 *       200:
 *         description: LikePost creat amb èxit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikePost'
 *       500:
 *         description: Error del servidor
 */

app.post("/likePost", async (req, res) => {
  try {
    const likePost = await models.likePost.create({
      postId: req.body.postId,
      userId: req.body.userId,
    });
    console.log("LikePost created:", likePost);
    res.send(likePost);
  } catch (error) {
    console.error("Error:", error);
  }
});

/**
 * @swagger
 * /likePosts:
 *   get:
 *     summary: Obté els likes d'un usuari per a publicacions
 *     tags: [LikesPost]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de l'usuari per obtenir els seus likes de publicacions
 *     responses:
 *       200:
 *         description: Llista de likes de l'usuari per a publicacions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LikePost'
 *       500:
 *         description: Error del servidor
 */

app.get("/likePosts", async (req, res) => {
  try {
    const likePosts = await models.likePost.find({
      userId: req.query.userId,
    });
    res.send(likePosts);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
});

/**
 * @swagger
 * /likePosts/{postId}:
 *   get:
 *     summary: Obté el nombre de likes d'una publicació
 *     tags: [LikesPost]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicació per obtenir el nombre de likes
 *     responses:
 *       200:
 *         description: Nombre de likes de la publicació
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postLikes:
 *                   type: number
 *       404:
 *         description: Publicació no trobada o ID de publicació invàlid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Publicació no trobada
 *       500:
 *         description: Error del servidor
 */
app.get("/likePosts/:postId", async (req, res) => {
  try {
    const postExists = await models.post.exists({ _id: req.params.postId });
    if (!postExists) {
      throw new Error("Post does not exist");
    }
    const likePostCount = await models.likePost.countDocuments({
      postId: req.params.postId,
    });
    console.log("LikePost count:", likePostCount);
    res.send({ postLikes: likePostCount });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).send({ error: error.message });
  }
});

/**
 * @swagger
 * /likePost:
 *   delete:
 *     summary: Elimina un like d'una publicació
 *     tags: [LikesPost]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de la publicació
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de l'usuari
 *     responses:
 *       200:
 *         description: Like d'una publicació eliminat amb èxit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikePost'
 *       500:
 *         description: Error del servidor
 */

app.delete("/likePost", async (req, res) => {
  try {
    const likePost = await models.likePost.findOneAndDelete({
      postId: req.query.postId,
      userId: req.query.userId,
    });

    // Remove the _id from the likes array of the post
    await models.post.updateOne(
      { _id: req.query.postId },
      { $pull: { likes: likePost._id } }
    );

    console.log("LikePost deleted:", likePost._id);
    res.send(likePost);
  } catch (error) {
    console.error("Error:", error);
  }
});

/* COMMENTS */
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Crea un nou comentari en una publicació
 *     tags: [Comentaris]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: number
 *               content:
 *                 type: string
 *               parentId:
 *                 type: number
 *               userId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Comentari creat amb èxit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentPost'
 *       500:
 *         description: Error del servidor
 */
app.post("/comments", async (req, res) => {
  const comment = req.body;
  try {
    var createdComment = {
      postId: comment.postId,
      content: comment.content,
      likes: [],
      parentId: comment.parentId,
      userId: comment.userId,
    };
    res.send(await models.commentPost.create(createdComment));
  } catch (error) {
    console.error("Error:", error);
  }
});

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Obté els comentaris d'una publicació
 *     tags: [Comentaris]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de la publicació per obtenir els seus comentaris
 *     responses:
 *       200:
 *         description: Llista de comentaris de la publicació
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommentPost'
 *       500:
 *         description: Error del servidor
 */

app.get("/comments", async (req, res) => {
  try {
    const comments = await models.commentPost.find({
      postId: req.query.postId,
    });
    console.log("Comments:", comments);
    res.send(comments);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
});

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Obté el nombre de comentaris d'una publicació
 *     tags: [Comentaris]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicació per obtenir el nombre de comentaris
 *     responses:
 *       200:
 *         description: Nombre de comentaris de la publicació
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postComments:
 *                   type: number
 *       404:
 *         description: Publicació no trobada o ID de publicació invàlid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Publicació no trobada
 *       500:
 *         description: Error del servidor
 */
app.get("/comments/:postId", async (req, res) => {
  try {
    const postExists = await models.post.exists({ _id: req.params.postId });
    if (!postExists) {
      throw new Error("Post does not exist");
    }
    const commentCount = await models.commentPost.countDocuments({
      postId: req.params.postId,
    });
    console.log("Comment count:", commentCount);
    res.send({ postComments: commentCount });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).send({ error: error.message });
  }
});

/**
 * @swagger
 * /comments:
 *   delete:
 *     summary: Elimina un comentari
 *     tags: [Comentaris]
 *     parameters:
 *       - in: query
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comentari a eliminar
 *     responses:
 *       200:
 *         description: Comentari eliminat amb èxit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentPost'
 *       500:
 *         description: Error del servidor
 */
app.delete("/comments", async (req, res) => {
  try {
    const comment = await models.commentPost.findOneAndDelete({
      _id: req.query.commentId,
    });

    await models.likeComment.deleteMany({ commentId: comment._id });
    await models.commentPost.deleteMany({ parentId: comment._id });

    console.log("Comment deleted:", comment);
    res.send("Comment deleted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
});

/* LIKES A COMENTARIOS */

/**
 * @swagger
 * /likeComment:
 *   post:
 *     summary: Crea un nou like per a un comentari
 *     tags: [LikesComentaris]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *               userId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Like per a un comentari creat amb èxit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikeComment'
 *       500:
 *         description: Error del servidor
 */
app.post("/likeComment", async (req, res) => {
  try {
    const likeComment = await models.likeComment.create({
      commentId: req.body.commentId,
      userId: req.body.userId,
    });
    console.log("LikeComment created:", likeComment);
    res.send(likeComment);
  } catch (error) {
    console.error("Error:", error);
  }
});

/**
 * @swagger
 * /likeComments:
 *   get:
 *     summary: Obté els likes dels comentaris per a un usuari
 *     tags: [LikesComentaris]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de l'usuari per obtenir els seus likes de comentaris
 *     responses:
 *       200:
 *         description: Llista de likes de comentaris de l'usuari
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LikeComment'
 *       500:
 *         description: Error del servidor
 */
app.get("/likeComments", async (req, res) => {
  try {
    const likeComments = await models.likeComment.find({
      userId: req.query.userId,
    });
    console.log("LikeComments:", likeComments);
    res.send(likeComments);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
});

/**
 * @swagger
 * /likeComments/{commentId}:
 *   get:
 *     summary: Obté el nombre de likes d'un comentari
 *     tags: [LikesComentaris]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comentari per obtenir el nombre de likes
 *     responses:
 *       200:
 *         description: Nombre de likes del comentari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commentLikes:
 *                   type: number
 *       404:
 *         description: Comentari no trobat o ID de comentari invàlid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Comentari no trobat
 *       500:
 *         description: Error del servidor
 */
app.get("/likeComments/:commentId", async (req, res) => {
  try {
    const commentExists = await models.commentPost.exists({
      _id: req.params.commentId,
    });
    if (!commentExists) {
      throw new Error("Comment does not exist");
    }
    const likeCommentCount = await models.likeComment.countDocuments({
      commentId: req.params.commentId,
    });
    console.log("LikeComment count:", likeCommentCount);
    res.send({ commentLikes: likeCommentCount });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).send({ error: error.message });
  }
});

/**
 * @swagger
 * /likeComment:
 *   delete:
 *     summary: Elimina un like d'un comentari
 *     tags: [LikesComentaris]
 *     parameters:
 *       - in: query
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comentari associat al like a eliminar
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de l'usuari associat al like a eliminar
 *     responses:
 *       200:
 *         description: Like d'un comentari eliminat amb èxit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikeComment'
 *       500:
 *         description: Error del servidor
 */
app.delete("/likeComment", async (req, res) => {
  try {
    const likeComment = await models.likeComment.findOneAndDelete({
      commentId: req.query.commentId,
      userId: req.query.userId,
    });
    console.log("LikeComment deleted:", likeComment);
    res.send(likeComment);
  } catch (error) {
    console.error("Error:", error);
  }
});

/**
 * @swagger
 * /uploadImage:
 *   post:
 *     summary: Pujar una imatge
 *     tags: [Imatges]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: URL de la imatge pujada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link:
 *                   type: string
 *                   description: URL de la imatge pujada
 *       500:
 *         description: Error del servidor
 */
app.post("/uploadImage", upload.single("img"), async (req, res) => {
  fs.access("./imgs", (error) => {
    if (error) {
      fs.mkdirSync("./imgs");
    }
  });
  const { buffer, originalname } = req.file;
  const timestamp = new Date().toISOString();
  const link = `${timestamp}.png`;
  await sharp(buffer)
    .png({ quality: 60 })
    .toFile("./imgs/" + link);
  return res.json({ link });
});

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Comprova si existeix un xat entre dos usuaris i retorna els missatges si existeix
 *     tags: [Xats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *                 description: ID de l'usuari
 *               contact_id:
 *                 type: number
 *                 description: ID del contacte
 *     responses:
 *       200:
 *         description: Xat existent i els seus missatges, o un array buit si no existeix
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatExists:
 *                   $ref: '#/components/schemas/Chat'
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       500:
 *         description: Error del servidor
 */

app.post("/chat", async (req, res) => {
  console.log("Chat request:", req.body);
  try {
    let chatExists = await models.chat.findOne({
      $or: [
        { user_id: req.body.user_id, contact_id: req.body.contact_id },
        { user_id: req.body.contact_id, contact_id: req.body.user_id },
      ],
    });

    console.log("Chat exists:", chatExists);

    if (chatExists != null) {
      let messages;
      try {
        messages = models.message
          .find({ chat_id: chatExists._id })
          .limit(45)
          .sort({ sent_at: -1 });
        console.log(res.json({ chatExists: chatExists, messages: messages }));
        return res.json({
          chatExists: chatExists,
          messages: messages,
        });
      } catch (error) {
        res.json({ chatExists: chatExists });
      }
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Obtén tots els xats d'un usuari i el nombre de missatges nous
 *     tags: [Xats]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de l'usuari
 *     responses:
 *       200:
 *         description: Llista de xats amb el recompte de missatges nous
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del xat
 *                   user_id:
 *                     type: number
 *                     description: ID de l'usuari
 *                   contact_id:
 *                     type: number
 *                     description: ID del contacte
 *                   messageCount:
 *                     type: number
 *                     description: Nombre de missatges nous
 *       500:
 *         description: Error del servidor
 */
app.get("/chats", async (req, res) => {
  try {
    const chats = await models.chat
      .find({
        $or: [
          { user_id: req.query.user_id },
          { contact_id: req.query.user_id },
        ],
      })
      .lean();
    if (chats.length !== 0) {
      const chatsWithMessageCount = await Promise.all(
        chats.map(async (chat) => {
          const messageCount = await models.message.countDocuments({
            chat_id: chat._id,
            state: { $in: ["enviado", "recibido"] },
            user_id: { $ne: req.query.user_id },
          });
          console.log("Message count:", messageCount);
          return {
            ...chat,
            messageCount,
          };
        })
      );
      console.log("Chats with message count:", chatsWithMessageCount);

      res.send(chatsWithMessageCount);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
});

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Envia un missatge i crea un xat si no existeix
 *     tags: [Missatges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chat_id:
 *                 type: string
 *                 description: ID del xat (opcional si és un xat nou)
 *               user_id:
 *                 type: number
 *                 description: ID de l'usuari que envia el missatge
 *               contact_id:
 *                 type: number
 *                 description: ID del contacte
 *               content:
 *                 type: string
 *                 description: Contingut del missatge
 *               sent_at:
 *                 type: string
 *                 format: date-time
 *                 description: Data i hora d'enviament del missatge
 *               read_at:
 *                 type: string
 *                 format: date-time
 *                 description: Data i hora de lectura del missatge (opcional)
 *               state:
 *                 type: string
 *                 description: Estat del missatge (enviado, recibido, leido)
 *     responses:
 *       200:
 *         description: Missatge creat correctament
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Error del servidor
 */
app.post("/message", async (req, res) => {
  const message = req.body;
  try {
    let chatId = message.chat_id;

    if (chatId != null) {
      let chatExists = await models.chat.findOne({
        $or: [
          { user_id: req.body.user_id, contact_id: req.body.contact_id },
          { user_id: req.body.contact_id, contact_id: req.body.user_id },
        ],
      });

      if (chatExists == null) {
        const newChat = await models.chat.create({
          name: message.nameChat || `${message.user_id}-${message.contact_id}`,
          user_id: message.user_id,
          contact_id: message.contact_id,
          accepted: false,
        });

        chatId = newChat._id;
      } else {
        chatId = chatExists._id;
      }
    }

    var createdMessage = {
      chat_id: chatId,
      user_id: message.user_id,
      content: message.content,
      sent_at: message.sent_at,
      read_at: message.read_at,
      state: message.state || "enviado",
    };
    res.send(await models.message.create(createdMessage));
  } catch (error) {
    console.error("Error:", error);
  }
});

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Obtén els missatges d'un xat
 *     tags: [Missatges]
 *     parameters:
 *       - in: query
 *         name: chat_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del xat
 *     responses:
 *       200:
 *         description: Llista de missatges del xat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Error del servidor
 */
app.get("/messages", async (req, res) => {
  try {
    const messages = await models.message
      .find({ chat_id: req.query.chat_id })
      .limit(45)
      .sort({ sent_at: -1 });
    console.log("Messages:", messages);
    res.send(messages);
  } catch (error) {
    console.error("Error:", error);
    res.send([]);
  }
});

app.get("/get10messages", async (req, res) => {
  try {
    const messages = await models.message
      .find({
        chat_id: req.query.chat_id,
        _id: { $lt: req.query.message_id },
      })
      .limit(45)
      .sort({ sent_at: -1 });
    console.log("Messages:", messages);
    res.send(messages);
  } catch (error) {
    console.error("Error:", error);
    res.send([]);
  }
});

/**
 * @swagger
 * /get10messages:
 *   get:
 *     summary: Obtén els missatges d'un xat amb prioritat i missatges addicionals
 *     tags: [Missatges]
 *     parameters:
 *       - in: query
 *         name: chat_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del xat
 *       - in: query
 *         name: message_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del missatge de referència
 *     responses:
 *       200:
 *         description: Llista de missatges del xat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Error del servidor
 */
app.get("/get10messages", async (req, res) => {
  try {
    const chatId = req.query.chat_id;
    const messageId = req.query.message_id;

    const prioritizedMessages = await models.message
      .find({
        chat_id: chatId,
        $or: [{ state: "recibido" }, { state: "enviado" }],
        _id: { $lt: messageId },
      })
      .sort({ sent_at: -1 });

    const lastMessageId =
      prioritizedMessages.length > 0
        ? prioritizedMessages[prioritizedMessages.length - 1]._id
        : messageId;

    const additionalMessages = await models.message
      .find({
        chat_id: chatId,
        _id: { $lt: lastMessageId },
      })
      .limit(45)
      .sort({ sent_at: -1 });

    const messageIds = new Set(
      prioritizedMessages.map((msg) => msg._id.toString())
    );
    const combinedMessages = [...prioritizedMessages];

    additionalMessages.forEach((msg) => {
      if (!messageIds.has(msg._id.toString())) {
        combinedMessages.push(msg);
        messageIds.add(msg._id.toString());
      }
    });

    console.log("Messages:", finalMessages);
    res.send(finalMessages);
  } catch (error) {
    console.error("Error:", error);
    res.send([]);
  }
});

/**
 * @swagger
 * /lastMessage:
 *   get:
 *     summary: Obtén l'últim missatge d'un xat
 *     tags: [Missatges]
 *     parameters:
 *       - in: query
 *         name: chat_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del xat
 *     responses:
 *       200:
 *         description: L'últim missatge del xat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Error del servidor
 */
app.get("/lastMessage", async (req, res) => {
  try {
    const message = await models.message
      .findOne({ chat_id: req.query.chat_id })
      .sort({ sent_at: -1 });
    console.log("Messages:", message);
    res.send(message);
  } catch (error) {
    console.error("Error:", error);
    res.send("Error:", error);
  }
});

/**
 * @swagger
 * /getMessagesNotReceived:
 *   get:
 *     summary: Obte els missatges no rebut de l'usuari
 *     tags: [Missatges]
 *     parameters:
 *       - in: query
 *         name: chat_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del xat
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de l'usuari
 *     responses:
 *       200:
 *         description: Número de missatges no rebut de l'usuari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *       500:
 *         description: Error del servidor
 */
app.get("/getMessagesNotReceived", async (req, res) => {
  try {
    const messageCount = await models.message.countDocuments({
      chat_id: req.query.chat_id,
      state: "enviado",
      user_id: { $ne: req.query.user_id },
    });
    res.send({ count: messageCount });
  } catch (error) {
    console.error("Error:", error);
    res.send([]);
  }
});

/**
 * @swagger
 * /markMessagesAsReceived:
 *   put:
 *     summary: Marca els missatges com a rebut per l'usuari en un xat
 *     tags: [Missatges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chat_id:
 *                 type: string
 *               user_id:
 *                 type: number
 *             required:
 *               - chat_id
 *               - user_id
 *     responses:
 *       200:
 *         description: Missatges marcats com a rebut
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       500:
 *         description: Error del servidor
 */
app.put("/markMessagesAsReceived", async (req, res) => {
  try {
    const chatId = req.body.chat_id;
    const userId = req.body.user_id;

    console.log(`chat_id: ${chatId}`);

    const result = await models.message.updateMany(
      { chat_id: chatId, state: "enviado", user_id: { $ne: userId } },
      { $set: { state: "recibido" } }
    );

    res.send("Messages marked as received");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error marking messages as received");
  }
});

/**
 * @swagger
 * /markMessagesAsRead:
 *   put:
 *     summary: Marca els missatges com a llegits per l'usuari en un xat
 *     tags: [Missatges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chat_id:
 *                 type: string
 *               user_id:
 *                 type: number
 *             required:
 *               - chat_id
 *               - user_id
 *     responses:
 *       200:
 *         description: Missatges marcats com a llegits
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       500:
 *         description: Error del servidor
 */
app.put("/markMessagesAsRead", async (req, res) => {
  try {
    const chatId = req.body.chat_id;
    const userId = req.body.user_id;

    console.log(`chat_id: ${chatId}`);

    const result = await models.message.updateMany(
      { chat_id: chatId, state: "recibido", user_id: { $ne: userId } },
      { $set: { state: "leido" } }
    );

    res.send("Messages marked as read");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error marking messages as read");
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
