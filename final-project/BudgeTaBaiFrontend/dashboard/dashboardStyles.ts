// dashboardStyles.ts
import { StyleSheet } from 'react-native';

const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  
  // Sidebar styles
  sidebar: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e6e9ed',
    height: '100%',
  },
  sidebarCollapsed: {
    width: 80,
  },
  darkSidebar: {
    backgroundColor: '#1e1e1e',
    borderRightColor: '#333',
  },
  sidebarHeader: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e9ed',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
  },
  sidebarNav: {
    flex: 1,
    paddingVertical: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  navText: {
    color: '#666',
  },
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e6e9ed',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  themeText: {
    fontSize: 14,
  },
  themeSwitch: {
    width: 44,
    height: 24,
    borderRadius: 24,
    backgroundColor: '#999',
    padding: 3,
  },
  themeSwitchActive: {
    backgroundColor: '#e74c3c',
  },
  themeSwitchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'white',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
  },
  
  // Main content styles
  mainContent: {
    flex: 1,
    padding: 16,
  },
  mainContentExpanded: {
    marginLeft: 80,
  },
  mainHeader: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e74c3c',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  
  // Card styles
  overviewCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    flex: 1,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff7f7f',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff4d4d',
  },
  balanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  fullWidthCard: {
    width: '100%',
    marginRight: 0,
    marginTop: 24,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardContent: {
    
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    color: '#2ecc71',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cardHeaderTitle: {
    fontSize: 18,
  },
  filterDropdown: {
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButtonText: {
    color: '#e74c3c',
  },
  
  // Transaction list styles
  transactionsList: {
    maxHeight: 400,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e9ed',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  incomeIcon: {
    backgroundColor: 'rgba(75, 192, 192, 0.1)',
  },
  expenseIcon: {
    backgroundColor: 'rgba(255, 99, 132, 0.1)',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontWeight: '600',
  },
  transactionInfo: {
    flexDirection: 'row',
    fontSize: 14,
    color: '#666',
  },
  transactionCategory: {
    marginRight: 16,
    color: '#666',
  },
  transactionDate: {
    color: '#666',
  },
  transactionAmount: {
    fontWeight: '600',
  },
  incomeAmount: {
    color: '#ff7f7f',
  },
  expenseAmount: {
    color: '#ff4d4d',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '90%',
  },
  darkModalContent: {
    backgroundColor: '#1e1e1e',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e9ed',
  },
  modalTitle: {
    fontSize: 20,
  },
  modalBody: {
    padding: 24,
  },
  formLabel: {
    marginBottom: 4,
    fontWeight: '500',
  },

  aiButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  aiPopover: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 99,
  },
  aiSuggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  aiSuggestionText: {
    fontSize: 14,
    color: '#333',
  },
});



export default dashboardStyles;