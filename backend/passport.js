import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error('No email from Google'));
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ 
        name: profile.displayName || 'Google User', 
        email, 
        password: null, 
        role: 'user', 
        isBlocked: false 
      });
    }
    return done(null, user);
  } catch (e) { return done(e); }
}));


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
  scope: ['user:email']
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const emailObj = profile.emails?.find(e => e.primary) || profile.emails?.[0];
    const email = emailObj?.value;
    if (!email) return done(new Error('No email from GitHub'));
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ 
        name: profile.displayName || profile.username || 'GitHub User', 
        email, 
        password: null, 
        role: 'user', 
        isBlocked: false 
      });
    }
    return done(null, user);
  } catch (e) { return done(e); }
}));

export default passport;




