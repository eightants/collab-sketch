import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./Create.module.css";
import { Button } from "../../components/Button/Button";
import { Toggle } from "../../components/Toggle/Toggle";
import { Input } from "../../components/Input/Input";

// Function to generate unique room ID
const uniqueId = (length = 5) => {
  return Math.ceil(Math.random() * Date.now())
    .toPrecision(length)
    .toString()
    .replace(".", "")
    .slice(0, length);
};

type LobbyObject = {
  id?: string;
  timerLength: number;
  rotationType: string;
  numRotations: number;
  uniqueColors: boolean;
  separateCanvas: boolean;
};

export const Create = ({ socket }: { socket: any }) => {
  const [lobby, setLobby] = useState<LobbyObject>({
    timerLength: 20,
    rotationType: "fixed",
    numRotations: 5,
    uniqueColors: false,
    separateCanvas: false
  });
  const router = useHistory();

  useEffect(() => {
    socket.on("newLobbyCreated", (data: any) => {
      router.push(`/lobby/${data.id}`);
    });
  }, [router, socket]);
  // Tell server to create new lobby
  const handleCreateLobby = () => {
    lobby.id = uniqueId();
    socket.emit("onCreateLobby", lobby);
    console.log("CREATE");
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.createContent}>
        <div className={styles.settingsDiv}>
          <div className={styles.settingsRow}>
            <div>Timer Length</div>
            <Input
              width="80px"
              value={lobby.timerLength}
              onChange={(e) =>
                setLobby((prev) => ({
                  ...prev,
                  timerLength: Number(e.target.value)
                }))
              }
            />
          </div>
          <div className={styles.settingsRow}>
            <div>Number of Rotations</div>
            <Input
              width="80px"
              value={lobby.numRotations}
              onChange={(e) =>
                setLobby((prev) => ({
                  ...prev,
                  numRotations: Number(e.target.value)
                }))
              }
            />
          </div>
          <div className={styles.settingsRow}>
            <div>Rotation Type</div>
            <Input
              width="80px"
              value={lobby.rotationType}
              onChange={(e) =>
                setLobby((prev) => ({
                  ...prev,
                  rotationType: e.target.value
                }))
              }
            />
          </div>
          <div className={styles.settingsRow}>
            <div>Unique Colors</div>
            <Toggle
              value={lobby.uniqueColors}
              onChange={(e) =>
                setLobby((prev) => ({
                  ...prev,
                  uniqueColors: e.target.checked
                }))
              }
            />
          </div>
          <div className={styles.settingsRow}>
            <div>Separate Canvas</div>
            <Toggle
              value={lobby.separateCanvas}
              onChange={(e) =>
                setLobby((prev) => ({
                  ...prev,
                  separateCanvas: e.target.checked
                }))
              }
            />
          </div>
        </div>
        <Button
          text="Create Session"
          variant="dark"
          onClick={handleCreateLobby}
        />
        <Link to="/">
          <Button text="Back" />
        </Link>
      </div>
    </div>
  );
};
