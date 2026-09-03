import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/AppHeader';
import { NAMES_OF_ALLAH } from '../constants/namesOfAllah';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const NamesOfAllahScreen = () => {
  const { theme, navigateTo } = useApp();
  const [search, setSearch] = useState('');

  const filteredNames = useMemo(() => {
    if (!search.trim()) return NAMES_OF_ALLAH;
    const q = search.trim().toLowerCase();
    return NAMES_OF_ALLAH.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.id.toString() === q
    );
  }, [search]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader
        title="أسماء الله الحسنى ومعانيها"
        showBack={true}
        onBack={() => navigateTo('activities', null)}
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Ionicons name="search" size={20} color={COLORS.greenDark} style={{ marginLeft: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="ابحث عن اسم أو معنى..."
            placeholderTextColor="#888888"
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={18} color="#888888" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Total Count Badge */}
        <View style={styles.countBadgeRow}>
          <Text style={[styles.countBadgeText, { color: theme.textSecondary }]}>
            عرض {filteredNames.length} من أصل 99 اسماً
          </Text>
        </View>

        {/* List of Names */}
        <FlatList
          data={filteredNames}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.nameCard,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              {/* Card Header: Number & Name */}
              <View style={styles.cardHeader}>
                <View style={[styles.nameBadge, { backgroundColor: 'rgba(23, 163, 29, 0.12)' }]}>
                  <Text style={[styles.nameTitle, { color: COLORS.greenDark }]}>{item.name}</Text>
                </View>

                <View style={[styles.numberCircle, { backgroundColor: theme.isDark ? '#2a2a2a' : '#f0f4f0' }]}>
                  <Text style={[styles.numberText, { color: theme.textSecondary }]}>{item.id}</Text>
                </View>
              </View>

              {/* Meaning Text */}
              <Text style={[styles.meaningText, { color: theme.textPrimary }]}>
                {item.meaning}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
    paddingVertical: 8,
  },
  countBadgeRow: {
    flexDirection: 'row-reverse',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  countBadgeText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 30,
    gap: 12,
  },
  nameCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  nameBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  nameTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    letterSpacing: 1,
  },
  meaningText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
  },
});
