import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { C, F } from '../theme';
import { useApp } from '../state';
import { Btn, Chip, Logo, RadioRow, Screen, Serif, StepHeader, T, tap } from '../ui';

const inputStyle = {
  height: 50,
  borderRadius: 14,
  borderWidth: 2,
  borderColor: C.border,
  backgroundColor: C.white,
  paddingHorizontal: 14,
  fontFamily: F.w600,
  fontSize: 15,
  color: C.ink,
} as const;

export function Login() {
  const { reset, go } = useApp();
  const [email, setEmail] = useState('kasia@example.com');
  const [pass, setPass] = useState('haslo1234');
  return (
    <Screen padTop={40} gap={22}>
      <View style={{ alignItems: 'center', gap: 12 }}>
        <Logo size={76} />
        <Serif size={40} style={{ letterSpacing: -0.5 }}>
          Bloom
        </Serif>
        <T w={600} size={14} color={C.muted}>
          Ruch po porodzie, w Twoim tempie
        </T>
      </View>
      <View style={{ gap: 12 }}>
        <View style={{ gap: 6 }}>
          <T w={700} size={13}>
            E-mail
          </T>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={inputStyle} />
        </View>
        <View style={{ gap: 6 }}>
          <T w={700} size={13}>
            Hasło
          </T>
          <TextInput value={pass} onChangeText={setPass} secureTextEntry style={inputStyle} />
        </View>
        <T w={600} size={13} color={C.deep} style={{ alignSelf: 'flex-end' }}>
          Nie pamiętasz hasła?
        </T>
      </View>
      <View style={{ gap: 12 }}>
        <Btn label="Zaloguj się" onPress={() => reset('Home')} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: C.chipBorder }} />
          <T w={600} size={12} color={C.muted}>
            lub
          </T>
          <View style={{ flex: 1, height: 1, backgroundColor: C.chipBorder }} />
        </View>
        <Btn label="Kontynuuj z Google" variant="white" height={50} onPress={() => reset('Home')} />
        <Btn label="Kontynuuj z Apple" variant="white" height={50} onPress={() => reset('Home')} />
      </View>
      <View style={{ marginTop: 'auto', alignItems: 'center', gap: 12 }}>
        <View style={{ flexDirection: 'row' }}>
          <T size={14}>Nie masz konta? </T>
          <Pressable onPress={() => go('Onboarding1')}>
            <T w={700} size={14} color={C.deep} style={{ textDecorationLine: 'underline' }}>
              Załóż konto
            </T>
          </Pressable>
        </View>
        <Pressable
          onPress={() => {
            tap();
            go('PartnerView');
          }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.soft, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 18 }}
        >
          <Feather name="heart" size={16} color={C.ink} />
          <T w={700} size={13.5}>
            Mam zaproszenie do kręgu wsparcia
          </T>
        </Pressable>
      </View>
    </Screen>
  );
}

function StepTitle({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <T w={700} size={13} color={C.deep}>
        {kicker}
      </T>
      <Serif size={27}>{title}</Serif>
      {desc ? (
        <T size={13.5} color={C.body}>
          {desc}
        </T>
      ) : null}
    </View>
  );
}

const MONTHS = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
const TODAY = Date.parse('2026-10-04');

export function Onboarding1() {
  const { go } = useApp();
  const [birth, setBirth] = useState(3);
  const [date, setDate] = useState(Date.parse('2026-08-08'));
  const [kid, setKid] = useState(0);
  const births = [
    ['Naturalnie', 'Bez nacięcia i pęknięć krocza'],
    ['Naturalnie z nacięciem lub pęknięciem', 'Krocze wymaga dłuższego gojenia'],
    ['Poród zabiegowy', 'Z użyciem kleszczy lub próżnociągu'],
    ['Cesarskie cięcie', 'Planowane lub nagłe'],
  ];
  const days = Math.floor((TODAY - date) / 86400000);
  const w = Math.floor(days / 7);
  const d = days % 7;
  const ago = 'To ' + w + ' tyg.' + (d ? ' i ' + d + (d === 1 ? ' dzień' : ' dni') : '') + ' temu';
  const dt = new Date(date);
  const shift = (n: number) => {
    tap();
    setDate((v) => Math.min(TODAY, v + n * 86400000));
  };
  return (
    <Screen gap={16} footer={<Btn label="Dalej" onPress={() => go('Onboarding2')} />}>
      <StepHeader step={1} />
      <StepTitle kicker="Krok 1 z 4 · Twój poród" title="Opowiedz nam o porodzie" desc="Od tego zależy, które ćwiczenia są dla Ciebie bezpieczne na start." />
      <View style={{ gap: 8 }}>
        <T w={700}>Jak urodziłaś?</T>
        {births.map((b, i) => (
          <RadioRow key={i} label={b[0]} desc={b[1]} selected={birth === i} onPress={() => setBirth(i)} />
        ))}
      </View>
      <View style={{ gap: 8 }}>
        <T w={700}>Data porodu</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 14, borderWidth: 2, borderColor: C.border, backgroundColor: C.white }}>
          <Pressable onPress={() => shift(-1)} style={{ width: 48, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="chevron-left" size={20} color={C.deep} />
          </Pressable>
          <T w={600} size={15} style={{ flex: 1, textAlign: 'center' }}>
            {dt.getUTCDate()} {MONTHS[dt.getUTCMonth()]} {dt.getUTCFullYear()}
          </T>
          <Pressable onPress={() => shift(1)} style={{ width: 48, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="chevron-right" size={20} color={C.deep} />
          </Pressable>
        </View>
        <T w={600} size={12.5} color={C.deep}>
          {ago}
        </T>
      </View>
      <View style={{ gap: 8 }}>
        <T w={700}>Które to Twoje dziecko?</T>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Pierwsze', 'Drugie', 'Kolejne'].map((l, i) => (
            <Pressable
              key={l}
              onPress={() => {
                tap();
                setKid(i);
              }}
              style={{ flex: 1, minHeight: 46, borderRadius: 14, borderWidth: 2, borderColor: kid === i ? C.primary : C.border, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }}
            >
              <T w={600} size={13.5} color={kid === i ? C.deep : C.ink}>
                {l}
              </T>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

export function Onboarding2() {
  const { go } = useApp();
  const [level, setLevel] = useState(2);
  const [likes, setLikes] = useState<Record<string, boolean>>({ Bieganie: true, Joga: true });
  const [goal, setGoal] = useState(0);
  const levels = [
    ['Rzadko', 'mniej niż raz w tyg.'],
    ['Czasem', '1 do 2 razy w tyg.'],
    ['Regularnie', '3+ razy w tyg.'],
  ];
  return (
    <Screen gap={16} footer={<Btn label="Dalej" onPress={() => go('Onboarding3')} />}>
      <StepHeader step={2} />
      <StepTitle kicker="Krok 2 z 4 · Twój ruch" title="Jak ruszałaś się przed ciążą?" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {levels.map((l, i) => (
          <Pressable
            key={l[0]}
            onPress={() => {
              tap();
              setLevel(i);
            }}
            style={{ flex: 1, minHeight: 64, padding: 8, borderRadius: 16, backgroundColor: C.white, borderWidth: 2, borderColor: level === i ? C.primary : C.border, alignItems: 'center', justifyContent: 'center', gap: 3 }}
          >
            <T w={700}>{l[0]}</T>
            <T size={11} color={C.muted} style={{ textAlign: 'center' }}>
              {l[1]}
            </T>
          </Pressable>
        ))}
      </View>
      <View style={{ gap: 8 }}>
        <T w={700}>
          Co lubisz robić?{' '}
          <T size={14} color={C.muted}>
            Możesz zaznaczyć kilka
          </T>
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['Spacery', 'Bieganie', 'Joga', 'Pilates', 'Siłownia', 'Pływanie', 'Rower', 'Taniec'].map((l) => (
            <Chip key={l} label={l} selected={!!likes[l]} onPress={() => setLikes({ ...likes, [l]: !likes[l] })} />
          ))}
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <T w={700}>Co jest teraz Twoim celem?</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['Wrócić do biegania', 'Wzmocnić brzuch i dno miednicy', 'Mieć więcej energii', 'Pozbyć się bólu'].map((l, i) => (
            <Pressable
              key={l}
              onPress={() => {
                tap();
                setGoal(i);
              }}
              style={{ width: '48.5%', minHeight: 64, padding: 12, borderRadius: 16, borderWidth: 2, borderColor: goal === i ? C.primary : C.border, backgroundColor: goal === i ? C.primary : C.white, justifyContent: 'center' }}
            >
              <T w={700} size={13.5} color={goal === i ? C.white : C.ink}>
                {l}
              </T>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

export function Onboarding3() {
  const { go } = useApp();
  const [issues, setIssues] = useState<Record<string, boolean>>({ 'Nietrzymanie moczu': true, 'Ból blizny': true, 'Przewlekłe zmęczenie': true });
  const [sev, setSev] = useState(2);
  const list = ['Ból blizny', 'Ból krocza', 'Nietrzymanie moczu', 'Nietrzymanie gazów', 'Uczucie ciężkości w kroczu', 'Rozejście mięśni brzucha', 'Ból kręgosłupa', 'Ból miednicy', 'Ból nadgarstków', 'Przewlekłe zmęczenie', 'Nic z tych'];
  return (
    <Screen gap={16} footer={<Btn label="Dalej" onPress={() => go('Onboarding4')} />}>
      <StepHeader step={3} />
      <StepTitle kicker="Krok 3 z 4 · Twoje ciało" title="Co Ci teraz dokucza?" desc="To częste po porodzie i nie ma się czego wstydzić. Zaznacz wszystko, co pasuje." />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {list.map((l) => (
          <Chip
            key={l}
            label={l}
            selected={!!issues[l]}
            onPress={() => (l === 'Nic z tych' ? setIssues({ 'Nic z tych': !issues[l] }) : setIssues({ ...issues, [l]: !issues[l], 'Nic z tych': false }))}
          />
        ))}
      </View>
      <View style={{ backgroundColor: C.white, borderRadius: 20, padding: 14, gap: 10 }}>
        <T w={700}>Jak bardzo przeszkadza Ci to na co dzień?</T>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((v, i) => (
            <Pressable
              key={v}
              onPress={() => {
                tap();
                setSev(i);
              }}
              style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: sev === i ? C.primary : C.softer, alignItems: 'center', justifyContent: 'center' }}
            >
              <T w={700} size={15} color={sev === i ? C.white : C.ink}>
                {v}
              </T>
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T w={600} size={11.5} color={C.muted}>
            Prawie wcale
          </T>
          <T w={600} size={11.5} color={C.muted}>
            Bardzo
          </T>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 2 }}>
        <Feather name="lock" size={15} color={C.deep} style={{ marginTop: 2 }} />
        <T size={12.5} color={C.body} style={{ flex: 1 }}>
          Te informacje widzisz tylko Ty. Trafią do raportu dla specjalisty wyłącznie, jeśli to zaznaczysz.
        </T>
      </View>
    </Screen>
  );
}

export function Onboarding4() {
  const { go, setVisitDone } = useApp();
  const [choice, setChoice] = useState(0);
  const [notes, setNotes] = useState('');
  const opts = [
    ['Tak, mogę ćwiczyć', 'Lekarz nie widzi przeciwwskazań'],
    ['Tak, ale z zaleceniami', 'Dopiszesz je poniżej, uwzględnimy je w planie'],
    ['Jeszcze nie', 'Zaczniemy łagodnie i przygotujemy Cię do wizyty'],
  ];
  return (
    <Screen
      gap={16}
      footer={
        <Btn
          label="Zakończ ankietę"
          onPress={() => {
            setVisitDone(choice !== 2);
            go('PlanReady');
          }}
        />
      }
    >
      <StepHeader step={4} />
      <StepTitle kicker="Krok 4 z 4 · Bezpieczeństwo" title="Czy byłaś już na wizycie kontrolnej po porodzie?" desc="Zwykle odbywa się około 6 tygodni po porodzie." />
      <View style={{ gap: 8 }}>
        {opts.map((o, i) => (
          <RadioRow key={i} label={o[0]} desc={o[1]} minHeight={64} selected={choice === i} onPress={() => setChoice(i)} />
        ))}
      </View>
      {choice === 1 && (
        <View style={{ gap: 6 }}>
          <T w={700}>Co zalecił lekarz?</T>
          <TextInput
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="np. bez dźwigania do 10. tygodnia"
            placeholderTextColor={C.disabled}
            style={{ ...inputStyle, height: 90, paddingTop: 12, textAlignVertical: 'top', fontSize: 14 }}
          />
        </View>
      )}
      {choice === 2 && (
        <View style={{ backgroundColor: C.soft, borderRadius: 18, padding: 14 }}>
          <T size={13}>
            <T w={800} size={13}>
              Nic straconego.
            </T>{' '}
            Do czasu wizyty proponujemy spacery i ćwiczenia oddechowe, a w raporcie przygotujemy listę pytań do lekarza.
          </T>
        </View>
      )}
    </Screen>
  );
}

export function PlanReady() {
  const { reset, go, visitDone } = useApp();
  const rows = [
    ['Poród', 'Cesarskie cięcie, 8.08.2026'],
    ['Etap', visitDone ? 'Odbudowa, 8. tydzień' : 'Połóg, przed wizytą kontrolną'],
    ['Cel', 'Powrót do biegania'],
    ['Uważamy na', 'bliznę, nietrzymanie moczu, zmęczenie'],
  ];
  return (
    <Screen
      padTop={40}
      gap={16}
      footer={
        <>
          <Btn label="Zaczynamy" variant="dark" onPress={() => reset(visitDone ? 'Home' : 'NoVisit')} />
          <Btn label="Zaproś kogoś do kręgu wsparcia" variant="ghost" height={44} onPress={() => reset('Circle')} />
        </>
      }
    >
      <View style={{ alignItems: 'center', gap: 12 }}>
        <Logo size={64} />
        <Serif size={28} style={{ textAlign: 'center' }}>
          Twój plan jest gotowy, Kasia
        </Serif>
        <T size={13.5} color={C.body} style={{ textAlign: 'center' }}>
          Dobraliśmy go do Twoich odpowiedzi. Możesz je zmienić w każdej chwili w profilu.
        </T>
      </View>
      <View style={{ backgroundColor: C.white, borderRadius: 22, paddingVertical: 6, paddingHorizontal: 16 }}>
        {rows.map((r, i) => (
          <View key={r[0]} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 11, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderBottomColor: C.divider }}>
            <T w={600} size={13.5} color={C.muted}>
              {r[0]}
            </T>
            <T w={700} size={13.5} style={{ flex: 1, textAlign: 'right' }}>
              {r[1]}
            </T>
          </View>
        ))}
      </View>
      <View style={{ backgroundColor: C.primary, borderRadius: 22, padding: 16, gap: 8 }}>
        <T w={800} size={12} color={C.white} style={{ letterSpacing: 0.5, opacity: 0.9 }}>
          TWÓJ START
        </T>
        <Serif size={21} color={C.white}>
          {visitDone ? '3 sesje po 15 minut w tygodniu' : 'Spacery i oddech do wizyty'}
        </Serif>
        <T size={13} color={C.white}>
          {visitDone
            ? 'Dno miednicy, mięśnie głębokie i oddech. Następna bramka: testy gotowości do biegania od 12. tygodnia.'
            : 'Pełny plan odblokuje się po wizycie kontrolnej. Przygotujemy Cię do niej listą pytań.'}
        </T>
      </View>
    </Screen>
  );
}
