import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { authService } from "../../modules/auth/auth.service";
import { env } from "../../shared/config/env";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const result = await authService.handleOAuthCallback({
          provider: "GOOGLE",
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
