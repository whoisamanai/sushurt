# SushrutAI - Hospital Front Desk Automation MVP

Production-ready SaaS MVP boilerplate using **React + Vite + TypeScript + Firebase**.

## Tech Stack
- React (Vite)
- TypeScript (TSX)
- React Router v6
- Firebase Authentication (Email/Password)
- Firebase Firestore

## Core Flow
`Login → Patient Form → Save to Firestore → Preview → Print`

## Folder Structure

```text
src/
  components/
  context/
    AuthContext.tsx
  pages/
    Dashboard.tsx
    Login.tsx
    PatientForm.tsx
    Preview.tsx
    Register.tsx
  routes/
    PrivateRoute.tsx
  services/
    firebase.ts
    patientService.ts
  types/
    patient.ts
  App.tsx
  main.tsx
  styles.css
  vite-env.d.ts
```

## Patient Model

```ts
interface Patient {
  id?: string;
  name: string;
  fatherName: string;
  address: string;
  mobile: string;
  complaint: string;
  createdAt: Timestamp;
}
```

## Firestore Data Structure

```text
patients (collection)
   └── userId (document)
         └── records (subcollection)
               └── patientId (document)
```

## Routes
- `/login`
- `/register`
- `/dashboard`
- `/new-patient`
- `/preview/:id`

## Setup Instructions

### 1) Install dependencies

```bash
npm install
```

### 2) Add environment variables

```bash
cp .env.example .env
```

Populate `.env` from Firebase Console:
- Project settings → General → Your Apps → SDK setup values.

### 3) Firebase configuration steps

1. Create a Firebase project.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create **Firestore Database** (production mode recommended).
4. Update Firestore rules using `firestore.rules` from this project.
5. In Firebase console, add a web app and copy config values into `.env`.

### 4) Run locally

```bash
npm run dev
```

Open the Vite URL shown in terminal (usually `http://localhost:5173`).

## Firebase initialization (already wired)
- `src/services/firebase.ts` initializes `firebaseApp`, `auth`, and `db`.
- `src/context/AuthContext.tsx` manages register/login/logout/session state.
- `src/services/patientService.ts` handles typed CRUD operations for patient records.

## Authentication and Protected Routes
- `AuthProvider` wraps app in `main.tsx`.
- `PrivateRoute` protects dashboard, new patient, and preview routes.

## Print-ready OPD Slip
- `src/pages/Preview.tsx` shows printable slip and calls `window.print()`.
- `src/styles.css` includes `@media print` styles optimized for A4.

## Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login and initialize (if needed):
   ```bash
   firebase login
   firebase use --add
   ```
3. Build app:
   ```bash
   npm run build
   ```
4. Deploy hosting + Firestore rules:
   ```bash
   firebase deploy --only hosting,firestore:rules
   ```

## Security Rules
Rules are in `firestore.rules`, allowing access only to authenticated users reading/writing their own documents.

## Troubleshooting

### Error: `auth/api-key-not-valid. Please pass a valid API key.`

This means your Firebase Web API key is missing or invalid in `.env`:

1. Open **Firebase Console → Project settings → General → Your apps (Web app)**.
2. Copy the exact `apiKey` and all other config values.
3. Update `.env` (not `.env.example`) with `VITE_FIREBASE_*` keys.
4. Restart Vite dev server after changing `.env`:

```bash
npm run dev
```

Also make sure values are not wrapped incorrectly and are not placeholders like `your_api_key`.

### Error: Authentication failed (`auth/invalid-login-credentials`, `auth/user-not-found`, `auth/wrong-password`, or popup/sign-in issues)

Use this Firebase reference checklist:

1. **Enable correct sign-in provider**  
   Firebase Console → **Authentication** → **Sign-in method**  
   - For this project, ensure **Email/Password** is enabled.

2. **Verify user exists in Firebase Auth**  
   Firebase Console → **Authentication** → **Users**  
   - Confirm the email account was actually created.
   - If not, register from `/register` or create the user in Console.

3. **Check authorized domain** (important for local + deployed app)  
   Firebase Console → **Authentication** → **Settings** → **Authorized domains**  
   - Add your local domain (for Vite: `localhost`) and deployment domain.

4. **Check Web App config is from same Firebase project**  
   Firebase Console → **Project settings** → **General** → **Your apps (Web)**  
   - Ensure `.env` values (`VITE_FIREBASE_*`) belong to the same project where Auth is configured.

5. **Confirm Authentication API is enabled in Google Cloud**  
   Google Cloud Console (same Firebase project) → **APIs & Services** → **Enabled APIs & services**  
   - Verify **Identity Toolkit API** is enabled.

6. **Reset test account password if needed**  
   Firebase Console → **Authentication** → **Users** → select user → reset password.

7. **Restart app after config changes**

```bash
npm run dev
```

If login still fails, inspect browser console/network response for the exact Firebase error code and map it to Firebase Auth docs:  
https://firebase.google.com/docs/auth

