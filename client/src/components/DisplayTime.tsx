import React, { useState, useEffect } from "react";

export const Time = ({ minutes, seconds} : { minutes: number, seconds: number }) => {

  const [timeText, setTimeText] = useState("0:00");

  useEffect(() => {
    console.log("Current time: min " + minutes + " sec " + seconds);

    let textSeconds = seconds.toString();
    if (seconds < 10) {
      textSeconds = "0" + seconds;
    }
    setTimeText(minutes + ":" + textSeconds);
  }, [minutes, seconds]);

  return (

    <div>{timeText}</div>

  )
}
