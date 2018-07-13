import { ApiAiClient } from "api-ai-javascript";
import to from "await-to-js";
import types from "../store/action-types";
import { msgChatMessageSuccess, msgChatMessageError } from "../store/actions";
import randomBool from "random-bool";

const client = new ApiAiClient({
  accessToken: "e0358ac042804c7d9eca9e90e5bb22cb"
});

const asyncSendMessage = async text => {
  const [err, response] = await to(client.textRequest(text));
  // console.log(response);
  const { result: { fulfillment: { speech } } } = response;

  return [err, speech];
};

export default ({ getState, dispatch }) => next => action => {
  next(action);

  if (action.type === types["CHAT/MESSAGE_REQUEST"]) {
    const { text } = action.payload.message;

    /** async block */
    (async () => {
      console.log("[chatbot:start async] ");
      let [err, speech] = await asyncSendMessage(text);
      console.log("[chatbot:finish async] ");

      // simulate error
      err = randomBool({ likelihood: 10 }) ? new Error("Error, bro!") : null;

      console.log("[Error Check]: ", err);
      // conditionally send action message based upon error var
      err
        ? next(msgChatMessageError(err))
        : next(msgChatMessageSuccess(speech));

      // err
      //   ? dispatch(msgChatMessageError(err))
      //   : dispatch(msgChatMessageSuccess(speech));

      // executed asynchronously after messages has increased
      console.log("[chatbot:async] ", getState().messages.length);
    })();
    /** **************** */
  }

  // executed immediately
  console.log("[chatbot:immediately] ", getState().messages.length);

  // next(action);
};
