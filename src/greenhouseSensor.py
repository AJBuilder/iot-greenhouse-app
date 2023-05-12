# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0.

from awscrt import mqtt, http
from awsiot import mqtt_connection_builder
import sys
import threading
import time
import json
import argparse
import time


# Callback when connection is accidentally lost.
def on_connection_interrupted(connection, error, **kwargs):
    print("Connection interrupted. error: {}".format(error))
    connection.connect()


# Callback when an interrupted connection is re-established.
def on_connection_resumed(connection, return_code, session_present, **kwargs):
    return
#    print("Connection resumed. return_code: {} session_present: {}".format(return_code, session_present))
#
#    if return_code == mqtt.ConnectReturnCode.ACCEPTED and not session_present:
#        print("Session did not persist. Resubscribing to existing topics...")
#        resubscribe_future, _ = connection.resubscribe_existing_topics()
#
#        # Cannot synchronously wait for resubscribe result because we're on the connection's event-loop thread,
#        # evaluate result with a callback instead.
#        resubscribe_future.add_done_callback(on_resubscribe_complete)


def on_resubscribe_complete(resubscribe_future):
#    resubscribe_results = resubscribe_future.result()
#    print("Resubscribe results: {}".format(resubscribe_results))
#
#    for topic, qos in resubscribe_results['topics']:
#        if qos is None:
#            sys.exit("Server rejected resubscribe to topic: {}".format(topic))
    return

# Callback when the subscribed topic receives a message
def on_message_received(topic, payload, dup, qos, retain, **kwargs):
#    print("Received message from topic '{}': {}".format(topic, payload))
#    global received_count
#    received_count += 1
#    if received_count == cmdData.input_count:
#        received_all_event.set()
    return

if __name__ == '__main__':
    # Create the proxy options if the data is present in cmdData

    parser = argparse.ArgumentParser(description="Script for sending greenhouse data to cloud")
    parser.add_argument("id",
                        action="store",
                        help="The id used to identify the sensor"
                        )
    parser.add_argument("--endpoint", 
                        default="a1wslsrn8714ln-ats.iot.us-east-2.amazonaws.com",
                        action="store",
                        dest="endpoint",
                        help="The specified AWS endpoint"
                        )
    parser.add_argument("--port",
                        default="8883",
                        action="store",
                        dest="port",
                        help="The specified AWS port. 443 and 8883 are supported.",
                        type=int
                        )
    parser.add_argument("--key",
                        action="store",
                        dest="key",
                        help="The private key used to communicate with the endpoint.",
                        required=True
                        )
    parser.add_argument("--cert", 
                        action="store",
                        dest="cert",
                        help="The certificate used to communicate with the endpoint.",
                        required=True
                        )
    parser.add_argument("--ca",
                        default=None,
                        action="store",
                        dest="ca",
                        help="The certificate authority used to communicate with the endpoint. (Sometimes necessary)"
                        )
    
    args = parser.parse_args()

    print(args)
    client_id = "greenhouse-" + args.id
    # Create a MQTT connection from the command line data
    mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=args.endpoint,
        port=args.port,
        cert_filepath=args.cert,
        pri_key_filepath=args.key,
        ca_filepath=args.ca,
        on_connection_interrupted=on_connection_interrupted,
        on_connection_resumed=on_connection_resumed,
        client_id=client_id,
        clean_session=False,
        keep_alive_secs=30,)
    
    
    try:
        print("Connecting to endpoint with client ID: " + client_id)
        connect_future = mqtt_connection.connect()

        # Future.result() waits until a result is available
        connect_future.result()
        print("Connected!")


        topic = "greenhouse-sensor-data"
        print("Using topic: " + topic)
        print("Sending messages until program killed")

        while True:
            message = "Testing"
            print("Publishing message to topic '{}': {}".format(topic, message))
            obj = {
                "sensor_name": client_id,
                "time": int(time.time()),
                "humidity": 0,
                "temperature": 0,
                "moisture_1": 0,
                "moisture_2": 0,
                "moisture_3": 0,
                "moisture_4": 0,
                }
            message_json = json.dumps(obj)
            mqtt_connection.publish(
                topic=topic,
                payload=message_json,
                qos=mqtt.QoS.AT_LEAST_ONCE)
            time.sleep(60)

            
    except KeyboardInterrupt:
        print("Disconnecting...")
        disconnect_future = mqtt_connection.disconnect()
        disconnect_future.result()
        print("Exiting!")

