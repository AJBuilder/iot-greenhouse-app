import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import awsExports from './aws-exports';

import './App.css';
import '@aws-amplify/ui-react/styles.css';

import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

Amplify.configure(awsExports);


function App() {

  var dayAgoInSeconds = (new Date() - 86400000) / 1000;
  var params = { 
    TableName: 'GreenhouseData',
    KeyConditionExpression: '#id = :iottopic and #ts >= :datum',
    ExpressionAttributeNames: {
      "#id": "sensor_name",
      "#ts": "time"
    },
    ExpressionAttributeValues: {
      ":iottopic": { "S" : "greenhouse-1"},
      ":datum": { "N" : dayAgoInSeconds.toString()}
    }
  };


  const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];
  
  const renderLineChart = (
    <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );

  console.log("loaded")

  return (
    <Authenticator>
      {
        ({signOut, user}) => {

          Auth.currentCredentials()
          .then(credentials => {
            const db= new DynamoDB({
              region: "us-east-2",
              credentials: Auth.essentialCredentials(credentials)
            });
            db.query(params, function(err, data) {
                if (err) {
                console.log(err);
                return null;
                } else {
            
                console.log('Got data');
                console.log(data);

                for (var i in data['Items']) {
                    // read the values from the dynamodb JSON packet
                    var tempRead = parseFloat(data['Items'][i]['temperature']['N']);
                    var timeStamp = parseInt(data['Items'][i]['time']['N']);
                    var timeRead = new Date(timeStamp * 1000);	
                    console.log(timeRead);
                    console.log(tempRead);        
                    }
                }     
            })      
          });

          return <div className="App">
            <button> Test </button>        
            {renderLineChart}
          </div>
        }
      }
      
    </Authenticator>
  );
}

export default App;
