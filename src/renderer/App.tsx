import { SubjectsTab } from '#renderer/components/subjectsTab';
import { MessagesTab } from '#renderer/components/messagesTab';
import { PublishTab } from '#renderer/components/publishTab';
import { ServersTab } from '#renderer/components/serversTab';
import { LoggerTab } from '#renderer/components/loggerTab';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import 'react-reflex/styles.css';
import './styles/react-reflex-override.css';
import './styles/main.css';
import './app.scss';


function App() {
  return (
    <div className="app">

      <div className="header">
        <ServersTab/>
      </div>

      <ReflexContainer
        className="app-content"
        orientation="horizontal"
      >
        <ReflexElement className="body">
          <ReflexContainer orientation="vertical">

            <ReflexElement size={320}>
              <SubjectsTab/>
            </ReflexElement>

            <ReflexSplitter propagate={true}/>

            <ReflexElement>
              <PublishTab/>
            </ReflexElement>

            <ReflexSplitter propagate={true}/>

            <ReflexElement>
              <MessagesTab/>
            </ReflexElement>

          </ReflexContainer>
        </ReflexElement>

        <ReflexSplitter propagate={true}/>

        <ReflexElement
          size={150}
        >
          <LoggerTab/>
        </ReflexElement>

      </ReflexContainer>
    </div>
  );
}

export default App;
