# Skill Registry

## Project Standards (auto-resolved)

### Next.js 16 + Supabase
- Use Server Actions for all mutations.
- Use `lib/supabase/server.ts` for server-side client.
- Use `lib/supabase/client.ts` for client-side client.
- Protect admin actions by checking the `role` in the `profiles` table.

## User Skills

| Name | Trigger |
|------|---------|
| branch-pr | PR creation, review |
| go-testing | Go tests |
| issue-creation | GitHub issue |
| judgment-day | adversarial review |
| sdd-* | SDD phases |
| skill-creator | creating skills |
