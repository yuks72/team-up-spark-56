# VELUNE feature priorities

- [x] Inspect existing features, persistence, and runtime errors: projects/profile/discovery use browser demo storage; no previous app auth/database or observed error logs.
- [x] Implement Meet Calendar: month/week views, private Cloud meeting CRUD, project association, upcoming list, validation.
- [x] Verify desktop/mobile Calendar navigation, existing pages, seven Calendar rule tests, existing five tests, and clean build/security linter.
- [ ] Verify authenticated create/edit/delete, project association, and refresh persistence through UI — blocked until the user signs in; session minting reports no auth users.
- [x] Summarize Calendar completion and remaining setup before starting Chat and Huddles.
- [ ] Project Chat — waits for the requested verified Calendar checkpoint and first sign-in.
- [ ] Huddles — waits for the requested verified Calendar checkpoint; live calling infrastructure is not configured.