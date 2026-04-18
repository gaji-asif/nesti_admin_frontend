import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Button from "../components/ui/button/Button";
import { useUser } from "../hooks/useApiData";

const normalizeLabel = (value: string) =>
  value
    .replace("interest.", "")
    .replace("language.", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
};

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading, error } = useUser(id);
  const [isActive, setIsActive] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (user) {
      setIsActive(Boolean(user.is_active));
    }
  }, [user]);

  const fullName = useMemo(() => {
    const first = user?.first_name?.trim();
    const last = user?.last_name?.trim();
    if (first || last) return [first, last].filter(Boolean).join(" ");
    return user?.name?.trim() || "Unknown user";
  }, [user]);

  const interests = user?.profile?.interests ?? [];
  const languages = user?.profile?.language ?? [];
  const childrenAgeRanges = user?.profile?.children_age_range ?? [];

  const handleStatusToggle = () => {
    const actionLabel = isActive ? "deactivate" : "activate";
    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel} this account?`
    );

    if (!confirmed) return;

    // UI-only status toggle until admin endpoint is available.
    setIsActive((prev) => !prev);
  };

  const handleSafetyPlaceholder = (action: string) => {
    window.alert(`${action} is not wired yet. Add backend endpoint to enable it.`);
  };

  const handleSaveNote = () => {
    if (!note.trim()) {
      window.alert("Please enter a note before saving.");
      return;
    }
    window.alert("Safety note saved locally for now.");
    setNote("");
  };

  return (
    <>
      <PageMeta
        title={`User ${id ?? ""} | Nesti Admin`}
        description="Single-view user profile dashboard for admin"
      />
      <PageBreadcrumb pageTitle={user ? `User #${user.id}` : "User Detail"} />

      <div className="mb-4">
        <Link to="/all-users" className="inline-flex">
          <Button size="sm" variant="outline" className="px-3 py-2">
            Back to all users
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
          Loading user profile...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && !user && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          User not found.
        </div>
      )}

      {!loading && !error && user && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Quick Info
              </p>
              <div className="flex flex-col items-center text-center">
                {user.profile?.users_img_url ? (
                  <img
                    src={user.profile.users_img_url}
                    alt={fullName}
                    className="mb-4 h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-2xl font-semibold text-gray-700 dark:bg-gray-800 dark:text-white/90">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}

                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {fullName}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</p>

                <span
                  className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Contact
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">{user.email || "N/A"}</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {user.profile?.location || "Unknown location"}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Postcode: {user.profile?.postcode || "N/A"}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6 lg:col-span-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Detailed Data
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">First Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.first_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.last_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.profile?.location ? normalizeLabel(user.profile.location) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Profile Created</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(user.profile?.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Registered At</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-5 dark:border-white/[0.06]">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Bio</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{user.profile?.bio || "No bio provided."}</p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {interests.length ? (
                      interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        >
                          {normalizeLabel(interest)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {languages.length ? (
                      languages.map((language) => (
                        <span
                          key={language}
                          className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                        >
                          {normalizeLabel(language)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Children Age Ranges</p>
                  <div className="flex flex-wrap gap-2">
                    {childrenAgeRanges.length ? (
                      childrenAgeRanges.map((ageRange) => (
                        <span
                          key={ageRange}
                          className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                        >
                          {normalizeLabel(ageRange)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6 lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Admin Actions
              </p>

              <div className="space-y-3">
                <Button size="sm" onClick={handleStatusToggle} className="w-full justify-center">
                  {isActive ? "Deactivate Account" : "Activate Account"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSafetyPlaceholder("Lock Account")}
                  className="w-full justify-center"
                >
                  Lock Account
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSafetyPlaceholder("Reset Password Link")}
                  className="w-full justify-center"
                >
                  Send Password Reset
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSafetyPlaceholder("Revoke Sessions")}
                  className="w-full justify-center"
                >
                  Revoke Sessions
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSafetyPlaceholder("Flag Account")}
                  className="w-full justify-center"
                >
                  Flag Account
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Safety Notes
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Write admin note..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={handleSaveNote} className="w-full justify-center">
                  Save Note
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
