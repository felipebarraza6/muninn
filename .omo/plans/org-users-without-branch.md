# org-users-without-branch - Work Plan

## TL;DR (For humans)

**What you'll get:**
Superadmin puede crear usuarios sin sucursal en `/admin/usuarios` (para luego asignarlos como organizadores en `/admin/organizaciones`), y el Select de Propietario en `/admin/organizaciones` solo muestra usuarios que no tienen sucursal asignada.

**Why this approach:**
Dos cambios frontend exclusivamente. El backend ya acepta crear usuarios sin `branch_assignment` (`POST /accounts/users/create_and_assign/`). Solo relajamos la validación que obligaba a tener sucursal y filtramos la lista de usuarios en el Select de Propietario usando `useBranchUsers`.

**What it will NOT do:**

- No cambia el backend (Yggdra)
- No cambia la creación de usuarios para roles no-superadmin (siguen requiriendo sucursal)
- No toca otras listas/selects de usuarios en la app

**Effort:** Quick
**Risk:** Low — cambios acotados, frontend-only, sin cambios de esquema ni API
**Decisions to sanity-check:** (1) Branch/rol opcionales para superadmin, (2) Filtro estricto en Select de propietario (solo usuarios sin sucursal)

Your next move: `$start-work org-users-without-branch`

---

> TL;DR (machine): Quick | Low | 2 frontend-only changes: relax create-user validation for superadmin + filter org owner Select by unassigned users

## Scope

### Must have

1. Superadmin puede crear usuario en `/admin/usuarios` sin seleccionar sucursal ni rol
2. Select de Propietario en `/admin/organizaciones` solo muestra usuarios SIN branch assignments

### Must NOT have (guardrails, anti-slop, scope boundaries)

- No se toca backend (Yggdra)
- No se modifican hooks de API ni tipos compartidos
- No se agregan nuevos componentes UI (solo cambios inline en formularios existentes)
- No se cambia la validación para usuarios no-superadmin
- No se filtran otros selects ni tablas de usuarios

## Verification strategy

> Zero human intervention - all verification is agent-executed.

- **Test decision:** tests-after (manual verification via build + lint)
- **Evidence:** `.omo/evidence/org-users-without-branch/task-{N}.evidence`

## Execution strategy

### Parallel execution waves

Single wave — 2 todos, sin dependencias entre sí.

### Dependency matrix

| Todo | Depends on | Blocks | Can parallelize with |
| ---- | ---------- | ------ | -------------------- |
| 1    | —          | —      | 2                    |
| 2    | —          | —      | 1                    |

## Todos

> Implementation + Test = ONE todo. Never separate.

<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

- [x] 1. admin.usuarios.tsx — Permitir crear usuario sin sucursal para superadmin
     What to do / Must NOT do:
  - En `saveCreate()` (línea ~720):
    - Cambiar la validación de línea 733: `if (!isGlobalAdmin && (!primary?.branchId || !primary?.roleCode))` para que superadmin pueda saltarla
    - Cambiar línea 737: `if (primary.branchId && !canManageBranchUsers(primary.branchId))` — solo validar si hay branchId
    - En el payload de `createUser.mutate()` (líneas 742-756): condicionar `branch_assignment` con spread: `...(hasBranch ? { branch_assignment: {...} } : {})`
  - En el form (sección de asignación, ~línea 1465): agregar texto aclaratorio arriba del grid de sucursal/rol:
    `<p className="text-[11px] text-muted-foreground mb-2">Opcional para superadmin — dejar vacío crea un usuario organizador sin sucursal.</p>`
  - Must NOT do: No cambiar el texto para no-superadmin. No modificar el `onSuccess` callback (ya maneja correctamente el caso sin branchId).
    Parallelization: Wave 1 | Blocked by: — | Blocks: —
    References:
  - `src/routes/admin.usuarios.tsx:720-808` (saveCreate)
  - `src/routes/admin.usuarios.tsx:1465-1495` (form UI section for branch assignment)
  - `src/api/hooks/useUsers.ts:24-43` (CreateAndAssignPayload type)
    Acceptance criteria (agent-executable):
  - `bun x tsc --noEmit` passes with zero errors
  - `bun run lint` on `src/routes/admin.usuarios.tsx` passes
  - Validation logic: superadmin can call `saveCreate()` with empty branchId/roleCode without error toast
    QA scenarios:
  - Happy: Superadmin creates user with email+password only → payload sent without `branch_assignment` → success toast + user appears in list
  - Failure: Superadmin creates user WITH branch+role selected → payload includes `branch_assignment` same as before
  - Regression: Non-superadmin (org owner) tries to create user without branch → error toast "Elige sucursal y rol"
  - Evidence: `.omo/evidence/org-users-without-branch/task-1.evidence`
    Commit: Y | `feat(admin): allow superadmin to create users without branch`

- [x] 2. admin.organizaciones.tsx — Filtrar Select de Propietario a usuarios sin sucursal
     What to do / Must NOT do:
  - Agregar `useBranchUsers` a los imports desde `@/api/hooks/useBranches` (junto a los exists)
  - Agregar `const { data: allAssignments = [] } = useBranchUsers({ allBranches: true });` después de `useAdminUsers()` (~ línea 241)
  - Crear un Set memoizado de user IDs con branch assignments:
    ```tsx
    const assignedUserIds = useMemo(() => {
      const set = new Set<string>();
      for (const a of allAssignments) {
        if (a.is_active !== false) set.add(String(a.user));
      }
      return set;
    }, [allAssignments]);
    ```
  - Filtrar `users` en el render del Select de Propietario (línea 1383):
    Cambiar `{users.map((u) => (` por `{users.filter((u) => !assignedUserIds.has(String(u.id))).map((u) => (`
  - Must NOT do: No modificar el hook `useAdminUsers` ni su queryKey. No filtrar en otros lugares del archivo.
    Parallelization: Wave 1 | Blocked by: — | Blocks: —
    References:
  - `src/routes/admin.organizaciones.tsx:241` (users fetch)
  - `src/routes/admin.organizaciones.tsx:59-82` (imports from useBranches)
  - `src/routes/admin.organizaciones.tsx:1374-1389` (owner Select JSX)
  - `src/api/hooks/useBranches.ts:762-773` (useBranchUsers hook)
    Acceptance criteria (agent-executable):
  - `bun x tsc --noEmit` passes with zero errors
  - `bun run lint` on `src/routes/admin.organizaciones.tsx` passes
  - Owner Select renders only users WITHOUT any entry in `useBranchUsers` result
  - A user with active branch assignments does NOT appear in the dropdown
    QA scenarios:
  - Happy: Org owner opens edit panel → Select de Propietario shows only users without branch → selects one → saves → owner assigned correctly
  - Failure: User with branch assignment is NOT visible in the Select
  - Regression: User list still renders correctly for other uses (not affected)
  - Evidence: `.omo/evidence/org-users-without-branch/task-2.evidence`
    Commit: Y | `feat(admin): filter org owner select to unassigned users only`

## Final verification wave

> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.

- [ ] F1. Plan compliance audit — Verify both todos were implemented exactly per spec: validation relaxed only for superadmin, branch_assignment conditional, owner select filters by `useBranchUsers`
- [ ] F2. Code quality review — `bun run lint` passes, no unused imports/vars, TypeScript compiles clean
- [ ] F3. Real manual QA — Confirm via dev server at `localhost:3001/app/admin/usuarios` and `/app/admin/organizaciones`:
  - Create user as superadmin without branch → no error, user created
  - Go to organizaciones → owner select shows only unassigned users
  - Create user as superadmin WITH branch → works as before
- [ ] F4. Scope fidelity — No backend changes, no changes to non-superadmin flow, no filtering of other user selects

## Commit strategy

Two commits (one per file), no squash — changes are independent.

1. `feat(admin): allow superadmin to create users without branch`
2. `feat(admin): filter org owner select to unassigned users only`

## Success criteria

- [ ] Superadmin puede crear usuario sin sucursal en `/admin/usuarios`
- [ ] Select de Propietario en `/admin/organizaciones` solo muestra usuarios sin branch assignments
- [ ] Cero errores de compilación y lint
- [ ] Funcionalidad existente no regresiona (no-superadmin sigue requiriendo branch, selects de sucursal siguen igual)
