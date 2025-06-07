import AsyncStorage from "@react-native-async-storage/async-storage";

// Fetch transactions from API
export async function fetchTransactions() {
  try {
    const token = await AsyncStorage.getItem("access_token");
    const response = await fetch("http://127.0.0.1:8000/api/tracker/entries/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      return data.map((transaction: any) => ({
        ...transaction,
        amount: parseFloat(transaction.amount) || 0,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

// Fetch account info from API
export async function fetchAccountInfo() {
  try {
    const token = await AsyncStorage.getItem("access_token");
    const response = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching account information:", error);
    return null;
  }
}

// Fetch budget limits from API
export async function fetchBudgetLimits() {
  try {
    const token = await AsyncStorage.getItem("access_token");
    const response = await fetch("http://127.0.0.1:8000/api/tracker/budget/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching budget limits:", error);
    return null;
  }
}

// Save budget limits to API
export async function saveBudgetLimits(key: string, value: number) {
  try {
    const token = await AsyncStorage.getItem("access_token");
    const payload = { [key]: value };
    const response = await fetch("http://127.0.0.1:8000/api/tracker/budget/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    console.error("Error saving budget limit:", error);
    return false;
  }
}

// Logout user
export async function logoutUser() {
  try {
    const accessToken = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    if (!refreshToken) {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      return true;
    }
    const response = await fetch("http://127.0.0.1:8000/api/accounts/logout/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    return response.ok;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
}

// Calculate budget totals
export function calculateBudgetTotals(transactions: any[]) {
  const budgetLimit = transactions
    .filter((t) => t.entry_type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.entry_type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return { budgetLimit, totalExpenses };
}

// Check if a transaction is within the last X days
function isWithinLastDays(
  transactionDate: string,
  days: number,
  currentDate: Date
) {
  const transactionDateObj = new Date(transactionDate);
  const differenceInTime = currentDate.getTime() - transactionDateObj.getTime();
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
  return differenceInDays <= days;
}

// Check if budget is exceeded
export function checkBudget(
  transactions: any[],
  weeklyLimit: number,
  monthlyLimit: number,
  annualLimit: number
) {
  const currentDate = new Date();
  const weeklyExpenses = transactions
    .filter(
      (t) =>
        t.entry_type === "expense" && isWithinLastDays(t.date, 7, currentDate)
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = transactions
    .filter(
      (t) =>
        t.entry_type === "expense" && isWithinLastDays(t.date, 30, currentDate)
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const annualExpenses = transactions
    .filter(
      (t) =>
        t.entry_type === "expense" && isWithinLastDays(t.date, 365, currentDate)
    )
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    weeklyExceeded: weeklyExpenses > weeklyLimit,
    monthlyExceeded: monthlyExpenses > monthlyLimit,
    annualExceeded: annualExpenses > annualLimit,
    weeklyExpenses,
    monthlyExpenses,
    annualExpenses,
  };
}
