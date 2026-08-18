const { INITIAL_DEMO_USERS } = require('../js/storage');

let inMemoryUsers = [...INITIAL_DEMO_USERS];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: List all users with optional query filtering
  if (req.method === 'GET') {
    const { stream, status, search, exportType } = req.query;
    let filtered = [...inMemoryUsers];

    if (stream && stream !== 'all') {
      filtered = filtered.filter(u => u.stream && u.stream.toLowerCase().includes(stream.toLowerCase()));
    }
    if (status && status !== 'all') {
      filtered = filtered.filter(u => u.status && u.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(u => 
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q))
      );
    }

    if (exportType === 'csv') {
      const headers = ['ID,Name,Email,Phone,Stream,City,TopMatch,ScorePct,Date,Status'];
      const rows = filtered.map(u => 
        `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.stream}","${u.city}","${u.topMatch}","${u.scorePct}%","${u.registeredAt}","${u.status}"`
      );
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="registered_students.csv"');
      return res.status(200).send([headers, ...rows].join('\n'));
    }

    return res.status(200).json({
      success: true,
      total: filtered.length,
      users: filtered
    });
  }

  // POST: Add new user registration
  if (req.method === 'POST') {
    const data = req.body || {};
    if (!data.name || !data.email) {
      return res.status(400).json({ error: 'Name and Email are required.' });
    }

    const newUser = {
      id: `NXG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      stream: data.stream || 'Class 12 Pass / Appearing',
      city: data.city || 'India',
      topMatch: data.topMatch || 'General Career Path',
      topMatchId: data.topMatchId || 'eng',
      scorePct: data.scorePct || 85,
      registeredAt: new Date().toISOString(),
      status: 'New',
      notes: data.notes || '',
      scores: data.scores || {}
    };

    inMemoryUsers.unshift(newUser);
    return res.status(201).json({ success: true, user: newUser });
  }

  // PUT: Update user status or notes
  if (req.method === 'PUT') {
    const { id, updates } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    const idx = inMemoryUsers.findIndex(u => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }
    inMemoryUsers[idx] = { ...inMemoryUsers[idx], ...updates, updatedAt: new Date().toISOString() };
    return res.status(200).json({ success: true, user: inMemoryUsers[idx] });
  }

  // DELETE: Remove user
  if (req.method === 'DELETE') {
    const { id } = req.query || req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    inMemoryUsers = inMemoryUsers.filter(u => u.id !== id);
    return res.status(200).json({ success: true, message: 'User deleted successfully.' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
