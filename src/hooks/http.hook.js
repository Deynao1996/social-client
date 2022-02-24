import {useState, useCallback} from 'react';

export const useHttp = () => {
  const [itemLoadingStatus, setItemLoadingStatus] = useState('loading');

  const request = useCallback(async (url, withStatus = true, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
    withStatus && setItemLoadingStatus('loading');
    try {
      const response = await fetch(url, {method, body, headers});
      
      if (!(response.status === 400  || response.status === 401) && !response.ok) {
        throw new Error(`Could not fetch ${url}, status: ${response.status}`);
      }
      
      const data = await response.json();
      withStatus && setItemLoadingStatus('idle');
      return data;
    } catch (e) {
      withStatus && setItemLoadingStatus('error');
      throw e;
    }
  }, []);

  const clearError = useCallback(() => setItemLoadingStatus('idle'), []);

  return {itemLoadingStatus, request, clearError}
}
