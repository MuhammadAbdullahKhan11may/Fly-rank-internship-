# Phase 1 Design

## Problem
Businesses need a small form/CTA they can embed on another website with one script tag. Public submissions must be treated as untrusted internet traffic.

## Actors and request paths
1. Owner: authenticated CRUD for widgets and dashboard data.
2. Customer site: public versioned widget bundle + cached widget configuration.
3. Visitor: public cross-origin submission endpoint.

## Data model
- User owns Widgets and Submissions.
- Widget stores type, display copy and JSON field definitions.
- Submission stores validated payload, widget/tenant ownership and optional geo enrichment.
- Tenant ownership is persisted directly on submissions to make owner-scoped dashboard queries explicit.

## Main flow
Create widget -> receive embed script -> external page loads widget.v1.js -> loader fetches config -> renders form -> visitor submits -> validate -> spam/rate checks -> geo fallback -> persist -> non-critical side effect -> dashboard.

## Non-goal
This is not a drag-and-drop form builder or polished frontend dashboard. The capstone focuses on the backend boundary and resilience.
