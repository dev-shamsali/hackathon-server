export const calculateWinners = (scores) => {
  const teamMap = {};

  scores.forEach((score) => {
    if (!score.teamId) return;
    const id = score.teamId._id?.toString() || score.teamId.toString();
    if (!teamMap[id]) {
      teamMap[id] = {
        team: score.teamId,
        totalScores: [],
        innovation: [],
        technicalImplementation: [],
        problemSolving: [],
        uiux: [],
        documentation: []
      };
    }
    teamMap[id].totalScores.push(score.totalScore);
    teamMap[id].innovation.push(score.innovation);
    teamMap[id].technicalImplementation.push(score.technicalImplementation);
    teamMap[id].problemSolving.push(score.problemSolving);
    teamMap[id].uiux.push(score.uiux);
    teamMap[id].documentation.push(score.documentation);
  });

  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const rankings = Object.values(teamMap).map((entry) => ({
    team: entry.team,
    avgTotal: avg(entry.totalScores),
    avgInnovation: avg(entry.innovation),
    avgTechnical: avg(entry.technicalImplementation),
    avgProblemSolving: avg(entry.problemSolving),
    avgUiux: avg(entry.uiux),
    avgDocumentation: avg(entry.documentation),
    judgeCount: entry.totalScores.length
  }));

  rankings.sort((a, b) => {
    if (b.avgTotal !== a.avgTotal) return b.avgTotal - a.avgTotal;
    if (b.avgInnovation !== a.avgInnovation) return b.avgInnovation - a.avgInnovation;
    if (b.avgTechnical !== a.avgTechnical) return b.avgTechnical - a.avgTechnical;
    return b.avgProblemSolving - a.avgProblemSolving;
  });

  const specialAwards = {
    bestUiux: [...rankings].sort((a, b) => b.avgUiux - a.avgUiux)[0],
    bestTechnical: [...rankings].sort((a, b) => b.avgTechnical - a.avgTechnical)[0],
    mostInnovative: [...rankings].sort((a, b) => b.avgInnovation - a.avgInnovation)[0],
    bestDocumentation: [...rankings].sort((a, b) => b.avgDocumentation - a.avgDocumentation)[0]
  };

  return { rankings, specialAwards };
};
