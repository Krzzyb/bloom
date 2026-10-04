import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, BackHandler, StyleSheet, Text } from 'react-native';
import { C, F } from './theme';

export type Route =
  | 'Login'
  | 'Onboarding1'
  | 'Onboarding2'
  | 'Onboarding3'
  | 'Onboarding4'
  | 'PlanReady'
  | 'NoVisit'
  | 'Home'
  | 'Exercises'
  | 'ExerciseAI'
  | 'Stop'
  | 'Timeline'
  | 'Report'
  | 'ReportReady'
  | 'ReportPdf'
  | 'Circle'
  | 'PartnerView';



export type Person = { name: string; role: string; initial: string; bg: string; fg: string; on: boolean[] };

type AppState = {
  // nawigacja
  stack: Route[];
  route: Route;
  go: (r: Route) => void;
  tab: (r: Route) => void;
  back: () => void;
  reset: (r: Route) => void;
  // dane demo
  visitDone: boolean;
  setVisitDone: (v: boolean) => void;
  mood: number;
  setMood: (v: number) => void;
  energy: number;
  setEnergy: (v: number) => void;
  sleep: number;
  setSleep: (v: number) => void;
  done: boolean[];
  setDone: (v: boolean[]) => void;
  stopEvents: number;
  addStopEvent: () => void;
  stopActive: boolean;
  setStopActive: (v: boolean) => void;
  people: Person[];
  setPeople: (p: Person[]) => void;
  reportSections: boolean[];
  setReportSections: (v: boolean[]) => void;
  questions: string[];
  setQuestions: (v: string[]) => void;
  toast: (msg: string) => void;
};

const Ctx = createContext<AppState | null>(null);

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp outside provider');
  return c;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<Route[]>(() => {
    // na webie można wejść prosto na ekran: /#Home, /#ExerciseAI ...
    const h = typeof window !== 'undefined' && window.location ? window.location.hash.slice(1) : '';
    return h ? ['Login', h as Route] : ['Login'];
  });
  const [visitDone, setVisitDone] = useState(true);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(2);
  const [sleep, setSleep] = useState(2);
  const [done, setDone] = useState([true, true, false, false, false]);
  const [stopEvents, setStopEvents] = useState(1);
  const [stopActive, setStopActive] = useState(false);
  const [people, setPeople] = useState<Person[]>([
    { name: 'Tomek', role: 'Partner', initial: 'T', bg: C.ink, fg: C.white, on: [true, true, false, true, false] },
    { name: 'Ola', role: 'Siostra', initial: 'O', bg: C.pink, fg: C.deeper, on: [true, false, false, false, false] },
  ]);
  const [reportSections, setReportSections] = useState([true, true, true, true, true, true]);
  const [questions, setQuestions] = useState([
    'Kiedy mogę bezpiecznie wrócić do biegania?',
    'Czy ciągnięcie w okolicy blizny przy wstawaniu jest normalne?',
    'Jak sprawdzić, czy mam rozejście mięśni brzucha?',
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useCallback(
    (msg: string) => {
      setToastMsg(msg);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      Animated.timing(toastAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      toastTimer.current = setTimeout(() => {
        Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setToastMsg(null));
      }, 2200);
    },
    [toastAnim],
  );

  const go = useCallback((r: Route) => setStack((s) => [...s, r]), []);
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const reset = useCallback((r: Route) => setStack([r]), []);
  // zakładki dolnego paska zastępują cały stos
  const tab = useCallback((r: Route) => setStack([r]), []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        back();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack, back]);

  const value = useMemo<AppState>(
    () => ({
      stack,
      route: stack[stack.length - 1],
      go,
      tab,
      back,
      reset,
      visitDone,
      setVisitDone,
      mood,
      setMood,
      energy,
      setEnergy,
      sleep,
      setSleep,
      done,
      setDone,
      stopEvents,
      addStopEvent: () => setStopEvents((n) => n + 1),
      stopActive,
      setStopActive,
      people,
      setPeople,
      reportSections,
      setReportSections,
      questions,
      setQuestions,
      toast,
    }),
    [stack, go, tab, back, reset, visitDone, mood, energy, sleep, done, stopEvents, stopActive, people, reportSections, questions, toast],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {toastMsg && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            { opacity: toastAnim, transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] },
          ]}
        >
          <Text style={styles.toastText}>{toastMsg}</Text>
        </Animated.View>
      )}
    </Ctx.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 120,
    backgroundColor: C.ink,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  toastText: { color: C.white, fontFamily: F.w700, fontSize: 14, textAlign: 'center' },
});
