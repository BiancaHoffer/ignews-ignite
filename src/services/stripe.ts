import Stripe from 'stripe';
import { version } from "../../package.json"

export const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY, {
    // @ts-ignore stripe-version-2022-08-01
    apiVersion: "2020-08-27",
    appInfo: {
    name: 'ignews-ignite',
    version,
  },
})

export default stripe;