import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Helper variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: 'agriculture'
});

// Connect to MySQL and create tables if they do not exist
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');

    // Create necessary tables if they don't exist
    const createTables = [
        `
        CREATE TABLE IF NOT EXISTS farmerreg (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255),
            phonenumber VARCHAR(10),
            address TEXT,
            city VARCHAR(255),
            state VARCHAR(255),
            username VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            image LONGBLOB
        )
        `,
        `
        CREATE TABLE IF NOT EXISTS buyersreg (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255),
            phonenumber VARCHAR(10),
            address TEXT,
            city VARCHAR(255),
            state VARCHAR(255),
            username VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            image LONGBLOB
        )
        `,
        `
        CREATE TABLE IF NOT EXISTS agentsreg (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255),
            phonenumber VARCHAR(10),
            companyname VARCHAR(255),
            address TEXT,
            city VARCHAR(255),
            state VARCHAR(255),
            username VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            image LONGBLOB
        )
        `,
        `
        CREATE TABLE IF NOT EXISTS crops (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255),
            crop VARCHAR(255),
            plantingDate DATE,
            soilHealth VARCHAR(255),
            irrigation VARCHAR(255)
        )
        `,
        `
        CREATE TABLE IF NOT EXISTS soil_samples (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ph DOUBLE,
            nitrogen DOUBLE,
            phosphorus DOUBLE,
            potassium DOUBLE,
            organic_matter DOUBLE
        )
        `,
        `
        CREATE TABLE IF NOT EXISTS fertilizers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            company_name VARCHAR(255) NOT NULL,
            crop_name VARCHAR(255) NOT NULL,
            fertilizers TEXT NOT NULL
        )
        `,
        `
        CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sender_username VARCHAR(255),
            receiver_username VARCHAR(255),
            message TEXT,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `,
    `
        CREATE TABLE IF NOT EXISTS crop_costs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    crop VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS purchases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        productName VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL
    )
`
    ];

    createTables.forEach(query => {
        db.query(query, (err) => {
            if (err) throw err;
            console.log('Table created or exists');
        });
    });
});

// Handle farmer registration form submission
app.post('/register_farmer', upload.single('image'), (req, res) => {
    const { fullname, phonenumber, address, city, state, username, password } = req.body;
    const image = req.file ? req.file.buffer : null;

    const checkQuery = 'SELECT * FROM farmerreg WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length > 0) {
            return res.status(409).send('User already exists');
        }

        const insertQuery = `
            INSERT INTO farmerreg (fullname, phonenumber, address, city, state, username, password, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [fullname, phonenumber, address, city, state, username, password, image], (err) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error registering user');
            }
            res.redirect('/farmerlogin.html');
        });
    });
});

// Handle farmer login endpoint
app.post('/farmerlogin', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const query = 'SELECT * FROM farmerreg WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 1) {
            res.redirect(`/farmerdashboard.html?username=${username}`);
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});


// Handle farmers profile update
app.post('/update-farmer', upload.single('image'), (req, res) => {
    const { username, password, fullname, phonenumber, address, city, state } = req.body;
    const image = req.file ? req.file.buffer : null;

    let updateQuery = 'UPDATE farmerreg SET password = ?, fullname = ?, phonenumber = ?, address = ?, city = ?, state = ?';
    const queryParams = [password, fullname, phonenumber, address, city, state, username];

    if (image) {
        updateQuery += ', image = ?';
        queryParams.splice(6, 0, image);
    }

    updateQuery += ' WHERE username = ?';

    db.query(updateQuery, queryParams, (err) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ message: 'Error updating profile' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    });
});


// Handle buyers registration form submission
app.post('/register_buyers', upload.single('image'), (req, res) => {
    const { fullname, phonenumber, address, city, state, username, password } = req.body;
    const image = req.file ? req.file.buffer : null;

    const checkQuery = 'SELECT * FROM buyersreg WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length > 0) {
            return res.status(409).send('User already exists');
        }

        const insertQuery = `
            INSERT INTO buyersreg (fullname, phonenumber, address, city, state, username, password, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [fullname, phonenumber, address, city, state, username, password, image], (err) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error registering user');
            }
            res.redirect('/buyerslogin.html');
        });
    });
});

// Handle buyers login endpoint
app.post('/buyerslogin', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const query = 'SELECT * FROM buyersreg WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 1) {
            res.redirect(`/buyersdashboard.html?username=${username}`);
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

// Handle agents registration form submission
app.post('/register_agents', upload.single('image'), (req, res) => {
    const { fullname, phonenumber, companyname, address, city, state, username, password } = req.body;
    const image = req.file ? req.file.buffer : null;

    const checkQuery = 'SELECT * FROM agentsreg WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length > 0) {
            return res.status(409).send('User already exists');
        }

        const insertQuery = `
            INSERT INTO agentsreg (fullname, phonenumber, companyname, address, city, state, username, password, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [fullname, phonenumber, companyname, address, city, state, username, password, image], (err) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error registering user');
            }
            res.redirect('/agentslogin.html');
        });
    });
});

// Handle agents login endpoint
app.post('/agentslogin', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const query = 'SELECT * FROM agentsreg WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 1) {
            res.redirect(`/agentsdashboard.html?username=${username}`);
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

// Handle buyers profile update
app.post('/update-buyer', upload.single('image'), (req, res) => {
    const { username, password, fullname, phonenumber, address, city, state } = req.body;
    const image = req.file ? req.file.buffer : null;

    let updateQuery = 'UPDATE buyersreg SET password = ?, fullname = ?, phonenumber = ?, address = ?, city = ?, state = ?';
    const queryParams = [password, fullname, phonenumber, address, city, state, username];

    if (image) {
        updateQuery += ', image = ?';
        queryParams.splice(6, 0, image);
    }

    updateQuery += ' WHERE username = ?';

    db.query(updateQuery, queryParams, (err) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ message: 'Error updating profile' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    });
});

// Handle agents profile update
app.post('/update-agent', upload.single('image'), (req, res) => {
    const { username, password, fullname, phonenumber, companyname, address, city, state } = req.body;
    const image = req.file ? req.file.buffer : null;

    let updateQuery = 'UPDATE agentsreg SET password = ?, fullname = ?, phonenumber = ?, companyname = ?, address = ?, city = ?, state = ?';
    const queryParams = [password, fullname, phonenumber, companyname, address, city, state, username];

    if (image) {
        updateQuery += ', image = ?';
        queryParams.splice(7, 0, image);
    }

    updateQuery += ' WHERE username = ?';

    db.query(updateQuery, queryParams, (err) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ message: 'Error updating profile' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    });
});

// Handle crop data submission
app.post('/api/crops', (req, res) => {
    const { username, crop, plantingDate, soilHealth, irrigation } = req.body;

    const query = `
        INSERT INTO crops (username, crop, plantingDate, soilHealth, irrigation) 
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [username, crop, plantingDate, soilHealth, irrigation], (err) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Error inserting data' });
            return;
        }
        res.status(200).json({ message: 'Crop data submitted successfully!' });
    });
});

// Handle fetching crop data based on username
app.get('/api/crops/:username', (req, res) => {
    const username = req.params.username;

    const query = 'SELECT * FROM crops WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }
        res.status(200).json(results);
    });
});

// Analyze soil data and generate recommendations
app.post('/analyze-soil', (req, res) => {
    const { ph, nitrogen, phosphorus, potassium, organic_matter } = req.body;

    // Insert soil data into the database
    const insertQuery = 'INSERT INTO soil_samples (ph, nitrogen, phosphorus, potassium, organic_matter) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [ph, nitrogen, phosphorus, potassium, organic_matter], (err) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Generate recommendations based on soil data
        let recommendations = '';

        // pH recommendations
        if (ph < 6.0) {
            recommendations += 'Soil pH is low. Consider adding lime to increase pH.\n';
        } else if (ph > 7.5) {
            recommendations += 'Soil pH is high. Consider adding sulfur to decrease pH.\n';
        } else {
            recommendations += 'Soil pH is within the optimal range.\n';
        }

        // Nitrogen recommendations
        if (nitrogen < 20.0) {
            recommendations += 'Nitrogen level is low. Consider adding a nitrogen-rich fertilizer or green manure.\n';
        } else if (nitrogen > 40.0) {
            recommendations += 'Nitrogen level is high. Reduce nitrogen input or use a balanced fertilizer.\n';
        } else {
            recommendations += 'Nitrogen level is sufficient.\n';
        }

        // Phosphorus recommendations
        if (phosphorus < 15.0) {
            recommendations += 'Phosphorus level is low. Apply phosphorus-rich fertilizers.\n';
        } else if (phosphorus > 30.0) {
            recommendations += 'Phosphorus level is high. Avoid excess phosphorus to prevent environmental issues.\n';
        } else {
            recommendations += 'Phosphorus level is adequate.\n';
        }

        // Potassium recommendations
        if (potassium < 25.0) {
            recommendations += 'Potassium level is low. Use potassium-rich fertilizers.\n';
        } else if (potassium > 50.0) {
            recommendations += 'Potassium level is high. Monitor for potential nutrient imbalances.\n';
        } else {
            recommendations += 'Potassium level is suitable.\n';
        }

        // Organic matter recommendations
        if (organic_matter < 5.0) {
            recommendations += 'Organic matter content is low. Add compost or organic amendments.\n';
        } else if (organic_matter > 10.0) {
            recommendations += 'Organic matter content is high. Ensure balanced soil conditions.\n';
        } else {
            recommendations += 'Organic matter content is sufficient.\n';
        }

        // Crop recommendations
        let cropRecommendations = 'Based on the soil conditions, consider the following crops:\n';

        if (ph >= 6.0 && ph <= 7.5 && nitrogen >= 20.0 && phosphorus >= 15.0 && potassium >= 25.0) {
            cropRecommendations += ' - Corn\n - Beans\n - Tomatoes\n';
        } else if (ph < 6.0 && nitrogen < 20.0) {
            cropRecommendations += ' - Potatoes\n - Lettuce\n - Cabbage\n';
        } else if (ph > 7.5 && potassium > 50.0) {
            cropRecommendations += ' - Asparagus\n - Carrots\n - Parsnips\n';
        } else {
            cropRecommendations += ' - Consult with a local agronomist for specific crop recommendations.\n';
        }

        res.json({ recommendations: recommendations + '\n' + cropRecommendations });
    });
});

// Add a new fertilizer entry with company name, crop name, and fertilizers
app.post('/api/add-fertilizer', (req, res) => {
    const { companyName, cropName, fertilizers } = req.body;

    if (!companyName || !cropName || !fertilizers) {
        return res.status(400).json({ message: 'Company name, crop name, and fertilizers are required.' });
    }

    const sql = 'INSERT INTO fertilizers (company_name, crop_name, fertilizers) VALUES (?, ?, ?)';
    db.query(sql, [companyName, cropName, fertilizers], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Failed to add crop.' });
            return;
        }
        res.json({ message: 'Crop and fertilizers added successfully!' });
    });
});


// Endpoint to fetch fertilizers based on company name
app.get('/api/agents/fertilizers/:companyName', (req, res) => {
    const companyName = req.params.companyName;

    const query = 'SELECT * FROM fertilizers WHERE company_name = ?';
    db.query(query, [companyName], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.json(results);
    });
});

// Handle fetching fertilizers based on crop name
app.get('/api/fertilizers/:cropName', (req, res) => {
    const cropName = req.params.cropName;

    const query = 'SELECT fertilizers FROM fertilizers WHERE crop_name = ?';
    db.query(query, [cropName], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'No fertilizers found for this crop' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Endpoint to send a message
app.post('/api/agents/send-message', (req, res) => {
    const { sender, receiver, message } = req.body;

    const query = 'INSERT INTO messages (sender_username, receiver_username, message) VALUES (?, ?, ?)';
    db.query(query, [sender, receiver, message], (err) => {
        if (err) {
            console.error('Error sending message:', err);
            return res.status(500).json({ message: 'Error sending message' });
        }
        res.json({ message: 'Message sent successfully' });
    });
});

// Endpoint to retrieve messages
app.get('/api/agents/messages/:username', (req, res) => {
    const username = req.params.username;

    const query = 'SELECT * FROM messages WHERE receiver_username = ? ORDER BY sent_at DESC';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).json({ message: 'Error fetching messages' });
        }
        res.json(results);
    });
});

// Route to get sent messages
app.get('/api/agents/messages/:username', (req, res) => {
    const username = req.params.username;

    // SQL query to get sent messages for a particular user
    const query = 'SELECT * FROM messages WHERE sender_username = ? ORDER BY sent_at DESC';

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json(results);
    });
});

// Handle account deletion endpoint
app.delete('/delete-account', (req, res) => {
    const { username, userType } = req.body;

    if (!username || !userType) {
        return res.status(400).json({ error: 'Username and userType are required' });
    }

    let tableName = '';
    if (userType === 'farmer') {
        tableName = 'farmerreg';
    } else if (userType === 'buyer') {
        tableName = 'buyersreg';
    } else if (userType === 'agent') {
        tableName = 'agentsreg';
    } else {
        return res.status(400).json({ error: 'Invalid userType' });
    }

    const deleteQuery = `DELETE FROM ${tableName} WHERE username = ?`;

    db.query(deleteQuery, [username], (err, result) => {
        if (err) {
            console.error('Error deleting account:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    });
});

// Route to handle GET requests for fetching agents by city
app.get('/api/agents/:city', (req, res) => {
    const city = req.params.city;

    const query = 'SELECT * FROM agentsreg WHERE city = ?';
    db.query(query, [city], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ message: 'Error fetching agent data' });
        }
        res.json(results);
    });
});


// Endpoint to handle purchase data
app.post('/api/purchases', (req, res) => {
    const { username, productName, quantity, price } = req.body;

    // Validation
    if (!username || !productName || !quantity || isNaN(quantity) || quantity <= 0 || isNaN(price) || price < 0) {
        return res.status(400).json({ error: 'Invalid input. Please check your data.' });
    }

    // Insert data into the database
    const insertQuery = 'INSERT INTO purchases (username, productName, quantity, price) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [username, productName, quantity, price], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ message: 'Purchase details submitted successfully' });
    });
});

// Endpoint to get purchases by username
app.get('/api/purchases/:username', (req, res) => {
    const { username } = req.params;
    const selectQuery = 'SELECT * FROM purchases WHERE username = ?';

    db.query(selectQuery, [username], (err, results) => {
        if (err) {
            console.error('Error fetching purchase details:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(results);
    });
});

// Endpoint to get buyers by city
app.get('/api/buyers/:city', (req, res) => {
    const city = req.params.city;

    const query = 'SELECT * FROM buyersreg WHERE city = ?';
    db.query(query, [city], (err, results) => {
        if (err) {
            console.error('Error fetching buyers:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
