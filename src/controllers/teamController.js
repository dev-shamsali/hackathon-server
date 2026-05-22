import Team from '../models/Team.js';

export const registerTeam = async (req, res) => {
  try {
    const { teamName, leaderName, email, members, institute, projectTitle, problemStatement, techStack } = req.body;

    const existing = await Team.findOne({ $or: [{ email }, { teamName }] });
    if (existing) {
      const field = existing.email === email ? 'Email' : 'Team name';
      return res.status(400).json({ message: `${field} already registered` });
    }

    const prdUrl = req.files?.prd?.[0] ? `/uploads/${req.files.prd[0].filename}` : '';
    const trdUrl = req.files?.trd?.[0] ? `/uploads/${req.files.trd[0].filename}` : '';

    const membersArr = typeof members === 'string' ? members.split(',').map(m => m.trim()) : members || [];

    const team = await Team.create({
      teamName, leaderName, email, members: membersArr,
      institute, projectTitle, problemStatement, techStack, prdUrl, trdUrl
    });

    res.status(201).json({ message: 'Team registered successfully', team: { id: team._id, teamId: team.teamId, teamName: team.teamName } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { teamName, leaderName, email, members, institute, projectTitle, problemStatement, techStack, prdUrl, trdUrl } = req.body;

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (teamName && teamName !== team.teamName) {
      const dup = await Team.findOne({ teamName, _id: { $ne: team._id } });
      if (dup) return res.status(400).json({ message: 'Team name already taken' });
    }
    if (email && email !== team.email) {
      const dup = await Team.findOne({ email, _id: { $ne: team._id } });
      if (dup) return res.status(400).json({ message: 'Email already registered' });
    }

    if (teamName !== undefined) team.teamName = teamName;
    if (leaderName !== undefined) team.leaderName = leaderName;
    if (email !== undefined) team.email = email;
    if (institute !== undefined) team.institute = institute;
    if (projectTitle !== undefined) team.projectTitle = projectTitle;
    if (problemStatement !== undefined) team.problemStatement = problemStatement;
    if (techStack !== undefined) team.techStack = techStack;
    if (prdUrl !== undefined) team.prdUrl = prdUrl;
    if (trdUrl !== undefined) team.trdUrl = trdUrl;
    if (members !== undefined) {
      team.members = typeof members === 'string' ? members.split(',').map(m => m.trim()).filter(Boolean) : members;
    }

    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
