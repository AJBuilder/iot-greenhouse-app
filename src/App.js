import { Amplify, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';


import awsExports from './aws-exports';

import './App.css';


Amplify.configure(awsExports);


function App() {


  return (
    <div className="App">
      <button> Test </button>
    </div>
  );
}

export default App;
