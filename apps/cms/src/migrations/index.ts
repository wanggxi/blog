import * as migration_20260902_094955_initial from './20260902_094955_initial';

export const migrations = [
  {
    up: migration_20260902_094955_initial.up,
    down: migration_20260902_094955_initial.down,
    name: '20260902_094955_initial'
  },
];
