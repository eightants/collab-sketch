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
    this.members = [];
  }

  getInfo() {
    return this.data;
  }

  setInfo(data) {
    this.data = data;
  }

  getHost() {
    return this.data.host;
  }

  getMembers() {
    return this.members;
  }

  addMember(user) {
    this.members.push(user);
  }

  removeMember(sid) {
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].sid === sid) {
        this.members.splice(i);
        return;
      }
    }
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
