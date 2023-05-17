
import { CheckboxField, TextField } from '@aws-amplify/ui-react';

import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import './SensorGraph.css'
function SensorGraph({data}){

    console.log("SensorGraph got",data)

    const [dataToDisplay, setdataToDisplay] = React.useState({"Temperature": false,"Humidity": false,"Air Quality": false,"Moisture": false,});
    
    function handleDataToDisplay(type){
        let temp = {...dataToDisplay};
        temp[type] = !temp[type];
        //console.log("Change", temp)
    
        setdataToDisplay(temp);
    }
    
    function updateStartDate(date){

    }

    return (
        <div className="SensorGraph">
            <div className="GraphControl">
                <div className="FilterButtons">
                    {
                    Object.keys(dataToDisplay).map((value, index) => {

                        return <CheckboxField
                            key={index}
                            label={value}
                            onChange={() => handleDataToDisplay(value)}/>
                        })
                    }
                </div>
                
                <div className='DateEntry'>
                    Start
                    <input 
                        type="datetime-local"
                        onChange={e => updateStartDate()}
                    />
                </div>

            </div>
            {data.length !== 0 ?
            <LineChart 
            width={600} 
            height={300} 
            data={data} 
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
                {dataToDisplay["Temperature"] ? <Line type="monotone" dataKey="temperature" stroke="#8884d8" /> : null}
                {dataToDisplay["Humidity"] ? <Line type="monotone" dataKey="humidity" stroke="#8884d8" /> : null}
                {dataToDisplay["Air Quality"] ? <Line type="monotone" dataKey="gas_quality" stroke="#8884d8" /> : null}
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
    )
}


export default SensorGraph;