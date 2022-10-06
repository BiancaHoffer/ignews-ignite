import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'read:user',
                }
            }
        }),
    ],
    jwt: {
        secret: process.env.NEXTAUTH_JWT_KEY
    }
})