# CORS Fix Instructions

## Problem
The sliders are getting CORS errors when trying to fetch dynamic ranges from the backend:
```
Access to fetch at 'http://localhost:8080/api/vehicles/filtered/ranges' from origin 'http://localhost:3002' 
has been blocked by CORS policy
```

## What Was Fixed

### 1. Enhanced CORS Configuration (`CorsConfig.java`)
- Added `WebMvcConfigurer` implementation for better CORS handling
- Configured to allow all origins with pattern `*`
- Added all HTTP methods including OPTIONS (required for CORS preflight)
- Set `maxAge` to cache CORS preflight requests for 1 hour

### 2. Added Graceful Error Handling (`VehicleSearch.tsx`)
- Added better logging to see what's happening
- Added explicit headers to fetch requests
- Gracefully handles CORS errors without breaking the UI
- Sliders will still work with initial ranges if backend is unavailable

## How to Apply the Fix

### Step 1: Restart the Backend

**Option A: Using Docker Compose**
```bash
# Stop the containers
docker-compose down

# Rebuild and start
docker-compose up --build
```

**Option B: Using Maven (if running locally)**
```bash
# Stop the running Spring Boot application (Ctrl+C)

# Rebuild
cd backend/workflowservice
mvn clean install

# Restart
mvn spring-boot:run
```

**Option C: In IntelliJ/Eclipse**
1. Stop the running application
2. Clean and rebuild the project
3. Start the application again

### Step 2: Clear Browser Cache (Important!)
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

OR

1. Go to DevTools → Network tab
2. Check "Disable cache"
3. Refresh the page

### Step 3: Test the Sliders

1. Navigate to the Vehicle Search page
2. Open DevTools Console (F12)
3. Select a Make (e.g., "Toyota")
4. You should see in console:
   ```
   Fetching dynamic ranges with params: make=Toyota
   Received dynamic ranges: {priceRange: {...}, yearRange: {...}, mileageRange: {...}}
   ```
5. Sliders should adjust smoothly
6. No CORS errors should appear

## Verification Checklist

- [ ] Backend restarted successfully
- [ ] Browser cache cleared
- [ ] No CORS errors in console
- [ ] Console shows "Fetching dynamic ranges..." messages
- [ ] Console shows "Received dynamic ranges..." with data
- [ ] Sliders adjust when selecting Make
- [ ] Sliders adjust when selecting Model
- [ ] Sliders adjust when selecting Body Type, Fuel Type, or Province

## If CORS Errors Persist

### Check 1: Verify Backend is Running
```bash
curl http://localhost:8080/api/vehicles/filters
```
Should return JSON with vehicle filters.

### Check 2: Test CORS Directly
```bash
curl -H "Origin: http://localhost:3002" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8080/api/vehicles/filtered/ranges
```

Should return CORS headers in response.

### Check 3: Verify Port Numbers
- Backend should be on: `http://localhost:8080`
- Frontend should be on: `http://localhost:3002` (or your configured port)

### Check 4: Check Firewall/Antivirus
Some security software blocks CORS requests. Try temporarily disabling it.

## Alternative: Use Proxy (If CORS Still Fails)

If CORS continues to be an issue, you can configure a proxy in the frontend:

**In `package.json` of buying-flow:**
```json
{
  "proxy": "http://localhost:8080"
}
```

Then update fetch URLs to use relative paths:
```typescript
// Instead of: http://localhost:8080/api/vehicles/filtered/ranges
// Use: /api/vehicles/filtered/ranges
```

## Expected Behavior After Fix

1. **Select Make** → Console logs fetch → Sliders adjust immediately
2. **Select Model** → Console logs fetch → Sliders narrow further
3. **Select Filters** → Console logs fetch → Sliders update smoothly
4. **No errors** in console
5. **Smooth UX** with real-time slider updates

## Files Modified

1. `backend/workflowservice/src/main/java/com/trex/workflowservice/config/CorsConfig.java`
   - Enhanced CORS configuration with WebMvcConfigurer

2. `microfrontends/buying-flow/src/steps/VehicleSearch.tsx`
   - Added better error handling and logging
   - Added explicit headers to fetch requests

## Need Help?

If CORS errors persist after following these steps:
1. Check the backend logs for any errors
2. Verify the CORS configuration is loaded (look for logs on startup)
3. Try accessing the API directly in browser: `http://localhost:8080/api/vehicles/filters`
4. Check if there are any proxy/VPN settings interfering
