import styles from "./chat.module.css";

import SendIcon from "@mui/icons-material/Send";
import { Input } from "@mui/material";
import { useRef, useState, useEffect } from "react";

const Chat = ({ socket }) => {
  const messageRef = useRef();
  const bottomRef = useRef();
  const [messageBox, setMessageBox] = useState([]);

  useEffect(() => {
    messageRef.current.focus();
    socket.on("receive_message", (data) => {
      setMessageBox((current) => [...current, data]);
      });

    return () => socket.off("receive_message");
  }, [socket]);

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messageBox]);

  const messageSubmit = () => {
    const message = messageRef.current.value;
    if (!message.trim()) return;

    socket.emit("message", message);

    clearInput();
    messageRef.current.focus();
  };

  const clearInput = () => {
    messageRef.current.value = "";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      messageSubmit();
    }
  };

  return (
    <div className={styles["chat-container"]}>
      <div className={styles["chat-body"]}>
        {messageBox.map((message, index) => (
          <div
            className={`${styles["message-container"]}
          ${message.authorID === socket.id && styles["message-mine"]}`}
            key={index}
          >
            <div className={styles["message-author"]}>
              <strong>{message.author}</strong>
            </div>
            <div className={styles["message-text"]}> {message.text} </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className={styles["chat-footer"]}>
        <Input
          inputRef={messageRef}
          placeholder="Mensagem"
          fullWidth
          onKeyDown={handleKeyPress}
        />
        <SendIcon
          sx={{ m: 1, cursor: "pointer" }}
          style={{ color: "#129d93" }}
          onClick={() => messageSubmit()}
        />
      </div>
    </div>
  );
};

export default Chat;