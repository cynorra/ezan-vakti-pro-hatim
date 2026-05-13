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
    <View style={[styles.container, { backgroundColor: colors.surface }, Shadows.medium]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={[styles.titleDot, { backgroundColor: colors.accent }]} />
          <Text style={[styles.title, { color: colors.text }]}>ÖNEMLİ GÜNLER</Text>
        </View>
        <Ionicons name="calendar-sharp" size={18} color={colors.primary} />
      </View>

      <View style={styles.list}>
        {upcomingDays.map((day, index) => {
          const date = new Date(day.date);
          const dayStr = date.getDate().toString().padStart(2, '0');
          const monthStr = date.toLocaleString('tr-TR', { month: 'short' }).toUpperCase();
          
          return (
            <View 
              key={day.name + day.date} 
              style={[
                styles.dayRow, 
                index !== upcomingDays.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
              ]}
            >
              <View style={[styles.dateBadge, { backgroundColor: colors.primary + '10' }]}>
                <Text style={[styles.dateDay, { color: colors.primary }]}>{dayStr}</Text>
                <Text style={[styles.dateMonth, { color: colors.primary }]}>{monthStr}</Text>
              </View>
              
              <View style={styles.content}>
                <Text style={[styles.dayName, { color: colors.text }]}>{day.name}</Text>
                <View style={styles.typeRow}>
                  <Ionicons 
                    name={day.type === 'eid' ? "star" : "bookmark"} 
                    size={10} 
                    color={day.type === 'eid' ? colors.accent : colors.textMuted} 
                  />
                  <Text style={[styles.dayType, { color: colors.textSecondary }]}>
                    {day.type === 'kandil' ? 'Kandil Gecesi' : day.type === 'eid' ? 'Dini Bayram' : 'Mübarek Gün'}
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={16} color={colors.border} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  list: {
    paddingVertical: Spacing.xs,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  dateBadge: {
    width: 54,
    height: 54,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '800',
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '900',
    marginTop: -2,
  },
  content: {
    flex: 1,
  },
  dayName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: 2,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayType: {
    fontSize: 11,
    fontWeight: '600',
  },
});
