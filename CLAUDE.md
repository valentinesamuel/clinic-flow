# CLAUDE.md — Clinic Flow (React Vite)

## Tech Stack

* Frontend: React 19, Vite, Tailwind CSS, shadcn/ui
* Backend:
* State Management:

## Standards

* Use functional components and TypeScript interfaces.
* Favor `npm run dev` for local development.
* Component structure: `src/components/ui` for primitives, `src/features` for logic.

## Parallel Execution Golden Rule

* 1 MESSAGE = ALL COMPONENT ECOSYSTEM OPERATIONS (Component + Hook + Test + Styles).

### 2. Surgical Agent Selection (Personas)

Instead of 135 agents, create or keep only these four files in your `.claude/agents/` directory. These cover your full-stack needs:

* **`frontend-architect.md`**: For React 19 component logic and state management.
* **`api-designer.md`**: For your backend/API work.
* **`devops-engineer.md`**: For infrastructure and Docker work.
* **`security-auditor.md`**: Critical for clinic-flow to ensure HIPAA-ready patterns.

**Token Tip:** If you want to keep an agent from loading its description into every prompt, add `disable-model-invocation: true` to its YAML frontmatter. You can still call it manually with `@agent-name`.

### 3. High-Value "Skills" (Automated Logic)

Skills are more token-efficient than agents because Claude only loads the full instructions when it determines they are relevant to your task.

* **Vercel React Best Practices:** Don't let the name fool you; these 45 rules are essential for React performance (fixing waterfalls and bundle size) regardless of whether you use Next.js or Vite.
```bash
npx add-skill vercel-labs/agent-skills

```


* **a11y-audit:** Automatically ensures your healthcare dashboard meets WCAG accessibility standards.
```bash
/plugin install a11y-audit

```



### 4. "Power Plugins" (MCP Servers)

To give your agent "eyes" and live knowledge of your Vite project, install these two Model Context Protocol servers:

* **Context7 (The Documentation Plugin):** This is considered the "best MCP for coding" because it fetches live, up-to-date documentation for your specific stack (e.g., Vite, Tailwind v4) into the context, preventing hallucinations.


* **Playwright DevTools:** Essential for debugging "Vite HMR" issues or broken UI redirects in your clinic dashboard. It allows Claude to launch a real browser and see what’s failing.



**Installation:**

```bash
claude mcp add context7
claude mcp add playwright-devtools --scope user npx playwright-devtools-mcp@latest

```

### 5. Advanced Token Management for Full-Stack

To prevent your backend rules from eating tokens while you work on CSS, use **Path-Scoping** in your `.claude/rules/` directory.

Create a file at `.claude/rules/frontend.md` and add this frontmatter:

```yaml
---
paths:
  - "src/components/**/*"
  - "src/hooks/**/*"
---
# React UI Rules
- Use Tailwind spacing scales exclusively.
- Ensure all forms have ARIA labels.

