"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import Stripe from "stripe";
import { internal } from "./_generated/api";

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2024-06-20",
});

export const pay = action({
  args: {},
  handler: async (ctx, {}) => {
    const domain = process.env.HOSTING_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: process.env.PRICE_ID!, quantity: 1 }],
      mode: "payment",
      success_url: `${domain}/index-course`,
      cancel_url: `${domain}`,
      automatic_tax: { enabled: true },
    });

    return session.url;
  },
});

export const webhookFulfill = internalAction({
  args: { signature: v.string(), payload: v.any() },
  handler: async (ctx, args) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
      const event = stripe.webhooks.constructEvent(
        args.payload,
        args.signature,
        webhookSecret
      );

      if (event.type === "checkout.session.completed") {
        const completedEvent = event.data.object as Stripe.Checkout.Session;
        const customerEmail = completedEvent.customer_details?.email;
        const stripeCheckoutId = completedEvent.id;

        if (!customerEmail && !stripeCheckoutId) {
          throw new Error(
            "Payment wasn't successfull OR email wasn't provided"
          );
        }

        const userDetails = {
          email: customerEmail!,
          stripeCheckoutId: stripeCheckoutId,
        };

        await ctx.runMutation(internal.fromUsers.createUser, { ...userDetails });
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      console.log("Tell me what's wrong", err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});
