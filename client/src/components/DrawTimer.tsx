import React, { useState, useEffect } from "react";

export const Timer = (args: any) => {

    const [timeText, setTimeText] = useState("0:00");

    useEffect(() => {
        console.log("Start time: min " + args.minutes + " sec " + args.seconds);
        countdownTimer(args.minutes, args.seconds);
    }, []);

    function countdownTimer(minutes: number, seconds: number) {

        let timeM = minutes;
        let timeS = seconds;

        const interval = setInterval(() => {
            let textTimeS = padTime(timeS);
            console.log(timeM + ":" + textTimeS);
            setTimeText(timeM + ":" + textTimeS);

            timeS--;
            if (timeS < 0) {
                timeM--;
                timeS = 59;
            }

            if (timeM === -1 && timeS === 59) {
                clearInterval(interval);
            } else {

            }
        }, 1000);

    };

    function padTime(time: number) {
        let textTime = time.toString();
        if (time < 10) {
            textTime = "0" + time;
        }

        return textTime;
    };

    return (

        <div>{timeText}</div>

    )
}
