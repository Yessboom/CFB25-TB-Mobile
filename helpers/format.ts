
export function getPositionName(positionCode: number | string): string {
  // if string, convert to number
  const code = typeof positionCode === "string" 
    ? parseInt(positionCode, 10) 
    : positionCode;

  const positions: Record<number, string> = {
    0: "QB",
    1: "HB", 
    2: "FB",
    3: "WR",
    4: "TE",
    5: "LT",
    6: "LG",
    7: "C", 
    8: "RG",
    9: "RT",
    10: "LE",
    11: "RE",
    12: "DT", 
    13: "LOLB",
    14: "MLB",
    15: "ROLB",
    16: "CB",
    17: "FS",
    18: "SS", 
    19: "K",
    20: "P",
  };
  
  return positions[code] || "Unknown";
}

export function formatHeight(heightInInches: number): string {
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;
  const cm = Math.round(heightInInches * 2.54);
  const meters = (cm / 100).toFixed(2);
  // return `${feet}'${inches}"`;  // US format
  return `${meters} m`;  // Metric format
}

export function formatDevTrait(traitCode: string | undefined): string {
  if (!traitCode) return "N/A";
  
  const traits: Record<string, string> = {
    "0": "Normal",
    "1": "Impact", 
    "2": "Star",
    "3": "Elite"
  };
  
  return traits[traitCode] || traitCode;
}

// Helper function to format weight
export function formatWeight(weight: number | undefined): string {
  if (!weight) return "N/A";
  
  const kg = Math.round((160 + weight) * 0.453592);
  return `${kg} kg`;
}