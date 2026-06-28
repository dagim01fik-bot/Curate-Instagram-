# API Integration Setup Guide

## ✅ What Was Changed

### Files Modified
- **`.env`** - Created with API key placeholders
- **`.gitignore`** - Added `.env` to protect API keys
- **`constants/topics.ts`** - Added `TOPIC_API_MAP` with YouTube category IDs and Pexels queries
- **`types/content.ts`** - Added `creatorName`, `embedUrl`, renamed `sourceApp` to `source`
- **`services/contentService.ts`** - **REPLACED** mock data with real YouTube Data API v3 + Pexels Video API
- **`services/filterService.ts`** - **NEW** file for content filtering and ranking
- **`data/mockVideos.ts`** - Updated to match new `Video` type (for fallback/testing)
- **`hooks/useFeed.ts`** - Integrated real API calls while maintaining existing store architecture
- **`components/feed/VideoCard.tsx`** - Added YouTube WebView support for embedded playback

### Packages Installed
- **`react-native-webview`** - For YouTube video embedding

---

## 🔑 API Key Setup

### 1. Get YouTube Data API v3 Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**:
   - Navigate to **APIs & Services** → **Library**
   - Search for "YouTube Data API v3"
   - Click **Enable**
4. Create credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **API Key**
   - Copy the generated key
   - **(Optional)** Restrict the key to YouTube Data API v3 for security

### 2. Get Pexels API Key

1. Go to [Pexels API](https://www.pexels.com/api/)
2. Sign up for a free account
3. Once logged in, your API key will be displayed on the API page
4. Copy the API key

### 3. Update `.env` File

Open `c:\Users\D\Instagram\curate\.env` and replace the placeholders:

```env
EXPO_PUBLIC_YOUTUBE_API_KEY=AIzaSy...Your_Actual_YouTube_Key_Here
EXPO_PUBLIC_PEXELS_API_KEY=Your_Actual_Pexels_Key_Here
```

**Important:** Never commit this file to Git! It's already in `.gitignore`.

---

## 📱 Rebuild the App

After adding your API keys, rebuild the APK:

```bash
# Build a new preview APK with the API keys
npx eas build -p android --profile preview
```

Once the build completes, download and install the APK on your device.

---

## 🎯 How It Works

### Video Sources
- **YouTube**: Fetches real YouTube Shorts using search API + video details
  - Plays via embedded WebView (automatically switches when `source === 'youtube'`)
- **Pexels**: Fetches curated stock videos matching topic queries
  - Plays natively via `expo-video` (direct .mp4 files)

### Content Flow
1. User's selected topics (from Preferences) → `TOPIC_API_MAP`
2. Parallel API calls to YouTube + Pexels for each topic
3. `filterService.ts` applies:
   - Hard blocks (blocked creators, topics, keywords)
   - Boosts (followed creators, boosted keywords)
   - Feedback-based scoring (likes/dislikes from history)
4. Sorted by relevance score, deduplicated, and limited to `MAX_FEED_ITEMS`

### Fallback
If API keys are missing or API calls fail, the app gracefully returns an empty feed (no crash). Check console logs for warnings.

---

## 🧪 Testing Without Rebuilding

To test API integration locally before building:

```bash
# Start dev server
npx expo start

# Scan QR code with Expo Go (requires API keys in .env)
```

Note: YouTube embed may not work in Expo Go due to WebView restrictions. Build a standalone APK to test full functionality.

---

## 🔍 Troubleshooting

### "No videos showing up"
- Check that you have topics selected in Preferences
- Verify API keys are correct in `.env`
- Check console for API error messages

### "YouTube videos not playing"
- YouTube embeds require a standalone APK (won't work in Expo Go)
- Ensure `embedUrl` is not null for YouTube videos

### "Quota exceeded" (YouTube)
- Free tier: 10,000 units/day
- Each search = 100 units, each video details call = 1 unit
- Pexels has no quota limits (rate-limited only)

---

## 📦 Commit Changes

Once verified working:

```bash
git add .
git commit -m "feat: integrate YouTube Data API + Pexels + content filter"
git push origin main
```
