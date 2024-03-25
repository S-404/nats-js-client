import React, { FC } from 'react';
import Modal from '#renderer/components/shared/modal/Modal.tsx';
import MyInput from '#renderer/components/shared/inputs/myInput/MyInput.tsx';
import MyButton from '#renderer/components/shared/buttons/myButton/MyButton.tsx';

import './saveAsModal.scss';
import ServerConnectionsStore, { ServerConnectionType } from '#renderer/store/ServerConnectionsStore.ts';
import { appActionDispatcher } from '#renderer/bridge';

interface ISaveAsModalModalProps {
  isModalOpened: boolean;
  closeModal: () => void;
  updateConnection: <
    K extends keyof typeof ServerConnectionsStore.currentConnection,
    V extends typeof ServerConnectionsStore.currentConnection[K]
  >(key: K, value: V) => void;
}

const SaveAsModal: FC<ISaveAsModalModalProps> = ({ isModalOpened, closeModal, updateConnection }) => {
  const { currentConnection } = ServerConnectionsStore;

  const saveToStore = async (connection: ServerConnectionType) => {
    const newConnection = {
      ...connection,
      id: `${connection.title}`,
    };
    const stored: ServerConnectionType & {
      id: [string]
    }[] = (await appActionDispatcher('storeGet', 'connections')) ?? [];

    const connectionsSet = new Set(stored);
    connectionsSet.add({ ...newConnection, id: [newConnection.id] });

    appActionDispatcher('storeSave', {
      connections: Array.from(connectionsSet)
    });
    ServerConnectionsStore.addConnection(newConnection);
    closeModal();
  };

  return (
    <Modal
      isModalOpen={isModalOpened}
      onClose={closeModal}
      title={'Save connection'}
    >
      <div className={'save-connection'}>
        <div className={'save-connection__inputs'}>
          <MyInput
            text={currentConnection.title}
            title={'Title'}
            clearButton={true}
            onChange={(e) => updateConnection('title', e.target.value)}
          />
          <MyInput
            text={currentConnection.host}
            title={'Host'}
            clearButton={true}
            onChange={(e) => updateConnection('host', e.target.value)}
          />
          <MyInput
            text={currentConnection.port}
            title={'Port'}
            clearButton={true}
            onChange={(e) => updateConnection('port', e.target.value)}
          />
          <MyInput
            text={currentConnection.token}
            title={'Token'}
            clearButton={true}
            onChange={(e) => updateConnection('token', e.target.value)}
          />
        </div>
        <div className={'save-connection__buttons'}>
          <MyButton
            text={'Save'}
            onClick={() => saveToStore(currentConnection)}
            color={'green'}
            disabled={currentConnection.title?.length < 1}
          />
        </div>


      </div>

    </Modal>
  );
};

export default SaveAsModal;
