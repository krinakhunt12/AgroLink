export const classifyVideo = (text) => {
  const lower = text.toLowerCase();

  if (lower.includes("price") || lower.includes("mandi"))
    return "CROP_PRICE";

  if (lower.includes("disease") || lower.includes("fungus"))
    return "CROP_DISEASE";

  if (lower.includes("weather") || lower.includes("rain"))
    return "WEATHER_ALERT";

  return "FARMING_TECHNIQUE";
};
