const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const electionRoutes = require('./routes/electionRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const tokenController = require('./controllers/tokenController');
const electionController = require('./controllers/electionController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/elections', electionRoutes);
app.use('/api/tokens', tokenRoutes);

// Standalone routes as per prompt requirements
app.post('/api/register', tokenController.registerVoter);
app.post('/api/merkle/witness', electionController.getMerkleWitness);

// Sync Database and Start Server
// Using alter: true to update tables without dropping them if possible
db.sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
