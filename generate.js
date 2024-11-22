import peopleJSON from './people.json' with { type: 'json' };
import { shuffle, random, loadFromJSON } from './utils.js';

/** @type {Map<string, Set<string>>} */
const peopleExclusions = loadFromJSON(peopleJSON);

/**
 * @param {string} person
 * @param {Set<string>} allPeople
 * @param {Set<string>} takenPeople
 */
function getMatchForPerson(person, allPeople, takenPeople) {
  const exclusions = peopleExclusions.get(person);
  const possibleMatches = Array.from(allPeople).filter(
    (possibleMatch) =>
      !exclusions.has(possibleMatch) &&
      !takenPeople.has(possibleMatch) &&
      person !== possibleMatch,
  );

  if (possibleMatches.length === 0) {
    throw new Error(`Unable to find match for ${person}`);
  }

  return random(possibleMatches);
}

function buildMatches() {
  /** @type {Set<string>} */
  const people = new Set(shuffle([...peopleExclusions.keys()]));
  /** @type {Map<string, string>} */
  const matches = new Map();
  /** @type {Set<string>} */
  const takenPeople = new Set();

  for (const person of people) {
    const match = getMatchForPerson(person, people, takenPeople);
    console.log(`${person} --> ${match}`);
    matches.set(person, match);
    takenPeople.add(match);
  }

  return matches;
}

/**
 * @param {string} start
 * @param {Map<string, string>} matches
 */
function getCycle(start, matches) {
  /** @type {Set<string>} */
  const cycle = new Set();
  cycle.add(start);

  let curr = start;
  do {
    const match = matches.get(curr);
    if (!match) throw new Error(`No match found for ${curr}`);

    if (match === start) return cycle;

    cycle.add(match);
    curr = match;
  } while (cycle.size < 100);
  throw new Error(`Could not find cycle for ${start}`);
}

/** @param {Map<string, string>} matches */
function verifyMatchGraph(matches) {
  const cycles = new Set();
  const people = new Set(matches.keys());
  let minCycleLength = Number.POSITIVE_INFINITY;
  let maxCycleLength = 0;

  for (const person of people) {
    const cycle = getCycle(person, matches);
    console.log(`${Array.from(cycle)}: ${cycle.size}`);

    if (cycle.size < minCycleLength) minCycleLength = cycle.size;
    if (cycle.size > maxCycleLength) maxCycleLength = cycle.size;

    for (const cyclePerson of cycle) {
      people.delete(cyclePerson);
    }

    cycles.add(cycle);
  }

  console.log(
    `Total Cycles: ${cycles.size}; Max Cycle Length: ${maxCycleLength}, Min Cycle Length: ${minCycleLength}`,
  );

  if (cycles.size > 1) throw new Error('More than one cycle found');
}

do {
  try {
    console.log('Attempting to build graph...');
    const matches = buildMatches();
    verifyMatchGraph(matches);
    console.log('Success!!');
    break;
  } catch (err) {
    console.error(err.message);
    console.error('Error building match graph... Trying again...');
  }
} while (true);
