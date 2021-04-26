function timer(socketIO, users, minutes, seconds) {
  let drawerIdx = 0;
  let min = minutes;
  let sec = seconds;

  console.log("# Users connected: " + users.length);

  const interval = setInterval(() => {
    socketIO.emit("turnTick", users[drawerIdx], min, sec);

    if (min === 0 && sec === 0) {
      if (drawerIdx < users.length - 1) {
        drawerIdx++;
        min = minutes;
        sec = seconds + 1;
      } else {
        clearInterval(interval);
      }
    }

    sec--;
    if (sec < 0) {
      min--;
      sec = 59;
    }
  }, 1000);
}

module.exports = {
  timer,
}
