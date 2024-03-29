import React, { FC } from 'react';
import { observer } from 'mobx-react';
import TabContainer from '../shared/tabContainer/TabContainer.tsx';
import NatsClientStore, { SubjectItem } from '#renderer/store/NatsClientStore.ts';
import SavedSubjectsModal from '#renderer/components/subjectsTab/savedSubjects/SavedSubjectsModal.tsx';
import SavedSubjectsStore from '#renderer/store/SavedSubjectsStore.ts';
import Subject from './subject/Subject.tsx';
import MyButton from '#renderer/components/shared/buttons/myButton/MyButton.tsx';
import { appActionDispatcher } from 'src/renderer/bridge';
import { useModal } from '#renderer/hooks/useModal.ts';

import './subjectsTab.scss';


export const SubjectsTab: FC = observer(() => {
  const { subjects, selectedSubject } = NatsClientStore;
  const { isOpened, open, close } = useModal();

  const selectSubject = (subject: SubjectItem) => {
    NatsClientStore.setSelectedSubject(subject.id);
  };

  const addSubject = () => {
    const newSubject = NatsClientStore.createSubject({
      method: 'request',
      name: '',
    });
    selectSubject(newSubject);
  };

  const remove = ({ id, subject }: { id: string, subject: string }) => {
    NatsClientStore.removeSubject(id);
    appActionDispatcher('natsUnsubscribe', { subject });
  };

  const saveToStore = (subject: SubjectItem) => {
    SavedSubjectsStore.addSavedSubject(subject);
    appActionDispatcher('storeSave', {
      [`subjects.${subject.id}`]: subject,
    });
  };

  const clearSubjects = () => {
    NatsClientStore.clearState(true);
  };

  return (
    <TabContainer name={'Subjects'}>
      <div className={'subjects-tab-container'}>

        <div className={'subjects-tab-container__buttons'}>
          <MyButton
            text={'Add'}
            onClick={addSubject}
          />
          <MyButton
            text={'Load'}
            onClick={open}
          />
          <MyButton
            text={'Clear'}
            onClick={clearSubjects}
          />
        </div>

        <hr/>

        <div className={'subjects-tab-container__subject-list'}>
          {subjects.map((item) => (
            <Subject
              key={item.id}
              onClick={() => selectSubject(item)}
              isSelected={selectedSubject?.id === item.id}
              removeSubject={() => remove({ id: item.id, subject: item.name })}
              saveSubject={() => saveToStore({ ...item })}
              {...item}
            />
          ))}
        </div>

        <SavedSubjectsModal
          closeModal={close}
          isModalOpened={isOpened}
        />

      </div>
    </TabContainer>
  );
});

