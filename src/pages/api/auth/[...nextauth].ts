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
    callbacks: {
        async signIn({user}) {
            const { email } = user    
    
            try {
                await fauna.query(
                    query.Create(
                        query.Collection('users'),
                        { data: { email } }
                    )
            )
            } catch (error) {
                console.error(error);
                return false;
            }

            return true;
        }
    }
})

