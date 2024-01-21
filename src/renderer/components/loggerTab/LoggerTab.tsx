import React, { FC, useEffect, useState } from 'react';
import './loggerTab.scss';
import TabContainer from '../shared/tabContainer/TabContainer.tsx';
import { LOGGER_ADD } from '../../../app/events/constants.ts';
import TextArea from '../shared/textarea/TextArea.tsx';

export const LoggerTab: FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    window.ipcRenderer.on(LOGGER_ADD, (_event, message) => {
      setLogs(prev => {
        return prev.length > 1000 ?
          [prev.slice(1), message] :
          [...prev, message];
      });
    });
  }, []);


  return (
    <TabContainer name={'logger'}>
      <div style={{ height: '150px' }}>
        <TextArea
          text={logs.join('\n')}
          autoScrolling={true}
        />
      </div>

    </TabContainer>
  );
};
