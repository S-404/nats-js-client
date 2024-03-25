import React, { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import TabContainer from '../shared/tabContainer/TabContainer.tsx';
import LogMessagesStore from '#renderer/store/LogMessagesStore.ts';
import IconButton from '#renderer/components/shared/buttons/iconButton/IconButton.tsx';

import './loggerTab.scss';

export const LoggerTab: FC = observer(() => {
  const { logMessages } = LogMessagesStore;
  const ref = useRef(null);
  const [onBottom, setOnBottom] = useState<boolean>(true);

  useEffect(() => {
    if (onBottom) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [logMessages.length, onBottom]);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if ((scrollHeight - clientHeight) - scrollTop === 0) {
      setOnBottom(true);
    } else {
      setOnBottom(false);
    }
  };

  return (
    <TabContainer name={'Logger'}>
      <div className="logger-tab-container">
        <div
          ref={ref}
          className="log-list"
          onScroll={onScroll}
        >
          {logMessages.map((item, index) => (
            <div
              key={`${item.time}_${index}`}
              className="log-list__log-item"
            >
              <a className="log-item__time">
                {`${item.time}: `}
              </a>
              <a
                onClick={() => navigator.clipboard.writeText(item.message)}
                className={`log-item__message log-item__message_${item.type}`}
              >
                {item.message}
              </a>
              {item.subject && (
                <a className='copy-button'>
                  <IconButton
                    iconType='copy'
                    onClick={() => navigator.clipboard.writeText(item.subject)}
                  />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </TabContainer>
  );
});
