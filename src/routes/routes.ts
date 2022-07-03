/* eslint-disable global-require */
import express from 'express';
import fs from 'fs';
import path from 'path';

const controllersDir = path.join(process.cwd(), 'src', 'controllers');

const router = express.Router();

fs
  .readdirSync(controllersDir)
  .filter((f) => f.endsWith('.ts'))
  .forEach((f) => {
    // eslint-disable-next-line import/no-dynamic-require
    const controller = require(path.join(controllersDir, f)).default;

    if (controller) { router.use(`/${f.replace('_controller.ts', '')}`, controller); }

  });

export { router };
