import { useCallback, useMemo, useRef, useState } from 'react';
import { Request } from 'src/shared/api';

import { UseFetch, UseFetchParams } from './types';

class ApiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const DEFAULT_SUCCESS_MESSAGE = 'Your action has been completed successfully.';
const DEFAULT_ERROR_MESSAGE = 'Your action could not be completed. Please try again later.';

export const useFetch: UseFetch = <T, K>(
  cb: Request<T, K>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  { init = {} as K, onError = () => {}, onSuccess = () => {} }: UseFetchParams<K> = {}
) => {
  const initValue = useMemo(() => init ?? ({} as K), [init]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<K>(initValue);
  const [message, setMessage] = useState<null | string>(null);
  const [error, setError] = useState<null | string>(null);
  const isEnabled = useRef(true);

  const handleReset = useCallback(() => {
    setMessage(null);
    setError(null);
    setData(initValue);
    isEnabled.current = true;
  }, [initValue]);

  const fetchData = useCallback(
    async (args = {} as T) => {
      if (!isEnabled.current) return;
      isEnabled.current = false;
      setIsLoading(true);
      try {
        const response = await cb(args);
        if (!response.ok) throw new ApiError(response.error);
        const message = response.message ?? DEFAULT_SUCCESS_MESSAGE;
        const result = response.data ?? initValue;
        setData(result);
        setMessage(response.message);
        onSuccess({ data: result, message });
      } catch (error) {
        setData(initValue);
        setMessage(null);
        const message = error instanceof ApiError ? error.message : DEFAULT_ERROR_MESSAGE;
        onError({ data: initValue, message });
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [cb, initValue, onError, onSuccess]
  );

  return [{ data, error, handleReset, isLoading, message }, fetchData];
};