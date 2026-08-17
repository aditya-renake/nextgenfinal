const { CAREERS, CATS, EXAM_INFO } = require('../js/data');

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category, search } = req.query;

  let results = [...CAREERS];

  if (category && category !== 'all') {
    results = results.filter(c => c.cat === category);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.one.toLowerCase().includes(q) ||
      c.stream.toLowerCase().includes(q) ||
      c.skills.toLowerCase().includes(q)
    );
  }

  // Hydrate exam info
  const enriched = results.map(c => ({
    ...c,
    categoryName: CATS.find(cat => cat.id === c.cat)?.name || c.cat,
    exams: c.examKeys.map(key => EXAM_INFO[key]).filter(Boolean)
  }));

  return res.status(200).json({
    success: true,
    count: enriched.length,
    data: enriched
  });
};
