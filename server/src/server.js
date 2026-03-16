require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const publicRoutes = require('./routes/public.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
  }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'LogiDispatch API is running',
    health: '/api/health',
    blog: '/api/blog',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, data: { status: 'up' }, meta: {} });
});

app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
