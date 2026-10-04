import React, { useLayoutEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { C } from './src/theme';
import { AppProvider, Route, useApp } from './src/state';
import { Login, Onboarding1, Onboarding2, Onboarding3, Onboarding4, PlanReady } from './src/screens/Onboarding';
import { Exercises, Home, NoVisit, Timeline } from './src/screens/Main';
import { ExerciseAI, Stop } from './src/screens/Exercise';
import { Report, ReportPdf, ReportReady } from './src/screens/Report';
import { Circle, PartnerView } from './src/screens/Circle';

const SCREENS: Record<Route, React.ComponentType> = {
  Login,
  Onboarding1,
  Onboarding2,
  Onboarding3,
  Onboarding4,
  PlanReady,
  NoVisit,
  Home,
  Exercises,
  ExerciseAI,
  Stop,
  Timeline,
  Report,
  ReportReady,
  ReportPdf,
  Circle,
  PartnerView,
};

function Router() {
  const { route, stack } = useApp();
  const anim = useRef(new Animated.Value(1)).current;
  const prevLen = useRef(stack.length);
  const dir = useRef(1);

  const first = useRef(true);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    dir.current = stack.length >= prevLen.current ? 1 : -1;
    prevLen.current = stack.length;
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [route, stack.length, anim]);

  const Screen = SCREENS[route];
  return (
    <Animated.View
      key={stack.length + route}
      style={{
        flex: 1,
        opacity: anim,
        transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [24 * dir.current, 0] }) }],
      }}
    >
      <Screen />
    </Animated.View>
  );
}

export default function App() {
  const [loaded] = useFonts({
    Fraunces_600SemiBold,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        {/* na webie (demo na laptopie) trzymamy szerokość telefonu */}
        <View style={{ flex: 1, backgroundColor: Platform.OS === 'web' ? '#EDE6E9' : C.bg, alignItems: 'center' }}>
          <View style={{ flex: 1, width: '100%', maxWidth: Platform.OS === 'web' ? 420 : undefined, backgroundColor: C.bg, overflow: 'hidden' }}>
            <Router />
          </View>
        </View>
        <StatusBar style="dark" />
      </AppProvider>
    </SafeAreaProvider>
  );
}
