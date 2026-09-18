# Installation & Setup Guide - CV Module

**Total time: 20 minutes**

## Prerequisites Check

Before starting, make sure you have:
- ✓ Python 3.8+ installed
- ✓ Node.js 16+ installed
- ✓ Webcam connected
- ✓ ~2GB free disk space
- ✓ 4+ GB RAM

**Check Python:**
```bash
python --version
```

**Check Node:**
```bash
node --version
npm --version
```

---

## Phase 1: CV Module Setup (10 minutes)

### Step 1.1: Navigate to CV Module

```bash
cd d:\Vs\Projects\Aarambh\cv_module
```

### Step 1.2: Create Virtual Environment

```bash
python -m venv venv
```

This creates an isolated Python environment to avoid conflicts.

### Step 1.3: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` at the start of your prompt.

### Step 1.4: Install Dependencies

```bash
pip install -r requirements.txt
```

**Expected output:**
```
Collecting opencv-python==4.8.1.78
  Downloading opencv_python-4.8.1.78-cp...
  
Collecting mediapipe==0.10.9
  Downloading mediapipe-0.10.9-...
  (Downloads MediaPipe models ~150MB)
  
Successfully installed ...
```

**Installation time:** 5-10 minutes (MediaPipe models are large)

### Step 1.5: Verify Installation

```bash
python -c "import cv2; import mediapipe; import flask; print('✓ All dependencies installed successfully')"
```

Should print: `✓ All dependencies installed successfully`

---

## Phase 2: Frontend Setup (5 minutes)

The hook has been updated! ✅

**File:** `d:\Vs\Projects\Aarambh\Arambh\src\hooks\useConfidenceScore.js`

**What changed:**
- ❌ OLD: Random confidence scores
- ✅ NEW: Connects to CV Module API at `http://localhost:5001`

No other changes needed to frontend code.

---

## Phase 3: Run Everything (2 minutes)

### Terminal 1: CV Module API Server

```bash
# Make sure you're in cv_module with venv activated
cd d:\Vs\Projects\Aarambh\cv_module
python server.py
```

**Expected output:**
```
============================================================
AARAMBH - CV Module Server
============================================================

[Server] Starting CV module...
[Camera] Opening camera...
[Camera] Opened successfully
[CV Module] Ready!
[Server] Starting Flask on 0.0.0.0:5000
[Server] API endpoints:
  GET  http://localhost:5001/api/health
  GET  http://localhost:5001/api/metrics/current
  GET  http://localhost:5001/api/metrics/stream
  GET  http://localhost:5001/api/metrics/stats

 * Running on http://0.0.0.0:5000
```

**⚠️ KEEP THIS RUNNING** - Don't close this terminal!

---

### Terminal 2: Frontend Dev Server

**In a new terminal:**

```bash
cd d:\Vs\Projects\Aarambh\Arambh
npm run dev
```

**Expected output:**
```
  VITE v7.3.1  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**⚠️ KEEP THIS RUNNING** - Don't close this terminal!

---

### Terminal 3: Backend (Optional)

If you want to save metrics to database:

```bash
cd d:\Vs\Projects\Aarambh\backend
npm run dev
```

---

## Phase 4: Test It! (3 minutes)

### Test 1: Check CV Module Health

```bash
# In a new terminal, test the API
curl http://localhost:5001/api/health
```

Should return:
```json
{
  "status": "ok",
  "service": "Aarambh CV Module",
  "version": "1.0.0",
  "timestamp": 1692547200.123
}
```

### Test 2: Get Current Metrics

```bash
curl http://localhost:5001/api/metrics/current
```

Should return something like:
```json
{
  "success": true,
  "timestamp": 1692547200.123,
  "frame_count": 123,
  "confidence": {
    "confidence_score": 74,
    "eye_contact_score": 81,
    ...
  }
}
```

### Test 3: Open Frontend

1. Open browser to `http://localhost:5173`
2. Click on "Start Interview" or "Interview Live"
3. You should see:
   - Real-time video feed
   - Confidence: **74%**
   - Eye Contact: **81%**
   - Blink Score: **72%**
   - Head Stability: **69%**
   - Real-time feedback

### Test 4: Check Console

Open browser DevTools (F12) and go to Console tab:

You should see:
```
[CV Module] Attempting connection to http://localhost:5001/api/metrics/stream
[CV Module] ✓ Connected successfully
```

If you see **connection error**, check:
- Is Terminal 1 (CV Module server) still running?
- Is it showing `Running on http://0.0.0.0:5000`?

---

## What Each Terminal Does

| Terminal | Command | What it does | Can I close it? |
|----------|---------|------------|-----------------|
| **1** | `python server.py` | CV Module + API | ❌ NO - metrics won't work |
| **2** | `npm run dev` | Frontend UI | ❌ NO - site won't load |
| **3** | `npm run dev` (backend) | Save to database | ✓ YES - optional |

---

## Troubleshooting During Setup

### Issue: `python: command not found`
**Solution:** Python not in PATH
```bash
# Use full path
C:\Python311\python.exe --version
# OR reinstall Python with "Add to PATH" checked
```

### Issue: `venv\Scripts\activate` not found
**Solution:** Virtual environment not created
```bash
# Make sure you're in cv_module folder
cd cv_module
python -m venv venv
venv\Scripts\activate
```

### Issue: `pip install` fails
**Solution:** Upgrade pip first
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: MediaPipe download fails
**Solution:** Network issue, retry with:
```bash
pip install --upgrade mediapipe --no-cache-dir
```

### Issue: Camera not found
**Solution:** Check webcam connection
```bash
# In Python:
import cv2
cap = cv2.VideoCapture(0)
if cap.isOpened():
    print("✓ Camera works")
else:
    print("✗ Camera not found")
cap.release()
```

### Issue: Port 5000 already in use
**Solution:** Change port in config.py
```python
# In cv_module/config.py, change:
FLASK_PORT = 5001  # Instead of 5000
```

Then update frontend hook:
```javascript
// In useConfidenceScore.js, change:
eventSource = new EventSource('http://localhost:5001/api/metrics/stream');
```

### Issue: Frontend won't connect to CV Module
**Solution:** 
1. Check if `python server.py` is still running (Terminal 1)
2. Check browser console (F12) for error messages
3. Try manual test: `curl http://localhost:5001/api/health`
4. If curl fails, CV Module server crashed - restart it

---

## Folder Structure After Setup

```
d:\Vs\Projects\Aarambh\
├── cv_module/
│   ├── venv/                    ← Created by virtualenv
│   ├── *.py files               ← Already created
│   ├── requirements.txt          ← Already created
│   └── README.md
│
├── Arambh/                       ← Frontend
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useConfidenceScore.js  ✓ UPDATED
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── backend/                      ← Unchanged
```

---

## Quick Reference Commands

```bash
# Navigate CV module
cd d:\Vs\Projects\Aarambh\cv_module

# Activate venv
venv\Scripts\activate

# Install dependencies (one time)
pip install -r requirements.txt

# Run CV Module API
python server.py

# Run frontend (new terminal, from Arambh folder)
npm run dev

# Run backend (new terminal, from backend folder)
npm run dev

# Test API
curl http://localhost:5001/api/health
curl http://localhost:5001/api/metrics/current

# Deactivate venv (when done)
deactivate
```

---

## Expected Timeline

| Step | Time | Status |
|------|------|--------|
| Create venv | 30s | ⚡ Fast |
| Install deps | 5-10min | ⏱️ Wait for MediaPipe |
| Start CV server | 5s | ⚡ Fast |
| Start frontend | 15s | ⚡ Fast |
| Test in browser | 30s | ⚡ Fast |
| **TOTAL** | **~15-20 min** | ✅ Ready |

---

## Success Checklist

- [ ] Python 3.8+ installed
- [ ] Virtual environment created (`venv` folder exists)
- [ ] Dependencies installed (no errors from `pip install`)
- [ ] `python server.py` runs without errors
- [ ] `npm run dev` starts frontend on localhost:5173
- [ ] Browser shows "Connected" or metrics appear
- [ ] Metrics update in real-time as you move
- [ ] Confidence score changes (0-100)

If all checkboxes are checked ✓, you're ready!

---

## Next Step

Once everything is running, go to `http://localhost:5173` and:

1. Navigate to Interview page
2. Start/resume interview
3. Look at camera
4. See confidence score update live
5. Try different behaviors:
   - Look away → Eye contact drops
   - Blink fast → Blink score changes
   - Move head → Head stability changes

---

## Need Help?

Check these files for details:
- `cv_module/README.md` - Detailed documentation
- `cv_module/QUICK_START.md` - Demo guide
- `cv_module/config.py` - Configuration options

Good luck! 🚀
