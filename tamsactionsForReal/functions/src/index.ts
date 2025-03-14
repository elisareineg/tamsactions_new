/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Stripe } from 'stripe';
import cors = require('cors');

admin.initializeApp();

const corsMiddleware = cors({ origin: true });
const stripe = new Stripe('sk_test_51R2LwII1IKSpNneXYGvwZ7mZaxluwh8ikq6HUOjCLzKkguf57RA1ixO9DYebtpOoRx6bwcwEz1tJSOiYKOWiHV9x00YVLajxJQ', {
  apiVersion: '2025-02-24.acacia'
});

export const createPaymentIntent = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ error: { message: 'Method not allowed' } });
        return;
      }

      const { amount, currency = 'usd' } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ error: { message: 'Invalid amount' } });
        return;
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Stripe expects amount in cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Send client secret to client
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({
        error: {
          message: 'An error occurred while creating the payment intent.',
        },
      });
    }
  });
});
