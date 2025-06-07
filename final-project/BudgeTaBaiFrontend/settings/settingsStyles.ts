import { getRedirectError } from "next/dist/client/components/redirect";
import { StyleSheet } from "react-native";

export const settingsStyles = (isDarkTheme: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? "#121212" : "#f8f9fa",
    },

    // Sidebar styles
    sidebar: {
      width: 280,
      backgroundColor: isDarkTheme ? "#1e1e1e" : "#ffffff",
      borderRightWidth: 1,
      borderRightColor: isDarkTheme ? "#333333" : "#e6e9ed",
      position: "absolute",
      height: "100%",
      zIndex: 10,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    sidebarCollapsed: {
      width: 80,
    },
    sidebarHeader: {
      height: 72,
      borderBottomWidth: 1,
      borderBottomColor: isDarkTheme ? "#333333" : "#e6e9ed",
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    logoText: {
      fontSize: 20,
      fontWeight: "700",
      color: isDarkTheme ? "#e1e1e1" : "#333333",
    },
    sidebarNav: {
      flex: 1,
      paddingVertical: 16,
    },
    navItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderLeftWidth: 3,
      borderLeftColor: "transparent",
    },
    activeNavItem: {
      backgroundColor: isDarkTheme
        ? "rgba(231, 76, 60, 0.1)"
        : "rgba(231, 76, 60, 0.05)",
      borderLeftColor: "#e74c3c",
    },
    navText: {
      color: isDarkTheme ? "#b0b0b0" : "#666666",
    },
    activeNavText: {
      color: "#e74c3c",
    },
    sidebarFooter: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: isDarkTheme ? "#333333" : "#e6e9ed",
    },
    themeToggle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    themeText: {
      color: isDarkTheme ? "#e1e1e1" : "#333333",
    },
    themeSwitch: {
      width: 44,
      height: 24,
    },
    slider: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDarkTheme ? "#808080" : "#999999",
      borderRadius: 12,
    },
    sliderActive: {
      backgroundColor: "#e74c3c",
    },
    sliderThumb: {
      position: "absolute",
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: "#fff",
      left: 3,
      top: 3,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingVertical: 16,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    userName: {
      fontWeight: "600",
      fontSize: 14,
      color: isDarkTheme ? "#e1e1e1" : "#333333",
    },
    userEmail: {
      fontSize: 12,
      color: isDarkTheme ? "#808080" : "#999999",
    },

    // Main content styles
    mainContent: {
      flex: 1,
      padding: 16,
    },
    mainHeader: {
      height: 72,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: isDarkTheme ? "#e1e1e1" : "#333333",
    },
    budgetInfo: {
      backgroundColor: isDarkTheme ? "#1e1e1e" : "#ffffff",
      borderWidth: 1,
      borderColor: isDarkTheme ? "#333333" : "#e6e9ed",
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    budgetText: {
      fontSize: 16,
      color: isDarkTheme ? "#e1e1e1" : "#333333",
      marginBottom: 8,
    },
    budgetAmount: {
      fontWeight: "700",
      color: "#e74c3c",
    },
    overviewCards: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 2, // or manually using `marginRight`, `marginBottom` in children
      marginBottom: 24, // adjust based on your --space-lg
    },
    card: {
      backgroundColor: isDarkTheme ? "#1e1e1e" : "#ffffff",
      borderRadius: 16,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      width: "32%",
    },
    weeklyCard: {
      borderTopWidth: 3,
      borderTopColor: "#ff7f7f",
    },
    monthlyCard: {
      borderTopWidth: 3,
      borderTopColor: "#ff4d4d",
    },
    annualCard: {
      borderTopWidth: 3,
      borderTopColor: "#e74c3c",
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    weeklyIcon: {
      backgroundColor: "rgba(75, 192, 192, 0.1)",
    },
    monthlyIcon: {
      backgroundColor: "rgba(255, 99, 132, 0.1)",
    },
    annualIcon: {
      backgroundColor: "rgba(54, 162, 235, 0.1)",
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      color: isDarkTheme ? "#b0b0b0" : "#666666",
      marginBottom: 16,
    },
    amountText: {
      fontSize: 24,
      fontWeight: "700",
      color: isDarkTheme ? "#e1e1e1" : "#333333",
      marginTop: 16,
    },

    // Logout button styles
    logoutButton: {
      backgroundColor: "#e74c3c",
      position: "absolute",
      bottom: 40,
      right: 32,
      width: 152,
      height: 48,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    logoutButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "500",
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: isDarkTheme ? "#1e1e1e" : "#ffffff",
      borderRadius: 8,
      padding: 24,
      width: "80%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    modalText: {
      fontSize: 18,
      color: isDarkTheme ? "#e1e1e1" : "#333333",
      marginBottom: 24,
      textAlign: "center",
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 16,
    },
    confirmButton: {
      backgroundColor: "#d32f2f",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    confirmButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "500",
    },
    cancelButton: {
      backgroundColor: isDarkTheme ? "#333333" : "#e6e9ed",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    cancelButtonText: {
      color: isDarkTheme ? "#e1e1e1" : "#333333",
      fontSize: 16,
      fontWeight: "500",
    },
  });
