const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;


const SECRET_API_KEY = "my_super_secret_dev_key_123";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 


const users = {
    "1": { id: "1", name: "Alice", email: "alice@example.com", isAdmin: true },
    "2": { id: "2", name: "Bob", email: "bob@example.com", isAdmin: false },
    "3": { id: "3", name: "Charlie", email: "charlie@example.com", isAdmin: false }
};

app.get('/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.send('Please provide a search query (e.g., /search?q=test)');
    }
    const simulatedSql = `SELECT * FROM products WHERE name LIKE '%${query}%';`;
    console.log("Simulated SQL Query:", simulatedSql);
    res.send(`Searching for: ${query}. (Simulated query executed: ${simulatedSql})`);
});

app.get('/comment', (req, res) => {
    const userComment = req.query.text; 
    if (!userComment) {
        return res.send('Please provide a comment (e.g., /comment?text=hello)');
    }

    res.send(`<h1>Your Comment:</h1><p>${userComment}</p><p>This comment was processed.</p>`);
});


app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    const user = users[userId];
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

app.get('/', (req, res) => {
    res.send(`
        <h1>Vulnerable Node.js App</h1>
        <p>This app demonstrates security vulnerabilities for educational purposes.</p>
        <ul>
            <li><a href="/search?q=example">SQL Injection Demo (Try: /search?q=admin'%20OR%20'1'='1)</a></li>
            <li><a href="/comment?text=<b>Hello!</b>">XSS Demo (Try: /comment?text=<script>alert('XSSed!')</script>)</a></li>
            <li><a href="/user/1">IDOR Demo (Access User 1)</a></li>
            <li><a href="/user/2">IDOR Demo (Access User 2 - no auth needed)</a></li>
        </ul>
        <p>API Key: ${SECRET_API_KEY}</p>
    `);
});


app.listen(port, () => {
    console.log(`Vulnerable app listening at http://localhost:${port}`);
    console.log(`Simulated API Key: ${SECRET_API_KEY}`);
});