# Ethereum Mobile App

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Router**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Animations**: React Native Reanimated 4
- **UI Components**: Custom themed components with dark mode support
- **Navigation**: React Navigation (Bottom Tabs)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or newer)
- **npm**
- **Expo CLI**: `npm install -g expo-cli`

### Platform-Specific Requirements

#### iOS

- **macOS** (required for iOS development)
- **Xcode** 14.0 or newer
- **CocoaPods**: `sudo gem install cocoapods`
- **iOS Simulator** or physical iOS device

#### Android

- **Android Studio** (latest version)
- **Android SDK** (API level 34 or higher)
- **Android Emulator** or physical Android device
- **Java Development Kit (JDK)** 17 or newer

#### Web

- Modern web browser (Chrome, Firefox, Safari)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/anaarezo/ethereum.git
   cd ethereum
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Running the Application

### Development Mode (Expo Go)

Start the development server:

```bash
npm start
```

This will open Expo Dev Tools in your browser. From there, you can:

- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Press `w` to open in web browser
- Scan the QR code with [Expo Go app](https://expo.dev/go) on your physical device

### iOS

#### Using Simulator

```bash
npm run ios
```

#### Using Physical Device

1. Open `ios/ethereum.xcworkspace` in Xcode
2. Select your device from the target dropdown
3. Click the Run button or press `Cmd + R`

**Note**: You may need to configure code signing in Xcode for physical device deployment.

### Android

#### Using Emulator

```bash
npm run android
```

#### Using Physical Device

1. Enable USB debugging on your Android device
2. Connect your device via USB
3. Run `npm run android`

**Troubleshooting Android**:

- Ensure Android SDK is properly configured: `export ANDROID_HOME=$HOME/Library/Android/sdk`
- Verify device connection: `adb devices`

### Web

```bash
npm run web
```

The application will open in your default browser at `http://localhost:8081`.

## Troubleshooting

### iOS Build Issues

- Clear Xcode derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
- Reinstall pods: `cd ios && pod deintegrate && pod install`
- Reset Metro bundler cache: `npx expo start -c`

### Android Build Issues

- Clean Gradle cache: `cd android && ./gradlew clean`
- Invalidate Android Studio caches: File > Invalidate Caches / Restart
- Check SDK location in `android/local.properties`

### Module Resolution Errors

- Restart TypeScript server: Cmd+Shift+P → "TypeScript: Restart TS Server"
- Clear watchman: `watchman watch-del-all`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## Support

For issues and questions, please contact laura.arezo@gmail.com
