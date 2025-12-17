# Implementation Plan: Appointment Module & Workflow Updates

# Goal Description
Implement a multi-stage postulation workflow:
1. **Document Review**: Admins review FUT/Docs. Outcome: `rechazado` (can retry) or `apto_entrevista`.
2. **Appointments (Citas)**: Students explicitly approved (`apto_entrevista`) can book an appointment with a psychologist.
3. **Final Decision**: After the interview, status becomes `becario` (accepted) or `rechazado`.

## User Review Required
- **Database Change**: Modifying `postulaciones` enum column might require raw SQL statement or `DB::statement` depending on DB driver (MySQL supports it, SQLite doesn't easily).
- **Retry Logic**: Confirming that "retry" means creating a *new* row or updating the existing one? *Assumption*: Create a new row (history is preserved), but checks preventing duplicates must allow it if previous is `rechazado`.

## Proposed Changes

### Database
- **Create** `entrevistas` table:
    - `id`, `postulacion_id`, `fecha_hora`, `lugar` (optional), `psicologo_id` (User FK), `estado` (pendiente, completada, no_asistio), `resultado` (apto, no_apto), `observaciones`.
- **Update** `postulaciones` table:
    - Modify `estado` enum to include: `['pendiente', 'apto_entrevista', 'entrevista_programada', 'becario', 'rechazado']`.

### Backend (Laravel)
#### [MODIFY] [PostulacionController](file:///e:/ADS%2022%20TRABAJO/spgcu_system/app/Http/Controllers/PostulacionController.php)
- Update `store` method to allow creating a new postulation if the previous one for the same convocatoria is `rechazado`.
- Update `update` method to handle transitions to `apto_entrevista`.

#### [NEW] [EntrevistaController](file:///e:/ADS%2022%20TRABAJO/spgcu_system/app/Http/Controllers/EntrevistaController.php)
- `index`: List available slots (for student) or upcoming interviews (for admin).
- `store`: Book a slot.
- `update`: Record result (Admin/Psicologo).

### Frontend (React)
#### [NEW] [Citas/Index.jsx](file:///e:/ADS%2022%20TRABAJO/spgcu_system/resources/js/Pages/Citas/Index.jsx)
- Student view: Calendar/List to pick a slot.
- Admin view: Manage slots.

## Verification Plan
### Automated Tests
- Test re-postulation logic: Create -> Reject -> Create again (should succeed).
- Test duplicate block: Create -> Pending -> Create again (should fail).
- Test booking: User with `apto_entrevista` can book. User with `pendiente` cannot.

### Manual Verification
1. Log in as Student -> Postulate.
2. Log in as Admin -> Reject.
3. Log in as Student -> Postulate again -> Success.
4. Log in as Admin -> Approve (Apto Entrevista).
5. Log in as Student -> Go to "Citas" -> Book slot.
6. Log in as Admin -> Mark interview as passed -> Status becomes `becario`.
