import Stripe from 'stripe';
import { version } from "../../package.json"

export const stripe = new Stripe("sk_test_51LpKgbBMpmIkB5igPMQQNy2a7CYlnLQyIYKcY2w6mRD2MrK9lzRRbpQwitGC773Cw18WmUfOmalP3UgYfbUTKB4k00Z6dX6PCJ", {
    // @ts-ignore stripe-version-2022-08-01
    apiVersion: "2020-08-27",
    appInfo: {
    name: 'ignews-ignite',
    version,
  },
})

export default stripe;