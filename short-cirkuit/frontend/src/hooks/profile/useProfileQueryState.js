import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PROFILE_QUERY_TAB,
  PROFILE_TABS,
  PROFILE_TAB_QUERY
} from '../../components/profile/profile.constants';

export default function useProfileQueryState({ searchParams, setSearchParams, isAdmin }) {
  const [isSwitchingTab, setIsSwitchingTab] = useState(false);
  const switchTimerRef = useRef(null);

  const tab = isAdmin
    ? PROFILE_TABS.ACCOUNT
    : (PROFILE_QUERY_TAB[searchParams.get('tab')] || PROFILE_TABS.ACCOUNT);

  useEffect(() => {
    if (!isAdmin) return;
    if (searchParams.get('tab') === PROFILE_TAB_QUERY.ACCOUNT) return;
    setSearchParams({ tab: PROFILE_TAB_QUERY.ACCOUNT }, { replace: true });
  }, [isAdmin, searchParams, setSearchParams]);

  useEffect(() => () => {
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
  }, []);

  const selectTab = useCallback((nextTab) => {
    if (isAdmin || nextTab === tab) return;

    setIsSwitchingTab(true);
    setSearchParams({ tab: PROFILE_TAB_QUERY[nextTab] });

    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    switchTimerRef.current = setTimeout(() => {
      setIsSwitchingTab(false);
      switchTimerRef.current = null;
    }, 180);
  }, [isAdmin, tab, setSearchParams]);

  return { tab, selectTab, isSwitchingTab };
}
