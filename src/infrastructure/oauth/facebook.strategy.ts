import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { env } from "../../shared/config/env";
import { authService } from "../../modules/auth/auth.service";

passport.use(
  new FacebookStrategy(
    {
      clientID: env.facebookAppId,
      clientSecret: env.facebookAppSecret,
      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/facebook/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const result = await authService.handleOAuthCallback({
          provider: "FACEBOOK",
          providerId: profile.id,
          email: profile.emails?.[0]?.value!,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        });
        done(null, result as any);
      } catch (error) {
        done(error as Error);
      }
    },
  ),
);

export default passport;
