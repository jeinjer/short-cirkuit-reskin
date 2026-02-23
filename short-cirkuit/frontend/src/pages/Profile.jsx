import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import CircuitLoader from '../components/others/CircuitLoader';
import ProfileAccountSection from '../components/profile/ProfileAccountSection';
import ProfileInquiriesSection from '../components/profile/ProfileInquiriesSection';
import ProfileOrdersSection from '../components/profile/ProfileOrdersSection';
import ProfileTabsNav from '../components/profile/ProfileTabsNav';
import { PROFILE_TABS } from '../components/profile/profile.constants';
import { formatArs, formatDateTimeAr } from '../utils/formatters';
import useProfileAvatar from '../hooks/profile/useProfileAvatar';
import useProfileInquiries from '../hooks/profile/useProfileInquiries';
import useProfileOrders from '../hooks/profile/useProfileOrders';
import useProfileQueryState from '../hooks/profile/useProfileQueryState';

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const { tab, selectTab, isSwitchingTab } = useProfileQueryState({
    searchParams,
    setSearchParams,
    isAdmin
  });

  const {
    selectedAvatar,
    setSelectedAvatar,
    savingProfile,
    saveProfile,
    removeAvatar
  } = useProfileAvatar({ refreshUser });

  const {
    orders,
    ordersPage,
    setOrdersPage,
    ordersMeta,
    loadingOrders,
    loadOrders,
    copyOrderId,
    expandedOrderId,
    setExpandedOrderId
  } = useProfileOrders({ isAdmin });

  const {
    inquiries,
    inquiriesPage,
    setInquiriesPage,
    inquiriesMeta,
    loadingInquiries
  } = useProfileInquiries({ isAdmin });

  const firstName = useMemo(() => user?.name?.split(' ')[0] || 'Cliente', [user]);

  return (
    <main className="min-h-screen bg-[#050507] text-white pt-24 md:pt-28 pb-12 md:pb-16 overflow-x-clip">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        <section className="rounded-2xl border border-cyan-500/20 bg-linear-to-b from-cyan-500/10 to-transparent p-6">
          <p className="text-cyan-300 text-xs uppercase tracking-widest font-mono">Perfil</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-cyber uppercase tracking-tight mt-2">
            Mi cuenta
          </h1>
          <p className="text-gray-300 mt-3 max-w-3xl">
            Hola {firstName}.{' '}
            {isAdmin
              ? 'Gestioná tu perfil desde esta sección.'
              : 'Gestioná tu perfil, pedidos y consultas desde secciones separadas.'}
          </p>
        </section>

        {!isAdmin && <ProfileTabsNav tab={tab} onSelectTab={selectTab} />}

        {isSwitchingTab && !isAdmin && (
          <section className="bg-[#0f0f15] border border-white/10 rounded-2xl p-8 flex justify-center">
            <CircuitLoader size="sm" label="Cargando sección" />
          </section>
        )}

        {!isSwitchingTab && tab === PROFILE_TABS.ACCOUNT && (
          <ProfileAccountSection
            user={user}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
            savingProfile={savingProfile}
            onRemoveAvatar={removeAvatar}
            onSaveProfile={saveProfile}
          />
        )}

        {!isSwitchingTab && !isAdmin && tab === PROFILE_TABS.ORDERS && (
          <ProfileOrdersSection
            loadingOrders={loadingOrders}
            orders={orders}
            ordersPage={ordersPage}
            ordersMeta={ordersMeta}
            onRefresh={() => loadOrders(ordersPage)}
            onCopyOrderId={copyOrderId}
            expandedOrderId={expandedOrderId}
            setExpandedOrderId={setExpandedOrderId}
            formatDateTimeAr={formatDateTimeAr}
            formatArs={formatArs}
            setOrdersPage={setOrdersPage}
          />
        )}

        {!isSwitchingTab && !isAdmin && tab === PROFILE_TABS.INQUIRIES && (
          <ProfileInquiriesSection
            loadingInquiries={loadingInquiries}
            inquiries={inquiries}
            inquiriesMeta={inquiriesMeta}
            inquiriesPage={inquiriesPage}
            setInquiriesPage={setInquiriesPage}
            formatDateTimeAr={formatDateTimeAr}
          />
        )}
      </div>
    </main>
  );
}
