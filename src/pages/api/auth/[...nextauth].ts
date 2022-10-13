import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb'

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
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
              q.Intersection([
                q.Match(
                  q.Index('subscription_by_user_ref'), 
                  q.Select(
                    "ref",
                      q.Get(
                        q.Match(
                          q.Index('user_by_email'),
                          q.Casefold(session.user.email)
                        )
                      )
                    )
                  ),
                 q.Match(
                  q.Index('subscription_by_status'),
                  "active"
                 ) 
              ])
            )
          )
  
          return {
            ...session,
            activeSubscription: userActiveSubscription
          }
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn({ user }) {
      const { email } = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
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

