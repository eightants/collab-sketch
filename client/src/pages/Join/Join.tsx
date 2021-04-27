import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import styles from "./Join.module.css";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";

export const Join = ({ socket }: { socket: any }) => {
  const [enteredID, setEnteredID] = useState("");
  const [nickname, setNickname] = useState("");
  const { id } = useParams<{ id: string }>();
  const router = useHistory();

  useEffect(() => {
    if (id) {
      setEnteredID(id);
    }
    socket.on("joinedLobby", () => {
      router.push(`/lobby/${enteredID}`);
    });
    socket.on("joinedStartedLobby", () => {
      router.push(`/draw/${enteredID}`);
    });
  }, [enteredID, id, router, socket]);

  const handleJoinLobby = () => {
    socket.emit("onJoinLobby", { id: enteredID, nickname: nickname });
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.joinContent}>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={"Enter nickname"}
        />
        <Input
          value={enteredID}
          onChange={(e) => setEnteredID(e.target.value)}
          placeholder={"Enter lobby code"}
        />
        <Button text="Join Session" variant="dark" onClick={handleJoinLobby} />
        <Link to="/">
          <Button text="Back" />
        </Link>
      </div>
    </div>
  );
};
