import * as migration_20250405_190551 from './20250405_190551';
import * as migration_20250405_192016 from './20250405_192016';

export const migrations = [
  {
    up: migration_20250405_190551.up,
    down: migration_20250405_190551.down,
    name: '20250405_190551',
  },
  {
    up: migration_20250405_192016.up,
    down: migration_20250405_192016.down,
    name: '20250405_192016'
  },
];
