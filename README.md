# Bloom

Ruch po porodzie, w Twoim tempie. Klikalne demo aplikacji mobilnej (React Native + Expo) na hackathon.

## Uruchomienie

```bash
cd app
npm install
npx expo start
```

Zeskanuj kod QR aplikacją **Expo Go** (Android / iOS). Na laptopie: `npx expo start --web` — na webie można wejść prosto na ekran, np. `http://localhost:8081/#ExerciseAI`.

## Ścieżka demo

1. **Logowanie** → „Załóż konto” → ankieta (poród, ruch i cel, dolegliwości, wizyta kontrolna) → plan gotowy.
   - „Jeszcze nie” w kroku 4 pokazuje tryb **przed wizytą kontrolną** (ćwiczenia zablokowane, „Byłam już” odblokowuje).
2. **Dziś** – codzienny check-in: zmień nastrój albo stuknij „Energia” / „Sen”, a plan i jego wyjaśnienie dopasują się do dnia (np. niewyspana Kasia dostaje krótszą sesję).
3. **Ćwiczenia** → odhaczanie → „Ćwicz z AI”: animacja przysiadu do krzesła albo tryb kamery z korektą postawy (obraz nie opuszcza telefonu).
4. **STOP** (pływający przycisk) – sygnały alarmowe, 112, powiadomienie kręgu wsparcia, zapis zdarzenia do raportu.
5. **Ciało** – oś czasu z bramkami zamiast kalendarza.
6. **Raport** – wybór danych i pytań → PDF (podgląd 2 stron) → wysyłka / kod QR.
7. **Krąg** – kto co widzi (Tylko STOP / Wybrane / Wszystko) → „Zobacz, jak to widzi Tomek”. Po naciśnięciu STOP widok Tomka pokazuje alert.

Długie przytrzymanie avatara „K” na ekranie Dziś wraca do logowania.

## Stack

Expo SDK 57, React Native, TypeScript, react-native-svg, expo-camera, expo-haptics, fonty Fraunces i Plus Jakarta Sans. Makiety: `Bloom.html`.
