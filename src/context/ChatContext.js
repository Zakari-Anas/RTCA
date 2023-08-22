import {
  createContext,
  useContext,
  useReducer,
} from "react";
import { AuthContext } from "./authContext";
import { auth } from "../Firebase";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
           auth.currentUser.uid > action.payload.uid
              ? auth.currentUser.uid + action.payload.uid
              : action.payload.uid + auth.currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data:state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};