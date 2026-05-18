# Android Setup for Tunex Gaming

To successfully build the Android APK, follow these steps:

1. **Firebase Configuration**:
   - The project is currently configured to build **without** native Google Services to avoid build errors if `google-services.json` is missing.
   - The web app handles its own Firebase configuration, so features like Firestore and Auth will still work through the web layer.
   - If you want to use native Push Notifications, you will need to add the `google-services.json` file to `android/app/` and re-add the plugin in `build.gradle`.

2. **GitHub Actions**:
   - I have added a `.github/workflows/android_build.yml` file.
   - When you push these changes to GitHub, it will automatically try to build your APK.
   - You can find the built APK in the "Actions" tab of your GitHub repository under "Artifacts".

3. **Building Locally**:
   - Run `npm run build:android` to sync your web changes to the Android project.
   - Open the `android` folder in Android Studio to build or debug.

4. **Signing**:
   - The current GitHub Action builds an **unsigned** debug/release APK.
   - To build a signed APK for production, you will need to add your `.jks` keystore and configure GitHub Secrets.
