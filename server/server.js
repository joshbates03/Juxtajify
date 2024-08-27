const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const pool = require('./db');
const port = 3001;
app.use(express.static(path.join(__dirname, '../client/build')));
const domain = `http://localhost:${port}/`;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/save', async (req, res) => {
  const urlSchema = 'https://';

  try {
    let { url, slug } = req.body;
    if (!url.startsWith(urlSchema)) {
      url = 'https://' + url;
    }

    if (!slug) {
      const { nanoid } = await import('nanoid');
      slug = nanoid(5);
    }

    const query = 'INSERT INTO links (url, slug) VALUES ($1, $2)';
    const values = [url, slug];
    const result = await pool.query(query, values);
    const link =  domain + slug;

    res.json(link);
  } catch (error) {
    console.error('Error inserting user data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  const query = 'SELECT url FROM links WHERE slug = $1';

  try {
    const result = await pool.query(query, [slug]);
    if (result.rowCount === 0) {
      res.status(400).json({ error: 'Invalid slug' });
      return;
    }
    res.redirect(result.rows[0].url);
  } catch (error) {
    console.error('Error retrieving link', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
