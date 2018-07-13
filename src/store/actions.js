import types from "./action-types";

let isErrorMessage = false;
let onProcess = false;
let sender = 'Bot'
let error = null;

// action creator
export const msgChatMessageRequest = text => ({
  type: types["CHAT/MESSAGE_REQUEST"],
  payload: {
    message: {
      text,
      sender: "User",
      isErrorMessage
    },
    onProcess: true,
    error
  }
});

export const msgChatMessageSuccess = text => ({
  type: types["CHAT/MESSAGE_SUCCESS"],
  payload: {
    message: {
      text,
      sender,
      isErrorMessage
    },
    onProcess,
    error
  }
});

export const msgChatMessageError = error => ({
  type: types["CHAT/MESSAGE_ERROR"],
  payload: {
    message: {
      text: "Sorry! " + error.message,
      sender,
      isErrorMessage: true
    },
    onProcess,
    error
  }
});
