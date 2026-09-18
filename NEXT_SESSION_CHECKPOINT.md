# Aarambh Resume Checkpoint

Date: 2026-09-07

## Current State

- Frontend: `Arambh/` React + Vite is running on `http://localhost:5173`.
- Backend: `backend/` Express API is running on `http://localhost:5000`.
- MongoDB: local service is connected and the seeded demo users exist.
- CV service: `cv_module/server.py` is responding on `http://localhost:5001`.
- Verified service health: `GET /api/health` returned HTTP `200 OK`.
- Verified default auth users: `admin@example.com / admin123`, `john@example.com / password123`, `jane@example.com / password123`.

## What Was Fixed

- CV service moved to port `5001` so it does not conflict with the backend.
- MediaPipe model path configured in `cv_module/config.py` and `cv_module/models/face_landmarker.task` added.
- CV JSON output converted to normal Python types.
- Eye-contact scoring fixed to use degree-based thresholds; it was previously forced to `0%` by dividing degrees by `0.75`.
- Browser is now the only physical webcam owner. `WebcamPanel.jsx` captures browser video frames and sends JPEG frames to `POST /api/metrics/frame`.
- CV server uses `CVModule(use_camera=False)` and analyzes browser frames instead of opening OpenCV camera capture.
- Confidence SSE stream remains at `GET /api/metrics/stream`.
- Confidence meter displays live values or `--` when unavailable.
- Camera cleanup race fixed in `useCamera.js`.
- Random fake speech metrics removed from `useSpeechMetrics.js`.
- Speech metrics now attempt browser `SpeechRecognition`, count words/filler words, and calculate WPM/clarity from recognized speech.
- WPM calculation now uses active speech time: the first transcript batch gets a short speech-duration estimate and gaps between recognition batches are capped, preventing idle time from reducing real speech to values such as `3 WPM`.
- Speech recognition now enables interim results and refreshes the visible WPM, filler count, and clarity every 500ms; only final transcripts are committed to totals to prevent duplicate word counting.
- `useSpeechMetrics.js` was refactored to use explicit final/interim word counters, reusable word and filler regexes, a 220 WPM cap, a 1500ms maximum speech gap, and a 500ms UI update interval.
- Speech status now distinguishes listening from receiving real speech data.
- Dashboard placeholders were replaced with data loaded from completed sessions and their populated speech/confidence metrics.
- Dashboard now derives average score, improvement, things improved, yet to improve, recent sessions, and performance trend from real records, with explicit empty states when history is unavailable.
- Frontend production build passed after the low-latency speech meter changes.

## Confirmed Working

- Frontend dev server is running successfully on `http://localhost:5173`.
- Backend server is running successfully on `http://localhost:5000`.
- MongoDB is connected and the seed script created 3 demo users.
- CV service health endpoint is returning `200 OK` on `http://localhost:5001/api/health`.
- Default login works with the seeded credentials in the backend: `admin@example.com / admin123`.
- Browser camera works.
- CV confidence values update through browser frames. Recent examples included confidence around `61%`, eye contact around `78-84%`, and head stability around `80-85%`.
- CV service starts with: `Waiting for frames from the browser camera` and does not take the webcam from Chrome.
- `npm run build` passes in `Arambh/` after the WPM and dashboard changes.
- Dashboard data loading and aggregation are implemented in `Arambh/src/pages/dashboard.jsx`.
- Speech meter latency fix is implemented in `Arambh/src/hooks/useSpeechMetrics.js`.
- Report generation from the completed interview now navigates to the generated report ID.
- Reports list and report viewer now load real report records from the backend instead of placeholder entries and scores.
- Report detail responses populate the linked session so duration and date can be displayed from actual session data.
- Interview completion now sends elapsed duration and live speech metrics to the backend; the backend persists a `SpeechMetrics` record and uses the saved duration in generated reports.
- Chrome speech recognition now starts from the visible `Start Speech` user action, avoiding silent pre-gesture listening with no transcript events.
- The current speech hook preserves the public return values consumed by `InterviewLive.jsx`; small future changes can remain isolated to the hook if that API is preserved.

## Voice Status

Chrome voice recognition is considered working for the user's environment. WPM remains transcript-driven and does not use random fallback values. The integrated browser used for validation returned `Speech recognition error: network`, which is an environment/service limitation rather than a reason to fabricate a numeric WPM.

The latest user-side screenshots still showed `Waiting for speech` in one run, so transcript delivery must be verified again after clicking `Start Speech` in Chrome. A numeric WPM must only be shown after real recognition results arrive.

## Next Session Plan

1. Log in with the seeded admin credentials and verify the dashboard loads from the real backend data.
2. Test WPM in the user's Chrome with a sustained spoken answer and confirm the meter updates during speech rather than waiting 49 seconds.
3. Complete a new interview and generate a new report; verify duration and WPM are populated.
4. Confirm the dashboard shows real completed-session values after ending an interview.
5. Verify the generated report no longer shows placeholder values and that the linked session duration is non-zero.
6. Keep the browser-frame CV architecture; do not let Python open the physical webcam again.

## Worktree Note

- Today's changes are currently uncommitted in the workspace.
- Important modified areas include the speech hook, live interview flow, session completion, report generation/viewing, reports list, dashboard, camera/CV integration, and CV module files.
- Before the next major change, run `npm run build` from `Arambh/` and `node --check` for modified backend controllers.

## Useful Commands

From repository root:

```powershell
cd D:\Vs\Projects\Aarambh\Arambh
npm run dev -- --host 0.0.0.0
```

Start the backend:

```powershell
cd D:\Vs\Projects\Aarambh\backend
npm start
```

Seed demo users if the DB is empty:

```powershell
cd D:\Vs\Projects\Aarambh\backend
npm run seed
```

Start the CV service without taking the webcam:

```powershell
& 'D:\Vs\Projects\Aarambh\cv_module\venv\Scripts\python.exe' 'D:\Vs\Projects\Aarambh\cv_module\server.py'
```

Check CV health and metrics:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:5001/api/health
Invoke-WebRequest -UseBasicParsing http://localhost:5001/api/metrics/current
```

Stop the CV service at the end of a session if the camera should be released:

```powershell
$connection = Get-NetTCPConnection -LocalPort 5001 -State Listen -ErrorAction SilentlyContinue
if ($connection) { Stop-Process -Id $connection.OwningProcess -Force }
```

## Important Files

- `Arambh/src/hooks/useSpeechMetrics.js`
- `Arambh/src/hooks/useCamera.js`
- `Arambh/src/hooks/useConfidenceScore.js`
- `Arambh/src/components/WebcamPanel.jsx`
- `Arambh/src/components/ConfidenceMeter.jsx`
- `Arambh/src/pages/InterviewLive.jsx`
- `cv_module/main.py`
- `cv_module/server.py`
- `cv_module/eye_contact.py`
