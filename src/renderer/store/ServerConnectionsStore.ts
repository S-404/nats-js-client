import { makeAutoObservable } from 'mobx';

export type ServerConnectionType = {
  id?: string;
  host: string;
  port?: string;
  token?: string;
  title?: string;
}

class ServerConnectionsStore {
  currentConnection: ServerConnectionType;
  connections: ServerConnectionType[] = [];

  constructor() {
    this.currentConnection = {
      host: '',
      port: '',
      token: '',
    };
    makeAutoObservable(this);
  }

  setCurrentConnection(connection: ServerConnectionType) {
    this.currentConnection = { ...connection };
  }

  setConnections(connections: ServerConnectionType[]) {
    this.connections = [...connections];
  }

  addConnection(connection: ServerConnectionType) {
    const targetIndex = this.connections.findIndex(item => item.id === connection.id);
    if (targetIndex !== -1) {
      this.connections[targetIndex] = { ...connection };
    } else {
      this.connections.push(connection);
    }
  }

  removeConnection(id: string) {
    this.connections = this.connections.filter(item => item.id !== id);
  }
}


export default new ServerConnectionsStore();
