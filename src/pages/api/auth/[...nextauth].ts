import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { fauna } from '../../../services/fauna';
import { query } from 'faunadb'

export default NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    scope: 'read:user',
                }
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    //debug: true,
    callbacks: {
        async signIn({user}) {
            const { email } = user
            console.log(email)
            
             await fauna.query(
                query.Create(
                    query.Collection('users'),
                    { data: email}
                )
            )
            
            return true;
        }
    }
})

