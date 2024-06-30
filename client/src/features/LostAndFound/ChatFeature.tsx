import { useState } from "react";
import Chat from "./Chat";
import io from "socket.io-client";
import "./chatFeature.scss";

const socket = io(`${process.env.REACT_APP_SERVER_URL}`);

function ChatFeature() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChats, setShowChat] = useState(false);

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="APP">
      {!showChats ? (
        <div className="joinChatContainer">
          <div>
            <h3>Join Chat </h3>
            <input
              type="text"
              placeholder="User Name..."
              onChange={(event) => {
                setUserName(event.target.value);
              }}
            ></input>
            <input
              type="text"
              placeholder="Pet ID..."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            ></input>
            <button onClick={joinRoom}> Join Room</button>
          </div>
        </div>
      ) : (
        <Chat socket={socket} username={userName} room={room}></Chat>
      )}
    </div>
  );
}

export default ChatFeature;
