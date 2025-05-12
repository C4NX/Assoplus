## [0.2.0] - 2025-05-12

### Chore

- :arrow_up: upgrading deps
- :heavy_plus_sign: added emojione local icons
- :arrow_up: audit fixing
- :mag: added og-image, icon and better description for better seo

### Ci

- :construction_worker: add lint-check in .github
- :construction_worker: add name for job lint

### Docs

- :memo: CHANGELOG
- :memo: added missing env and added warning in description

### Feat

- :recycle: Changed verify jwt to uuid session verify
- :sparkles: added informations update for a user (like email, firstname etc...
- :lipstick: Amélioration du style pour les pages d'articles (CGU, etc..)
- :sparkles: Better footer and landing page
- :speech_balloon: en i18n
- :sparkles: Added tag_select and start of the add association form
- :sparkles: Limitation on update email for oauth2
- :sparkles: Added upload for association logo
- :sparkles: add csv exports and others fixes
- :sparkles: Added order parameter to handle order on name
- :sparkles: now 100 associations on seeding and console log to show what seed is used
- :sparkles: add a slot for terms and services
- :sparkles: rewrite of the associations list page
- :sparkles: add undefined on search field to not passing parameters search when empty
- :lipstick: make card button responsive on small screen
- :sparkles: a lot of changes in prisma schema and logo display
- :sparkles: Added news and association page
- :truck: members --> volunteers
- :sparkles: association edit on dashboard
- Add news management features with CRUD operations
- :sparkles: better modal management for news
- :sparkles: CSV export for news
- :sparkles: Better volunteers table
- :construction: big rework of news edit and added redirect to external link for news
- :sparkles: requireAssociationVolunteer
- :sparkles: Association access for a volunteer
- :sparkles: added a lot of features for volunteers and roles managements, fixed news and a lot more
- :sparkles: tag type support
- :sparkles: added profile store to handle notifications redirect
- :sparkles: added donations table and schema
- :sparkles: Search on news
- :sparkles: header outside of the news listing
- :sparkles: added sort for news public
- :sparkles: added form for donations
- :sparkles: better header better i18n for profile
- :fire: removed test associationId
- :sparkles: better informations dashboard i18n
- :lipstick: removed rounded on delete button
- :dizzy: added missing en i18n
- :sparkles: donations i18n
- :card_file_box: added initial migration

### Fix

- :bug: added prisma update to change user's avatar
- :art: eslint format
- :bug: correct stats on homepage
- :bug: Order of stats in home page
- :art: fixed eslint warnings
- :bug: Lot of small changes and fixes
- :bug: Fixed and made responsive informations tab, news now have text when empty
- :lipstick: padding on dashboard for mobile screen
- :bug: missing NuxtLinkLocale in /associations
- :bug: updatedBy null when created in seed.ts
- :art: fixed eslint errors
- :speech_balloon: fixed version to 0.2.0

### Refactor

- :recycle: added component for articles
- :memo: added a table for env vars
- :truck: AssociationsList --> AssociationList
- :fire: forgot some console.log
- :recycle: renamed components to upper camel case

### Style

- :art: eslint fix
- :art: lint:fix
- :art: eslint fix
- :art: lint:fix the code
- :art: lint:fix

## [0.1.0] - 2025-04-04

### Chore

- Initial commit
- :construction_worker: setup docker
- :heavy_plus_sign: flowbite, tailwindcss and @nuxt/icon
- :heavy_plus_sign: eslint and eslint stylistic
- :sparkles: Added lint script
- *(server)* :sparkles: added nest server with simple swagger and versioning
- :wrench: added scopes for conventional commit
- :wrench: new scopes
- :wrench: added no-extraneous-class for backend classes with only decorators
- *(backend)* :fire: remove nest
- :wrench: add pgsql as default database and add pg in compose.yml
- :construction_worker: add dev and prod compose with prisma

### Ci

- :construction_worker: publish workflow

### Docs

- :memo: add description

### Feat

- :sparkles: exemple header and footer
- *(frontend)* :sparkles: title template
- *(frontend)* :bento: added logo on header and footer
- :alembic: added prisma and some routes with h3
- *(backend)* :sparkles: add jwt auth with refresh token and custom auth guard
- :sparkles: added seeds for prisma
- :sparkles: implement dashboard layout, add i18n support, and enhance user authentication
- :sparkles: A lot of things, updated docker, change front to daisyui, add login page wip
- :sparkles: fixed a lot of things and changed pnpm to npm
- :sparkles: update file permissions and enhance homepage layout with new design elements
- :sparkles: add associations page with search and pagination
- :sparkles: implement front authentication support with ofetch and update refresh token handling
- :sparkles: add associations page, implement logging service, and enhance authentication flow
- :sparkles: rewrite all auth omg
- :sparkles: add privacy policy and terms and conditions pages (WIP)
- :sparkles: refactor authentication flow, remove unused files, and enhance user session management
- :sparkles: implement Discord OAuth authentication, add user roles, and enhance user model
- :sparkles: update authentication flow, implement password reset functionality, and enhance user management
- *(frontend)* :sparkles: remove unused images and robots.txt, update background styles, and enhance profile layout (me)
- :sparkles: add Google OAuth support, enhance user model with googleId, and implement dashboard components (WIP)
- :coffin: removed discord oauth impl
- :sparkles: Amélioration de la gestion d'erreurs pour l'authentification
- :sparkles: added logo for associations and basic creation / delete
- :sparkles: add CHANGELOG.md 0.1.0
- :sparkles: update Docker publish workflow to include semver *.*.* tags and latest instead of main

### Style

- :art: format with eslint

