// Lightweight MSG91 Web SDK initializer for custom UI usage
// Docs: https://msg91.com/help/sendotp/how-to-integrate-the-new-login-with-otp-widget

let scriptLoading = false;
let scriptLoaded = false;
let initDone = false;

export function isMsg91Configured() {
  return (
    typeof window !== "undefined" &&
    !!process.env.NEXT_PUBLIC_MSG91_WIDGET_ID &&
    !!process.env.NEXT_PUBLIC_MSG91_TOKEN
  );
}

export function isMsg91Ready() {
  return (
    typeof window !== "undefined" && !!window.sendOtp && !!window.verifyOtp
  );
}

export function loadMsg91Widget() {
  return new Promise((resolve, reject) => {
    if (!isMsg91Configured()) {
      return resolve(false);
    }

    if (isMsg91Ready()) {
      return resolve(true);
    }

    if (scriptLoaded && !initDone) {
      tryInit();
      return resolve(isMsg91Ready());
    }

    if (scriptLoading) {
      const check = setInterval(() => {
        if (isMsg91Ready()) {
          clearInterval(check);
          resolve(true);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(check);
        resolve(isMsg91Ready());
      }, 5000);
      return;
    }

    scriptLoading = true;
    const script = document.createElement("script");
    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      tryInit();
      // Wait until methods are exposed
      const startedAt = Date.now();
      const waitReady = setInterval(() => {
        if (isMsg91Ready()) {
          clearInterval(waitReady);
          resolve(true);
        } else if (Date.now() - startedAt > 8000) {
          clearInterval(waitReady);
          reject(new Error("MSG91 SDK not ready"));
        }
      }, 100);
    };
    script.onerror = () => {
      scriptLoading = false;
      reject(new Error("Failed to load MSG91 SDK"));
    };
    document.body.appendChild(script);
  });
}

function tryInit() {
  if (initDone) return;
  if (typeof window === "undefined") return;
  if (typeof window.initSendOTP !== "function") return;

  const configuration = {
    exposeMethods: true,
    // success/failure are optional with custom UI
    success: () => {},
    failure: () => {},
    tokenAuth: process.env.NEXT_PUBLIC_MSG91_TOKEN,
    widgetId: process.env.NEXT_PUBLIC_MSG91_WIDGET_ID,
    captchaRenderId: "", // optional for captcha
  };

  try {
    // Avoid double init
    if (!window.__MSG91_WIDGET_INITIALIZED__) {
      window.initSendOTP(configuration);
      window.__MSG91_WIDGET_INITIALIZED__ = true;
    }
    initDone = true;
  } catch (_) {
    // noop
  }
}

export async function msg91SendOtp(identifier) {
  if (!isMsg91Ready())
    throw new Error("OTP Service is down. Please try after sometime.");
  return new Promise((resolve, reject) => {
    try {
      window.sendOtp(
        normalizeIdentifier(identifier),
        (data) => resolve(data),
        (error) => reject(error)
      );
    } catch (err) {
      reject(err);
    }
  });
}

export async function msg91VerifyOtp(otp, txnIdOptional) {
  if (!isMsg91Ready())
    throw new Error("OTP Service is down. Please try after sometime.");
  return new Promise((resolve, reject) => {
    try {
      const otpValue = String(otp).trim();
      window.verifyOtp(
        otpValue,
        (data) => resolve(data),
        (error) => reject(error),
        txnIdOptional
      );
    } catch (err) {
      reject(err);
    }
  });
}

export async function msg91RetryOtp(channelOrNull = null, reqIdOptional) {
  if (!isMsg91Ready()) throw new Error("MSG91 not ready");
  return new Promise((resolve, reject) => {
    try {
      window.retryOtp(
        channelOrNull,
        (data) => resolve(data),
        (error) => reject(error),
        reqIdOptional
      );
    } catch (err) {
      reject(err);
    }
  });
}

export function msg91GetWidgetData() {
  if (
    typeof window === "undefined" ||
    typeof window.getWidgetData !== "function"
  )
    return null;
  try {
    return window.getWidgetData();
  } catch (_) {
    return null;
  }
}

export function msg91IsCaptchaVerified() {
  if (
    typeof window === "undefined" ||
    typeof window.isCaptchaVerified !== "function"
  )
    return false;
  try {
    return Boolean(window.isCaptchaVerified());
  } catch (_) {
    return false;
  }
}

// Extract access token from various MSG91 verify responses
// Handles shapes like:
// - { type: "success", message: "<jwt>" }
// - { data: { accessToken: "..." } }
// - { accessToken: "..." }
export function msg91ExtractAccessToken(resp) {
  try {
    const d = resp?.data || resp || {};
    if (typeof d.accessToken === "string" && d.accessToken.length > 0) {
      return d.accessToken;
    }
    if (typeof d.message === "string" && d.type === "success") {
      // MSG91 verifyOtp sometimes returns JWT in message
      const maybeJwt = d.message.trim();
      if (maybeJwt.split(".").length === 3) return maybeJwt;
    }
    if (d.data && typeof d.data.accessToken === "string") {
      return d.data.accessToken;
    }
    return null;
  } catch (_) {
    return null;
  }
}

// Add +91 (as 91 for MSG91) when identifier is a 10-digit Indian mobile
function normalizeIdentifier(value) {
  if (!value) return value;
  const str = String(value).trim();
  if (str.includes("@")) return str; // email
  let digits = str.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }
  if (digits.startsWith("91")) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

// Extract request/reference id from SDK responses (varies by account)
export function msg91ExtractReqId(resp) {
  try {
    const d = resp?.data || resp || {};
    return (
      d.reqId ||
      d.requestId ||
      d.txnId ||
      d.req_id ||
      d.referenceId ||
      d.reference ||
      null
    );
  } catch (_) {
    return null;
  }
}
