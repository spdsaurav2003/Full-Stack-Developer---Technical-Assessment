"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function LoginPage() {
  const { guestLogin, user, isLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/tasks");
    }
  }, [user, isLoading, router]);

  const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await guestLogin();
      router.push("/tasks");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("Google OAuth is not configured in this demo. Please use Guest Login.");
  };

  if (isLoading) return null;

  return (
    <div className="login-page">
      {/* Background gradient */}
      <div className="login-bg" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="logo-text">TaskFlow</span>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h1>Let&apos;s get back on track</h1>
          <p>Enter your email below to login to your account.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Email input (decorative for guest demo) */}
        <div className="login-form-group">
          <label htmlFor="email-input">Email address</label>
          <input
            id="email-input"
            type="email"
            placeholder="name@company.com"
            className="input-field"
            disabled
          />
        </div>

        {/* Continue as Guest Button */}
        <button
          id="guest-login-btn"
          onClick={handleGuestLogin}
          disabled={loading}
          className="login-guest-btn"
        >
          {loading ? (
            <>
              <span className="spinner" />
              Signing in...
            </>
          ) : (
            "Continue as Guest"
          )}
        </button>

        {/* Divider */}
        <div className="login-divider">
          <span>or</span>
        </div>

        {/* Google login */}
        <button
          id="google-login-btn"
          onClick={handleGoogleLogin}
          className="login-google-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Login with Google
        </button>

        {/* Terms */}
        <p className="login-terms">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>
        </p>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          background: var(--bg-secondary);
        }

        .login-bg {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% -20%, rgba(124, 58, 237, 0.15), transparent),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(59, 130, 246, 0.1), transparent);
          pointer-events: none;
          z-index: 0;
        }

        .login-card {
          position: relative;
          z-index: 1;
          background: var(--bg-primary);
          border: 1px solid var(--border-default);
          border-radius: 16px;
          padding: 40px 36px;
          width: 100%;
          max-width: 380px;
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeIn 400ms ease forwards;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .login-heading h1 {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          margin-bottom: 6px;
        }

        .login-heading p {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 8px;
          font-size: 13px;
          border: 1px solid #fecaca;
        }

        [data-theme="dark"] .login-error {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .login-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .login-form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .login-guest-btn {
          width: 100%;
          padding: 11px 16px;
          background: #111827;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 200ms ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.01em;
        }

        .login-guest-btn:hover:not(:disabled) {
          background: #1f2937;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .login-guest-btn:active { transform: translateY(0); }

        .login-guest-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-subtle);
          font-size: 12px;
        }

        .login-divider::before,
        .login-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--border-default);
        }

        .login-google-btn {
          width: 100%;
          padding: 10px 16px;
          background: var(--bg-primary);
          color: var(--text-secondary);
          border: 1px solid var(--border-default);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 200ms ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .login-google-btn:hover {
          background: var(--bg-hover);
          border-color: var(--border-strong);
        }

        .login-terms {
          font-size: 11.5px;
          color: var(--text-subtle);
          text-align: center;
          line-height: 1.6;
        }

        .login-terms a {
          color: var(--accent);
          text-decoration: none;
        }

        .login-terms a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
