# ADR-001: Why Zustand for State Management

## Context

We need a centralized state management solution for our React application to avoid prop drilling and redundant API calls.

## Decision

We have decided to use **Zustand** for state management.

## Rationale

* **Simplicity:** Zustand has a very simple and minimal API.
* **Performance:** It is highly performant and does not cause unnecessary re-renders.
* **Small Bundle Size:** It has a very small bundle size, which is important for frontend performance.
* **No Boilerplate:** It does not require a lot of boilerplate code like other state management libraries.
* **Hooks-based:** It is based on React hooks, which makes it easy to integrate with our existing codebase.
