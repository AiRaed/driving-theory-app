/**
 * Seed draft example learning cards into local-data only.
 * Never publishes. Never writes to the live database.
 */

import { seedDraftExampleCards } from '../lib/learning-cards/seedDrafts';

const result = seedDraftExampleCards(null);
console.log(JSON.stringify(result, null, 2));
if (result.published) {
  throw new Error('Seed published cards — abort');
}
