 
 

let isLoggingOut = false;

export const logoutUser = async () => {
  try {
    const { result }: any = await authClient.logout();
    clearAppLocalStorage();
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Logout failed:", error);
    return { success: false, message: (error as Error).message };
  }
};

const notifyUser = (alert: { title: string; message: string }) => {
  showNotification({
    title: alert.title,
    message: alert.message,
    color: "red",
  });
};

export const triggerAutoLogout = async (
  redirectPath = "/auth",
  delay = 2000,
  alert?: Parameters<typeof notifyUser>[0] | null,
) => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  if (alert) {
    notifyUser(alert);
  }

  setTimeout(async () => {
    await logoutUser();
    window.location.href = redirectPath;
    isLoggingOut = false;
  }, delay);
};

/**
 * Description - GetNameInitials accepts a name (Firstname and Lastname) separated by a space,
 * and collects the first characters of each name
 * converts them to uppercase
 * and returns these first two characters
 * @param {any} name:string
 * @returns {any}
 */
export const getNameInitials = (name: string): string => {
  return name
    .split(" ")
    .reduce((acc, word) => acc + (word[0] || ""), "")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Description - Set current country in localStorage
 * @param {string} countryName
 * @returns {void}
 */
export const setCountryLocalStorage = (countryId: string): void => {
  localStorage.setItem("country", countryId);
};

export const capitalize = (str: string | null | undefined): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "N/A";

/**
 * Helper to check if a string is already URL encoded.
 */
const isEncoded = (value: string): boolean => {
  try {
    return decodeURIComponent(value) !== value;
  } catch {
    return false;
  }
};

/**
 * Description - generateQueryString handles dynamic key-value pairs
 * and ensures the generated query string is URL-safe and formatted correctly.
 * Example, '?name=NG&code=234&order=ASC'
 * @param {any} params:QueryParams
 * @returns {any}
 */
export const generateQueryString = (params: unknown): string => {
  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null) // Remove undefined or null values
    .map(([key, value]) => {
      const stringValue = String(value);
      const encodedValue = isEncoded(stringValue)
        ? stringValue
        : encodeURIComponent(stringValue);
      return `${encodeURIComponent(key)}=${encodedValue}`;
    })
    .join("&");
  return `?${queryString}`;
};

export const handleErrorByStatus = (
  status: number,
  message: string,
  errorType?: string,
) => {
  const createAlert = (status: number, title: string, message: string) => ({
    id: `${status}-${Date.now()}`,
    title,
    message,
    type: "error",
    status,
    timestamp: Date.now(),
  });

  const errorActions: Record<number, () => void> = {
    401: () => {
      let alert;
      // handles ERR_APG_3, ERR_USR_3, ERR_ODR_3 etc.
      if (errorType?.includes("_3")) {
        alert = createAlert(
          401,
          "Session has timed out - redirecting to login.",
          message,
        );
        triggerAutoLogout("/auth", 2000, alert);
      }
      if (
        errorType === "ERR_APG_5" &&
        !window.location.href.endsWith("/auth/awaiting-approval")
      ) {
        alert = createAlert(
          401,
          "User is unapproved - redirecting to awaiting approval screen",
          message,
        );
        triggerAutoLogout("/auth/awaiting-approval", 3000, alert);
      }
    },
    403: () => {
      const alert = createAlert(403, "Forbidden", message);
      notifyUser(alert);
    },
    500: () => {
      const alert = createAlert(500, "Server Error", message);
      notifyUser(alert);
    },
  };

  if (errorActions[status]) {
    errorActions[status]();
  } else {
    const alert = createAlert(
      status,
      "Unexpected Error",
      message || "An unexpected error occurred.",
    );
    notifyUser(alert);
  }
};

/**
 * Description - Formats a number as a price with comma separators with decimal places.
 * @param amount - The number to format
 * @param decimalPlaces - The number of decimal
 * @returns - The formatted amount string
 */
export const formatAmount = (
  amount: number,
  decimalPlaces: number = 0,
): string => {
  return amount?.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

export const formatAmountWithCurrency = (
  countryName: string,
  amount: number,
  decimalPlaces: number = 0,
) => {
  if (amount < 0)
    return `-${getCountryCurrency(countryName)}${Math.abs(amount).toLocaleString()}`;
  return `${getCountryCurrency(countryName)}${formatAmount(amount, decimalPlaces)}`;
};

export const getCountryCurrency = (countryName: string) => {
  switch (countryName) {
    case "Nigeria":
      return "₦";
    case "Ghana":
      return "GH₵";
    case "Mozambique":
      return "MT";
    case "South Africa":
      return "R";
    case "Uganda":
      return "UGX";
    case "Tanzania":
      return "TZS";
    case "Zambia":
      return "ZK";
    default:
      return "₦";
  }
};

/**
 * Clears only the app-specific localStorage keys: country, persist:root, verifier
 */
export const clearAppLocalStorage = (): void => {
  const keysToRemove = ["country", "persist:root", "verifier"];
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};
