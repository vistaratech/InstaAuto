# 📱 InstaAuto - Real Native Android Application

**InstaAuto Android** is a 100% real native Android mobile application built with React Native and Expo. It provides a mobile-first, user-friendly interface to control your Instagram automation, auto-replies, live inbox, and Reels scheduling directly from your Android smartphone.

---

## ✨ Features & Screens

1. 🏠 **Home Dashboard (`HomeScreen`)**
   - Real-time Master Engine Switch (1-tap toggle to pause or activate all automations)
   - 4 Live Metric Cards (Active Rules, Active Chats, AI Fallback Status, Automation Health)
   - AI Fallback quick toggle
   - Quick action shortcuts and recent activity feed

2. ⚡ **Automations Manager (`AutomationsScreen` & `CreateAutomationModal`)**
   - Filter Tabs: `All`, `DMs 💬`, `Comments 💭`, `Stories 📖`
   - Real-time Search bar for keywords and rules
   - Interactive Rule Cards with instant toggle switches
   - Interactive Rule Builder with **Live Instagram DM Simulator Preview**
   - Support for multiple action buttons (URL links & postback payloads)

3. 💬 **Live Instagram Inbox (`InboxScreen` & `ChatThreadScreen`)**
   - Real-time follower conversation threads
   - Native 2-way chat bubbles with timestamp formatting
   - Fast manual reply input bar
   - Quick reply suggestion chips

4. 🎬 **Reels Auto-Publisher (`PublisherScreen`)**
   - Native Android gallery video picker (`expo-image-picker`)
   - Caption editor with hashtags
   - Interval scheduler (e.g. Every 4 hours)
   - Queue management with status indicators (`PENDING ⏳`, `READY ✅`, `PUBLISHED`)

5. ⚙️ **AI Settings & Accounts (`SettingsScreen`)**
   - Groq AI (Llama 3) personality editor & custom prompt context
   - Quick Personality Presets (Friendly Creator, Sales & Leads, Fast Support)
   - Connected Instagram Token status (60-day long-lived token)
   - Custom Backend Server URL configuration

---

## 🚀 How to Run on Android Device

### Option 1: Run on Real Android Phone (Instant Testing ⚡)
1. Install **Expo Go** from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
2. In your terminal inside `insta-auto-android`:
   ```bash
   npm start
   ```
3. Scan the QR code using the **Expo Go** app on your Android phone!

### Option 2: Run on Android Studio Emulator
```bash
npm run android
```

---

## 📦 How to Build Standalone Android APK (`.apk`)

To generate an installable Android `.apk` file:

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Build standalone APK
eas build -p android --profile preview
```
This generates a downloadable `.apk` file that you can install directly on any Android smartphone.
