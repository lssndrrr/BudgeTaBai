import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome6";
import { settingsStyles } from "./settingsStyles";
import { settingsAnimations } from "./settingsAnimations";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../App";
import Slider from "@react-native-community/slider";
import dashboardStyles from "../dashboard/dashboardStyles";
import {
  fetchTransactions,
  fetchAccountInfo,
  fetchBudgetLimits,
  saveBudgetLimits,
  logoutUser,
  calculateBudgetTotals,
  checkBudget,
} from "./settingsService";

const Settings = () => {
  const navigation = useNavigation<NavigationProps>();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  type AccountInfo = {
    name?: string;
    email?: string;
    avatar?: string;
  };
  const [themeDark, setThemeDark] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [budgetLimits, setBudgetLimits] = useState({
    weekly_limit: 0,
    monthly_limit: 0,
    annual_limit: 0,
  });
  const [budgetTotals, setBudgetTotals] = useState({
    budgetLimit: 0,
    totalExpenses: 0,
  });
  const [animation] = useState(new Animated.Value(0));

  //   // Initialize app data
  //   useEffect(() => {
  //     const initApp = async () => {
  //       const [transactionsData, accountData, limitsData] = await Promise.all([
  //         fetchTransactions(),
  //         fetchAccountInfo(),
  //         fetchBudgetLimits(),
  //       ]);

  //       setTransactions(transactionsData);
  //       setAccountInfo(accountData);

  //       if (limitsData) {
  //         setBudgetLimits(limitsData);
  //         checkBudget(
  //           transactionsData,
  //           limitsData.weekly_limit,
  //           limitsData.monthly_limit,
  //           limitsData.annual_limit
  //         );
  //       }

  //       // Calculate budget totals
  //       const totals = calculateBudgetTotals(transactionsData);
  //       setBudgetTotals(totals);

  //       // Check theme preference
  //       const savedTheme = await AsyncStorage.getItem("dark-theme");
  //       setIsDarkTheme(savedTheme === "true");
  //     };

  //     initApp();
  //   }, []);

  // Run animations when component mounts
  useEffect(() => {
    settingsAnimations.animateCards(animation);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    setThemeDark(!themeDark);
  };

  // Handle budget limit change
  interface BudgetLimits {
    weekly_limit: number;
    monthly_limit: number;
    annual_limit: number;
  }

  type BudgetLimitKey = keyof BudgetLimits;

  const handleBudgetLimitChange = async (
    key: BudgetLimitKey,
    value: number
  ) => {
    setBudgetLimits((prev: BudgetLimits) => ({ ...prev, [key]: value }));
    // await saveBudgetLimits(key, value);
  };

  // Handle logout
  const handleLogout = async () => {
    // const success = await logoutUser();
    // if (success) {
    //   navigation.navigate("Login");
    // }
  };

  // Get styles based on theme
  const styles = settingsStyles(isDarkTheme);

  return (
    <View
      style={[
        dashboardStyles.container,
        themeDark && dashboardStyles.darkContainer,
      ]}
    >
      {/* Sidebar (copied from Dashboard) */}
      <View
        style={[
          dashboardStyles.sidebar,
          sidebarCollapsed && dashboardStyles.sidebarCollapsed,
          themeDark && dashboardStyles.darkSidebar,
        ]}
      >
        <View style={dashboardStyles.sidebarHeader}>
          <View style={dashboardStyles.logo}>
            <Icon name="wallet" size={20} color="#e74c3c" />
            {!sidebarCollapsed && (
              <Text style={dashboardStyles.logoText}>BudgeTaBai</Text>
            )}
          </View>
          <TouchableOpacity onPress={toggleSidebar}>
            <Icon name="bars" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={dashboardStyles.sidebarNav}>
          <TouchableOpacity
            style={[dashboardStyles.navItem, { borderLeftColor: "#e74c3c" }]}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Icon name="chart-line" size={16} color="#e74c3c" />
            {!sidebarCollapsed && (
              <Text style={[dashboardStyles.navText, { color: "#e74c3c" }]}>
                Dashboard
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={dashboardStyles.navItem}>
            <Icon name="chart-pie" size={16} color="#666" />
            {!sidebarCollapsed && (
              <Text style={dashboardStyles.navText}>Overview</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={dashboardStyles.navItem}
            onPress={() => navigation.navigate("Settings")}
          >
            <Icon name="gear" size={16} color="#666" />
            {!sidebarCollapsed && (
              <Text style={dashboardStyles.navText}>Settings</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={dashboardStyles.sidebarFooter}>
          <View style={dashboardStyles.themeToggle}>
            {!sidebarCollapsed && (
              <Text style={dashboardStyles.themeText}>Theme</Text>
            )}
            <TouchableOpacity
              style={[
                dashboardStyles.themeSwitch,
                themeDark && dashboardStyles.themeSwitchActive,
              ]}
              onPress={toggleTheme}
            >
              <View
                style={[
                  dashboardStyles.themeSwitchThumb,
                  themeDark && { transform: [{ translateX: 20 }] },
                ]}
              />
            </TouchableOpacity>
          </View>

          <View style={dashboardStyles.userInfo}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
              }}
              style={dashboardStyles.userAvatar}
            />
            {!sidebarCollapsed && (
              <View>
                <Text style={dashboardStyles.userName}>Unknown</Text>
                <Text style={dashboardStyles.userEmail}>Unknown Email</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={[styles.mainContent, sidebarCollapsed && styles.mainHeader]}>
        <View style={styles.mainHeader}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Budget Info Section */}
        <View style={styles.budgetInfo}>
          <Text style={styles.budgetText}>
            Budget Limit:{" "}
            <Text style={styles.budgetAmount}>
              ${budgetTotals.budgetLimit.toFixed(2)}
            </Text>
          </Text>
          <Text style={styles.budgetText}>
            Total Expenses:{" "}
            <Text style={styles.budgetAmount}>
              ${budgetTotals.totalExpenses.toFixed(2)}
            </Text>
          </Text>
        </View>

        <View style={styles.overviewCards}>
          {/* Weekly Budget Card */}
          <Animated.View
            style={[
              styles.card,
              styles.weeklyCard,
              {
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, styles.weeklyIcon]}>
                <Icon name="calendar-week" size={24} color="#ff7f7f" />
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Weekly</Text>
              <Slider
                value={budgetLimits.weekly_limit}
                onValueChange={(value: number) =>
                  handleBudgetLimitChange("weekly_limit", value)
                }
                minimumValue={0}
                maximumValue={10000}
                step={100}
                minimumTrackTintColor="#e74c3c"
                maximumTrackTintColor="#e6e9ed"
                thumbTintColor="#e74c3c"
              />
              <Text style={styles.amountText}>
                Limit: ${budgetLimits.weekly_limit.toFixed(2)}
              </Text>
            </View>
          </Animated.View>

          {/* Monthly Budget Card */}
          <Animated.View
            style={[
              styles.card,
              styles.monthlyCard,
              {
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, styles.monthlyIcon]}>
                <Icon name="calendar-alt" size={24} color="#ff4d4d" />
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Monthly</Text>
              <Slider
                value={budgetLimits.monthly_limit}
                onValueChange={(value: number) =>
                  handleBudgetLimitChange("monthly_limit", value)
                }
                minimumValue={0}
                maximumValue={20000}
                step={100}
                minimumTrackTintColor="#e74c3c"
                maximumTrackTintColor="#e6e9ed"
                thumbTintColor="#e74c3c"
              />
              <Text style={styles.amountText}>
                Limit: ${budgetLimits.monthly_limit.toFixed(2)}
              </Text>
            </View>
          </Animated.View>

          {/* Annual Budget Card */}
          <Animated.View
            style={[
              styles.card,
              styles.annualCard,
              {
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [150, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, styles.annualIcon]}>
                <Icon name="calendar" size={24} color="#e74c3c" />
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Annual</Text>
              <Slider
                value={budgetLimits.annual_limit}
                onValueChange={(value: number) =>
                  handleBudgetLimitChange("annual_limit", value)
                }
                minimumValue={0}
                maximumValue={100000}
                step={500}
                minimumTrackTintColor="#e74c3c"
                maximumTrackTintColor="#e6e9ed"
                thumbTintColor="#e74c3c"
              />
              <Text style={styles.amountText}>
                Limit: ${budgetLimits.annual_limit.toFixed(2)}
              </Text>
            </View>
          </Animated.View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.logoutButtonText}>Log out</Text>
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Yes, Log Out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Settings;
