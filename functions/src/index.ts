import * as functions from 'firebase-functions'
import dotenv from 'dotenv'

import { App } from 'octokit'
import { createAppAuth } from '@octokit/auth-app'
import { beforeUserSignedIn } from "firebase-functions/v2/identity";
import admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

import {
  InstallationCreatedEvent,
  InstallationDeletedEvent,
  InstallationSuspendEvent,
  InstallationUnsuspendEvent,
  IssuesClosedEvent,
  IssuesOpenedEvent,
  IssuesReopenedEvent
} from '@octokit/webhooks-types'

import {
  installations,
  issues
} from './hooks/index.js'

dotenv.config()

const app = new App({
  authStrategy: createAppAuth,
  appId: process.env.APP_ID ?? '',
  privateKey: process.env.PRIVATE_KEY ?? '',
  webhooks: {
    secret: process.env.WEBHOOK_SECRET ?? ''
  }
})



// Exportar como Firebase Function
export const webhook = functions.https.onRequest((req, res) => {
  debugger;
  if (req.method === 'GET' && req.url === '/') {
    console.log("Get al html")
    res.status(200).send('<h1>Welcome to the GitHub App!</h1>');
    return;
  }

  if (req.method === 'POST' && req.url?.startsWith('/api/webhook')) {
    console.log("POST a /api/webhook")
    // webhookMiddleware(req, res);
    const eventType = req.headers['x-github-event'] as string | undefined;
    console.log('eventType:', eventType);
    console.log(req.body);
    console.log(req.headers);

    
    const webhookHandlers: Record<string, Record<string, (req: any, res: any) => void>> = {
      installation: {
        created: (req, res) => {
          installations.created(app, req.body as InstallationCreatedEvent)
        },
        suspend: (req, res) => {
          installations.suspended(app, req.body as InstallationSuspendEvent)
        },
        deleted: (req, res) => {
          installations.deleted(app, req.body as InstallationDeletedEvent)
        },
        unsuspend: (req, res) => {
          installations.unsuspended(app, req.body as InstallationUnsuspendEvent)
        }
      },
      issues: {
        opened: (req, res) => {
          issues.commentOnIssueOpened(app, req.body as IssuesOpenedEvent)
        },
        closed: (req, res) => {
          issues.commentOnIssueClosed(app, req.body as IssuesClosedEvent)
        },
        reopened: (req, res) => {
          issues.commentOnIssueReopened(app, req.body as IssuesReopenedEvent)
        },
      },
    };

    const eventHandlers = webhookHandlers[eventType ?? ''];
    const action = req.body.action;
    if (eventHandlers && action && typeof eventHandlers[action] === 'function') {
      eventHandlers[action](req, res);
    } else {
      console.log(`No handler for event: ${eventType}, action: ${action}`);
    }
    
  } else {
    // Fallback
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }

})


export const blockUnauthorizedUsers = beforeUserSignedIn(async (event) => {
  if (!event.data?.email) {
    logger.error("No se detectó correo del usuario:", event.data);
    throw new Error("No se detectó correo del usuario.");
  }

  const email = event.data.email.toLowerCase();

  const snapshot = await admin.firestore()
    .collection("users")
    .where("email", "==", email)
    .get();

  if (snapshot.empty) {
    logger.warn(`Intento de login de usuario no registrado: ${email}`);
    throw new Error("Usuario no autorizado.");
  }

  logger.info(`Usuario ${email} autorizado correctamente`);
  return;
});


export const test = functions.https.onRequest({
    timeoutSeconds: 120
}, (req, res)=>{
    res.send('Hola :)')
})