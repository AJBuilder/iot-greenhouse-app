import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerGreenhouseData = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<GreenhouseData, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly time?: number | null;
  readonly temperature?: number | null;
  readonly humidity?: number | null;
  readonly moisture1?: number | null;
  readonly moisture2?: number | null;
  readonly moisture3?: number | null;
  readonly moisture4?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyGreenhouseData = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<GreenhouseData, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly time?: number | null;
  readonly temperature?: number | null;
  readonly humidity?: number | null;
  readonly moisture1?: number | null;
  readonly moisture2?: number | null;
  readonly moisture3?: number | null;
  readonly moisture4?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type GreenhouseData = LazyLoading extends LazyLoadingDisabled ? EagerGreenhouseData : LazyGreenhouseData

export declare const GreenhouseData: (new (init: ModelInit<GreenhouseData>) => GreenhouseData) & {
  copyOf(source: GreenhouseData, mutator: (draft: MutableModel<GreenhouseData>) => MutableModel<GreenhouseData> | void): GreenhouseData;
}