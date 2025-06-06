import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDashboardAnimations } from "./dashboardAnimations";
import dashboardStyles from "./dashboardStyles";

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { fadeAnim } = useDashboardAnimations();

  const [darkTheme, setDarkTheme] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [accountInfo, setAccountInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  });

  // Mock data for transactions
  useEffect(() => {
    const mockTransactions = [
      {
        id: "1",
        title: "Salary",
        amount: 3000,
        entry_type: "income",
        category: "salary",
        date: "2023-06-01",
      },
      {
        id: "2",
        title: "Rent",
        amount: 1200,
        entry_type: "expense",
        category: "housing",
        date: "2023-06-05",
      },
      {
        id: "3",
        title: "Groceries",
        amount: 150,
        entry_type: "expense",
        category: "food",
        date: "2023-06-07",
      },
      {
        id: "4",
        title: "Freelance Work",
        amount: 850,
        entry_type: "income",
        category: "freelance",
        date: "2023-06-10",
      },
      {
        id: "5",
        title: "Dinner Out",
        amount: 75,
        entry_type: "expense",
        category: "food",
        date: "2023-06-12",
      },
    ];
    setTransactions(mockTransactions);
  }, []);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const calculateFinancialSummary = () => {
    const totalIncome = transactions
      .filter((t) => t.entry_type === "income")
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const totalExpenses = transactions
      .filter((t) => t.entry_type === "expense")
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
  };

  const { totalIncome, totalExpenses, balance } = calculateFinancialSummary();

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter(
          (t) => t.entry_type === filter || t.category === filter
        );

  const renderTransactionItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={dashboardStyles.transactionItem}
      onPress={() => setShowEditModal(true)}
    >
      <View
        style={[
          dashboardStyles.transactionIcon,
          item.entry_type === "income"
            ? dashboardStyles.incomeIcon
            : dashboardStyles.expenseIcon,
        ]}
      >
        <Icon
          name={item.entry_type === "income" ? "arrow-up" : "arrow-down"}
          size={16}
          color={item.entry_type === "income" ? "#2ecc71" : "#e74c3c"}
        />
      </View>
      <View style={dashboardStyles.transactionDetails}>
        <Text
          style={[
            dashboardStyles.transactionTitle,
            darkTheme && { color: "#e1e1e1" },
          ]}
        >
          {item.title}
        </Text>
        <View style={dashboardStyles.transactionInfo}>
          <Text style={darkTheme ? { color: "#b0b0b0" } : { color: "#666" }}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
          <Text style={darkTheme ? { color: "#b0b0b0" } : { color: "#666" }}>
            {item.date}
          </Text>
        </View>
      </View>
      <Text
        style={[
          dashboardStyles.transactionAmount,
          item.entry_type === "income"
            ? dashboardStyles.incomeAmount
            : dashboardStyles.expenseAmount,
        ]}
      >
        {item.entry_type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        dashboardStyles.container,
        darkTheme && dashboardStyles.darkContainer,
      ]}
    >
      {/* Sidebar */}
      <View
        style={[
          dashboardStyles.sidebar,
          sidebarCollapsed && dashboardStyles.sidebarCollapsed,
          darkTheme && dashboardStyles.darkSidebar,
        ]}
      >
        <View style={dashboardStyles.sidebarHeader}>
          <View style={dashboardStyles.logo}>
            <Icon name="wallet" size={24} color="#e74c3c" />
            {!sidebarCollapsed && (
              <Text
                style={[
                  dashboardStyles.logoText,
                  darkTheme && { color: "#e1e1e1" },
                ]}
              >
                BudgeTaBai
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={toggleSidebar}>
            <Icon
              name={sidebarCollapsed ? "bars" : "times"}
              size={20}
              color={darkTheme ? "#b0b0b0" : "#666"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={dashboardStyles.sidebarNav}>
          <TouchableOpacity
            style={[dashboardStyles.navItem, { borderLeftColor: "#e74c3c" }]}
          >
            <Icon name="chart-line" size={20} color="#e74c3c" />
            {!sidebarCollapsed && (
              <Text
                style={[
                  dashboardStyles.navText,
                  darkTheme && { color: "#e1e1e1" },
                ]}
              >
                Dashboard
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={dashboardStyles.navItem}
            onPress={() => navigation.navigate("Overview")}
          >
            <Icon
              name="chart-pie"
              size={20}
              color={darkTheme ? "#b0b0b0" : "#666"}
            />
            {!sidebarCollapsed && (
              <Text
                style={[
                  dashboardStyles.navText,
                  darkTheme && { color: "#b0b0b0" },
                ]}
              >
                Overview
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={dashboardStyles.navItem}
            onPress={() => navigation.navigate("Settings")}
          >
            <Icon
              name="gear"
              size={20}
              color={darkTheme ? "#b0b0b0" : "#666"}
            />
            {!sidebarCollapsed && (
              <Text
                style={[
                  dashboardStyles.navText,
                  darkTheme && { color: "#b0b0b0" },
                ]}
              >
                Settings
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        <View style={dashboardStyles.sidebarFooter}>
          <View style={dashboardStyles.themeToggle}>
            {!sidebarCollapsed && (
              <Text
                style={[
                  dashboardStyles.themeText,
                  darkTheme && { color: "#e1e1e1" },
                ]}
              >
                Theme
              </Text>
            )}
            <TouchableOpacity onPress={toggleTheme}>
              <View
                style={[
                  dashboardStyles.themeSwitch,
                  darkTheme && dashboardStyles.themeSwitchActive,
                ]}
              >
                <View
                  style={[
                    dashboardStyles.themeSwitchThumb,
                    { transform: [{ translateX: darkTheme ? 20 : 0 }] },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={dashboardStyles.userInfo}>
            <Image
              source={{ uri: accountInfo.avatar }}
              style={dashboardStyles.userAvatar}
            />
            {!sidebarCollapsed && (
              <View>
                <Text
                  style={[
                    dashboardStyles.userName,
                    darkTheme && { color: "#e1e1e1" },
                  ]}
                >
                  {accountInfo.name}
                </Text>
                <Text
                  style={[
                    dashboardStyles.userEmail,
                    darkTheme && { color: "#b0b0b0" },
                  ]}
                >
                  {accountInfo.email}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Main Content */}
      <Animated.View
        style={[
          dashboardStyles.mainContent,
          sidebarCollapsed && dashboardStyles.mainContentExpanded,
          { opacity: fadeAnim },
        ]}
      >
        <View style={dashboardStyles.mainHeader}>
          <View style={dashboardStyles.headerLeft}>
            <Text
              style={[
                dashboardStyles.headerTitle,
                darkTheme && { color: "#e1e1e1" },
              ]}
            >
              Dashboard
            </Text>
          </View>
          <TouchableOpacity
            style={dashboardStyles.addButton}
            onPress={() => setShowTransactionModal(true)}
          >
            <Icon name="plus" size={16} color="white" />
            <Text style={dashboardStyles.addButtonText}>Add Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Overview Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={dashboardStyles.overviewCards}
        >
          <View
            style={[
              dashboardStyles.card,
              dashboardStyles.incomeCard,
              darkTheme && { backgroundColor: "#1e1e1e" },
            ]}
          >
            <View
              style={[
                dashboardStyles.cardIcon,
                { backgroundColor: "rgba(255, 127, 127, 0.1)" },
              ]}
            >
              <Icon name="arrow-trend-up" size={24} color="#ff7f7f" />
            </View>
            <View style={dashboardStyles.cardContent}>
              <Text
                style={[
                  dashboardStyles.cardTitle,
                  darkTheme && { color: "#b0b0b0" },
                ]}
              >
                Income
              </Text>
              <Text
                style={[
                  dashboardStyles.cardAmount,
                  darkTheme && { color: "#e1e1e1" },
                ]}
              >
                ${totalIncome.toFixed(2)}
              </Text>
              <View style={dashboardStyles.trend}>
                <Icon name="arrow-up" size={12} color="#2ecc71" />
                <Text
                  style={[
                    dashboardStyles.trendText,
                    darkTheme && { color: "#b0b0b0" },
                  ]}
                >
                  10% from last month
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              dashboardStyles.card,
              dashboardStyles.expenseCard,
              darkTheme && { backgroundColor: "#1e1e1e" },
            ]}
          >
            <View
              style={[
                dashboardStyles.cardIcon,
                { backgroundColor: "rgba(255, 77, 77, 0.1)" },
              ]}
            >
              <Icon name="arrow-trend-down" size={24} color="#ff4d4d" />
            </View>
            <View style={dashboardStyles.cardContent}>
              <Text
                style={[
                  dashboardStyles.cardTitle,
                  darkTheme && { color: "#b0b0b0" },
                ]}
              >
                Expenses
              </Text>
              <Text
                style={[
                  dashboardStyles.cardAmount,
                  darkTheme && { color: "#e1e1e1" },
                ]}
              >
                ${totalExpenses.toFixed(2)}
              </Text>
              <View style={dashboardStyles.trend}>
                <Icon name="arrow-down" size={12} color="#f39c12" />
                <Text
                  style={[
                    dashboardStyles.trendText,
                    darkTheme && { color: "#b0b0b0" },
                  ]}
                >
                  5% from last month
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              dashboardStyles.card,
              dashboardStyles.balanceCard,
              darkTheme && { backgroundColor: "#1e1e1e" },
            ]}
          >
            <View
              style={[
                dashboardStyles.cardIcon,
                { backgroundColor: "rgba(231, 76, 60, 0.1)" },
              ]}
            >
              <Icon name="wallet" size={24} color="#e74c3c" />
            </View>
            <View style={dashboardStyles.cardContent}>
              <Text
                style={[
                  dashboardStyles.cardTitle,
                  darkTheme && { color: "#b0b0b0" },
                ]}
              >
                Balance
              </Text>
              <Text
                style={[
                  dashboardStyles.cardAmount,
                  darkTheme && { color: "#e1e1e1" },
                ]}
              >
                ${balance.toFixed(2)}
              </Text>
              <View style={dashboardStyles.trend}>
                <Icon name="arrow-up" size={12} color="#2ecc71" />
                <Text
                  style={[
                    dashboardStyles.trendText,
                    darkTheme && { color: "#b0b0b0" },
                  ]}
                >
                  15% from last month
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Transactions Card */}
        <View
          style={[
            dashboardStyles.card,
            dashboardStyles.fullWidthCard,
            darkTheme && { backgroundColor: "#1e1e1e" },
          ]}
        >
          <View style={dashboardStyles.cardHeader}>
            <Text
              style={[
                dashboardStyles.cardHeaderTitle,
                darkTheme && { color: "#e1e1e1" },
              ]}
            >
              Recent Transactions
            </Text>
            <View style={dashboardStyles.filterDropdown}>
              <TouchableOpacity
                style={dashboardStyles.filterButton}
                onPress={() => setFilter(filter === "all" ? "expense" : "all")}
              >
                <Icon name="filter" size={16} color="#e74c3c" />
                <Text
                  style={[
                    dashboardStyles.filterButtonText,
                    darkTheme && { color: "#e74c3c" },
                  ]}
                >
                  {filter === "all" ? "All" : "Filtered"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            style={dashboardStyles.transactionsList}
          />
        </View>
      </Animated.View>

      {/* Add Transaction Modal */}
      <Modal
        visible={showTransactionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTransactionModal(false)}
      >
        <View style={dashboardStyles.modalOverlay}>
          <View
            style={[
              dashboardStyles.modalContent,
              darkTheme && dashboardStyles.darkModalContent,
            ]}
          >
            <View style={dashboardStyles.modalHeader}>
              <Text
                style={[
                  dashboardStyles.modalTitle,
                  darkTheme && { color: "#e1e1e1" },
                ]}
              >
                Add New Transaction
              </Text>
              <TouchableOpacity onPress={() => setShowTransactionModal(false)}>
                <Icon
                  name="times"
                  size={20}
                  color={darkTheme ? "#b0b0b0" : "#666"}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={dashboardStyles.modalBody}>
              <Text
                style={[
                  dashboardStyles.formLabel,
                  darkTheme && { color: "#e1e1e1" },
                ]}
              >
                Transaction Type
              </Text>
              {/* Additional form elements would go here */}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={dashboardStyles.modalOverlay}>
          <View
            style={[
              dashboardStyles.modalContent,
              darkTheme && dashboardStyles.darkModalContent,
            ]}
          >
            <View style={dashboardStyles.modalHeader}>
              <Text
                style={[
                  dashboardStyles.modalTitle,
                  darkTheme && { color: "#e1e1e1" },
                ]}
              >
                Edit Transaction
              </Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Icon
                  name="times"
                  size={20}
                  color={darkTheme ? "#b0b0b0" : "#666"}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={dashboardStyles.modalBody}>
              <Text
                style={[
                  dashboardStyles.formLabel,
                  darkTheme && { color: "#e1e1e1" },
                ]}
              >
                Transaction Details
              </Text>
              {/* Additional form elements would go here */}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DashboardScreen;
