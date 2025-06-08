
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


export const getSkillBackgroundColor = (value: number): string => {
  if (value >= 90) return "#C8E6C9"; // Green for elite skills
  if (value >= 80) return "#BBDEFB"; // Blue for good skills
  if (value >= 70) return "#FFF9C4"; // Yellow for average skills
  return "#FFCDD2"; // red
};

export const getSkillValueColor = (value: number): string => {
  if (value >= 90) return "#2E7D32"; // Light green for elite skills
  if (value >= 80) return "#1565C0"; // Light blue for good skills
  if (value >= 70) return "#F9A825"; // Light yellow for average skills
  return "#C62828"; // 
}
