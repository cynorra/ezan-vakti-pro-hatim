import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { religiousDays } from '@/lib/data/religious-days';

export function ReligiousDaysCard() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const upcomingDays = religiousDays
    .filter((day) => new Date(day.date) >= new Date())
    .slice(0, 3);

  if (upcomingDays.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, Shadows.medium]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Önemli Dini Günler</Text>
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
      </View>

      {upcomingDays.map((day, index) => {
        const date = new Date(day.date);
        const dayStr = date.getDate().toString().padStart(2, '0');
        const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
        
        return (
          <View 
            key={day.name + day.date} 
            style={[
              styles.dayRow, 
              index !== upcomingDays.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
            ]}
          >
            <View style={[styles.dateBadge, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.dateText, { color: colors.primary }]}>{dayStr}.{monthStr}</Text>
            </View>
            <View style={styles.content}>
              <Text style={[styles.dayName, { color: colors.text }]}>{day.name}</Text>
              <Text style={[styles.dayType, { color: colors.textSecondary }]}>
                {day.type === 'kandil' ? 'Kandil' : day.type === 'eid' ? 'Bayram' : 'Özel Gün'}
              </Text>
            </View>
            {day.type === 'eid' && (
              <Ionicons name="star" size={16} color={colors.accent} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
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
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  dateBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    minWidth: 50,
    alignItems: 'center',
  },
  dateText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  content: {
    flex: 1,
  },
  dayName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  dayType: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
