const { QUESTIONS, CATS } = require('../js/data');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Return all quiz questions
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      totalQuestions: QUESTIONS.length,
      questions: QUESTIONS.map(({ q, opts }) => ({
        question: q,
        options: opts.map(o => o.t)
      }))
    });
  }

  // POST: Evaluate submitted answers and return ranked categories
  if (req.method === 'POST') {
    const { answers } = req.body || {};

    if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) {
      return res.status(400).json({
        error: 'Invalid input. Please submit an array of chosen option indexes.'
      });
    }

    const scores = {};
    CATS.forEach(c => (scores[c.id] = 0));
    const maxPer = {};
    CATS.forEach(c => (maxPer[c.id] = 0));

    QUESTIONS.forEach((q, qi) => {
      q.opts.forEach(o => (maxPer[o.c] += 3));
      const chosenIdx = answers[qi];
      if (chosenIdx !== null && chosenIdx >= 0 && chosenIdx < q.opts.length) {
        scores[q.opts[chosenIdx].c] += 3;
      }
    });

    const ranked = CATS.map(c => ({
      ...c,
      score: scores[c.id],
      pct: Math.round((scores[c.id] / maxPer[c.id]) * 100)
    })).sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      topCategory: ranked[0],
      breakdown: ranked
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
