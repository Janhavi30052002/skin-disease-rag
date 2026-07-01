export function parseKnowledge(text = "") {
  if (!text) {
    return {
      overview: "",
      features: [],
      abcde: {},
      recommendation: "",
    };
  }

  const sections = {
    overview: "",
    features: [],
    abcde: {},
    recommendation: "",
  };

  const lines = text.split("\n").map((l) => l.trim());

  let current = null;

  for (let line of lines) {
    if (line.toLowerCase().includes("overview")) {
      current = "overview";
      continue;
    }

    if (line.toLowerCase().includes("characteristics")) {
      current = "features";
      continue;
    }

    if (line.toLowerCase().includes("abcde")) {
      current = "abcde";
      continue;
    }

    if (line.toLowerCase().includes("recommend")) {
      current = "recommendation";
      continue;
    }

    if (!line) continue;

    switch (current) {
      case "overview":
        sections.overview += line + " ";
        break;

      case "features":
        sections.features.push(line.replace("-", ""));
        break;

      case "recommendation":
        sections.recommendation += line + " ";
        break;

      case "abcde":
        const [key, value] = line.split(":");
        if (key && value) {
          sections.abcde[key.trim().toLowerCase()] = value.trim();
        }
        break;

      default:
        sections.overview += line + " ";
    }
  }

  return sections;
}