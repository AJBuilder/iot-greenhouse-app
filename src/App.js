import { Amplify, Auth } from 'aws-amplify';
import { Authenticator, CheckboxField } from '@aws-amplify/ui-react';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import awsExports from './aws-exports';

import './App.css';
import '@aws-amplify/ui-react/styles.css';

import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import SensorGraph from './ui-components/SensorGraph';

Amplify.configure(awsExports);


function App() {


  const [data, setData] = React.useState([]);


  function getData(begin, end){

    //console.log("begin", begin);
    //console.log("end", end);
    const params = { 
      TableName: 'GreenhouseData',
      KeyConditionExpression: '#id = :iottopic AND #t BETWEEN :begin AND :end',
      ExpressionAttributeNames: {
        "#id": "sensor_name",
        "#t": "time"
      },
      ExpressionAttributeValues: {
        ":iottopic": { "S" : "greenhouse-1"},
        ":begin": { "N" : (begin.getTime() / 1000).toString()},
        ":end": { "N" : (end.getTime() / 1000).toString()}
      }
    };

    return Auth.currentCredentials()
      .then(credentials => {
        const db= new DynamoDB({
          region: "us-east-2",
          credentials: Auth.essentialCredentials(credentials)
        });
        return new Promise( resolve => {
          db.query(params, function(err, result) {
            if (err) {
            console.log(err);
            resolve(null);
            } else {
        
            //console.log('Got data',result["Items"]);

            let temp = [];

            for(const dataPoint of result["Items"].values()){
              var tempPoint = {}
              for(const [label, value] of Object.entries(dataPoint)){
                switch(Object.keys(value)[0]){
                  case 'N':
                    tempPoint[label] = parseFloat(Object.values(value)[0]);
                    break;
                  case 'S':
                    tempPoint[label] = Object.values(value)[0];
                    break;
                }
              }
              temp.push(tempPoint);
            }

            //console.log("Returning data",temp)
            resolve(temp);
            }     
          })  
        });    
      });
  }

  function formatAirQuality(input){

    //console.log("Formating data:", input)

    let foundBase = false;
    let base;
    for(const [key, point] of Object.entries(input)){
      if(!foundBase){
        if(point.gas_quality != null){
          base = point.gas_quality;
          foundBase = true;
        }
      }
      if(foundBase){
        input[key].gas_quality = point.gas_quality * 100 / base;
      }
    }

    //console.log("Formated data:", input)
    return input;

  }

  React.useEffect(() => {
    getData(new Date(Date.now() - (2 * 60 * 60 * 1000)), new Date()).then(r => setData(formatAirQuality(r)));
    console.log(data)
  }, [])

  

  return (
    <Authenticator>
      {
        ({signOut, user}) => {
          return <div className="App">
            
            <SensorGraph data={data}></SensorGraph>
            
          </div>
        }
      }
      
    </Authenticator>
  );
}

export default App;
