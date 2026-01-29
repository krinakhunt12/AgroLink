/**
 * User Preference Middleware
 * Manages cookie-based preferences like language and content category.
 */

export const preferenceMiddleware = (req, res, next) => {
    // 1. Extract preferences from cookies or set defaults
    const preferences = {
        language: req.cookies?.pref_lang || 'en',
        category: req.cookies?.pref_cat || 'all',
        lastVisited: req.cookies?.pref_last_section || 'home'
    };

    // 2. Attach to request object for use in controllers
    req.userPreferences = preferences;

    // 3. Helper to update preferences (setting cookies)
    res.setPreference = (key, value) => {
        const cookieOptions = {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: false, // Allow client-side JS to read for UI if needed
            path: '/'
        };

        if (key === 'language') res.cookie('pref_lang', value, cookieOptions);
        if (key === 'category') res.cookie('pref_cat', value, cookieOptions);
        if (key === 'section') res.cookie('pref_last_section', value, cookieOptions);
    };

    next();
};
