
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import express from 'express';
import { PORT, API_BACKEND_HOST, API_PAYLOAD_MAX_SIZE } from './config/env.js';
import { proxyLimiter } from './middleware/limiter.js';
import apiProxyRouter from './routes/apiProxy.js';
import { handleUpgrade } from './routes/wsProxy.js';

const app = express();
app.use(express.json({ limit: API_PAYLOAD_MAX_SIZE }));

app.set('trust proxy', 1 /* number of proxies between user and server */);

// Apply rate limiter to /api-proxy
app.use('/api-proxy', proxyLimiter);

// API Proxy Route
app.use(apiProxyRouter);

const server = app.listen(PORT, API_BACKEND_HOST, () => {
  console.log(`Vertex AI Backend listening at http://localhost:${PORT}`);
});

// WebSocket Proxy connection upgrade
server.on('upgrade', (request, socket, head) => {
  handleUpgrade(request, socket, head);
});



