"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import {
  ref,
  get,
  set,
} from "firebase/database";

import {
  auth,
  database,
  googleProvider,
} from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const [error, setError] = useState("");

  /**
   * Creates a Realtime Database profile automatically
   * the first time a Firebase Auth user logs in.
   *
   * Existing users are NOT overwritten.
   */
  async function ensureUserProfile(user: any) {
    const userRef = ref(database, `users/${user.uid}`);

    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, {
        name:
          user.displayName ||
          user.email?.split("@")[0] ||
          "Hospital Staff",

        email: user.email || "",

        role: "STAFF",

        department: "Hospital Staff",

        hospitalName: "MedMatch Hospital",

        status: "ACTIVE",

        createdAt: Date.now(),
      });
    }
  }

  /**
   * EMAIL + PASSWORD LOGIN
   */
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      await ensureUserProfile(credential.user);

      router.replace("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Login error:", err);

      switch (err?.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Invalid email or password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/too-many-requests":
          setError(
            "Too many login attempts. Please try again later."
          );
          break;

        default:
          setError(
            "Unable to sign in. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  }

  /**
   * CREATE EMAIL/PASSWORD ACCOUNT
   *
   * New accounts are automatically stored under:
   * /users/{firebaseUid}
   */
  async function handleCreateAccount() {
    if (!email.trim() || !password.trim()) {
      setError(
        "Enter an email and password to create an account."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setSignupLoading(true);
      setError("");

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      await ensureUserProfile(credential.user);

      router.replace("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Create account error:", err);

      switch (err?.code) {
        case "auth/email-already-in-use":
          setError(
            "An account already exists with this email. Please sign in."
          );
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/weak-password":
          setError(
            "Please choose a stronger password."
          );
          break;

        default:
          setError(
            "Unable to create the account. Please try again."
          );
      }
    } finally {
      setSignupLoading(false);
    }
  }

  /**
   * GOOGLE LOGIN
   *
   * Any successfully authenticated Google account
   * gets a Realtime Database profile automatically.
   */
  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);
      setError("");

      const credential =
        await signInWithPopup(
          auth,
          googleProvider
        );

      await ensureUserProfile(credential.user);

      router.replace("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Google login error:", err);

      if (
        err?.code === "auth/popup-closed-by-user"
      ) {
        setError("");
        return;
      }

      if (
        err?.code === "auth/popup-blocked"
      ) {
        setError(
          "Google sign-in popup was blocked by your browser."
        );
        return;
      }

      setError(
        "Unable to sign in with Google. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  const busy =
    loading ||
    googleLoading ||
    signupLoading;

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand">
          <div className="brand-icon">
            +
          </div>

          <div>
            <h1>MedMatch AI</h1>
            <p>Hospital Procurement Platform</p>
          </div>
        </div>

        <div className="heading">
          <h2>Hospital Staff Login</h2>

          <p>
            Sign in to access MedMatch AI
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="staff@hospital.com"
            autoComplete="email"
            disabled={busy}
          />

          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={busy}
          />

          <button
            type="submit"
            className="primary-button"
            disabled={busy}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>

        <button
          type="button"
          className="create-button"
          onClick={handleCreateAccount}
          disabled={busy}
        >
          {signupLoading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        <div className="divider">
          <span />
          <p>or</p>
          <span />
        </div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
          disabled={busy}
        >
          <span className="google-icon">
            G
          </span>

          {googleLoading
            ? "Signing In..."
            : "Continue with Google"}
        </button>

        <p className="footer-text">
          MedMatch AI • Authorized hospital
          platform
        </p>
      </section>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(
              circle at top left,
              rgba(74, 145, 107, 0.17),
              transparent 32%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(180, 190, 186, 0.3),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #f2f4f3 0%,
              #e8f1ec 50%,
              #ecefed 100%
            );
        }

        .login-card {
          width: 100%;
          max-width: 430px;
          padding: 36px;
          border-radius: 22px;
          background: rgba(
            255,
            255,
            255,
            0.94
          );
          border: 1px solid
            rgba(43, 80, 64, 0.1);
          box-shadow:
            0 20px 60px
            rgba(34, 61, 50, 0.1);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 34px;
        }

        .brand-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #1f6949;
          color: white;
          font-size: 27px;
          font-weight: 400;
        }

        .brand h1 {
          margin: 0;
          font-size: 20px;
          color: #163c2d;
        }

        .brand p {
          margin: 3px 0 0;
          color: #78857f;
          font-size: 12px;
        }

        .heading {
          margin-bottom: 26px;
        }

        .heading h2 {
          margin: 0 0 7px;
          font-size: 28px;
          color: #17251f;
        }

        .heading p {
          margin: 0;
          color: #718078;
          font-size: 14px;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 7px;
          color: #36483f;
          font-size: 13px;
          font-weight: 600;
        }

        input {
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 18px;
          padding: 13px 14px;
          border: 1px solid #d8e0dc;
          border-radius: 10px;
          background: #fbfcfb;
          color: #1c2923;
          font-size: 14px;
          outline: none;
          transition:
            border 0.2s ease,
            box-shadow 0.2s ease;
        }

        input:focus {
          border-color: #3d8665;
          box-shadow:
            0 0 0 3px
            rgba(61, 134, 101, 0.1);
        }

        button {
          width: 100%;
          min-height: 46px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition:
            transform 0.15s ease,
            opacity 0.15s ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .primary-button {
          border: none;
          background: #1f6949;
          color: white;
        }

        .create-button {
          margin-top: 11px;
          border: 1px solid #b7cdc1;
          background: #f5faf7;
          color: #285a43;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0;
        }

        .divider span {
          flex: 1;
          height: 1px;
          background: #e2e7e4;
        }

        .divider p {
          margin: 0;
          color: #98a29d;
          font-size: 12px;
        }

        .google-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid #dce2df;
          background: white;
          color: #34443d;
        }

        .google-icon {
          font-size: 17px;
          font-weight: 700;
        }

        .error-message {
          margin-bottom: 18px;
          padding: 12px 14px;
          border-radius: 9px;
          background: #fff1f1;
          border: 1px solid #f3cccc;
          color: #a63939;
          font-size: 13px;
        }

        .footer-text {
          margin: 26px 0 0;
          text-align: center;
          color: #98a39d;
          font-size: 11px;
        }

        @media (max-width: 520px) {
          .login-page {
            padding: 16px;
          }

          .login-card {
            padding: 26px 20px;
            border-radius: 18px;
          }

          .heading h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </main>
  );
}