import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, useWindowDimensions, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { useApp } from '../state';
import { BackButton, Btn, CheckBox, Chip, Logo, Screen, Segmented, Serif, T, tap } from '../ui';

const SECTIONS = [
  { label: 'Dane o porodzie', desc: 'Sposób i data porodu, wizyta kontrolna' },
  { label: 'Samopoczucie', desc: 'Wykres z codziennych check-inów' },
  { label: 'Dolegliwości', desc: 'Jak często i jak mocno' },
  { label: 'Wykonane ćwiczenia', desc: 'Sesje, czas i uwagi' },
  { label: 'Zdarzenia STOP', desc: 'Data, objawy, co się działo' },
  { label: 'Moje pytania', desc: 'Lista na wizytę' },
];
const WHO = ['Ginekolog', 'Fizjoterapeutka', 'Położna', 'Inny specjalista'];
const MOOD_VALS = [4, 4, 3, 5, 4, 2, 1, 3, 4, 4, 5, 4, 3, 2];
const barColor = (v: number, i: number) => (i === 6 ? C.deep : v >= 4 ? C.primary : C.pink2);

function Steps({ step }: { step: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {['1. Wybierz dane', '2. Podgląd', '3. Wyślij'].map((l, i) => (
        <View key={l} style={{ flex: 1, gap: 5 }}>
          <View style={{ height: 4, borderRadius: 2, backgroundColor: i <= step ? C.primary : C.pink }} />
          <T w={700} size={11} color={i === step ? C.deep : C.muted}>
            {l}
          </T>
        </View>
      ))}
    </View>
  );
}

export function Report() {
  const { go, reportSections, setReportSections, questions, setQuestions } = useApp();
  const [who, setWho] = useState(1);
  const [range, setRange] = useState(1);
  const [q, setQ] = useState('');
  const count = reportSections.filter(Boolean).length;
  const addQ = () => {
    if (!q.trim()) return;
    setQuestions([...questions, q.trim()]);
    setQ('');
  };
  return (
    <Screen tabs>
      <Steps step={0} />
      <View style={{ gap: 4 }}>
        <T w={600} size={13} color={C.muted}>
          Wizyta · 10 października
        </T>
        <Serif size={28}>Przygotuj raport</Serif>
      </View>
      <View style={{ gap: 8 }}>
        <T w={700}>Dla kogo?</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {WHO.map((l, i) => (
            <Chip key={l} label={l} selected={who === i} onPress={() => setWho(i)} />
          ))}
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <T w={700}>Z jakiego okresu?</T>
        <Segmented options={['7 dni', '14 dni', '30 dni']} value={range} onChange={setRange} />
      </View>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <T w={700}>Co uwzględnić?</T>
          <T w={600} size={12} color={C.muted}>
            {count} z 6
          </T>
        </View>
        <View style={{ backgroundColor: C.white, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 14 }}>
          {SECTIONS.map((s, i) => (
            <Pressable
              key={s.label}
              onPress={() => {
                tap();
                const n = reportSections.slice();
                n[i] = !n[i];
                setReportSections(n);
              }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: i < SECTIONS.length - 1 ? 1 : 0, borderBottomColor: C.divider }}
            >
              <CheckBox on={reportSections[i]} />
              <View style={{ flex: 1, gap: 1 }}>
                <T w={700}>{s.label}</T>
                <T size={11.5} color={C.muted}>
                  {s.desc}
                </T>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={{ backgroundColor: C.white, borderRadius: 20, padding: 14, gap: 8 }}>
        <T w={700}>Moje pytania</T>
        <View style={{ gap: 6 }}>
          {questions.map((x, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
              <T w={800} size={13} color={C.primary}>
                {i + 1}.
              </T>
              <T size={13} style={{ flex: 1 }}>
                {x}
              </T>
            </View>
          ))}
        </View>
        <T w={600} size={12} color={C.muted}>
          Dopisz pytanie
        </T>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            value={q}
            onChangeText={setQ}
            onSubmitEditing={addQ}
            returnKeyType="done"
            placeholder="np. czy mogę już robić brzuszki?"
            placeholderTextColor={C.disabled}
            style={{ flex: 1, height: 44, borderRadius: 14, borderWidth: 1.5, borderColor: C.chipBorder, paddingHorizontal: 12, fontFamily: F.w500, fontSize: 13, color: C.ink, backgroundColor: C.bg }}
          />
          <Pressable onPress={addQ} style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: q.trim() ? C.primary : C.pink, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="plus" size={20} color={C.white} />
          </Pressable>
        </View>
      </View>
      <Btn label="Przygotuj PDF" icon="file-text" onPress={() => go('ReportReady')} />
      <T size={11} color={C.muted} style={{ textAlign: 'center' }}>
        Raport dla: {WHO[who].toLowerCase()} · {['7', '14', '30'][range]} dni
      </T>
    </Screen>
  );
}

function FakeQR({ size = 200 }: { size?: number }) {
  const n = 25;
  const cells: React.ReactNode[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const finder = (x: number, y: number) => (cx: number, cy: number) => {
    const dx = cx - x;
    const dy = cy - y;
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null;
    return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
  };
  const fs = [finder(0, 0), finder(n - 7, 0), finder(0, n - 7)];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      let on: boolean | null = null;
      for (const f of fs) {
        const r = f(x, y);
        if (r !== null) on = r;
      }
      if (on === null) on = rnd() > 0.52;
      if (on) cells.push(<Rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={C.ink} />);
    }
  return (
    <Svg width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`}>
      <Rect x={-1} y={-1} width={n + 2} height={n + 2} fill={C.white} />
      {cells}
    </Svg>
  );
}

export function ReportReady() {
  const { go, toast } = useApp();
  const [sent, setSent] = useState(false);
  const [qr, setQr] = useState(false);
  return (
    <Screen padTop={8}>
      <Steps step={sent ? 2 : 1} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <BackButton />
        <Serif size={26}>Raport gotowy</Serif>
      </View>
      <Pressable
        onPress={() => {
          tap();
          go('ReportPdf');
        }}
        style={{ alignSelf: 'center', width: 210, height: 297, backgroundColor: C.white, borderRadius: 6, padding: 14, paddingTop: 16, gap: 8, shadowColor: C.ink, shadowOpacity: 0.14, shadowRadius: 32, shadowOffset: { width: 0, height: 12 }, elevation: 8 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: C.primary }} />
            <Serif size={10}>Bloom</Serif>
          </View>
          <T size={6} color={C.muted} style={{ lineHeight: 8 }}>
            str. 1 z 2
          </T>
        </View>
        <View style={{ height: 2, backgroundColor: C.primary }} />
        <Serif size={9.5}>Raport aktywności i samopoczucia po porodzie</Serif>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
          {[100, 100, 70, 60].map((w, i) => (
            <View key={i} style={{ width: '48%' }}>
              <View style={{ width: `${w}%`, height: 4, backgroundColor: C.divider, borderRadius: 2 }} />
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={{ flex: 1, height: 22, backgroundColor: C.softer, borderRadius: 3 }} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 46 }}>
          {MOOD_VALS.map((v, i) => (
            <View key={i} style={{ flex: 1, height: `${v * 20}%`, backgroundColor: barColor(v, i), borderTopLeftRadius: 2, borderTopRightRadius: 2 }} />
          ))}
        </View>
        <View style={{ gap: 3 }}>
          {[100, 100, 80, 100, 55].map((w, i) => (
            <View key={i} style={{ width: `${w}%`, height: 4, backgroundColor: C.divider, borderRadius: 2 }} />
          ))}
        </View>
        <View style={{ position: 'absolute', right: -8, bottom: -8, backgroundColor: C.ink, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 }}>
          <T w={700} size={11} color={C.white}>
            Podgląd
          </T>
        </View>
      </Pressable>
      <View style={{ alignItems: 'center', gap: 2 }}>
        <T w={700}>Bloom_raport_2026-10-10.pdf</T>
        <T w={600} size={12} color={C.muted}>
          2 strony · dla fizjoterapeutki · 21.09 do 04.10
        </T>
      </View>
      {sent && (
        <View style={{ backgroundColor: C.soft, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="check" size={15} color={C.white} />
          </View>
          <T w={600} size={13}>
            Wysłano do gabinetu Fizjo Mama, Kraków
          </T>
        </View>
      )}
      <View style={{ marginTop: 'auto', gap: 8 }}>
        <Btn
          label={sent ? 'Wysłano ✓' : 'Wyślij e-mailem do gabinetu'}
          icon={sent ? undefined : 'send'}
          onPress={() => {
            setSent(true);
            toast('Raport wysłany do gabinetu');
          }}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Btn label="Pobierz" icon="download" variant="outline" height={48} style={{ flex: 1 }} onPress={() => toast('Zapisano w Plikach')} />
          <Btn label="Kod QR" icon="grid" variant="outline" height={48} style={{ flex: 1 }} onPress={() => setQr(true)} />
        </View>
        <T size={11.5} color={C.muted} style={{ textAlign: 'center' }}>
          Raport zawiera tylko dane, które wybrałaś. Kod QR pokażesz w gabinecie, a link wygaśnie po 7 dniach.
        </T>
      </View>
      <Modal visible={qr} transparent animationType="fade" onRequestClose={() => setQr(false)}>
        <Pressable onPress={() => setQr(false)} style={{ flex: 1, backgroundColor: 'rgba(58,20,40,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: C.white, borderRadius: 28, padding: 24, alignItems: 'center', gap: 12, width: '100%' }}>
            <Serif size={22}>Pokaż w gabinecie</Serif>
            <FakeQR size={220} />
            <T size={12.5} color={C.muted} style={{ textAlign: 'center' }}>
              Specjalista zeskanuje kod i zobaczy raport. Link wygaśnie po 7 dniach.
            </T>
            <Btn label="Zamknij" variant="dark" height={46} style={{ alignSelf: 'stretch' }} onPress={() => setQr(false)} />
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

/* ---------- PDF ---------- */

function PdfHeader({ right }: { right: React.ReactNode }) {
  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Logo size={26} />
          <Serif size={20}>Bloom</Serif>
        </View>
        <View style={{ alignItems: 'flex-end' }}>{right}</View>
      </View>
      <View style={{ height: 3, backgroundColor: C.primary, borderRadius: 2 }} />
    </>
  );
}

function H2({ n, children }: { n?: number; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {n !== undefined && (
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} size={10.5} color={C.white} style={{ lineHeight: 13 }}>
            {n}
          </T>
        </View>
      )}
      <T w={800} size={12.5} color={n === undefined ? C.muted : C.ink}>
        {children}
      </T>
    </View>
  );
}

function Table({ cols, head, rows }: { cols: number[]; head: string[]; rows: React.ReactNode[][] }) {
  return (
    <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 10, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: C.softer }}>
        {head.map((h, i) => (
          <T key={h} w={800} size={9.5} color={C.muted} style={{ flex: cols[i], letterSpacing: 0.3 }}>
            {h}
          </T>
        ))}
      </View>
      {rows.map((r, ri) => (
        <View key={ri} style={{ flexDirection: 'row', gap: 8, paddingVertical: 7, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: C.divider }}>
          {r.map((c, i) => (
            <View key={i} style={{ flex: cols[i] }}>
              {typeof c === 'string' ? (
                <T w={i === 0 ? 700 : 500} size={10.5}>
                  {c}
                </T>
              ) : (
                c
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return <View style={{ width: 595, height: 842, backgroundColor: C.white, paddingVertical: 40, paddingHorizontal: 44, gap: 16 }}>{children}</View>;
}

function Scaled({ scale, children }: { scale: number; children: React.ReactNode }) {
  return (
    <View style={{ width: 595 * scale, height: 842 * scale, overflow: 'hidden', borderRadius: 6, shadowColor: C.ink, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4, backgroundColor: C.white }}>
      <View style={{ width: 595, height: 842, transform: [{ scale }], transformOrigin: 'top left' }}>{children}</View>
    </View>
  );
}

export function ReportPdf() {
  const { reportSections: on, questions, stopEvents } = useApp();
  const { width } = useWindowDimensions();
  const ins = useSafeAreaInsets();
  const [zoom, setZoom] = useState(false);
  const scale = zoom ? 1 : (width - 32) / 595;
  let n = 0;
  const num = () => ++n;
  const field = (k: string, v: string) => (
    <T key={k} size={11} style={{ width: '48%' }}>
      <T size={11} color={C.muted}>
        {k}:
      </T>{' '}
      <T w={800} size={11}>
        {v}
      </T>
    </T>
  );
  return (
    <View style={{ flex: 1, backgroundColor: '#EDE6E9' }}>
      <View style={{ paddingTop: ins.top + 8, paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <BackButton />
        <View style={{ flex: 1 }}>
          <T w={700}>Bloom_raport_2026-10-10.pdf</T>
          <T size={12} color={C.muted}>
            2 strony · stuknij, aby {zoom ? 'dopasować' : 'powiększyć'}
          </T>
        </View>
      </View>
      <ScrollView horizontal={false} contentContainerStyle={{ alignItems: 'center', gap: 16, paddingBottom: 40 + ins.bottom }}>
        <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 16, flexDirection: 'column', gap: 16 }} scrollEnabled={zoom}>
          <Pressable onPress={() => setZoom(!zoom)}>
            <Scaled scale={scale}>
              <Page>
                <PdfHeader
                  right={
                    <>
                      <T w={800} size={10}>
                        Raport przed wizytą
                      </T>
                      <T size={10} color={C.muted}>
                        Wygenerowano 04.10.2026 · str. 1 z 2
                      </T>
                    </>
                  }
                />
                <Serif size={22}>Raport aktywności i samopoczucia po porodzie</Serif>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 6, columnGap: 18, backgroundColor: C.bg, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14 }}>
                  {field('Pacjentka', 'Katarzyna K.')}
                  {field('Dla', 'fizjoterapeutka uroginekologiczna')}
                  {on[0] && field('Poród', 'cesarskie cięcie, 08.08.2026')}
                  {field('Wizyta', '10.10.2026')}
                  {on[0] && field('Czas od porodu', '8 tyg. 1 dzień')}
                  {field('Okres raportu', '21.09 do 04.10.2026')}
                  {on[0] && field('Wizyta kontrolna', '19.09.2026, bez przeciwwskazań')}
                  {field('Cel pacjentki', 'powrót do biegania')}
                </View>
                <View style={{ gap: 8 }}>
                  <H2 n={num()}>Podsumowanie</H2>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {[
                      ['9', 'sesji ćwiczeń'],
                      ['142', 'minuty ruchu'],
                      ['3,4 / 5', 'śr. samopoczucie'],
                      [String(stopEvents), stopEvents === 1 ? 'zdarzenie STOP' : 'zdarzenia STOP'],
                    ].map(([v, l], i) => (
                      <View key={l} style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 10, gap: 2 }}>
                        <Serif size={22} color={i === 3 ? C.deep : C.ink}>
                          {v}
                        </Serif>
                        <T w={600} size={10} color={C.muted}>
                          {l}
                        </T>
                      </View>
                    ))}
                  </View>
                </View>
                {on[1] && (
                  <View style={{ gap: 8 }}>
                    <H2 n={num()}>Samopoczucie (codzienny check-in, skala 1 do 5)</H2>
                    <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingTop: 12, paddingHorizontal: 14, paddingBottom: 8, gap: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 96 }}>
                        {MOOD_VALS.map((v, i) => (
                          <View key={i} style={{ flex: 1, height: `${v * 20}%`, backgroundColor: barColor(v, i), borderTopLeftRadius: 4, borderTopRightRadius: 4, borderRadius: 2 }} />
                        ))}
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {['21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '1', '2', '3', '4'].map((d) => (
                          <T key={d} w={600} size={8.5} color={C.muted} style={{ flex: 1, textAlign: 'center' }}>
                            {d}
                          </T>
                        ))}
                      </View>
                      <View style={{ flexDirection: 'row', gap: 14 }}>
                        {[
                          [C.primary, 'dobrze (4 do 5)'],
                          [C.pink2, 'średnio lub słabo'],
                          [C.deep, 'dzień ze zdarzeniem STOP'],
                        ].map(([c, l]) => (
                          <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: c }} />
                            <T size={9.5} color={C.body}>
                              {l}
                            </T>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                )}
                {on[2] && (
                  <View style={{ gap: 8 }}>
                    <H2 n={num()}>Zgłaszane dolegliwości</H2>
                    <Table
                      cols={[1.3, 1, 1.6, 0.8]}
                      head={['DOLEGLIWOŚĆ', 'CZĘSTOŚĆ', 'KIEDY WYSTĘPUJE', 'TREND']}
                      rows={[
                        ['Nietrzymanie moczu', '5 z 14 dni', 'przy kaszlu i podnoszeniu dziecka', <T w={700} size={10.5} color={C.deep}>maleje</T>],
                        ['Ból blizny', 'śr. 1,4 / 5', 'ciągnięcie przy wstawaniu', <T w={700} size={10.5} color={C.deep}>maleje</T>],
                        ['Przewlekłe zmęczenie', '9 z 14 dni', 'po nocach z mniej niż 5 h snu', <T w={700} size={10.5} color={C.muted}>bez zmian</T>],
                      ]}
                    />
                  </View>
                )}
                <View style={{ marginTop: 'auto', flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: C.divider, paddingTop: 8 }}>
                  <T size={9} color={C.muted}>
                    Dane wprowadzone przez pacjentkę w aplikacji Bloom.
                  </T>
                  <T size={9} color={C.muted}>
                    1 / 2
                  </T>
                </View>
              </Page>
            </Scaled>
          </Pressable>
          <Pressable onPress={() => setZoom(!zoom)}>
            <Scaled scale={scale}>
              <Page>
                <PdfHeader
                  right={
                    <>
                      <T w={800} size={10}>
                        Katarzyna K. · 21.09 do 04.10.2026
                      </T>
                      <T size={10} color={C.muted}>
                        str. 2 z 2
                      </T>
                    </>
                  }
                />
                {on[4] && (
                  <View style={{ gap: 8 }}>
                    <H2 n={num()}>Zdarzenia STOP</H2>
                    <View style={{ borderWidth: 1.5, borderColor: C.deep, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, gap: 5 }}>
                      {[
                        ['Data i godzina', '27.09.2026, 18:42'],
                        ['Podczas', 'ćwiczenia „ręka i noga w klęku”, 9. minuta sesji'],
                        ['Objawy', 'zawroty głowy, uczucie osłabienia'],
                        ['Przebieg', 'ustąpiły po ok. 10 minutach odpoczynku, bez kontaktu z lekarzem; poprzedniej nocy ok. 4 h snu'],
                      ].map(([k, v], i) => (
                        <View key={k} style={{ flexDirection: 'row', gap: 12 }}>
                          <T w={600} size={10.5} color={C.muted} style={{ width: 110 }}>
                            {k}
                          </T>
                          <T w={i === 0 ? 800 : 500} size={10.5} style={{ flex: 1 }}>
                            {v}
                          </T>
                        </View>
                      ))}
                      {stopEvents > 1 && (
                        <T w={700} size={10.5} color={C.deep}>
                          + {stopEvents - 1} {stopEvents - 1 === 1 ? 'nowe zdarzenie' : 'nowe zdarzenia'} dziś (04.10.2026)
                        </T>
                      )}
                    </View>
                  </View>
                )}
                {on[3] && (
                  <View style={{ gap: 8 }}>
                    <H2 n={num()}>Wykonane ćwiczenia</H2>
                    <Table
                      cols={[1.6, 0.6, 1.8]}
                      head={['ĆWICZENIE', 'RAZY', 'UWAGI PACJENTKI']}
                      rows={[
                        ['Oddech z dnem miednicy', '9', 'bez trudności'],
                        ['Koci grzbiet', '9', 'bez trudności'],
                        ['Mostek biodrowy', '7', 'lekkie ciągnięcie blizny (2 razy)'],
                        ['Przysiad do krzesła', '6', 'popuszczanie przy szybkim wstawaniu (1 raz)'],
                        ['Otwarcie klatki piersiowej', '8', 'bez trudności'],
                      ]}
                    />
                  </View>
                )}
                {on[5] && (
                  <View style={{ gap: 8 }}>
                    <H2 n={num()}>Pytania pacjentki</H2>
                    <View style={{ gap: 6 }}>
                      {questions.map((q, i) => (
                        <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                          <T w={800} size={11} color={C.primary}>
                            {i + 1}.
                          </T>
                          <T size={11} style={{ flex: 1 }}>
                            {q}
                          </T>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                <View style={{ gap: 8, flex: 1 }}>
                  <H2>Notatki specjalisty</H2>
                  <View style={{ flex: 1, borderWidth: 1, borderStyle: 'dashed', borderColor: C.radio, borderRadius: 10, padding: 14, justifyContent: 'space-evenly' }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <View key={i} style={{ height: 1, backgroundColor: C.divider }} />
                    ))}
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20, borderTopWidth: 1, borderTopColor: C.divider, paddingTop: 8 }}>
                  <T size={9} color={C.muted} style={{ flex: 1 }}>
                    Raport powstał na podstawie danych wprowadzonych przez pacjentkę w aplikacji Bloom. Nie stanowi dokumentacji medycznej ani diagnozy.
                  </T>
                  <T size={9} color={C.muted}>
                    2 / 2
                  </T>
                </View>
              </Page>
            </Scaled>
          </Pressable>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

