import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { C, shadowCard } from '../theme';
import { useApp } from '../state';
import { BackButton, Btn, Card, Face, ProgressBar, Screen, Segmented, Serif, T, tap, Toggle } from '../ui';

const ROWS = [
  { label: 'Powiadomienia STOP', desc: 'Gdy naciśniesz STOP' },
  { label: 'Samopoczucie', desc: 'Nastrój i energia z check-inu' },
  { label: 'Ćwiczenia', desc: 'Co dziś zrobiłaś' },
  { label: 'Oś czasu', desc: 'Twój etap powrotu do formy' },
  { label: 'Raporty', desc: 'PDF przed wizytą' },
];
const PRESETS: Record<string, boolean[]> = {
  'Tylko STOP': [true, false, false, false, false],
  Wybrane: [true, true, false, true, false],
  Wszystko: [true, true, true, true, true],
};
const PRESET_NAMES = ['Tylko STOP', 'Wybrane', 'Wszystko'];

const summaryOf = (a: boolean[]) => (a.every(Boolean) ? 'Wszystko' : a[0] && a.slice(1).every((x) => !x) ? 'Tylko STOP' : a.some(Boolean) ? 'Wybrane' : 'Brak');

export function Circle() {
  const { people, setPeople, toast, go } = useApp();
  const [sel, setSel] = useState(0);
  const p = people[sel];
  const setOn = (on: boolean[]) => setPeople(people.map((x, i) => (i === sel ? { ...x, on } : x)));
  const cur = summaryOf(p.on);
  return (
    <Screen tabs gap={12}>
      <View style={{ gap: 4 }}>
        <T w={600} size={13} color={C.muted}>
          Bliskie osoby, które wspierasz informacjami
        </T>
        <Serif size={28}>Krąg wsparcia</Serif>
      </View>
      <View style={{ gap: 8 }}>
        {people.map((x, i) => (
          <Pressable
            key={x.name}
            onPress={() => {
              tap();
              setSel(i);
            }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 18, backgroundColor: C.white, borderWidth: 2, borderColor: sel === i ? C.primary : C.white }}
          >
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: x.bg, alignItems: 'center', justifyContent: 'center' }}>
              <T w={700} size={16} color={x.fg}>
                {x.initial}
              </T>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T w={700} size={15}>
                {x.name}
              </T>
              <T w={600} size={12} color={C.muted}>
                {x.role}
              </T>
            </View>
            <View style={{ backgroundColor: C.soft, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 }}>
              <T w={700} size={12} color={C.deep}>
                {summaryOf(x.on)}
              </T>
            </View>
          </Pressable>
        ))}
        <Pressable
          onPress={() => {
            tap();
            if (people.length < 3) {
              setPeople([...people, { name: 'Mama', role: 'Mama', initial: 'M', bg: C.soft, fg: C.deep, on: [true, false, false, false, false] }]);
              toast('Zaproszenie wysłane SMS-em');
            } else toast('Zaproszenie już wysłane');
          }}
          style={{ height: 46, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: C.radio, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <Feather name="plus" size={16} color={C.deep} />
          <T w={700} color={C.deep}>
            Zaproś bliską osobę
          </T>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 4 }}>
        <Serif size={19}>Co widzi {p.name}</Serif>
        <Pressable
          onPress={() => {
            tap();
            setOn([false, false, false, false, false]);
            toast(`${p.name} nie widzi już Twoich danych`);
          }}
          style={{ paddingVertical: 8 }}
        >
          <T w={700} size={13} color={C.deep}>
            Odbierz dostęp
          </T>
        </Pressable>
      </View>
      <Segmented options={PRESET_NAMES} value={PRESET_NAMES.indexOf(cur)} onChange={(i) => setOn(PRESETS[PRESET_NAMES[i]].slice())} />
      <View style={{ backgroundColor: C.white, borderRadius: 22, paddingVertical: 2, paddingHorizontal: 16 }}>
        {ROWS.map((r, i) => (
          <View key={r.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: i < ROWS.length - 1 ? 1 : 0, borderBottomColor: C.divider }}>
            <View style={{ flex: 1, gap: 1 }}>
              <T w={700}>{r.label}</T>
              <T size={12} color={C.muted}>
                {r.desc}
              </T>
            </View>
            <Toggle
              on={p.on[i]}
              onPress={() => {
                const n = p.on.slice();
                n[i] = !n[i];
                setOn(n);
              }}
            />
          </View>
        ))}
      </View>
      {sel === 0 && (
        <Pressable onPress={() => go('PartnerView')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8 }}>
          <Feather name="eye" size={14} color={C.deep} />
          <T w={700} size={13} color={C.deep}>
            Zobacz, jak to widzi Tomek
          </T>
        </Pressable>
      )}
    </Screen>
  );
}

const WEEK = [4, 3, 4, 3, 3, 2, 2];

export function PartnerView() {
  const { people, stopActive, stopEvents, mood, energy, sleep, done, toast, reset, stack, back } = useApp();
  const tomek = people[0];
  const all = tomek.on.every(Boolean);
  const [, see, exercises, timeline, reports] = tomek.on;
  const alert = stopActive || stopEvents > 1;
  const low = mood >= 3 || energy <= 2 || sleep <= 2;
  const doneCount = done.slice(0, 5).filter(Boolean).length;
  const moodLine = low ? 'Kasia czuje się słabiej' : 'Kasia ma dziś dobry dzień';
  return (
    <Screen gap={12} padTop={8}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
          <BackButton onPress={() => (stack.length > 1 ? back() : reset('Login'))} />
          <View style={{ gap: 2 }}>
            <T size={13} color={C.muted}>
              {all ? 'Kasia udostępnia Ci wszystko' : 'Krąg wsparcia Kasi'}
            </T>
            <Serif size={28}>Cześć, Tomek</Serif>
          </View>
        </View>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}>
          <T w={700} size={16} color={C.white}>
            T
          </T>
        </View>
      </View>

      {alert && tomek.on[0] && (
        <View style={{ backgroundColor: C.deep, borderRadius: 22, padding: 16, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} size={10} color={C.deep} style={{ letterSpacing: 0.5 }}>
                STOP
              </T>
            </View>
            <T w={800} size={16} color={C.white}>
              Kasia nacisnęła STOP
            </T>
          </View>
          <T size={13.5} color={C.white}>
            Dziś, przed chwilą. Zadzwoń do niej i sprawdź, czy potrzebuje pomocy.
          </T>
          <Btn label="Zadzwoń do Kasi" variant="white" height={48} style={{ borderColor: C.white }} onPress={() => Linking.openURL('tel:+48000000000')} />
        </View>
      )}

      {see ? (
        <View style={{ backgroundColor: C.primary, borderRadius: 22, padding: 16, gap: 10 }}>
          {!all && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T w={600} size={13} color={C.white} style={{ opacity: 0.9 }}>
                Etap: odbudowa
              </T>
              <T w={600} size={13} color={C.white}>
                8. tydzień po porodzie
              </T>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.pinkTint, alignItems: 'center', justifyContent: 'center' }}>
              <Face mood={mood} />
            </View>
            <View style={{ gap: 2, flex: 1 }}>
              <Serif size={21} color={C.white}>
                {moodLine}
              </Serif>
              <T size={13} color={C.white}>
                {all ? `Energia ${energy}/5 · Sen ${sleep}/5 · Ból blizny 1/5` : low ? 'Mało snu, niska energia' : 'Dobrze spała, ma energię'}
              </T>
            </View>
          </View>
        </View>
      ) : (
        <Card>
          <T w={700}>Kasia udostępnia Ci tylko powiadomienia STOP</T>
          <T size={13} color={C.muted}>
            Dostaniesz powiadomienie, gdy będzie potrzebowała wsparcia.
          </T>
        </Card>
      )}

      {see && all && (
        <Card shadow style={{ paddingVertical: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T w={800}>Samopoczucie</T>
            <T w={600} size={12} color={C.muted}>
              ostatnie 7 dni
            </T>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 54 }}>
            {WEEK.map((v, i) => (
              <View key={i} style={{ flex: 1, height: `${v * 20}%`, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderRadius: 3, backgroundColor: i === WEEK.length - 1 ? C.deep : v >= 4 ? C.primary : C.pink2 }} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'].map((d) => (
              <T key={d} w={700} size={10} color={C.muted} style={{ flex: 1, textAlign: 'center' }}>
                {d}
              </T>
            ))}
          </View>
        </Card>
      )}

      {exercises && (
        <Card shadow style={{ paddingVertical: 14, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T w={800}>Ćwiczenia dziś</T>
            <T w={700} size={12} color={C.deep}>
              {doneCount} z 5
            </T>
          </View>
          <ProgressBar pct={doneCount * 20} />
          <T size={12.5} color={C.body}>
            Łagodna odbudowa, 15 min. W tym tygodniu 4 sesje.
          </T>
        </Card>
      )}

      {timeline ? (
        <Card shadow style={{ paddingVertical: 14, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T w={800}>Oś czasu</T>
            <T w={600} size={12} color={C.muted}>
              8. tydzień po porodzie
            </T>
          </View>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <View style={{ flex: 1, height: 8, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, backgroundColor: C.primary }} />
            <View style={{ flex: 1, height: 8, backgroundColor: C.pink2 }}>
              <View style={{ position: 'absolute', left: '33%', top: -5, marginLeft: -9, width: 18, height: 18, borderRadius: 9, backgroundColor: C.white, borderWidth: 4, borderColor: C.primary }} />
            </View>
            <View style={{ flex: 1, height: 8, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: C.pink }} />
          </View>
          <T size={12.5} color={C.body}>
            Etap odbudowy. Bez dźwigania i skoków. Następna bramka: testy biegania od 12. tygodnia.
          </T>
        </Card>
      ) : null}

      {!all && timeline && (
        <View style={{ backgroundColor: C.soft, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 14, gap: 4 }}>
          <T w={800} size={12} color={C.deep}>
            Warto wiedzieć na tym etapie
          </T>
          <T size={13}>Kasia nie powinna jeszcze dźwigać ciężkich rzeczy. Fotelik i zakupy to dobra okazja, żeby wkroczyć.</T>
        </View>
      )}

      {reports && (
        <View style={{ backgroundColor: C.white, borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, ...shadowCard }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="file-text" size={20} color={C.deep} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <T w={700}>Raport na wizytę</T>
            <T size={12} color={C.muted}>
              Fizjoterapeutka · 10 października
            </T>
          </View>
          <Btn label="Otwórz" variant="outline" height={40} onPress={() => toast('Otwieranie raportu…')} />
        </View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 }}>
        <Feather name={tomek.on[0] ? 'bell' : 'lock'} size={14} color={C.muted} />
        <T size={12} color={C.muted} style={{ flex: 1 }}>
          {all
            ? 'Powiadomienia STOP włączone. Kasia może zmienić dostęp w każdej chwili.'
            : 'Ćwiczenia i raporty są prywatne. Kasia decyduje, co udostępnia.'}
        </T>
      </View>
    </Screen>
  );
}
