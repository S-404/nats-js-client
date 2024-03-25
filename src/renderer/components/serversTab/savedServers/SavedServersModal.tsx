import React, { FC, useEffect, useMemo, useState } from 'react';
import Modal from '#renderer/components/shared/modal/Modal.tsx';
import { appActionDispatcher } from '#renderer/bridge';
import ServerConnectionsStore, { ServerConnectionType } from '#renderer/store/ServerConnectionsStore.ts';
import IconButton from '#renderer/components/shared/buttons/iconButton/IconButton.tsx';
import { observer } from 'mobx-react';
import MyInput from '#renderer/components/shared/inputs/myInput/MyInput.tsx';

import './savedServersModal.scss';

interface ISavedServersModalProps {
  isModalOpened: boolean;
  closeModal: () => void;
}

type StoredConnectionsType = ServerConnectionType[] & { id: [string] }[]

const SavedServersModal: FC<ISavedServersModalProps> = observer(({ isModalOpened, closeModal }) => {
  const { connections } = ServerConnectionsStore;

  const [filter, setFilter] = useState('');

  const filteredConnections = useMemo(() => {
    if (!filter) {
      return connections;
    }
    return connections.filter(item => {
      return item.port.toLowerCase().includes(filter.toLowerCase()) ||
        item.host.toLowerCase().includes(filter.toLowerCase());
    });
  }, [filter, connections]);

  const removeFromStore = async (id: string) => {
    ServerConnectionsStore.removeConnection(id);
    const stored: Array<{ id: [string] }> = (await appActionDispatcher('storeGet', 'connections')) ?? [];
    appActionDispatcher('storeSave', {
      connections: stored.filter((item) => item.id[0] !== id)
    });
  };

  const loadFromStore = (connection: ServerConnectionType) => {
    ServerConnectionsStore.setCurrentConnection(connection);
    closeModal();
  };


  useEffect(() => {
    const loadSavedConnections = async () => {

      const storedConnections: StoredConnectionsType = await appActionDispatcher('storeGet', 'connections');
      if (storedConnections) {
        const result: ServerConnectionType[] = storedConnections.map(item => {
          const { id, ...itemData } = item;
          return { ...itemData, id: id[0] };
        });
        ServerConnectionsStore.setConnections(result);
      }
    };

    loadSavedConnections();
  }, []);


  return (
    <Modal
      isModalOpen={isModalOpened}
      onClose={closeModal}
      title={'Load server connection'}
    >
      <div className={'saved-connections'}>
        <div className={'saved-connections__search'}>
          <MyInput
            text={filter}
            title={'search'}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className={'saved-connections__connections'}>
          {filteredConnections.map((item) => (
            <div
              key={item.id}
              className="connection__item"
              onClick={() => loadFromStore(item)}
            >
              <div className="item__content">
                <p><b>{item.title}</b></p>
                <p><i>host:</i> {item.host}</p>
                <p><i>port:</i> {item.port}</p>
              </div>
              <div className={'connection__remove-button'}>
                <IconButton
                  onClick={() => removeFromStore(item.id)}
                  iconType={'remove'}
                />
              </div>
            </div>
          ))}
        </div>
        {!filteredConnections.length && (
          <p>Not found</p>
        )}
      </div>
    </Modal>
  );
});


export default SavedServersModal;
