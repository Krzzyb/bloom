import React from 'react';
import { Pressable, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { C, shadowCard } from '../theme';
import { useApp } from '../state';
import { planFor } from '../plan';
import { Btn, Bullet, Card, CheckCircle, Face, InfoNote, ProgressBar, Screen, Serif, T, tap } from '../ui';

const MOODS = [
  { label: 'Świetnie', tint: '#F8BBD0' },
  { label: 'Dobrze', tint: '#FAD1DE' },
  { label: 'Średnio', tint: '#FCE4EC' },
  { label: 'Słabo', tint: '#F3E3EA' },
  { label: 'Źle', tint: '#EBDDE3' },
];

function Avatar() {
  const { reset } = useApp();
  return (
    <Pressable onLongPress={() => reset('Login')} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center' }}>
      <T w={700} size={16} color={C.deeper}>
        K
      </T>
    </Pressable>
  );
}

function Stat({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={() => {
        if (!onPress) return;
        tap();
        onPress();
      }}
      style={{ flex: 1, backgroundColor: C.softer, borderRadius: 14, padding: 10, gap: 4 }}
    >
      <T w={600} size={11} color={C.muted}>
        {label}
      </T>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T w={700} size={15}>
          {value}
        </T>
        {onPress && <Feather name="refresh-cw" size={11} color={C.radio} />}
      </View>
    </Pressable>
  );
}

export function Home() {
  const { go, mood, setMood, energy, setEnergy, sleep, setSleep, done } = useApp();
  const plan = planFor(mood, energy, sleep);
  const doneCount = plan.exercises.filter((_, i) => done[i]).length;
  const cycle = (v: number) => (v % 5) + 1;
  return (
    <Screen tabs stop>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ gap: 2 }}>
          <T size={13} color={C.muted}>
            Niedziela, 4 października
          </T>
          <Serif size={28} style={{ letterSpacing: -0.3 }}>
            Dzień dobry, Kasia
          </Serif>
        </View>
        <Avatar />
      </View>

      <Pressable
        onPress={() => {
          tap();
          go('Timeline');
        }}
        style={{ backgroundColor: C.primary, borderRadius: 24, padding: 18, gap: 10 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T w={600} size={13} color={C.white} style={{ opacity: 0.9 }}>
            Etap: odbudowa
          </T>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <T w={600} size={13} color={C.white}>
              Twoje ciało teraz
            </T>
            <Feather name="chevron-right" size={16} color={C.white} />
          </View>
        </View>
        <Serif size={24} color={C.white}>
          8. tydzień po porodzie
        </Serif>
        <ProgressBar pct={50} track="rgba(255,255,255,0.3)" fill={C.white} />
        <T size={13} color={C.white}>
          Blizna się goi, a dno miednicy się odbudowuje. Stawiamy na głębokie mięśnie.
        </T>
      </Pressable>

      <Card shadow style={{ padding: 18, gap: 14, borderRadius: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Serif size={19}>Jak się dziś czujesz?</Serif>
          <T w={600} size={11} color={C.muted}>
            check-in · 15 s
          </T>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {MOODS.map((m, i) => {
            const sel = mood === i;
            return (
              <Pressable
                key={m.label}
                onPress={() => {
                  tap();
                  setMood(i);
                }}
                style={{ alignItems: 'center', gap: 6, minWidth: 56 }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: m.tint,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 3,
                    borderColor: sel ? C.primary : 'transparent',
                  }}
                >
                  <Face mood={i} />
                </View>
                <T w={600} size={11} color={sel ? C.deep : C.muted}>
                  {m.label}
                </T>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Stat label="Energia" value={`${energy}/5`} onPress={() => setEnergy(cycle(energy))} />
          <Stat label="Sen" value={`${sleep}/5`} onPress={() => setSleep(cycle(sleep))} />
          <Stat label="Ból blizny" value="1/5" />
        </View>
      </Card>

      <InfoNote icon={plan.adapted ? 'info' : 'trending-up'}>
        <T w={800} size={13}>
          {plan.headline}
        </T>{' '}
        {plan.reason}
      </InfoNote>

      <Card shadow style={{ padding: 18, gap: 12, borderRadius: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Serif size={19}>Dziś możesz</Serif>
          <T w={600} size={13} color={C.muted}>
            {plan.minutes} min
          </T>
        </View>
        <T size={14} color={C.body}>
          {plan.title}: {plan.exercises.slice(0, 3).map((e) => e.name.toLowerCase()).join(', ')}
          {plan.exercises.length > 3 ? ` i ${plan.exercises.length - 3} inne.` : '.'}
        </T>
        {doneCount > 0 && (
          <View style={{ gap: 6 }}>
            <ProgressBar pct={(doneCount / plan.exercises.length) * 100} />
            <T w={600} size={12} color={C.muted}>
              Wykonane {doneCount} z {plan.exercises.length}
            </T>
          </View>
        )}
        <Btn label={doneCount > 0 ? 'Kontynuuj' : 'Zaczynamy'} variant="dark" height={48} onPress={() => go('Exercises')} />
      </Card>
    </Screen>
  );
}

export function NoVisit() {
  const { go, setVisitDone, tab, toast } = useApp();
  return (
    <Screen tabs stop>
      <View style={{ gap: 2 }}>
        <T size={13} color={C.muted}>
          5. tydzień po porodzie · połóg
        </T>
        <Serif size={28}>Dzień dobry, Kasia</Serif>
      </View>
      <View style={{ backgroundColor: C.primary, borderRadius: 24, padding: 18, gap: 10 }}>
        <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="calendar" size={22} color={C.white} />
        </View>
        <Serif size={22} color={C.white}>
          Zacznijmy od wizyty kontrolnej
        </Serif>
        <T size={13.5} color={C.white}>
          Zwykle odbywa się około 6 tygodni po porodzie. Lekarz oceni gojenie, a my dopasujemy plan do wyniku.
        </T>
        <Btn label="Przygotuj pytania na wizytę" variant="white" height={46} style={{ borderColor: C.white }} onPress={() => tab('Report')} />
      </View>
      <Card shadow>
        <Serif size={19}>Na razie możesz</Serif>
        <View style={{ gap: 8 }}>
          <Bullet>Spokojne spacery, stopniowo dłuższe</Bullet>
          <Bullet>Oddech przeponowy w leżeniu lub siedzeniu</Bullet>
          <Bullet>Odpoczynek i zmiana pozycji w ciągu dnia</Bullet>
        </View>
        <T size={12} color={C.muted}>
          Jeśli coś Cię niepokoi, skonsultuj się z lekarzem lub położną.
        </T>
      </Card>
      <View style={{ backgroundColor: C.soft, borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="lock" size={18} color={C.deep} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T w={700}>Pełny plan ćwiczeń</T>
          <T size={12} color={C.body}>
            Odblokuje się po wizycie kontrolnej
          </T>
        </View>
        <Pressable
          onPress={() => {
            tap();
            setVisitDone(true);
            toast('Super! Plan ćwiczeń odblokowany');
            tab('Home');
          }}
        >
          <T w={700} size={13} color={C.deep} style={{ textDecorationLine: 'underline' }}>
            Byłam już
          </T>
        </Pressable>
      </View>
      <Pressable onPress={() => go('Timeline')}>
        <T w={600} size={12.5} color={C.muted} style={{ textAlign: 'center' }}>
          Progresja oparta na bramkach, nie na kalendarzu
        </T>
      </Pressable>
    </Screen>
  );
}

export function Exercises() {
  const { go, mood, energy, sleep, done, setDone, toast } = useApp();
  const plan = planFor(mood, energy, sleep);
  const n = plan.exercises.length;
  const doneCount = plan.exercises.filter((_, i) => done[i]).length;
  return (
    <Screen tabs stop>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <View style={{ gap: 4, flex: 1 }}>
          <T w={600} size={13} color={C.muted}>
            Dzisiejsza sesja · {plan.minutes} min
          </T>
          <Serif size={28}>{plan.title}</Serif>
        </View>
        <Pressable
          onPress={() => {
            tap();
            go('ExerciseAI');
          }}
          style={{ height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: C.ink, flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <MaterialCommunityIcons name="creation" size={15} color={C.white} />
          <T w={700} size={13} color={C.white}>
            Ćwicz z AI
          </T>
        </Pressable>
      </View>
      <View style={{ backgroundColor: C.white, borderRadius: 18, padding: 14, gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T w={700} size={13}>
            Wykonane
          </T>
          <T w={700} size={13} color={C.deep}>
            {doneCount} z {n}
          </T>
        </View>
        <ProgressBar pct={(doneCount / n) * 100} />
      </View>
      <View style={{ gap: 8 }}>
        {plan.exercises.map((e, i) => {
          const on = !!done[i];
          return (
            <Pressable
              key={e.name}
              onPress={() => {
                tap();
                const next = Array.from({ length: Math.max(done.length, n) }, (_, k) => !!done[k]);
                next[i] = !on;
                setDone(next);
                if (!on && next.slice(0, n).every(Boolean)) toast('Sesja ukończona! Brawo, Kasia 🌸');
              }}
              onLongPress={() => go('ExerciseAI')}
              style={{
                flexDirection: 'row',
                gap: 12,
                alignItems: 'center',
                padding: 12,
                paddingHorizontal: 14,
                borderRadius: 18,
                backgroundColor: C.white,
                borderWidth: 2,
                borderColor: on ? C.pink : C.white,
                opacity: on ? 0.75 : 1,
              }}
            >
              <CheckCircle on={on} />
              <View style={{ flex: 1, gap: 3 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <T w={700} size={15} style={{ flex: 1 }}>
                    {e.name}
                  </T>
                  <T w={600} size={12} color={C.muted}>
                    {e.min}
                  </T>
                </View>
                <T size={12} color={C.muted}>
                  {e.why}
                </T>
              </View>
            </Pressable>
          );
        })}
      </View>
      {plan.skipped && (
        <InfoNote icon="slash">
          <T w={800} size={13}>
            Pominięte dziś:
          </T>{' '}
          {plan.skipped}
        </InfoNote>
      )}
    </Screen>
  );
}

export function Timeline() {
  const { tab } = useApp();
  const Dot = ({ kind }: { kind: 'done' | 'now' | 'locked' }) =>
    kind === 'done' ? (
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.primary }} />
    ) : kind === 'now' ? (
      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.white, borderWidth: 5, borderColor: C.primary }} />
    ) : (
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.white, borderWidth: 2, borderColor: C.radio }} />
    );
  const Line = () => <View style={{ width: 2, flex: 1, backgroundColor: C.chipBorder }} />;
  const Gate = ({ label, title, last }: { label: string; title: string; last?: boolean }) => (
    <View style={{ flexDirection: 'row', gap: 14 }}>
      <View style={{ width: 20, alignItems: 'center' }}>
        <Dot kind="locked" />
        {!last && <Line />}
      </View>
      <View style={{ paddingBottom: 14, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Feather name="lock" size={12} color={C.muted} />
          <T w={700} size={12} color={C.muted}>
            {label}
          </T>
        </View>
        <T w={600}>{title}</T>
      </View>
    </View>
  );
  return (
    <Screen tabs stop gap={16}>
      <View style={{ gap: 4 }}>
        <T w={600} size={13} color={C.muted}>
          Twój powrót do formy
        </T>
        <Serif size={28}>Twoje ciało</Serif>
      </View>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
          <View style={{ flex: 1, height: 10, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, backgroundColor: C.primary }} />
          <View style={{ flex: 1, height: 10, backgroundColor: C.pink2 }}>
            <View style={{ position: 'absolute', left: '33%', top: -6, marginLeft: -11, width: 22, height: 22, borderRadius: 11, backgroundColor: C.white, borderWidth: 4, borderColor: C.primary }} />
          </View>
          <View style={{ flex: 1, height: 10, borderTopRightRadius: 5, borderBottomRightRadius: 5, backgroundColor: C.pink }} />
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {['Połóg · 0 do 6 tyg.', 'Odbudowa · 6 do 12', 'Powrót · 12+'].map((l) => (
            <T key={l} w={700} size={11} color={C.muted} style={{ flex: 1 }}>
              {l}
            </T>
          ))}
        </View>
      </View>
      <View>
        <View style={{ flexDirection: 'row', gap: 14, opacity: 0.6 }}>
          <View style={{ width: 20, alignItems: 'center' }}>
            <Dot kind="done" />
            <Line />
          </View>
          <View style={{ paddingBottom: 14, gap: 2 }}>
            <T w={700} size={12} color={C.muted}>
              Tydzień 6 · zaliczone
            </T>
            <T w={600}>Wizyta kontrolna po porodzie</T>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <View style={{ width: 20, alignItems: 'center' }}>
            <Dot kind="now" />
            <Line />
          </View>
          <View style={{ paddingBottom: 16, flex: 1 }}>
            <Card style={{ ...shadowCard, shadowOpacity: 0.12, shadowRadius: 18 }}>
              <View style={{ alignSelf: 'flex-start', backgroundColor: C.primary, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 }}>
                <T w={800} size={11} color={C.white} style={{ letterSpacing: 0.5 }}>
                  JESTEŚ TUTAJ · TYDZIEŃ 8
                </T>
              </View>
              <View style={{ gap: 4 }}>
                <T w={800} size={12} color={C.deep}>
                  W Twoim ciele
                </T>
                <T size={13.5}>Blizna z zewnątrz jest zagojona, ale głębsze tkanki wciąż się odbudowują. Dno miednicy i mięśnie brzucha są osłabione.</T>
              </View>
              <View style={{ gap: 4 }}>
                <T w={800} size={12} color={C.deep}>
                  Co to znaczy dla ruchu
                </T>
                <T size={13.5}>Mięśnie głębokie i oddech. Jeszcze bez brzuszków, skoków i dźwigania.</T>
              </View>
              <Pressable onPress={() => tab('Report')}>
                <T w={700} size={13} color={C.deep} style={{ textDecorationLine: 'underline' }}>
                  Umów ocenę u fizjoterapeutki uroginekologicznej
                </T>
              </Pressable>
            </Card>
          </View>
        </View>
        <Gate label="Od tygodnia 12" title="Testy gotowości do biegania" />
        <Gate label="Po testach" title="Powrót do pełnego treningu" last />
      </View>
      <View style={{ backgroundColor: C.soft, borderRadius: 18, padding: 14, gap: 6 }}>
        <T w={800} size={12} color={C.deep}>
          Bramki, nie kalendarz
        </T>
        <T size={13}>
          Bieganie odblokuje się dopiero, gdy zaliczysz testy: 1 min biegu w miejscu, 10 podskoków i 10 wykroków bez bólu, ciężkości i popuszczania.
        </T>
      </View>
    </Screen>
  );
}
