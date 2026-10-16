# Team Up Spark

Build VELUNE — A Space for Ambitious Minds

Create a polished, responsive web application called VELUNE.

Tagline: Find your people. Build your thing.

1. THE VISION

VELUNE is a peer-collaboration platform for ambitious high-school students who want to build meaningful projects but struggle to find equally motivated teammates, figure out where to start, or stay consistent.

Students can discover like-minded collaborators, explore shared interests, create projects, set milestones, divide tasks, and track their progress together.

VELUNE should feel like discovering a corner of the internet where people finally understand your ambition.

The brand is gender-neutral, youthful, thoughtful, intelligent, creative, and quietly aspirational. It should feel like a beautiful productivity app mixed with a creative community — not a school portal, corporate dashboard, or generic social network.

2. VISUAL IDENTITY

Create a premium dark-mode interface with a dreamy, minimal aesthetic.

Color palette

Background: deep midnight navy, approximately #10101A

Main surfaces: #191925

Elevated cards: #222233

Primary accent: muted lavender, #B9A4FF

Secondary accent: pale lilac, #DCD1FF

Main text: soft white, #F5F3FA

Secondary text: muted gray-lavender, #A4A0B7

Success: soft sage green, used sparingly

Design direction

Elegant, readable typography. Use a modern font such as Inter or Manrope.

Generous spacing and clean visual hierarchy.

Rounded cards, approximately 14–20px radius.

Fine borders with subtle contrast.

Soft lavender glows only for selected elements.

Small celestial-inspired details, such as subtle stars, orbital curves, or constellation dots. Keep these restrained.

Beautiful empty states and subtle hover transitions.

Simple, consistent line icons.

Use gradients sparingly. Avoid excessive glassmorphism, neon colors, cartoon illustrations, and visual clutter.

The interface should look carefully art-directed and launch-ready, even with demo data.

3. APP STRUCTURE

Create these primary navigation destinations:

Home

Discover

Projects

My Profile

On desktop, use a slim left sidebar with the VELUNE wordmark at the top and navigation beneath it. Add a compact profile section at the bottom.

On mobile, use a responsive layout with a compact header and bottom navigation.

Include a clear primary action to create a project.

4. HOME DASHBOARD

Make the dashboard the first screen users see.

Include:

Welcome section

Greeting: “Welcome to your orbit.”

Supporting text: “Big ideas feel different when you build them together.”

Primary button: “Find my people”

Secondary button: “Start a project”

Progress overview
Show three compact cards:

Active projects

Tasks completed

Current consistency streak

Use realistic demo numbers and make the data internally consistent.

Your current projects
Display project cards containing:

Project title

Short description

Category

Collaborator avatars or initials

Progress bar

Next milestone

Task completion count

Example projects:

AI for Everyday Learning

Youth Climate Action Lab

The Student Research Collective

These are illustrative demo projects, not claims about real users.

Upcoming milestones
Show upcoming project deadlines with clear dates and status indicators.

Momentum section
Display a small, tasteful weekly activity visualization or streak tracker. Keep it encouraging rather than competitive.

Include useful empty states if the user has not joined any projects.

5. DISCOVER — FIND YOUR PEOPLE

This is a core feature and should feel especially thoughtful.

Create a Discover page where users can browse potential collaborators.

Each student card should show:

Name

Short bio

Areas of interest

Skills they can contribute

What they want to learn

Types of projects they want to build

Availability or preferred commitment level

A short collaboration compatibility explanation

Use fictional demo profiles such as:

Aarav — AI, Python, research

Mira — sustainability, writing, community impact

Zoya — design, psychology, storytelling

Rohan — robotics, hardware, product building

Sam — science communication, data, social impact

Anaya — machine learning, mathematics, research

Give each profile its own interests, skills, goals, and preferred working style.

Add functional filters for:

Interests

Skills

Project category

Commitment level

Preferred collaboration style

Include a search field and sorting options.

Show compatibility as a descriptive match indicator based on overlapping interests, skills, goals, and working preferences. Use sample data and explain that it is an illustrative match, not a scientifically validated score.

Add working buttons:

View profile

Invite to collaborate

Save profile

These actions must respond visibly. Inviting someone can create a local demo invitation and show a confirmation toast. Saving should update a saved state.

Do not implement real messaging or external social integrations.

6. PROJECT CREATION FLOW

The “Start a project” button should open a clean, multi-step modal or dedicated page.

Collect:

Project name

Short description

Category: Research, AI & Technology, Social Impact, Creative, Business, or Other

What the team wants to accomplish

Skills needed

Target completion date

Collaboration commitment

Allow the user to create the project with the information provided.

After creation:

Show a success confirmation.

Add the project to the Projects page and dashboard.

Display its initial progress as 0%.

Offer the option to create the first milestone.

Use client-side state so new projects appear immediately during the demo session.

7. PROJECTS AND ACCOUNTABILITY

Create a Projects page with tabs or filters for:

All projects

In progress

Completed

Each project should have a detailed view with:

Project overview

Title and description

Category

Team members

Overall progress

Target date

Milestones
Allow users to add, edit, complete, and delete milestones.

Tasks
Allow users to:

Add a task

Edit task details

Assign a task to a demo team member

Set a due date

Mark a task complete

Reopen a completed task

Automatically calculate project progress from completed tasks, using a sensible empty-state rule when there are no tasks.

Team accountability
Include a simple weekly check-in section where the user can record:

What I completed

What I will work on next

Where I need help

Save check-ins in local application state.

All main interactions should work without a backend.

8. PROFILE

Create an editable student profile containing:

Display name

Short introduction

Interests

Skills

Skills they want to learn

Project interests

Preferred commitment level

Preferred collaboration style

Allow changes to be saved in local application state.

Use a fictional demo user by default, and make it easy to edit the profile. Do not assume a real user's personal information.

9. INTERACTION REQUIREMENTS

This must be a functional MVP, not just a static mockup.

Implement:

Working navigation

Functional search and filters

Save profile and invite actions

Project creation

Task and milestone management

Editable profile

Check-ins

Progress calculations

Responsive mobile navigation

Useful success, error, and empty states

Use React, TypeScript, Tailwind CSS, and the existing component system supported by the project.

Use local state and local demo data. If appropriate, persist the demo session using browser local storage so refreshing the page does not immediately erase the user's work.

Do not spend time building a real authentication system, backend, database, AI matching service, real-time chat, video calls, or external calendar integrations. These are future possibilities, not MVP requirements.

Avoid dead buttons, fake loading screens, and controls that look interactive but do nothing.

10. USER EXPERIENCE AND ACCESSIBILITY

Use clear labels and readable text.

Provide visible keyboard focus states.

Ensure buttons and form controls are accessible.

Use sufficient contrast.

Keep the interface usable on laptop and mobile screens.

Make forms validate required fields.

Use helpful messages rather than browser alerts where practical.

Respect reduced-motion preferences.

Keep the main user journey obvious.

11. THE CORE USER JOURNEY

The MVP should make this journey effortless:

A student lands on the VELUNE dashboard.

They explore compatible peers and shared interests.

They find someone they would like to collaborate with.

They create a project and define a goal.

They add milestones and tasks.

They return to track progress and stay accountable.

Prioritize this journey above secondary features.

12. FINAL QUALITY BAR

The finished app should feel like a real early-stage startup product, not a generic AI-generated template.

Use polished layouts, realistic demo content, consistent components, subtle interactions, and a distinctive visual identity.

The brand name must always be spelled VELUNE.

Display the tagline: Find your people. Build your thing.

Build the complete functional MVP now. Prioritize working features, cohesive design, and a polished end-to-end experience over adding more features.

Do not stop after creating a landing page or dashboard mockup. Implement all primary pages and the core user journey.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7a6a8e1c-1981-54b1-aca4-b3aee80e3ed5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
