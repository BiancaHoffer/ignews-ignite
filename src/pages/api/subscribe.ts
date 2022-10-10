import { NextApiRequest, NextApiResponse } from 'next'
import stripe from '../../services/stripe'
import { getSession } from "next-auth/react";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        // método para acessar dados do usuário logado nextauth por rota beck-end
        const session = await getSession({ req })

        // Criar um customer(credenciais do usuário) lá no dashboard do stripe
        const createStripeCustomer = stripe.customers.create({
            email: session.user.email,
        })
        
        const checkoutSessionStripe = stripe.checkout.sessions.create({
            customer: (await createStripeCustomer).id,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [{
                 price: 'price_1LpKkyBMpmIkB5igObRkF2lJ', 
                 quantity: 1
            }],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        })

        return res.status(200).json({ sessionId: (await checkoutSessionStripe).id })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}