import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import config from "../config/config.js";
import userModel from "../models/user.model.js";


passport.use(new Strategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_REDIRECT_URI,
    passReqToCallback: true,
    accessType: "offline",
    prompt: 'consent',

}, async (req, accessToken, refreshToken, profile, done) => {
    const user = await userModel.findOne({ email: profile.emails[0].value });

    if (user) {
        // User already exists, update the refresh token
        user.googleRefreshToken = refreshToken;
        await user.save();
        return done(null, user);
    }

    const newUser = new userModel({
        name: profile.displayName,
        email: profile.emails[ 0 ].value,
        googleRefreshToken: refreshToken
    });
    
    await newUser.save();
    return done(null, profile);
}))

passport.serializeUser((user, done) => {
    done(null, user);
});


passport.deserializeUser((user, done) => {
    done(null, user);
})

export default passport;