import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-google-oauth20";
import { env } from "../../shared/config/env";
import { authService } from "../../modules/auth/auth.service";

passport.use(
  new FacebookStrategy(
    {
      clientID: env.facebookAppId,
      clientSecret: env.facebookAppSecret,
      callbackURL: "/auth/facebook/callback",
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
        done(null, result);
      } catch (error) {
        done(error as Error);
      }
    },
  ),
);

export default passport;
