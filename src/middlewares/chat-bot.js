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
  const messagesLen = () => getState().messages.length;

  if (action.type === types["CHAT/MESSAGE_REQUEST"]) {
    const { text } = action.payload.message;

    /** async block */
    (async () => {
      console.log(
        "[chatbot:async] messagesLen: ",
        messagesLen(),
        " (before asyncSendMessage)"
      );
      console.log("[chatbot:async] will asyncSendMessage");
      let [err, speech] = await asyncSendMessage(text);
      console.log("[chatbot:async] finish asyncSendMessage");
      console.log(
        "[chatbot:async] messagesLen: ",
        messagesLen(),
        " (after asyncSendMessage)"
      );

      // simulate error
      err = randomBool({ likelihood: 10 }) ? new Error("Error, bro!") : null;

      console.log("[Error Check]: ", err);

      // conditionally send action message based upon error var
      next(err ? msgChatMessageError(err) : msgChatMessageSuccess(speech));
      // dispatch(err ? msgChatMessageError(err) : msgChatMessageSuccess(speech));

      // executed asynchronously after messages has increased
      console.log(
        "[chatbot:async] messagesLen: ",
        messagesLen(),
        " (after successfully push message into state)"
      );
    })();
    /** **************** */
  }

  // executed immediately
  console.log(
    "[chatbot:outside async] messagesLen: ",
    messagesLen(),
    " (last line of code in the middleware)".toUpperCase()
  );

  // next(action);
};
