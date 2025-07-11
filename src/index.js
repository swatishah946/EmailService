
import express from 'express';
import cors from 'cors';
import { enqueueEmailJob } from './emailservice.js';
import {EmailService} from './emailservice.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Email Service is running. Use POST /send-email to send emails.');
});

app.post('/send-email', async (req, res) => {
  const { to, subject, body, idempotencyKey } = req.body;

  if (!to || !subject || !body || !idempotencyKey) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, body, idempotencyKey' });
  }

  try {
    enqueueEmailJob({ to, subject, body, idempotencyKey });
    res.status(202).json({
      status: 'QUEUED',
      message: 'Email job accepted and will be processed shortly.',
      track: `/status/${idempotencyKey}`
    });
  } catch (err) {
    console.error('Failed to enqueue job:', err.message);
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});


app.get('/status/:id', (req, res) => {
  const emailService = new EmailService(); 
  const status = emailService.getStatus(req.params.id);

  res.status(200).json({
    idempotencyKey: req.params.id,
    status
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EmailService API running on http://localhost:${PORT}`);
});
