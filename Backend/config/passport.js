import dotenv from 'dotenv'
dotenv.config()
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          console.log('Existing user:', existingUser);
          return done(null, existingUser);
        }

        const newUser = await User.create({
          name: profile.displayName,
          googleId: profile.id,
        });

        console.log('New user created:', newUser);
        return done(null, newUser);
      } catch (error) {
        console.error('Error in strategy:', error);
        return done(error, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  if (!user || !user.id) {
    console.error('serializeUser failed - invalid user:', user);
    return done(new Error('User ID missing during serialization'), null);
  }
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

