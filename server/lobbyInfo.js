class LobbyInfo {
  // Abstract class
  getInfo() {}
  setInfo() {}
}

class InMemoryLobbyInfo extends LobbyInfo {
  constructor(data = {}) {
    super();
    this.data = data;
    this.started = false;
  }

  getInfo() {
    return {};
  }

  setInfo(data) {
    this.data = data;
  }

  getStarted() {
    return this.started;
  }

  setStarted(started) {
    this.started = started;
  }
}

module.exports = {
  InMemoryLobbyInfo
};
