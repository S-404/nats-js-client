import React, { FC, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import NatsClientStore from '#renderer/store/NatsClientStore.ts';
import TabContainer from '../shared/tabContainer/TabContainer.tsx';
import MyButton from '../shared/buttons/myButton/MyButton.tsx';
import MySyntaxHighlighter from '#renderer/components/shared/syntaxHighlighter/MySyntaxHighlighter.tsx';

import './messageTab.scss';


export const MessagesTab: FC = observer(() => {
  const { subjects, selectedSubject, messages: allMessages } = NatsClientStore;
  const [isShownAll, setIsShownAll] = useState<boolean>(false);

  const messages = useMemo(() => {
    if (isShownAll && selectedSubject) {
      return allMessages
        .reduce((acc, curr) => {
          if (curr.subjectId === selectedSubject?.id) {
            acc.push(curr.message);
          }
          return acc;
        }, [])
        .join('\n');
    }

    const subjectMessages = allMessages.filter(item => item.subjectId === selectedSubject?.id);
    return subjectMessages.length >= 1 ? subjectMessages[subjectMessages.length - 1].message : '';

  }, [allMessages.length, selectedSubject?.id, isShownAll]);

  const clear = () => {
    NatsClientStore.clearSubjectMessages(selectedSubject?.id);
  };


  if (!selectedSubject) {
    return (
      <TabContainer name={'Messages'}>
        <div className="publish-tab-container_empty">
          <p>{subjects.length ? 'Select subject' : 'Add subject'}</p>
        </div>
      </TabContainer>
    );
  }


  return (
    <TabContainer name={'Messages'}>
      <div className="messages-tab-container">

        <MySyntaxHighlighter
          text={messages}
        />

        <div className="buttons">
          <MyButton
            text="Clear"
            color="white"
            onClick={clear}
          />
          <MyButton
            text={isShownAll ? 'Only Latest' : 'Show All'}
            color={'white'}
            onClick={() => setIsShownAll(prevState => !prevState)}
          />
          <MyButton
            text={'Copy'}
            color={'white'}
            disabled={!messages.length}
            onClick={() => navigator.clipboard.writeText(messages)}
          />
        </div>
      </div>
    </TabContainer>
  );
});


