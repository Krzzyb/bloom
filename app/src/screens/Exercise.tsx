import React, { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C, shadowCard } from '../theme';
import { useApp } from '../state';
import { BackButton, Btn, Screen, Segmented, Serif, T, tap } from '../ui';

const CYCLE = 4000;
type Pt = [number, number];
const lerp = (a: Pt, b: Pt, p: number): Pt => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];
const pts = (arr: Pt[]) => arr.map((q) => q.join(',')).join(' ');

// pozycje ze storyboardu: stanie -> siad na krawędzi krzesła
const STAND = { body: [[150, 180], [152, 140], [150, 100], [152, 50]] as Pt[], arm: [[152, 50], [158, 94]] as Pt[], head: [154, 32] as Pt, hip: [150, 100] as Pt };
const SIT = { body: [[150, 180], [158, 141], [117, 130], [140, 86]] as Pt[], arm: [[140, 86], [186, 88]] as Pt[], head: [148, 68] as Pt, hip: [117, 130] as Pt };

function phase(t: number) {
  // keyTimes 0;0.45;0.55;1 z wygładzeniem
  const raw = t < 0.45 ? t / 0.45 : t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45;
  return raw * raw * (3 - 2 * raw);
}

function SquatAnimation({ t }: { t: number }) {
  const p = phase(t);
  const body = STAND.body.map((q, i) => lerp(q, SIT.body[i], p));
  const arm = STAND.arm.map((q, i) => lerp(q, SIT.arm[i], p));
  const head = lerp(STAND.head, SIT.head, p);
  const hip = lerp(STAND.hip, SIT.hip, p);
  return (
    <Svg width={300} height={230} viewBox="0 0 300 230">
      <Line x1={20} y1={180} x2={240} y2={180} stroke={C.muted} strokeWidth={2} strokeLinecap="round" />
      <Path d="M70 92 V180 M70 134 H114 M110 134 V180" fill="none" stroke={C.muted} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={hip[0]} cy={hip[1]} r={16} fill={C.primary} opacity={0.4} />
      <Polyline points={pts(body)} fill="none" stroke={C.white} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points={pts(arm)} fill="none" stroke={C.pink} strokeWidth={7} strokeLinecap="round" />
      <Circle cx={head[0]} cy={head[1]} r={13} fill={C.pink} />
      <Circle cx={hip[0]} cy={hip[1]} r={5} fill={C.primary} />
    </Svg>
  );
}

function PoseOverlay({ t }: { t: number }) {
  // szkielet "wykryty" przez kamerę, lekko drga, żeby wyglądał na żywy
  const j = Math.sin(t * Math.PI * 2) * 2;
  const pose: Pt[] = [
    [150, 180],
    [166 + j, 140],
    [126, 124 + j],
    [160 + j, 90],
  ];
  return (
    <Svg width={300} height={230} viewBox="0 0 300 230">
      <Line x1={20} y1={180} x2={240} y2={180} stroke={C.body} strokeWidth={2} />
      <Path d="M70 92 V180 M70 134 H114 M110 134 V180" fill="none" stroke={C.body} strokeWidth={4} strokeLinecap="round" />
      <Polyline points={pts(pose)} fill="none" stroke={C.pink2} strokeWidth={3} strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points={`${pose[1].join(',')} 157,140`} fill="none" stroke={C.white} strokeWidth={2} strokeDasharray="3 5" strokeLinecap="round" />
      <Polyline points={`${pose[3].join(',')} 196,96`} fill="none" stroke={C.pink2} strokeWidth={3} strokeDasharray="6 6" strokeLinecap="round" />
      <Circle cx={168} cy={72 + j} r={11} fill="none" stroke={C.pink2} strokeWidth={3} />
      {pose.map((q, i) => (
        <Circle key={i} cx={q[0]} cy={q[1]} r={i === 0 ? 5 : 6} fill={C.white} />
      ))}
      <Circle cx={157} cy={140} r={5} fill="none" stroke={C.white} strokeWidth={2} />
    </Svg>
  );
}

export function ExerciseAI() {
  const { go, back, done, setDone, toast } = useApp();
  const [mode, setMode] = useState(0);
  const [rep, setRep] = useState(3);
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const [perm, requestPerm] = useCameraPermissions();
  const start = useRef(Date.now());
  const lastCycle = useRef(0);

  useEffect(() => {
    if (!playing) return;
    start.current = Date.now() - t * CYCLE - lastCycle.current * CYCLE;
    const id = setInterval(() => {
      const el = Date.now() - start.current;
      const cyc = Math.floor(el / CYCLE);
      setT((el % CYCLE) / CYCLE);
      if (cyc > lastCycle.current) {
        lastCycle.current = cyc;
        setRep((r) => Math.min(8, r + 1));
        Haptics.selectionAsync().catch(() => {});
      }
    }, 33);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    if (rep === 8 && playing) {
      setPlaying(false);
      const n = Array.from({ length: Math.max(done.length, 5) }, (_, k) => !!done[k]);
      n[3] = true;
      setDone(n);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      toast('Przysiad do krzesła zaliczony!');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rep]);

  const isCam = mode === 1;
  const camReady = isCam && perm?.granted;

  return (
    <Screen padTop={8} gap={14}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <BackButton />
        <View style={{ flex: 1, gap: 2 }}>
          <T w={600} size={12} color={C.muted}>
            Ćwiczenie 4 z 5 · 3 min
          </T>
          <Serif size={22}>Przysiad do krzesła</Serif>
        </View>
      </View>
      <Segmented
        options={['Animacja AI', 'Kamera z korektą AI']}
        value={mode}
        onChange={(i) => {
          setMode(i);
          if (i === 1 && perm && !perm.granted && perm.canAskAgain) requestPerm();
        }}
      />
      <View style={{ backgroundColor: C.ink, borderRadius: 28, height: 300, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
        {camReady && <CameraView facing="front" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0.55 }} />}
        <View style={{ position: 'absolute', top: 14, left: 14, backgroundColor: 'rgba(255,255,255,0.14)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 2 }}>
          <MaterialCommunityIcons name="creation" size={12} color={C.white} />
          <T w={800} size={11} color={C.white} style={{ letterSpacing: 0.5 }}>
            {isCam ? 'AI ANALIZUJE POSTAWĘ' : 'WIZUALIZACJA AI'}
          </T>
        </View>
        {!isCam ? (
          <View style={{ alignItems: 'center' }}>
            <SquatAnimation t={t} />
            <T w={700} size={12} color={C.pink}>
              wdech w dół · wydech przy wstawaniu
            </T>
          </View>
        ) : (
          <>
            <PoseOverlay t={t} />
            <View style={{ position: 'absolute', bottom: 16, backgroundColor: C.white, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16 }}>
              <T w={700} size={13} color={C.deep}>
                Cofnij biodra, kolana nad stopami
              </T>
            </View>
            {perm && !perm.granted && (
              <Pressable
                onPress={() => (perm.canAskAgain ? requestPerm() : Linking.openSettings())}
                style={{ position: 'absolute', top: 14, right: 14, backgroundColor: C.primary, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 }}
              >
                <T w={700} size={11} color={C.white}>
                  Włącz kamerę
                </T>
              </Pressable>
            )}
          </>
        )}
      </View>
      {isCam && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Feather name="lock" size={12} color={C.muted} />
          <T size={11.5} color={C.muted}>
            Analiza postawy działa na telefonie, obraz nie jest wysyłany
          </T>
        </View>
      )}
      <View style={{ backgroundColor: C.white, borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <T w={800}>Powtórzenie {rep} z 8</T>
          <T w={700} size={12} color={C.muted}>
            tempo spokojne
          </T>
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i < rep - 1 ? C.primary : i === rep - 1 ? C.pink2 : C.soft }} />
          ))}
        </View>
        <T size={13.5}>
          <T w={800} size={13.5}>
            Usiądź na krawędzi i wstań z wydechem.
          </T>{' '}
          Przed wstaniem delikatnie napnij dno miednicy. To ten sam ruch, którym podnosisz dziecko z łóżeczka.
        </T>
      </View>
      <View style={{ marginTop: 'auto', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22 }}>
        <Pressable
          accessibilityLabel="Poprzednie powtórzenie"
          onPress={() => {
            tap();
            setRep((r) => Math.max(1, r - 1));
          }}
          style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }}
        >
          <Feather name="skip-back" size={20} color={C.ink} />
        </Pressable>
        <Pressable
          accessibilityLabel={playing ? 'Pauza' : 'Wznów'}
          onPress={() => {
            tap();
            if (rep === 8) {
              setRep(1);
              lastCycle.current = 0;
              setT(0);
            }
            setPlaying((p) => !p);
          }}
          style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', ...shadowCard, shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } }}
        >
          <Feather name={playing ? 'pause' : 'play'} size={28} color={C.white} />
        </Pressable>
        <Pressable
          accessibilityLabel="Następne powtórzenie"
          onPress={() => {
            tap();
            setRep((r) => Math.min(8, r + 1));
          }}
          style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }}
        >
          <Feather name="skip-forward" size={20} color={C.ink} />
        </Pressable>
      </View>
      {rep === 8 && !playing ? (
        <Btn label="Wróć do listy ćwiczeń" variant="dark" height={48} onPress={back} />
      ) : (
        <Pressable
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
            setPlaying(false);
            go('Stop');
          }}
          style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <T w={800} size={14} color={C.deep} style={{ letterSpacing: 0.5 }}>
            STOP, źle się czuję
          </T>
        </Pressable>
      )}
    </Screen>
  );
}

export function Stop() {
  const { back, people, addStopEvent, setStopActive, toast, stack, reset } = useApp();
  useEffect(() => {
    setStopActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const notified = people.filter((p) => p.on[0]).map((p) => p.name);
  const names = notified.length > 1 ? notified.slice(0, -1).join(', ') + ' i ' + notified[notified.length - 1] : notified[0];
  return (
    <Screen bg={C.soft} gap={14} padTop={8}>
      <BackButton />
      <View style={{ gap: 8 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.deep, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} size={14} color={C.white} style={{ letterSpacing: 1 }}>
            STOP
          </T>
        </View>
        <Serif size={30}>Przerwij ćwiczenie</Serif>
        <T size={15}>Usiądź albo połóż się. Oddychaj spokojnie. Dobrze, że słuchasz swojego ciała.</T>
      </View>
      <View style={{ backgroundColor: C.white, borderRadius: 22, padding: 16, gap: 10 }}>
        <T w={800} color={C.deep}>
          Skontaktuj się z lekarzem, jeśli zauważysz:
        </T>
        <View style={{ gap: 7 }}>
          {[
            'nagłe, obfite krwawienie',
            'gorączkę, ból lub zaczerwienienie blizny',
            'ból w klatce piersiowej lub duszność',
            'zawroty głowy, uczucie omdlenia',
            'ból i obrzęk łydki',
            'silny ból głowy lub zaburzenia widzenia',
          ].map((s) => (
            <View key={s} style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary, marginTop: 7 }} />
              <T size={13.5} style={{ flex: 1 }}>
                {s}
              </T>
            </View>
          ))}
        </View>
      </View>
      {names && (
        <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Feather name="bell" size={18} color={C.deep} />
          <T size={13} style={{ flex: 1 }}>
            <T w={800} size={13}>
              {names}
            </T>{' '}
            z Twojego kręgu wsparcia {notified.length > 1 ? 'dostali' : 'dostał(a)'} powiadomienie
          </T>
        </View>
      )}
      <View style={{ marginTop: 'auto', gap: 10 }}>
        <Btn label="Zadzwoń 112" icon="phone" variant="danger" onPress={() => Linking.openURL('tel:112')} />
        <Btn label="Zadzwoń do lekarza" variant="dangerOutline" onPress={() => Linking.openURL('tel:+48000000000')} />
        <Pressable
          onPress={() => {
            tap();
            addStopEvent();
            setStopActive(false);
            toast('Zdarzenie zapisane w raporcie');
            if (stack.length > 1) back();
            else reset('Home');
          }}
          style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <T w={600} color={C.body}>
            Czuję się lepiej, zapisz zdarzenie
          </T>
        </Pressable>
      </View>
    </Screen>
  );
}
