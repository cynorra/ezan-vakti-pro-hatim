import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface ChecklistItem {
  id: string;
  label: string;
  category: 'prayer' | 'quran' | 'dhikr' | 'charity';
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'fajr', label: 'Sabah Namazı', category: 'prayer' },
  { id: 'dhuhr', label: 'Öğle Namazı', category: 'prayer' },
  { id: 'asr', label: 'İkindi Namazı', category: 'prayer' },
  { id: 'maghrib', label: 'Akşam Namazı', category: 'prayer' },
  { id: 'isha', label: 'Yatsı Namazı', category: 'prayer' },
  { id: 'tahajjud', label: 'Teheccüd', category: 'prayer' },
  { id: 'duha', label: 'Kuşluk (Duha)', category: 'prayer' },
  { id: 'evvabin', label: 'Evvabin', category: 'prayer' },
  { id: 'quran', label: 'Kur\'an/Cüz', category: 'quran' },
  { id: 'dhikr', label: 'Zikirler', category: 'dhikr' },
  { id: 'charity', label: 'İyilik/Sadaka', category: 'charity' },
];

export const DailyChecklist = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(`checklist_${todayKey}`);
      if (saved) {
        setCompletedItems(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Checklist yuklenemedi:', error);
    }
  };

  const toggleItem = async (id: string) => {
    const isCompleted = completedItems.includes(id);
    const newItems = isCompleted 
      ? completedItems.filter(i => i !== id)
      : [...completedItems, id];
    
    setCompletedItems(newItems);
    Haptics.impactAsync(isCompleted ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      await AsyncStorage.setItem(`checklist_${todayKey}`, JSON.stringify(newItems));
    } catch (error) {
      console.log('Checklist kaydedilemedi:', error);
    }
  };

  const progress = Math.round((completedItems.length / CHECKLIST_ITEMS.length) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Günlük Amel Defteri</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Bugünkü manevi hedeflerin</Text>
        </View>
        <View style={[styles.progressBadge, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.progressText, { color: colors.primary }]}>%{progress}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {CHECKLIST_ITEMS.map((item) => {
          const isDone = completedItems.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                { 
                  backgroundColor: isDone ? colors.primary + '10' : colors.background,
                  borderColor: isDone ? colors.primary : colors.border
                }
              ]}
              onPress={() => toggleItem(item.id)}
            >
              <Ionicons 
                name={isDone ? "checkbox" : "square-outline"} 
                size={20} 
                color={isDone ? colors.primary : colors.textMuted} 
              />
              <Text 
                style={[
                  styles.itemLabel, 
                  { color: isDone ? colors.text : colors.textSecondary, textDecorationLine: isDone ? 'line-through' : 'none' }
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  progressBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  item: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});
