# Admin Portal Codebase Review Checklist

Use this checklist to track your review of the `apps/admin-portal` codebase.

## Root Configuration
- [ ] `eslint.config.mjs`
- [ ] `next.config.ts`
- [ ] `next-env.d.ts`
- [ ] `package.json`
- [ ] `postcss.config.mjs`
- [ ] `tailwind.config.js`
- [ ] `tsconfig.json`
- [ ] `middleware.ts`

## Source Code (`src`)

### Actions (`src/actions`)
- [ ] `src/actions/academics.actions.ts`
- [ ] `src/actions/dashboard.actions.ts`
- [ ] `src/actions/offering.actions.ts`
- [ ] `src/actions/student.actions.ts`

### App Router (`src/app`)

#### API Routes
- [ ] `src/app/api/admin` (Directory)
- [ ] `src/app/api/auth` (Directory)

#### Auth Pages
- [ ] `src/app/auth/error/page.tsx` (If exists)
- [ ] `src/app/auth/logout-callback/page.tsx` (If exists)
- [ ] `src/app/auth/redirect/page.tsx` (If exists)
- [ ] `src/app/login/page.tsx`

#### Dashboard Pages (`src/app/(dashboard)`)
- [ ] `src/app/(dashboard)/layout.tsx`
- [ ] `src/app/(dashboard)/page.tsx` (Main Dashboard)
- [ ] `src/app/(dashboard)/academics/page.tsx` (If exists)
- [ ] `src/app/(dashboard)/grades-offerings/page.tsx` (If exists)
- [ ] `src/app/(dashboard)/identity/page.tsx` (If exists)
- [ ] `src/app/(dashboard)/students/page.tsx` (If exists)

#### Global App Files
- [x] `src/app/favicon.ico`
- [x] `src/app/globals.css`
- [x] `src/app/layout.tsx`
- [x] `src/app/providers.tsx`

### Components (`src/components`)

#### Academics
- [ ] `src/components/academics/FacultyCard.tsx`

#### Courses
- [ ] `src/components/courses/CoursesTable.tsx`

#### Dashboard - Need to add Animation with framer motion
- [x] `src/components/dashboard/AdminStatsGrid.tsx` 
- [x] `src/components/dashboard/DashboardShell.tsx` 
- [ ] `src/components/dashboard/QuickAccessGrid.tsx` - Need to Connect quick linkt o relevent forms and pages

#### Degrees & Departments
- [ ] `src/components/degrees/DegreesTable.tsx`
- [ ] `src/components/departments/DepartmentsTable.tsx`

#### Forms
- [ ] `src/components/forms/CourseForm.tsx`
- [ ] `src/components/forms/DegreeForm.tsx`
- [ ] `src/components/forms/DepartmentForm.tsx`
- [ ] `src/components/forms/FacultyForm.tsx`
- [ ] `src/components/forms/GradeForm.tsx`
- [ ] `src/components/forms/OfferingForm.tsx`
- [ ] `src/components/forms/StudentForm.tsx`
- [ ] `src/components/forms/UserForm.tsx`

#### Identity
- [ ] `src/components/identity/UsersTable.tsx`

#### Offerings & Grades
- [ ] `src/components/offerings/CourseOfferingsTable.tsx`
- [ ] `src/components/offerings/StudentGradesTable.tsx`

#### Students
- [ ] `src/components/students/StudentDetailView.tsx`
- [ ] `src/components/students/StudentFilters.tsx`
- [ ] `src/components/students/StudentListContainer.tsx`
- [ ] `src/components/students/StudentsTable.tsx`

## Public Assets (`public`)
- [ ] `public/file.svg`
- [ ] `public/globe.svg`
- [ ] `public/next.svg`
- [ ] `public/vercel.svg`
- [ ] `public/window.svg`
