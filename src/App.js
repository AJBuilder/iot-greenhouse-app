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


  const [data, setData] = React.useState([]);
  const [dataToDisplay, setdataToDisplay] = React.useState({"Temperature": false,"Humidity": false,"Moisture": false,});


  function getData(begin, end){

    console.log("begin", begin);
    console.log("end", end);
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
        db.query(params, function(err, result) {
            if (err) {
            console.log(err);
            return null;
            } else {
        
            console.log('Got data');
            console.log(result["Items"]);

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

            console.log("Setting data",temp)
            setData(temp);
            }     
        })      
      });
  }

  React.useEffect(() => {
    getData(new Date(Date.now() - (2 * 60 * 60 * 1000)), new Date());
    
  }, [])

  React.useEffect(() => {
    console.log("Rerender")
  })

  function handleDataToDisplay(type){
    let temp = {...dataToDisplay};
    temp[type] = !temp[type];
    console.log("Change", temp)

    setdataToDisplay(temp);
  }

  console.log("loaded")

  return (
    <Authenticator>
      {
        ({signOut, user}) => {
          return <div className="App">
            {
              Object.keys(dataToDisplay).map((value, index) => {

                return <label key={index}>
                  {value}
                  <input
                  type="checkbox"
                  onChange={() => handleDataToDisplay(value)}
                  >
                  </input>  
                </label>
              })
            }
            {data.length !== 0 ?
            <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              {dataToDisplay["Temperature"] ? <Line type="monotone" dataKey="temperature" stroke="#8884d8" /> : null}
              {dataToDisplay["Humidity"] ? <Line type="monotone" dataKey="humidity" stroke="#8884d8" /> : null}
              {dataToDisplay["Moisture"] ? <Line type="monotone" dataKey="moisture_1" stroke="#8884d8" /> : null}
              {dataToDisplay["Moisture"] ? <Line type="monotone" dataKey="moisture_2" stroke="#8884d8" /> : null}
              {dataToDisplay["Moisture"] ? <Line type="monotone" dataKey="moisture_3" stroke="#8884d8" /> : null}
              {dataToDisplay["Moisture"] ? <Line type="monotone" dataKey="moisture_4" stroke="#8884d8" /> : null}

              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis 
                dataKey={'time'}
                domain={[data[0]["time"], data[data.length - 1]["time"]]}
                scale="time"
                type="number"
                tickFormatter={(x) => (new Date(x * 1000)).toLocaleString()} />
              <YAxis />
              <Tooltip />
            </LineChart> : null}
          </div>
        }
      }
      
    </Authenticator>
  );
}

export default App;
