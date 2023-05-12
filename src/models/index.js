// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { GreenhouseData } = initSchema(schema);

export {
  GreenhouseData
};