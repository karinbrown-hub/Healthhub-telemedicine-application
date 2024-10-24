const express = require('express');
const app = express();
const contactRouter = require('./routes/contact');
app.use('/api/contact', contactRouter);

// ... existing imports ...
const availabilityRouter = require('./routes/availability');
const notificationsRouter = require('./routes/notifications');
const auditLogMiddleware = require('./middleware/auditLogMiddleware');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const rateLimitMiddleware = require('./middleware/rateLimitMiddleware');
const { i18next, middleware: i18nextMiddleware } = require('./config/i18n');

// ... existing middleware ...

app.use(auditLogMiddleware);
app.use(sessionMiddleware);

app.use("/api/", rateLimitMiddleware);

app.use('/api/availability', availabilityRouter);
app.use('/api/notifications', notificationsRouter);

app.use(i18nextMiddleware);


module.exports = app;