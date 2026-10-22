import React, { useEffect, useState } from 'react';
import { getAdminAnalyticsApi } from '../../services/apiService';
import { RefreshCw, Sparkles } from 'lucide-react';
import type { AdminSection } from './AdminSidebar';
import {
  GrowthVelocityChart,
  AccountHealthDonut,
  DemographicsCard,
  EngagementFunnelCard,
  PremiumIntentCard,
  AnalyticsSkeletonGrid,
} from './AdminChartCards';

interface AdminDashboardProps {
  onSelectSection?: (section: AdminSection) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getAdminAnalyticsApi();
      setAnalytics(res);
    } catch (err) {
      console.error('Failed to fetch admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Real-time Visual Analytics & Charts Grid */}
      <div className="space-y-4 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F01472]" /> Real-Time Visual Intelligence & Telemetry
            </h3>
            <p className="text-xs text-slate-500">
              Live user growth, member account health, demographic distributions, and funnel conversion
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F01472]' : ''}`} /> Refresh Analytics
          </button>
        </div>

        {loading && !analytics ? (
          <AnalyticsSkeletonGrid />
        ) : (
          <div className="space-y-4">
            {/* Row 1: Growth Velocity & Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GrowthVelocityChart data={analytics?.growth_velocity || []} />
              <DemographicsCard
                data={
                  analytics?.demographics || {
                    gender: {},
                    marital_status: {},
                    age_brackets: {},
                    top_cities: {},
                  }
                }
              />
            </div>

            {/* Row 2: Account Health, Engagement Funnel, Monetization Intent */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AccountHealthDonut
                data={
                  analytics?.users || {
                    total: 0,
                    active: 0,
                    pending: 0,
                    blocked: 0,
                    deactivated: 0,
                    verified_emails: 0,
                    email_verification_rate: 0,
                  }
                }
              />
              <EngagementFunnelCard
                data={
                  analytics?.engagement_funnel || {
                    total_interests: 0,
                    accepted: 0,
                    pending: 0,
                    declined: 0,
                    matched: 0,
                    match_rate: 0,
                  }
                }
              />
              <PremiumIntentCard
                data={
                  analytics?.premium_telemetry || {
                    total_clicks: 0,
                    registered_clicks: 0,
                    guest_clicks: 0,
                    unique_premium_users: 0,
                    intent_rate: 0,
                  }
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
