import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { getStats, type Stats } from "../../api/statsApi";

// Note: I recommend installing 'lucide-react' for these icons
// import { Users, UserMinus, UserPlus, MessageSquare, UsersRound } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        setLoading(true);
        const result = await getStats();
        if (mounted) {
          setStats(result);
          setError(null);
        }
      } catch {
        if (mounted) setError("Failed to load dashboard stats.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadStats();
    return () => { mounted = false; };
  }, []);

  const safeStats: Stats = stats ?? {
    active_accounts: 0,
    deactive_accounts: 0,
    friend_requests: { daily: 0, weekly: 0, monthly: 0 },
    messages: { daily: 0, weekly: 0, monthly: 0 },
    group_messages: [],
  };

  return (
    <>
      <PageMeta
        title="Nesti Community Dashboard | Admin Panel"
        description="Admin panel for managing community services and metrics."
      />
      
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Community Overview</h2>
          <p className="text-sm text-gray-500">Real-time metrics for your community's health and activity.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
          
          {/* Active Card */}
          <StatCard 
            title="Active Accounts" 
            value={safeStats.active_accounts} 
            loading={loading} 
            color="text-emerald-600" 
          />

          {/* Deactive Card */}
          <StatCard 
            title="Deactive Accounts" 
            value={safeStats.deactive_accounts} 
            loading={loading} 
            color="text-rose-600" 
          />

          {/* Activity Breakdowns */}
          <TrendCard 
            title="Friend Requests" 
            data={safeStats.friend_requests} 
            loading={loading} 
          />

          <TrendCard 
            title="Direct Messages" 
            data={safeStats.messages} 
            loading={loading} 
          />
        </div>

        {/* Group Activity Table-style List */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <h3 className="font-semibold text-gray-800">Top Group Messages</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex animate-pulse space-x-4">
                <div className="h-4 w-full rounded bg-gray-200"></div>
              </div>
            ) : safeStats.group_messages.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-4">No group activity recorded today.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {safeStats.group_messages.map((group) => (
                  <div key={group.group_id} className="flex justify-between py-3 transition-colors hover:bg-gray-50/50 px-2 rounded-lg">
                    <span className="font-medium text-gray-700">{group.group_name}</span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {group.total_messages.toLocaleString()} msgs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Helper Components for Cleaner Code
function StatCard({ title, value, loading, color }: any) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className={`mt-2 text-4xl font-bold ${color}`}>
        {loading ? <span className="animate-pulse">...</span> : value.toLocaleString()}
      </p>
    </div>
  );
}

function TrendCard({ title, data, loading }: any) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-4">
        <TrendItem label="Daily" value={data.daily} loading={loading} />
        <TrendItem label="Weekly" value={data.weekly} loading={loading} />
        <TrendItem label="Monthly" value={data.monthly} loading={loading} />
      </div>
    </div>
  );
}

function TrendItem({ label, value, loading }: any) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
      <p className="text-lg font-semibold text-gray-800">
        {loading ? "..." : value.toLocaleString()}
      </p>
    </div>
  );
}