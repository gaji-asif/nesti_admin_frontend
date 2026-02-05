import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
// removed direct API import; authentication handled by AuthContext

export default function LogInForm() {
  const navigate = useNavigate();
  const location = useLocation();  // Now properly typed
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Delegate authentication (including token storage) to AuthContext
      await login(email, password);
      // Redirect back to intended page if present
      const from = location.state?.from?.pathname || "/";  // Removed 'as any' since it's now typed
      navigate(from, { replace: true });
    } catch (err: any) {
      const status = err?.response?.status;
      const message = status === 401
        ? "Invalid email or password"
        : status === 404
        ? "User not found"
        : err?.response?.data?.message || err?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
        <div className="flex justify-center mb-4">
          <img src="/images/logo/nesti-logo.png" alt="Nesti" width={180} height={36} />
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Log In</h2>
        {error && <div className="mb-3 text-sm text-error-500">{error}</div>}

        <div className="mb-3">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
        </div>

        <div className="mb-3">
          <Label>Password</Label>
          <div className="relative">
            <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
            </button>
          </div>
        </div>

        {/* <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2">
            <Checkbox checked={remember} onChange={setRemember} />
            <span className="text-sm">Remember me</span>
          </label>
          <Link to="/reset-password" className="text-sm text-brand-500">Forgot?</Link>
        </div> */}

        <Button className="w-full" size="sm" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
    </div>
  );
}


