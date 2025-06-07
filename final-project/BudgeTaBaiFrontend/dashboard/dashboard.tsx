import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import dashboardStyles from "./dashboardStyles";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../App";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themeDark, setThemeDark] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState("income");
  const [editTransactionType, setEditTransactionType] = useState("income");
  const navigation = useNavigation<NavigationProps>();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    setThemeDark(!themeDark);
  };

  const [showAIPopover, setShowAIPopover] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);

  const generateAISuggestions = () => {
    const mockSuggestions = [
      "You're spending 30% more on dining out this month",
      "Consider setting a budget for entertainment",
      "Your savings rate is lower than last month",
      "You could save $50 by reducing coffee shop visits",
    ];
    setAISuggestions(mockSuggestions);
    setShowAIPopover(!showAIPopover);
  };

  return (
    <View
      style={[
        dashboardStyles.container,
        themeDark && dashboardStyles.darkContainer,
      ]}
    >
      {/* Sidebar */}
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
      <View
        style={[
          dashboardStyles.mainContent,
          sidebarCollapsed && dashboardStyles.mainContentExpanded,
        ]}
      >
        <View style={dashboardStyles.mainHeader}>
          <View style={dashboardStyles.headerLeft}>
            <Text style={dashboardStyles.headerTitle}>Dashboard</Text>
          </View>
          <TouchableOpacity
            style={dashboardStyles.addButton}
            onPress={() => setTransactionModalVisible(true)}
          >
            <Icon name="plus" size={16} color="#fff" />
            <Text style={dashboardStyles.addButtonText}>Add Entry</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {/* Overview Cards */}
          <View style={dashboardStyles.overviewCards}>
            <View style={[dashboardStyles.card, dashboardStyles.incomeCard]}>
              <View style={dashboardStyles.cardIcon}>
                <Icon name="arrow-trend-up" size={20} color="#ff7f7f" />
              </View>
              <View style={dashboardStyles.cardContent}>
                <Text style={dashboardStyles.cardTitle}>Income</Text>
                <Text style={dashboardStyles.cardAmount}>$0.00</Text>
              </View>
            </View>

            <View style={[dashboardStyles.card, dashboardStyles.expenseCard]}>
              <View style={dashboardStyles.cardIcon}>
                <Icon name="arrow-trend-down" size={20} color="#ff4d4d" />
              </View>
              <View style={dashboardStyles.cardContent}>
                <Text style={dashboardStyles.cardTitle}>Expenses</Text>
                <Text style={dashboardStyles.cardAmount}>$0.00</Text>
              </View>
            </View>

            <View style={[dashboardStyles.card, dashboardStyles.balanceCard]}>
              <View style={dashboardStyles.cardIcon}>
                <Icon name="wallet" size={20} color="#e74c3c" />
              </View>
              <View style={dashboardStyles.cardContent}>
                <Text style={dashboardStyles.cardTitle}>Balance</Text>
                <Text style={dashboardStyles.cardAmount}>$0.00</Text>
              </View>
            </View>
          </View>

          {/* Transactions Card */}
          <View style={[dashboardStyles.card, dashboardStyles.fullWidthCard]}>
            <View style={dashboardStyles.cardHeader}>
              <Text style={dashboardStyles.cardHeaderTitle}>Entries</Text>
              <View style={dashboardStyles.filterDropdown}>
                <TouchableOpacity style={dashboardStyles.filterButton}>
                  <Icon name="filter" size={16} color="#e74c3c" />
                  <Text style={dashboardStyles.filterButtonText}>Filter</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={dashboardStyles.transactionsList}>
              {/* Empty state */}
              <Text style={{ textAlign: "center", padding: 20, color: "#666" }}>
                No transactions yet
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* AI Assistant Button */}
        <TouchableOpacity
          style={dashboardStyles.aiButton}
          onPress={generateAISuggestions}
        >
          <Icon name="robot" size={24} color="#fff" />
        </TouchableOpacity>

        {/* AI Suggestions Popover */}
        {showAIPopover && (
          <View style={dashboardStyles.aiPopover}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              AI Spending Insights
            </Text>
            {aiSuggestions.map((suggestion, index) => (
              <View key={index} style={dashboardStyles.aiSuggestionItem}>
                <Text style={dashboardStyles.aiSuggestionText}>
                  {suggestion}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              style={{ marginTop: 10, alignSelf: "flex-end" }}
              onPress={() => setShowAIPopover(false)}
            >
              <Text style={{ color: "#e74c3c" }}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Add Transaction Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={transactionModalVisible}
        onRequestClose={() => setTransactionModalVisible(false)}
      >
        <View style={dashboardStyles.modalOverlay}>
          <View
            style={[
              dashboardStyles.modalContent,
              themeDark && dashboardStyles.darkModalContent,
            ]}
          >
            <View style={dashboardStyles.modalHeader}>
              <Text style={dashboardStyles.modalTitle}>Add New Entry</Text>
              <TouchableOpacity
                onPress={() => setTransactionModalVisible(false)}
              >
                <Icon name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={dashboardStyles.modalBody}>
              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Transaction Type</Text>
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      padding: 12,
                      backgroundColor:
                        transactionType === "income" ? "#e74c3c" : "#f5f5f5",
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                      alignItems: "center",
                    }}
                    onPress={() => setTransactionType("income")}
                  >
                    <Text
                      style={{
                        color: transactionType === "income" ? "#fff" : "#666",
                      }}
                    >
                      Income
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      padding: 12,
                      backgroundColor:
                        transactionType === "expense" ? "#e74c3c" : "#f5f5f5",
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                      alignItems: "center",
                    }}
                    onPress={() => setTransactionType("expense")}
                  >
                    <Text
                      style={{
                        color: transactionType === "expense" ? "#fff" : "#666",
                      }}
                    >
                      Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Title</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#e6e9ed",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                  }}
                  placeholder="Enter title"
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Amount</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#e6e9ed",
                    borderRadius: 8,
                    paddingLeft: 12,
                    marginTop: 8,
                  }}
                >
                  <Text style={{ marginRight: 8 }}>$</Text>
                  <TextInput
                    style={{ flex: 1, paddingVertical: 12 }}
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Category</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    borderColor: "#e6e9ed",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                  }}
                >
                  <Text>Food</Text>
                  <Icon name="caret-down" size={16} color="#666" />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Date</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    borderColor: "#e6e9ed",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                  }}
                >
                  <Text>Select date</Text>
                  <Icon name="calendar" size={16} color="#666" />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Notes</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#e6e9ed",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                    height: 100,
                    textAlignVertical: "top",
                  }}
                  placeholder="Add notes"
                  multiline
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    marginRight: 16,
                  }}
                  onPress={() => setTransactionModalVisible(false)}
                >
                  <Text style={{ color: "#666" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    backgroundColor: "#e74c3c",
                  }}
                >
                  <Text style={{ color: "#fff" }}>Save Transaction</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={dashboardStyles.modalOverlay}>
          <View
            style={[
              dashboardStyles.modalContent,
              themeDark && dashboardStyles.darkModalContent,
            ]}
          >
            <View style={dashboardStyles.modalHeader}>
              <Text style={dashboardStyles.modalTitle}>Edit Transaction</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={dashboardStyles.modalBody}>
              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Transaction Type</Text>
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      padding: 12,
                      backgroundColor:
                        editTransactionType === "income"
                          ? "#e74c3c"
                          : "#f5f5f5",
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                      alignItems: "center",
                    }}
                    onPress={() => setEditTransactionType("income")}
                  >
                    <Text
                      style={{
                        color:
                          editTransactionType === "income" ? "#fff" : "#666",
                      }}
                    >
                      Income
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      padding: 12,
                      backgroundColor:
                        editTransactionType === "expense"
                          ? "#e74c3c"
                          : "#f5f5f5",
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                      alignItems: "center",
                    }}
                    onPress={() => setEditTransactionType("expense")}
                  >
                    <Text
                      style={{
                        color:
                          editTransactionType === "expense" ? "#fff" : "#666",
                      }}
                    >
                      Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Title</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#e6e9ed",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                  }}
                  placeholder="Enter title"
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Amount</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#e6e9ed",
                    borderRadius: 8,
                    paddingLeft: 12,
                    marginTop: 8,
                  }}
                >
                  <Text style={{ marginRight: 8 }}>$</Text>
                  <TextInput
                    style={{ flex: 1, paddingVertical: 12 }}
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Category</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    borderColor: "#e6e9ed",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                  }}
                >
                  <Text>Food</Text>
                  <Icon name="caret-down" size={16} color="#666" />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Date</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    borderColor: "#e6e9ed",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                  }}
                >
                  <Text>Select date</Text>
                  <Icon name="calendar" size={16} color="#666" />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={dashboardStyles.formLabel}>Notes</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#e6e9ed",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                    height: 100,
                    textAlignVertical: "top",
                  }}
                  placeholder="Add notes"
                  multiline
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    backgroundColor: "#ff4d4d",
                  }}
                >
                  <Text style={{ color: "#fff" }}>Delete</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={{ color: "#666" }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      borderRadius: 8,
                      backgroundColor: "#e74c3c",
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;
