# Connect Laravel Backend with Frontend Dashboard and Users

## Goal Description
We will expose Laravel API endpoints for the dashboard statistics and user management, then consume these endpoints from the React frontend. This will replace the current mock data in `Dashboard.jsx` and add a new Users page.

## Proposed Changes
---
### Backend (Laravel)
#### [MODIFY] routes/api.php
- Add routes for dashboard stats and user CRUD.

#### [NEW] app/Http/Controllers/Api/DashboardController.php
- `index` method returns JSON with counts for users, categories, products, sales.

#### [NEW] app/Http/Controllers/Api/UserController.php
- Standard REST actions: `index`, `store`, `show`, `update`, `destroy`.
- Use Laravel Sanctum for token authentication (optional, can be enabled later).

#### [MODIFY] app/Models/User.php (if needed)
- Ensure fillable fields and hidden password.

---
### Frontend (React)
#### [MODIFY] resources/js/pages/Dashboard.jsx
- Replace mock data with API calls using `axios`.
- Show loading state while fetching.

#### [NEW] resources/js/pages/Users.jsx
- Table component displaying users fetched from `/api/users`.
- Buttons for create, edit, delete (call respective API endpoints).

#### [MODIFY] resources/js/app.jsx (or router)
- Add route for `/users` pointing to the new Users component.

#### [NEW] resources/js/services/api.js
- Centralized axios instance with base URL.
- Export functions: `fetchDashboardStats`, `fetchUsers`, `createUser`, `updateUser`, `deleteUser`.

---
## Verification Plan
### Automated Tests
- No existing tests for these endpoints. We will add basic feature tests.
- Create `tests/Feature/Api/DashboardTest.php` asserting JSON structure and status 200.
- Create `tests/Feature/Api/UserTest.php` covering index, store, show, update, delete.

### Manual Verification
1. Run `php artisan serve` and `npm run dev`.
2. Open the app in a browser.
3. Verify the Dashboard displays real counts (matches database).
4. Navigate to `/users` and ensure the user list loads, and CRUD operations work (use the UI).
5. Use a tool like Postman to directly hit the API endpoints and confirm JSON responses.

## User Review Required
- Confirm whether to protect the API routes with Sanctum authentication now or later.
- Approve the addition of a new Users page in the frontend.
- Approve the creation of automated feature tests.
