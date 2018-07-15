import types from "./action-types";

console.log("CHECK: REDUCER ENTERED ONCE");

const initState = {
  messages: [
    {
      text: "Welcome! Any questions?",
      sender: "Bot",
      isErrorMessage: false
    }
  ],
  onProcess: false,
  error: null
};

// Commit Reducers
const processChatMessage = (state, action) => {
  console.log("[reducer]", action.type);
  const { messages } = state;
  const { message } = action.payload;

  const newMessages = [...messages, message];

  return { ...state, messages: newMessages };
};

const commitChatMessageRequest = processChatMessage;
const commitChatMessageSuccess = processChatMessage;
const commitChatMessageError = processChatMessage;

// Hub Reducer
const ChatMessageReducer = (state = initState, action) => {
  let newState;
  switch (action.type) {
    case types["CHAT/MESSAGE_REQUEST"]:
      newState = commitChatMessageRequest(state, action);
      break;
    case types["CHAT/MESSAGE_SUCCESS"]:
      newState = commitChatMessageSuccess(state, action);
      break;
    case types["CHAT/MESSAGE_ERROR"]:
      newState = commitChatMessageError(state, action);
      break;
    default:
      newState = state;
  }

  return newState;
};

export default ChatMessageReducer;
