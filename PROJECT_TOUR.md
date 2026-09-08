# A Quick Tour of What I've Been Building

I wanted to give you a look at what I've been teaching myself and building over the last stretch of time.

I don't come from a formal software/computer-science background. Most of this started with me having a problem or an idea, then figuring out whatever I needed to make it work: frontend, backend, databases, APIs, deployment, mobile, automation, AI integrations, Docker, FFmpeg, OAuth, webhooks, testing, and a lot of debugging.

I'm not trying to present every repo as polished production software. Some are working applications, some are active builds, and some are earlier experiments I kept because they show how the projects evolved.

GitHub profile:

https://github.com/Leeak82

## Good places to start

### REIGN-AI
AI-assisted customer-service and scheduling system.

This is one of the larger systems I've built. It includes conversation state and memory, appointment scheduling, SMS-provider abstractions, calendar integration, a Blazor dashboard, EF Core persistence, Docker deployment, health checks, webhooks, and external-provider configuration.

Repo: https://github.com/Leeak82/REIGN-AI

### OEM Gasket Cutfile Maker
A tool for mechanics/fabricators that can look up gasket information, work from a camera or uploaded image, detect geometry, preview the result, and generate SVG cut files.

It grew out of wanting to connect automotive work with something actually useful for fabrication instead of building another tutorial app.

Repo: https://github.com/Leeak82/OEM-GASKET-CUTFILE-MAKER-

### Scrap Profit App
A mobile-first resale/storage-unit utility that helps identify items, research comps, estimate realistic resale prices, save inventory, and generate listings.

Repo: https://github.com/Leeak82/Scrap-profit-app

### HaulNOW
A truck/driver marketplace experiment for local hauling and dump runs. It includes listing and booking flows plus backend work around Supabase and Stripe.

Repo: https://github.com/Leeak82/HaulNOW

### CardHarbor
A larger mobile/API project where I started learning more about monorepo structure, Expo/React Native, backend services, admin UI, state/workflow design, and the security/compliance boundaries around financial-style applications.

Repo: https://github.com/Leeak82/cardharbor

## Larger projects that may be private

### ViralForge
An autonomous faceless-content production system built around:

trend discovery -> scoring -> strategy -> script -> scenes -> media -> voice -> captions -> FFmpeg render -> quality gate -> publishing workflow -> analytics -> learning

This one pushed me into workers, provider abstractions, retries/recovery, media pipelines, cost/rights tracking, and separating simulated/unconfigured providers from real integrations.

### FreeMoney-AI
A source-backed assistance/opportunity discovery system that works from official/public data sources rather than inventing opportunities.

## Things I've ended up learning along the way

- C# / .NET / ASP.NET Core / Blazor
- JavaScript / TypeScript / React / Next.js
- Node.js / Express
- React Native / Expo / Capacitor
- PostgreSQL / SQLite / EF Core
- REST APIs
- OAuth and webhooks
- SMS and calendar integrations
- Docker and deployment
- Git / GitHub / branching / pull requests
- Android + Termux workflows
- FFmpeg and automated media generation
- AI-provider integrations and fallback design
- background workers and autonomous workflows
- state machines / workflow state
- basic testing, failure handling, retries, and health checks

## What I'm actually interested in hearing from you

Since you know this stuff professionally, I'd rather hear what you genuinely think than get a polite "looks cool."

I'm especially curious about:

- what architecture choices I accidentally got right
- what I clearly taught myself backwards
- folder/project structure that should be cleaned up
- security mistakes or bad habits you notice
- places where I'm overengineering something
- places where I should have used a standard pattern instead
- which project looks strongest technically
- what you'd focus on next if you were me

A lot of this was built by learning the next thing only when the project forced me to learn it, so the repos are basically a record of that progression.

Feel free to tear it apart. That's more useful to me than being nice about it.
