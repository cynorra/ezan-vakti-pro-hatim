import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { turkishCities, City } from '@/lib/data/cities';

interface CitySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: City, district?: string) => void;
  /** Worldwide option: use the device GPS position instead of a Turkish city. */
  onUseGps?: () => void;
  selectedCity: City;
  selectedDistrict?: string;
}

export function CitySelector({
  visible,
  onClose,
  onSelect,
  onUseGps,
  selectedCity,
  selectedDistrict,
}: CitySelectorProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedCity, setTempSelectedCity] = useState<City | null>(null);

  const filteredCities = useMemo(() => 
    turkishCities.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]);

  const filteredDistricts = useMemo(() => {
    if (!tempSelectedCity) return [];
    return tempSelectedCity.districts.filter(d => 
      d.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tempSelectedCity, searchQuery]);

  const handleCitySelect = (city: City) => {
    setTempSelectedCity(city);
    setSearchQuery('');
  };

  const handleDistrictSelect = (district: string) => {
    if (tempSelectedCity) {
      onSelect(tempSelectedCity, district);
      setTempSelectedCity(null);
      setSearchQuery('');
    }
  };

  const handleBack = () => {
    if (tempSelectedCity) {
      setTempSelectedCity(null);
      setSearchQuery('');
    } else {
      onClose();
    }
  };

  const renderCity = ({ item }: { item: City }) => {
    const isSelected = item.id === selectedCity.id;
    return (
      <TouchableOpacity
        style={[
          styles.cityItem,
          {
            backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
            borderBottomColor: colors.border,
          },
        ]}
        onPress={() => handleCitySelect(item)}
      >
        <Text
          style={[
            styles.cityName,
            { color: isSelected ? colors.primary : colors.text },
            isSelected && styles.cityNameSelected,
          ]}
        >
          {item.name}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    );
  };

  const renderDistrict = ({ item }: { item: string }) => {
    const isSelected = item === selectedDistrict && tempSelectedCity?.id === selectedCity.id;
    return (
      <TouchableOpacity
        style={[
          styles.cityItem,
          {
            backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
            borderBottomColor: colors.border,
          },
        ]}
        onPress={() => handleDistrictSelect(item)}
      >
        <Text
          style={[
            styles.cityName,
            { color: isSelected ? colors.primary : colors.text },
            isSelected && styles.cityNameSelected,
          ]}
        >
          {item}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleBack}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name={tempSelectedCity ? "arrow-back" : "close"} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            {tempSelectedCity ? t('location.selectDistrict', { city: tempSelectedCity.name }) : t('location.selectCity')}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={tempSelectedCity ? t('location.searchDistrict') : t('location.searchCity')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>

        {tempSelectedCity ? (
          <FlatList
            data={filteredDistricts}
            renderItem={renderDistrict}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <FlatList
            data={filteredCities}
            renderItem={renderCity}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              onUseGps ? (
                <>
                  <TouchableOpacity
                    style={[
                      styles.cityItem,
                      styles.gpsItem,
                      {
                        backgroundColor: selectedCity.id === 'gps' ? colors.primary + '10' : 'transparent',
                        borderBottomColor: colors.border,
                      },
                    ]}
                    onPress={onUseGps}
                  >
                    <Ionicons name="navigate-circle" size={24} color={colors.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cityName, styles.cityNameSelected, { color: colors.primary }]}>
                        {t('location.useGps')}
                      </Text>
                      <Text style={[styles.gpsHint, { color: colors.textMuted }]}>{t('location.useGpsHint')}</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('location.turkeyCities')}</Text>
                </>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  backButton: {
    padding: Spacing.sm,
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  cityName: {
    fontSize: FontSize.md,
  },
  cityNameSelected: {
    fontWeight: '700',
  },
  gpsItem: {
    justifyContent: 'flex-start',
    gap: Spacing.md,
  },
  gpsHint: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
});
