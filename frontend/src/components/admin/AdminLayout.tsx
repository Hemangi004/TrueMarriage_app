import React, { useState } from 'react';
import { AdminSidebar, type AdminSection } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { AdminDashboard } from './AdminDashboard';
import { AdminUsersPage } from './AdminUsersPage';
import { AdminSettingsPage } from './AdminSettingsPage';
import { AdminSecurityPage } from './AdminSecurityPage';
import { AdminTemplateManager } from './AdminTemplateManager';
import { AdminUserAnalysisPage } from './AdminUserAnalysisPage';
import { AdminNotificationsPage } from './AdminNotificationsPage';
import { AdminPlaceholderPage } from './AdminPlaceholderPage';

export const AdminLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-900 selection:bg-[#F01472]/20 selection:text-[#F01472]">
      {/* Admin Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={(section) => setActiveSection(section)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Admin Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#F8FAFC]">
        {/* Topbar */}
        <AdminTopbar
          activeSection={activeSection}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 p-3 sm:p-6 bg-[#F8FAFC]">
          {activeSection === 'dashboard' && (
            <AdminDashboard onSelectSection={(section) => setActiveSection(section)} />
          )}
          {activeSection === 'notifications' && <AdminNotificationsPage />}
          {activeSection === 'user_analysis' && <AdminUserAnalysisPage />}
          {activeSection === 'templates' && <AdminTemplateManager />}
          {activeSection === 'security' && <AdminSecurityPage />}
          {activeSection === 'users' && <AdminUsersPage />}
          {activeSection === 'settings' && <AdminSettingsPage />}
          {activeSection !== 'dashboard' &&
            activeSection !== 'notifications' &&
            activeSection !== 'user_analysis' &&
            activeSection !== 'templates' &&
            activeSection !== 'security' &&
            activeSection !== 'users' &&
            activeSection !== 'settings' && (
              <AdminPlaceholderPage section={activeSection} />
            )}
        </main>
      </div>
    </div>
  );
};
