/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Gets random element from array
 * @template ItemType
 * @param {ItemType[]} a items An array containing the items.
 */
export function random(a) {
  return a[Math.floor(Math.random() * a.length)];
}

/**
 * Creates Map -> Set structure from json config file
 * @param {unknown} json
 */
export function loadFromJSON(json) {
  if (typeof json !== 'object')
    throw new Error('json config must be an object');
  const keys = Object.keys(json);
  /** @type {Map<string, Set<string>>} */
  const map = new Map();

  for (const key of keys) {
    if (!Array.isArray(json[key]))
      throw new Error('every key in config object must be an array of strings');
    map.set(key, new Set(json[key]));
  }

  return map;
}
