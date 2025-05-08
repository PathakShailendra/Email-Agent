import { Server } from "socket.io";
import userModel from "../models/user.model.js";
import getResponse from "../service/ai.service.js";
import { appendMessage } from "../service/cache.service.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookie = socket.handshake.headers.cookie;

    if (!cookie) {
      return next(new Error("Authentication error"));
    }

    const token = cookie.split(";")[1].split("=")[1];
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const user = await userModel.authToken(token);
    if (!user) {
      return next(new Error("Authentication error"));
    }
    socket.user = user;

    next();
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("message", async (data) => {
      const { message } = data;

      appendMessage(`conversation:${socket.user._id}`, {
        role: "user",
        content: message,
      });
      const response = await getResponse(message);

      appendMessage(`conversation:${socket.user._id}`, {
        role: "model",
        content: response,
      });
      socket.emit("message", response);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export default initializeSocket;
