import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { registerThunk, googleLoginThunk, clearError } from "@/store/slices/authSlice.js";
import { Button } from "@/components/ui/Button.js";
import { Input } from "@/components/ui/Input.js";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError("");
    dispatch(clearError());

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    dispatch(registerThunk({ email, password, name }));
  }

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {displayError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {displayError}
        </div>
      )}

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(response) => {
            if (response.credential) {
              dispatch(clearError());
              dispatch(googleLoginThunk(response.credential));
            }
          }}
          onError={() => {
            dispatch(clearError());
          }}
          theme="outline"
          size="large"
          width="100%"
          text="signup_with"
        />
      </div>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400">or</span>
        </div>
      </div>

      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 6 characters"
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Repeat your password"
        required
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
