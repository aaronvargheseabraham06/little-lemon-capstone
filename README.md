# Little Lemon - React Native Capstone

Expo (React Native) app: Onboarding -> Home (hero, category filters, menu list) -> Profile.

## Run
```
npm install
npx expo start
```
Open in Expo Go (scan QR) or press `a` / `i` for an emulator/simulator.

## Features
- Onboarding with validated first name + email; Next is enabled only when both are valid. Shown only on first launch.
- Home: header with profile avatar, hero (description + search bar), selectable menu categories, menu list.
- Profile: pre-filled from onboarding, editable, saved with AsyncStorage (persists across restarts), Log out clears all data.
- Stack navigation with Back button.

## Wireframe
See `wireframe.jpg`.
