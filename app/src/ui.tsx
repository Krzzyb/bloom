import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C, F, shadowCard } from './theme';
import { Route, useApp } from './state';

export const tap = () => Haptics.selectionAsync().catch(() => {});

type W = 500 | 600 | 700 | 800;
export function T({
  w = 500,
  size = 14,
  color = C.ink,
  style,
  ...rest
}: TextProps & { w?: W; size?: number; color?: string; style?: StyleProp<TextStyle> }) {
  const fam = { 500: F.w500, 600: F.w600, 700: F.w700, 800: F.w800 }[w];
  return <Text {...rest} style={[{ fontFamily: fam, fontSize: size, color, lineHeight: size * 1.4 }, style]} />;
}

export function Serif({ size = 28, color = C.ink, style, ...rest }: TextProps & { size?: number; color?: string }) {
  return <Text {...rest} style={[{ fontFamily: F.serif, fontSize: size, color, lineHeight: size * 1.18 }, style]} />;
}

export function Logo({ size = 76 }: { size?: number }) {
  const op = [0.95, 0.85, 0.75, 0.85, 0.95];
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect x={0} y={0} width={100} height={100} rx={26} fill={C.primary} />
      {op.map((o, i) => (
        <G key={i} rotation={i * 72} origin="50, 50">
          <Ellipse cx={50} cy={31} rx={11} ry={17} fill={C.white} opacity={o} />
        </G>
      ))}
      <Circle cx={50} cy={50} r={8.5} fill={C.pink} />
      <Circle cx={50} cy={50} r={4} fill={C.primary} />
    </Svg>
  );
}

export const MOUTHS = [
  'M8 14c1.5 2.2 6.5 2.2 8 0',
  'M9 14.5c1 1.2 5 1.2 6 0',
  'M9 15h6',
  'M9 16c1-1.1 5-1.1 6 0',
  'M8 17c1.5-2.2 6.5-2.2 8 0',
];
export function Face({ mood, size = 26, color = C.ink }: { mood: number; size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
      <Circle cx={9} cy={10} r={0.9} fill={color} />
      <Circle cx={15} cy={10} r={0.9} fill={color} />
      <Path d={MOUTHS[mood]} />
    </Svg>
  );
}

/** Ekran z przewijaną treścią i bezpiecznymi marginesami. */
export function Screen({
  children,
  bg = C.bg,
  scroll = true,
  tabs = false,
  stop = false,
  gap = 14,
  padTop = 12,
  footer,
}: {
  children: React.ReactNode;
  bg?: string;
  scroll?: boolean;
  tabs?: boolean;
  stop?: boolean;
  gap?: number;
  padTop?: number;
  footer?: React.ReactNode;
}) {
  const ins = useSafeAreaInsets();
  const bottomPad = tabs ? 120 + ins.bottom : 24 + ins.bottom;
  const content = (
    <View style={{ paddingTop: ins.top + padTop, paddingHorizontal: 20, paddingBottom: footer ? 16 : bottomPad, gap, flexGrow: 1 }}>
      {children}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {footer && <View style={{ paddingHorizontal: 20, paddingBottom: 16 + ins.bottom, paddingTop: 8, gap: 8, backgroundColor: bg }}>{footer}</View>}
      {stop && <StopFab />}
      {tabs && <BottomNav />}
    </View>
  );
}

export function Btn({
  label,
  onPress,
  variant = 'primary',
  icon,
  height = 52,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'dark' | 'outline' | 'white' | 'ghost' | 'danger' | 'dangerOutline';
  icon?: React.ComponentProps<typeof Feather>['name'];
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = {
    primary: { bg: C.primary, fg: C.white, border: C.primary },
    dark: { bg: C.ink, fg: C.white, border: C.ink },
    outline: { bg: C.white, fg: C.deep, border: C.primary },
    white: { bg: C.white, fg: C.ink, border: C.chipBorder },
    ghost: { bg: 'transparent', fg: C.deep, border: 'transparent' },
    danger: { bg: C.deep, fg: C.white, border: C.deep },
    dangerOutline: { bg: C.white, fg: C.deep, border: C.deep },
  }[variant];
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          height,
          borderRadius: height / 2,
          backgroundColor: v.bg,
          borderWidth: 2,
          borderColor: v.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingHorizontal: 14,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      {icon && <Feather name={icon} size={18} color={v.fg} />}
      <T w={700} size={height >= 50 ? 16 : 14} color={v.fg}>
        {label}
      </T>
    </Pressable>
  );
}

export function Card({ children, style, shadow = false }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; shadow?: boolean }) {
  return <View style={[{ backgroundColor: C.white, borderRadius: 22, padding: 16, gap: 10 }, shadow && shadowCard, style]}>{children}</View>;
}

export function BackButton({ onPress }: { onPress?: () => void }) {
  const { back } = useApp();
  return (
    <Pressable
      accessibilityLabel="Wróć"
      onPress={() => {
        tap();
        (onPress ?? back)();
      }}
      style={({ pressed }) => [styles.back, pressed && { opacity: 0.7 }]}
    >
      <Feather name="chevron-left" size={22} color={C.ink} />
    </Pressable>
  );
}

export function StepHeader({ step, total = 4, onBack }: { step: number; total?: number; onBack?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <BackButton onPress={onBack} />
      <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i < step ? C.primary : C.pink }} />
        ))}
      </View>
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress();
      }}
      style={{
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor: selected ? C.primary : C.white,
        borderWidth: 1,
        borderColor: selected ? C.primary : C.chipBorder,
      }}
    >
      <T w={600} size={13} color={selected ? C.white : C.ink}>
        {label}
      </T>
    </Pressable>
  );
}

export function Segmented({ options, value, onChange }: { options: string[]; value: number; onChange: (i: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, backgroundColor: C.soft, padding: 5, borderRadius: 16 }}>
      {options.map((o, i) => {
        const sel = i === value;
        return (
          <Pressable
            key={o}
            onPress={() => {
              tap();
              onChange(i);
            }}
            style={[
              { flex: 1, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
              sel && { backgroundColor: C.white, ...shadowCard, shadowOpacity: 0.15 },
            ]}
          >
            <T w={700} size={13} color={sel ? C.deep : C.muted} numberOfLines={1}>
              {o}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function RadioRow({
  label,
  desc,
  selected,
  onPress,
  minHeight = 56,
}: {
  label: string;
  desc?: string;
  selected: boolean;
  onPress: () => void;
  minHeight?: number;
}) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress();
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        minHeight,
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderRadius: 16,
        backgroundColor: C.white,
        borderWidth: 2,
        borderColor: selected ? C.primary : C.border,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: selected ? 7 : 2,
          borderColor: selected ? C.primary : C.radio,
        }}
      />
      <View style={{ flex: 1, gap: 1 }}>
        <T w={700} size={14}>
          {label}
        </T>
        {desc ? (
          <T size={12} color={C.muted}>
            {desc}
          </T>
        ) : null}
      </View>
    </Pressable>
  );
}

export function CheckCircle({ on, size = 28 }: { on: boolean; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: on ? C.primary : C.white,
        borderWidth: on ? 0 : 2,
        borderColor: C.radio,
      }}
    >
      {on && <Feather name="check" size={size * 0.58} color={C.white} />}
    </View>
  );
}

export function CheckBox({ on }: { on: boolean }) {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: on ? C.primary : C.white,
        borderWidth: on ? 0 : 2,
        borderColor: C.radio,
      }}
    >
      {on && <Feather name="check" size={15} color={C.white} />}
    </View>
  );
}

export function Toggle({ on, onPress }: { on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress();
      }}
      style={{ width: 52, height: 32, borderRadius: 16, backgroundColor: on ? C.primary : C.toggleOff, justifyContent: 'center' }}
    >
      <View
        style={{
          position: 'absolute',
          left: on ? 24 : 4,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: C.white,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
        }}
      />
    </Pressable>
  );
}

export function ProgressBar({ pct, track = C.soft, fill = C.primary, height = 8 }: { pct: number; track?: string; fill?: string; height?: number }) {
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: '100%', borderRadius: height / 2, backgroundColor: fill }} />
    </View>
  );
}

export function Bullet({ children, size = 8, top }: { children: React.ReactNode; size?: number; top?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: top !== undefined ? 'flex-start' : 'center' }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.primary, marginTop: top }} />
      <T size={13.5} style={{ flex: 1 }}>
        {children}
      </T>
    </View>
  );
}

export function InfoNote({ icon = 'info', children, bg = C.soft }: { icon?: React.ComponentProps<typeof Feather>['name']; children: React.ReactNode; bg?: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      <Feather name={icon} size={20} color={C.deep} style={{ marginTop: 1 }} />
      <T size={13} style={{ flex: 1 }}>
        {children}
      </T>
    </View>
  );
}

export function StopFab() {
  const { go } = useApp();
  const ins = useSafeAreaInsets();
  return (
    <Pressable
      accessibilityLabel="STOP, źle się czuję"
      onPress={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
        go('Stop');
      }}
      style={({ pressed }) => [styles.stopFab, { bottom: 86 + Math.max(ins.bottom, 12) }, pressed && { transform: [{ scale: 0.94 }] }]}
    >
      <T w={800} size={15} color={C.white} style={{ letterSpacing: 1 }}>
        STOP
      </T>
    </Pressable>
  );
}

const NAV: { label: string; icon: React.ComponentProps<typeof Feather>['name']; route: Route }[] = [
  { label: 'Dziś', icon: 'home', route: 'Home' },
  { label: 'Ćwiczenia', icon: 'activity', route: 'Exercises' },
  { label: 'Ciało', icon: 'clock', route: 'Timeline' },
  { label: 'Raport', icon: 'file-text', route: 'Report' },
  { label: 'Krąg', icon: 'heart', route: 'Circle' },
];

export function BottomNav() {
  const { route, tab, visitDone, toast } = useApp();
  const ins = useSafeAreaInsets();
  return (
    <View style={[styles.nav, { height: 70 + Math.max(ins.bottom, 12), paddingBottom: Math.max(ins.bottom, 12) }]}>
      {NAV.map((n) => {
        const homeRoute: Route = visitDone ? 'Home' : 'NoVisit';
        const target = n.route === 'Home' ? homeRoute : n.route;
        const active = route === target || (n.route === 'Home' && route === 'NoVisit');
        const locked = n.route === 'Exercises' && !visitDone;
        const color = active ? C.primary : locked ? C.disabled : C.muted;
        return (
          <Pressable
            key={n.label}
            onPress={() => {
              tap();
              if (locked) toast('Ćwiczenia odblokują się po wizycie kontrolnej');
              else tab(target);
            }}
            style={{ alignItems: 'center', gap: 4, minWidth: 60, paddingTop: 10 }}
          >
            <Feather name={locked ? 'lock' : n.icon} size={23} color={color} />
            <T w={active ? 700 : 600} size={11} color={color}>
              {n.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: C.divider }} />;
}

const styles = StyleSheet.create({
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopFab: {
    position: 'absolute',
    right: 18,
    bottom: 110,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: C.deep,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: C.bg,
    shadowColor: C.deep,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
