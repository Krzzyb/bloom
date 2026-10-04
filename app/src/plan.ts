// Prosta "AI" dopasowania planu do codziennego check-inu (demo).

export type Exercise = { name: string; min: string; why: string };

const BASE: Exercise[] = [
  { name: 'Oddech z dnem miednicy', min: '3 min', why: 'Podstawa odbudowy po porodzie, łączy oddech z mięśniami głębokimi.' },
  { name: 'Koci grzbiet', min: '3 min', why: 'Rozluźnia kręgosłup obciążony noszeniem dziecka.' },
  { name: 'Mostek biodrowy', min: '3 min', why: 'Wzmacnia pośladki bez napinania blizny.' },
  { name: 'Przysiad do krzesła', min: '3 min', why: 'Uczy bezpiecznie wstawać i podnosić dziecko.' },
  { name: 'Otwarcie klatki piersiowej', min: '3 min', why: 'Prostuje plecy po karmieniu i noszeniu.' },
];

const EXTRA: Exercise[] = [
  { name: 'Deska na kolanach', min: '4 min', why: 'Stabilizacja tułowia, gdy masz siłę i energię.' },
  { name: 'Ręka i noga w klęku', min: '4 min', why: 'Koordynacja i mięśnie głębokie kręgosłupa.' },
];

export type DayPlan = {
  minutes: number;
  title: string;
  exercises: Exercise[];
  adapted: boolean;
  headline: string;
  reason: string;
  skipped?: string;
};

/** mood: 0 = świetnie ... 4 = źle; energy/sleep: 1..5 */
export function planFor(mood: number, energy: number, sleep: number): DayPlan {
  if (mood === 4) {
    return {
      minutes: 8,
      title: 'Oddech i rozluźnienie',
      exercises: [BASE[0], BASE[1], BASE[4]].map((e) => ({ ...e, min: e === BASE[0] ? '4 min' : '2 min' })),
      adapted: true,
      headline: 'Dziś tylko łagodnie.',
      reason: 'Gorszy dzień jest w porządku. Zostawiamy oddech i rozluźnienie, bez wysiłku. Jeśli coś Cię niepokoi, naciśnij STOP.',
      skipped: 'mostek, przysiad i wszystko w podporze.',
    };
  }
  if (sleep <= 2) {
    return {
      minutes: 15,
      title: 'Łagodna odbudowa',
      exercises: BASE,
      adapted: true,
      headline: 'Dopasowaliśmy plan.',
      reason: 'Mało dziś spałaś, więc skracamy sesję i pomijamy ćwiczenia w podporze.',
      skipped: 'deska i ćwiczenia w podporze, bo masz mało snu i energii.',
    };
  }
  if (energy <= 2 || mood === 3) {
    return {
      minutes: 15,
      title: 'Łagodna odbudowa',
      exercises: BASE,
      adapted: true,
      headline: 'Dopasowaliśmy plan.',
      reason: 'Masz dziś mniej energii, więc zostajemy przy krótszej sesji bez ćwiczeń w podporze.',
      skipped: 'deska i ćwiczenia w podporze, bo masz mało energii.',
    };
  }
  return {
    minutes: 23,
    title: 'Odbudowa i stabilizacja',
    exercises: [...BASE, ...EXTRA],
    adapted: false,
    headline: 'Dobra forma dziś!',
    reason: 'Wyspałaś się i masz energię, więc dokładamy deskę na kolanach i ćwiczenie w klęku.',
  };
}
