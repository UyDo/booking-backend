const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookingsRoutes = require('./routes/bookings');
const staffRoutes = require('./routes/staff');
const customersRoutes = require('./routes/customers');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// health
app.get('/', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/customers', customersRoutes);

app.listen(port, () => console.log(`API running on port ${port}`));
