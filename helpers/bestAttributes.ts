import { Player } from '@/types/FullTypes';

// Define the type for attribute names
type AttributeKey = string;

const skillCategories = {
  physical: { name: "Physical", skills: ["speed", "acceleration", "strength", "agility", "jumping", "awareness"] },
  passing: { name: "Passing", skills: ["throwPower", "throwAccuracy", "throwAccuracyShort", "throwAccuracyMid", "throwAccuracyDeep", "playAction", "throwOnTheRun", "throwUnderPressure", "breakSack"] },
  rushing: { name: "Rushing", skills: ["carrying", "trucking", "backfieldVision", "stiffArm", "spinMove", "jukeMove", "breakTackle", "changeOfDirection"] },
  receiving: { name: "Receiving", skills: ["catching", "spectacularCatch", "catchInTraffic", "shortRouteRun", "mediumRouteRun", "deepRouteRun", "release"] },
  blocking: { name: "Blocking", skills: ["runBlock", "passBlock", "impactBlocking", "runBlockPower", "runBlockFinesse", "passBlockPower", "passBlockFinesse", "leadBlock"] },
  defense: { name: "Defense", skills: ["tackle", "hitPower", "powerMoves", "finesseMoves", "blockShedding", "pursuit", "playRecognition"] },
  coverage: { name: "Coverage", skills: ["manCoverage", "zoneCoverage", "playRecognition", "press"] },
  kicking: { name: "Kicking", skills: ["kickPower", "kickAccuracy", "kickReturn", "longSnapRating"] }
};

// Flatten all skills into a single array
const allAttributes: readonly AttributeKey[] = Object.values(skillCategories).flatMap(category => category.skills);

export const GetBestThreeAttributes = (player: Player): AttributeKey[] => {
    // Create an array of objects containing attribute names and their values
    const attributeValues = allAttributes.map(attr => ({
        name: attr,
        value: player[attr as keyof Player] as number
    }));

    // Sort the attributes by their values in descending order
    attributeValues.sort((a, b) => b.value - a.value);

    // Extract the top three attributes
    const bestThreeAttributes = attributeValues.slice(0, 3).map(attr => attr.name);
    console.log("Best three attributes:", bestThreeAttributes);

    return bestThreeAttributes;
};