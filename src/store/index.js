import { createStore, applyMiddleware } from "redux";
import ChatMessageReducer from "./reducers";
import chatbot from "../middlewares/chat-bot";

const logger = () => next => action => {
  console.log("[logger]: ", action.type);
  next(action);
};

export default createStore(
  ChatMessageReducer,
  applyMiddleware(logger, chatbot)
);
