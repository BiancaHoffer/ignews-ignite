import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

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
    secret: "bhbNdRNdWjvshVKrLa23qH3FNTCRQbgr",
    jwt: { 
        secret: process.env.NEXTAUTH_JWT_KEY,
    }
})

