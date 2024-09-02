import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export const useSupabaseSession = () => {
  const pathname = usePathname()
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setToken(session?.access_token || null);
      setIsLoading(false);
    };
    fetcher();
  }, [pathname]);
  return { session, isLoading, token };
};
