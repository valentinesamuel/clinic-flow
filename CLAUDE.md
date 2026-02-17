# Clinic Flow (React 19 + Vite)

## Project Overview

- **Role**: Patient & Provider Management System (Healthcare context)
- **Stack**: React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui
- **Standards**: HIPAA-ready security, HL7 FHIR data patterns, WCAG 2.1 accessibility

## Universal Rules (MUST FOLLOW)

- **Baby Steps™**: Break tasks into the smallest possible meaningful changes.
- **Architecutre**: Always stick to the atomic design systems that we have.
- **Functionality**: Always make sure that all interactions are functional.
- **Parallel Execution**: "1 MESSAGE = ALL COMPONENT ECOSYSTEM OPERATIONS" (Always create the Component, Hook, Styles, and Test suite simultaneously).
- **Security**: NEVER commit `.env` files. NEVER hardcode PHI or secrets in tests or examples.
- **Types**: Use strict TypeScript interfaces over `type`. No `any`.
- **React**: Functional components only. Use React 19 `use` hook for promise unwrapping.
- **Agent Spawning**: Always make sure that you do not spawn agents unnecessarily unless you have to edit more than 5 files at once.
- **Post session Operation**: At the end of every session, make sure that that there are no build to type errors in the project

## Core Workflow

- **Plan Mode**: Always start complex tasks in Plan Mode (Shift+Tab) to verify architecture.
- **Verification**: Run `npm test` after every meaningful change. Use Playwright for UI validation.
- **Context Hygiene**: Run `/compact` every 5-10 turns or when context exceeds 60%..

## Command Reference

- **Dev**: `npm run dev` (Vite)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Test**: `npm test` (Vitest)
- **A11y**: `/run-audit` (using a11y-audit plugin)
