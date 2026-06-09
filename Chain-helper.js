/**
 * chain-helpers.js
 * Shared runner-chaining helpers for the "Dog or Cat Picture Randomizer" collection.
 *
 * WHERE TO PUT THIS FILE
 *   Place it inside your collection, e.g. at:  scripts/chain-helpers.js
 *   (the collection root is wherever opencollection.yml lives).
 *
 * HOW TO REFERENCE IT FROM A SCRIPT
 *   The require path is resolved from the COLLECTION ROOT, not from the
 *   request file — so it's always the same string no matter where the
 *   request sits in the tree:
 *
 *       const { queueRandom, endChain } = require('./scripts/chain-helpers.js');
 *
 *   `bru` is a global inside Bruno scripts but is NOT visible inside a
 *   required module, so each helper takes `bru` as its first argument.
 *
 *   Works in both the "safe" (default) and "developer" sandboxes.
 */

/**
 * Randomly pick one request name and queue it as the next request to run.
 * Use in a "before-request" (or "post-response") script to branch the run.
 *
 *   const { queueRandom } = require('./scripts/chain-helpers.js');
 *   queueRandom(bru, ["Get Cat", "Get Dog"]);
 *
 * NOTE: each string must match the target request's `info.name` EXACTLY.
 *
 * @param {object} bru   - the Bruno scripting global
 * @param {string[]} names - candidate request names to choose from
 * @returns {string} the name that was chosen and queued
 */
function queueRandom(bru, names) {
  if (!Array.isArray(names) || names.length === 0) {
    throw new Error('queueRandom: `names` must be a non-empty array of request names');
  }
  const chosen = names[Math.floor(Math.random() * names.length)];
  console.log('Randomly selected: ' + chosen);
  bru.runner.setNextRequest(chosen);
  return chosen;
}

/**
 * Queue a specific request to run next, by name.
 * Use when you want deterministic chaining rather than a random branch.
 *
 *   const { queueNext } = require('./scripts/chain-helpers.js');
 *   queueNext(bru, "Get Dog");
 *
 * @param {object} bru  - the Bruno scripting global
 * @param {string} name - the request name to run next (must match `info.name`)
 * @returns {string} the name that was queued
 */
function queueNext(bru, name) {
  bru.runner.setNextRequest(name);
  return name;
}

/**
 * End the run sequence after the current request — nothing runs next.
 * Use in an "after-response" script on leaf requests (Get Cat / Get Dog).
 *
 *   const { endChain } = require('./scripts/chain-helpers.js');
 *   endChain(bru);
 *
 * @param {object} bru - the Bruno scripting global
 */
function endChain(bru) {
  bru.runner.setNextRequest(null);
}

module.exports = { queueRandom, queueNext, endChain };