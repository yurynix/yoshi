import { useContext } from 'react';
import { PublicDataContext } from './PublicDataContext';

export function usePublicData() {
  const publicDataContext = useContext(PublicDataContext);

  if (!publicDataContext.ready && publicDataContext.readyPromise) {
    throw publicDataContext.readyPromise;
  }

  return publicDataContext;
}
