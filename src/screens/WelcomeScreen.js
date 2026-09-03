import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { LOGOS, FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';
import { COUNTRIES, DEFAULT_COUNTRY } from '../constants/countries';
import { PRIVACY_POLICY_TEXT } from '../constants/privacyPolicy';

export const WelcomeScreen = () => {
  const { saveProfile, theme } = useApp();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('male'); // 'male' | 'female'
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showFullPrivacy, setShowFullPrivacy] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    const query = searchQuery.toLowerCase().trim();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.capital.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const avatarColor = gender === 'male' ? COLORS.maleBlue : COLORS.femalePink;

  const handleContinue = () => {
    if (!name.trim()) {
      setErrorMsg('يرجى إدخال اسمك الكريم للمتابعة');
      return;
    }
    setErrorMsg('');
    saveProfile(name, gender, selectedCountry.id);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#ffffff' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Logo Section: logo1.png large & prominent */}
          <View style={styles.logoContainer}>
            <Image source={LOGOS.logo1} style={styles.topLogo} resizeMode="contain" />
            <Text style={styles.appTitle}>رحيق - Raheeq</Text>
            <Text style={styles.appSubtitle}>واحة إيمانية يومية لمتابعة صلواتك وأذكارك وإنجازاتك</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Avatar Preview */}
            <View style={styles.avatarPreviewRow}>
              <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
              <Text style={styles.avatarLabel}>
                {gender === 'male' ? 'مرحباً بك أخي الكريم' : 'مرحباً بكِ أختي الكريمة'}
              </Text>
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>الاسم الكريم:</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={COLORS.greenDark} style={{ marginLeft: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="أدخل اسمك هنا..."
                  placeholderTextColor="#999999"
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  textAlign="right"
                />
              </View>
              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>الجنس:</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'male' && [styles.genderButtonActive, { borderColor: COLORS.maleBlue, backgroundColor: 'rgba(37, 99, 235, 0.08)' }],
                  ]}
                  onPress={() => setGender('male')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="man"
                    size={20}
                    color={gender === 'male' ? COLORS.maleBlue : '#888888'}
                    style={{ marginLeft: 6 }}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'male' && { color: COLORS.maleBlue, fontFamily: FONTS.bold },
                    ]}
                  >
                    ذكر
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'female' && [styles.genderButtonActive, { borderColor: COLORS.femalePink, backgroundColor: 'rgba(219, 39, 119, 0.08)' }],
                  ]}
                  onPress={() => setGender('female')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="woman"
                    size={20}
                    color={gender === 'female' ? COLORS.femalePink : '#888888'}
                    style={{ marginLeft: 6 }}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'female' && { color: COLORS.femalePink, fontFamily: FONTS.bold },
                    ]}
                  >
                    أنثى
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Country & Capital Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>البلد والعاصمة (لحساب مواقيت الصلاة بدقة):</Text>
              <TouchableOpacity
                style={styles.countryPickerButton}
                onPress={() => setIsCountryModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-down" size={20} color={COLORS.greenDark} />
                <View style={styles.countryDisplay}>
                  <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                  <Text style={styles.countryText}>
                    {selectedCountry.name} ({selectedCountry.capital})
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-back" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
              <Text style={styles.primaryButtonText}>تسجيل الدخول بدون حساب</Text>
            </TouchableOpacity>

            <View style={styles.offlineNotice}>
              <Ionicons name="shield-checkmark" size={16} color={COLORS.greenDark} />
              <Text style={styles.offlineNoticeText}>
                تطبيق محلي 100% بدون أي سيرفر خارجي أو إعلانات، وبياناتك محفوظة بأمان على جهازك.
              </Text>
            </View>
          </View>

          {/* Privacy Policy Card */}
          <View style={styles.privacyCard}>
            <TouchableOpacity
              style={styles.privacyHeader}
              onPress={() => setShowFullPrivacy(!showFullPrivacy)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showFullPrivacy ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={COLORS.greyDark}
              />
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                <Ionicons name="lock-closed-outline" size={16} color={COLORS.greenDark} style={{ marginLeft: 6 }} />
                <Text style={styles.privacyTitle}>سياسة الخصوصية والأمان</Text>
              </View>
            </TouchableOpacity>

            <Text
              style={styles.privacyText}
              numberOfLines={showFullPrivacy ? undefined : 3}
            >
              {PRIVACY_POLICY_TEXT}
            </Text>

            {!showFullPrivacy && (
              <TouchableOpacity onPress={() => setShowFullPrivacy(true)} style={{ marginTop: 4 }}>
                <Text style={styles.readMoreText}>انقر لقراءة التفاصيل الكاملة...</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Selection Modal */}
      <Modal
        visible={isCountryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCountryModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setIsCountryModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#1a1a1a" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>اختر دولتك وعاصمتك</Text>
            </View>

            {/* Search Input */}
            <View style={styles.modalSearchBox}>
              <Ionicons name="search" size={20} color="#777777" style={{ marginLeft: 8 }} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="ابحث عن دولة أو عاصمة..."
                placeholderTextColor="#999999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                textAlign="right"
              />
            </View>

            {/* Country List */}
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedCountry.id;
                return (
                  <TouchableOpacity
                    style={[styles.countryListItem, isSelected && styles.countryListItemActive]}
                    onPress={() => {
                      setSelectedCountry(item);
                      setIsCountryModalVisible(false);
                      setSearchQuery('');
                    }}
                    activeOpacity={0.7}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.greenLight} />
                    )}
                    <View style={styles.countryItemDetails}>
                      <Text style={styles.countryItemName}>
                        {item.name} - <Text style={styles.countryItemCapital}>{item.capital}</Text>
                      </Text>
                      <Text style={styles.countryItemFlag}>{item.flag}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  topLogo: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  appTitle: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: COLORS.greenDark,
    textAlign: 'center',
  },
  appSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.greyDark,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  avatarPreviewRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  avatarLabel: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.greenDark,
  },
  inputGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: '#333333',
    marginBottom: 8,
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f8faf8',
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: '#1a1a1a',
    paddingVertical: 8,
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: '#dc2626',
    marginTop: 4,
    textAlign: 'right',
  },
  genderRow: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: '#f8faf8',
  },
  genderButtonActive: {
    borderWidth: 2,
  },
  genderButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: '#555555',
  },
  countryPickerButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8faf8',
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  countryDisplay: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  countryFlag: {
    fontSize: 20,
  },
  countryText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#1a1a1a',
  },
  primaryButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.greenDark,
    borderRadius: 14,
    height: 52,
    marginTop: 8,
    elevation: 3,
    shadowColor: COLORS.greenDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: '#ffffff',
  },
  offlineNotice: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 6,
    paddingHorizontal: 8,
  },
  offlineNoticeText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    flexShrink: 1,
    lineHeight: 16,
  },
  privacyCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  privacyHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  privacyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.greenDark,
  },
  privacyText: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: '#666666',
    textAlign: 'right',
    lineHeight: 16,
  },
  readMoreText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.greenDark,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  modalSearchBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  modalSearchInput: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: '#1a1a1a',
  },
  countryListItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  countryListItemActive: {
    backgroundColor: 'rgba(23, 163, 29, 0.08)',
    borderRadius: 10,
  },
  countryItemDetails: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  countryItemFlag: {
    fontSize: 22,
  },
  countryItemName: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#1a1a1a',
  },
  countryItemCapital: {
    fontFamily: FONTS.regular,
    color: '#666666',
  },
});
