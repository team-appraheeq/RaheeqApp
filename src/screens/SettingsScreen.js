import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/AppHeader';
import { COUNTRIES } from '../constants/countries';
import { PRIVACY_POLICY_TEXT } from '../constants/privacyPolicy';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const SettingsScreen = () => {
  const {
    userProfile,
    settings,
    theme,
    toggleTheme,
    toggleHaptics,
    saveProfile,
    logoutAndResetAll,
  } = useApp();

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [gender, setGender] = useState(userProfile?.gender || 'male');
  const [selectedCountry, setSelectedCountry] = useState(userProfile?.country || COUNTRIES[0]);
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Privacy Policy Modal
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.capital.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSaveProfile = () => {
    if (!name.trim()) return;
    saveProfile(name, gender, selectedCountry.id);
    setIsEditingProfile(false);
  };

  const handleOpenInstagram = () => {
    Linking.openURL('https://www.instagram.com/raheeq.app/');
  };

  const handleOpenTelegram = () => {
    Linking.openURL('https://t.me/+ALsbyYrlER5hYTFk');
  };

  const handleLogoutPrompt = () => {
    Alert.alert(
      'تسجيل الخروج وحذف البيانات',
      'هل أنت متأكد من تسجيل الخروج؟ سيتم حذف جميع البيانات وسجل الإنجاز والعودة لشاشة الترحيب.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نعم، تسجيل الخروج',
          style: 'destructive',
          onPress: () => logoutAndResetAll(),
        },
      ],
      { cancelable: true }
    );
  };

  const avatarBgColor = (isEditingProfile ? gender : userProfile?.gender) === 'male'
    ? COLORS.maleBlue
    : COLORS.femalePink;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader title="الإعدادات والتفضيلات" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditingProfile(!isEditingProfile)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isEditingProfile ? 'close' : 'pencil'}
                size={16}
                color={COLORS.greenDark}
              />
              <Text style={styles.editBtnText}>
                {isEditingProfile ? 'إلغاء' : 'تعديل'}
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
              <Ionicons name="person-circle-outline" size={20} color={COLORS.greenDark} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>الملف التعريفي</Text>
            </View>
          </View>

          {isEditingProfile ? (
            /* Editing Mode */
            <View style={styles.editForm}>
              {/* Name Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>الاسم:</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.inputBorder }]}
                  value={name}
                  onChangeText={setName}
                  textAlign="right"
                />
              </View>

              {/* Gender Selection */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>الجنس ولون الأيقونة 👤:</Text>
                <View style={styles.genderRow}>
                  <TouchableOpacity
                    style={[
                      styles.genderToggleBtn,
                      gender === 'male' && { borderColor: COLORS.maleBlue, backgroundColor: 'rgba(37,99,235,0.1)' },
                    ]}
                    onPress={() => setGender('male')}
                  >
                    <Ionicons name="man" size={18} color={gender === 'male' ? COLORS.maleBlue : '#888'} />
                    <Text style={[styles.genderToggleText, gender === 'male' && { color: COLORS.maleBlue, fontFamily: FONTS.bold }]}>
                      ذكر (أزرق)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.genderToggleBtn,
                      gender === 'female' && { borderColor: COLORS.femalePink, backgroundColor: 'rgba(219,39,119,0.1)' },
                    ]}
                    onPress={() => setGender('female')}
                  >
                    <Ionicons name="woman" size={18} color={gender === 'female' ? COLORS.femalePink : '#888'} />
                    <Text style={[styles.genderToggleText, gender === 'female' && { color: COLORS.femalePink, fontFamily: FONTS.bold }]}>
                      أنثى (زهري)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Country Selection */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>البلد والعاصمة:</Text>
                <TouchableOpacity
                  style={[styles.countrySelectBtn, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
                  onPress={() => setIsCountryModalVisible(true)}
                >
                  <Ionicons name="chevron-down" size={18} color={theme.textPrimary} />
                  <Text style={[styles.countrySelectText, { color: theme.textPrimary }]}>
                    {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.capital})
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.saveProfileBtn, { backgroundColor: COLORS.greenDark }]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveProfileBtnText}>حفظ التعديلات</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* View Mode */
            <View style={styles.profileViewRow}>
              <View style={[styles.profileAvatar, { backgroundColor: avatarBgColor }]}>
                <Text style={styles.profileAvatarIcon}>👤</Text>
              </View>
              <View style={styles.profileDetailsCol}>
                <Text style={[styles.profileName, { color: theme.textPrimary }]}>
                  {userProfile?.name || 'مستخدم رحيق'}
                </Text>
                <Text style={[styles.profileCountry, { color: theme.textSecondary }]}>
                  {userProfile?.country?.flag} {userProfile?.country?.name} - {userProfile?.country?.capital}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Appearance & Preferences */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <View />
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
              <Ionicons name="color-palette-outline" size={20} color={COLORS.greenDark} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>المظهر والتفضيلات</Text>
            </View>
          </View>

          {/* Dark Mode Switch */}
          <View style={styles.settingRow}>
            <Switch
              value={settings.isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: COLORS.greenLight }}
              thumbColor={settings.isDarkMode ? COLORS.yellowGold : '#f4f3f4'}
            />
            <View style={styles.settingLabelCol}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>الوضع الليلي (Dark Mode)</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                التبديل بين الوضع النهاري والليلي بألوان الهوية البصرية
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Haptics Switch */}
          <View style={styles.settingRow}>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: '#767577', true: COLORS.greenLight }}
              thumbColor={settings.hapticsEnabled ? '#ffffff' : '#f4f3f4'}
            />
            <View style={styles.settingLabelCol}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>الاهتزاز التفاعلي (Haptics)</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                اهتزاز ناعم وسلس عند الضغط على المسبحة والأزرار
              </Text>
            </View>
          </View>
        </View>

        {/* Social & Contact Buttons */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <View />
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
              <Ionicons name="share-social-outline" size={20} color={COLORS.greenDark} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>التواصل والمتابعة</Text>
            </View>
          </View>

          {/* Instagram */}
          <TouchableOpacity
            style={[styles.linkBtn, { borderColor: theme.cardBorder }]}
            onPress={handleOpenInstagram}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-instagram" size={22} color="#E1306C" />
            <Text style={[styles.linkBtnText, { color: theme.textPrimary }]}>تابعنا على انستغرام</Text>
            <Ionicons name="open-outline" size={16} color={theme.textSecondary} />
          </TouchableOpacity>

          {/* Telegram */}
          <TouchableOpacity
            style={[styles.linkBtn, { borderColor: theme.cardBorder }]}
            onPress={handleOpenTelegram}
            activeOpacity={0.7}
          >
            <Ionicons name="paper-plane" size={22} color="#229ED9" />
            <Text style={[styles.linkBtnText, { color: theme.textPrimary }]}>انضم لنا عبر تيليجرام</Text>
            <Ionicons name="open-outline" size={16} color={theme.textSecondary} />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            style={[styles.linkBtn, { borderColor: theme.cardBorder }]}
            onPress={() => setIsPrivacyModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.greenDark} />
            <Text style={[styles.linkBtnText, { color: theme.textPrimary }]}>سياسة الخصوصية والأمان</Text>
            <Ionicons name="chevron-back" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout / Reset Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogoutPrompt}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#ffffff" style={{ marginLeft: 6 }} />
            <Text style={styles.logoutBtnText}>تسجيل الخروج وحذف جميع البيانات</Text>
          </TouchableOpacity>
          <Text style={[styles.logoutNotice, { color: theme.textSecondary }]}>
            عند الضغط يتم مسح البيانات المحفوظة محلياً والعودة لشاشة الترحيب
          </Text>
        </View>

        {/* App Version Info */}
        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, { color: theme.textSecondary }]}>
            تطبيق رحيق - Raheeq • الإصدار 1.0.0 (2026)
          </Text>
          <Text style={[styles.versionText, { color: theme.textSecondary }]}>
            جميع الحقوق محفوظة لله تعالى
          </Text>
        </View>
      </ScrollView>

      {/* Country Selection Modal */}
      <Modal
        visible={isCountryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCountryModalVisible(false)}
      >
        <SafeAreaView style={styles.modalBackdrop}>
          <View style={[styles.countryModalCard, { backgroundColor: theme.cardBg }]}>
            <View style={styles.countryModalHeader}>
              <TouchableOpacity onPress={() => setIsCountryModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>اختر البلد والعاصمة</Text>
            </View>

            <TextInput
              style={[styles.countrySearchInput, { backgroundColor: theme.inputBg, color: theme.textPrimary }]}
              placeholder="ابحث..."
              placeholderTextColor="#888"
              value={countrySearch}
              onChangeText={setCountrySearch}
              textAlign="right"
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItemRow}
                  onPress={() => {
                    setSelectedCountry(item);
                    setIsCountryModalVisible(false);
                  }}
                >
                  <Text style={styles.countryItemFlag}>{item.flag}</Text>
                  <Text style={[styles.countryItemText, { color: theme.textPrimary }]}>
                    {item.name} ({item.capital})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Privacy Policy Full Modal */}
      <Modal
        visible={isPrivacyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPrivacyModalVisible(false)}
      >
        <SafeAreaView style={styles.modalBackdrop}>
          <View style={[styles.privacyModalCard, { backgroundColor: theme.cardBg }]}>
            <View style={styles.countryModalHeader}>
              <TouchableOpacity onPress={() => setIsPrivacyModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>سياسة الخصوصية</Text>
            </View>

            <ScrollView style={{ padding: 12 }}>
              <Text style={[styles.privacyFullText, { color: theme.textPrimary }]}>
                {PRIVACY_POLICY_TEXT}
              </Text>
            </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 34,
    gap: 14,
  },
  sectionCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  editBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(18, 112, 25, 0.08)',
  },
  editBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.greenDark,
  },
  profileViewRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarIcon: {
    fontSize: 26,
  },
  profileDetailsCol: {
    alignItems: 'flex-end',
    flex: 1,
  },
  profileName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  profileCountry: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    marginTop: 2,
  },
  editForm: {
    gap: 10,
  },
  formGroup: {
    gap: 4,
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    textAlign: 'right',
  },
  inputField: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  genderRow: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  genderToggleBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  genderToggleText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  countrySelectBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  countrySelectText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  saveProfileBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveProfileBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: '#ffffff',
  },
  settingRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabelCol: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  settingDesc: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  linkBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  linkBtnText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
    marginRight: 10,
  },
  logoutSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  logoutBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    elevation: 2,
  },
  logoutBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#ffffff',
  },
  logoutNotice: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 10,
    gap: 2,
  },
  versionText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  countryModalCard: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '75%',
    padding: 16,
  },
  privacyModalCard: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: '85%',
    padding: 16,
  },
  countryModalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  countrySearchInput: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: FONTS.medium,
    fontSize: 13,
    marginBottom: 10,
  },
  countryItemRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryItemFlag: {
    fontSize: 20,
  },
  countryItemText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  privacyFullText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 22,
    textAlign: 'right',
  },
});
