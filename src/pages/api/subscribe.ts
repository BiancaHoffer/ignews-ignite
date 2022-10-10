import { NextApiRequest, NextApiResponse } from 'next'

import stripe from '../../services/stripe'

import { getSession } from "next-auth/react";

import { fauna } from '../../services/fauna';
import { query as q } from 'faunadb'

interface User {
    ref: {
        id: string;
    };
    data: {
        stripe_customer_id: string;
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        // método para acessar dados do usuário logado nextauth por rota beck-end
        const session = await getSession({ req });

        // pegando e-mail do usuário logado pelo getSession do NextAuth
        // <User> é o retorno desse fauna.query
        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id;

        if (!customerId) {
            try {
                // Criar um customer(credenciais do usuário) lá no dashboard do stripe
                const createStripeCustomer = await stripe.customers.create({
                    email: session.user.email,
                })

                // adicionar ID Customer Stripe no FaunaDB
                await fauna.query(
                    q.Update(
                        q.Ref(q.Collection('users'), user.ref.id),
                        {
                            data: {
                                stripe_customer_id: createStripeCustomer.id,
                            }
                        }
                    )
                )

                customerId = createStripeCustomer.id;

            } catch (error) {
                console.log('erro no else na condição customerId:', error)
            }
        }
        
        const checkoutSessionStripe = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [{
                 price: 'price_1LpKkyBMpmIkB5igObRkF2lJ', 
                 quantity: 1,
            }],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        })

        return res.status(200).json({ sessionId: checkoutSessionStripe.id })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}