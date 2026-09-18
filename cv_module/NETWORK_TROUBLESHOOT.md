# NETWORK ISSUE WORKAROUND

If you're seeing connection errors during `pip install`, try these solutions:

## Solution 1: Use System Python Packages (EASIEST)

If some packages are already installed system-wide, they might work. Try:

```bash
cd d:\Vs\Projects\Aarambh\cv_module
python -m venv venv --system-site-packages
.\venv\Scripts\activate
pip install --no-cache-dir opencv-python mediapipe flask flask-cors
```

## Solution 2: Offline Installation

If your internet is working but slow, use this:

```bash
cd d:\Vs\Projects\Aarambh\cv_module
.\venv\Scripts\activate

# Install one package at a time
pip install --no-cache-dir opencv-python
pip install --no-cache-dir mediapipe
pip install --no-cache-dir flask
pip install --no-cache-dir flask-cors
pip install --no-cache-dir numpy
pip install --no-cache-dir scipy
```

## Solution 3: Pre-built Wheels

Pre-built wheels (faster, no compilation):

```bash
pip install --only-binary :all: opencv-python mediapipe flask
```

## Solution 4: Check Your Network

Test your internet connection:

```powershell
# Test DNS
nslookup google.com

# Test connectivity
Test-NetConnection -ComputerName pypi.org -Port 443
```

If network is down:
- Check your WiFi/Ethernet connection
- Restart your router
- Try mobile hotspot if available

## Solution 5: Work Offline for Now

If internet is completely down, you can still:
1. Run the CV module code locally (doesn't need server)
2. Test individual Python files
3. Create mock data for frontend testing

## Next Steps

1. **Try Solution 1 first** (system site packages)
2. **If that fails, try Solution 2** (install one at a time)
3. **If network is really down**, let me know and I'll create an offline version

---

## Quick Check

Before reinstalling, verify your Python setup:

```powershell
python --version
python -m pip --version
where python
```

All should show Python 3.8+.

---

**Let me know which solution works for you!**
