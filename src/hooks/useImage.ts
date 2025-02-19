import { useState, useCallback } from "react";

interface UseImageProps {
  onLoadingComplete?: () => void;
  onError?: () => void;
}

export const useImage = ({
  onLoadingComplete,
  onError,
}: UseImageProps = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  const handleError = useCallback(() => {
    setError(true);
    setIsLoading(false);
    onError?.();
  }, [onError]);

  return {
    isLoading,
    error,
    handleLoadComplete,
    handleError,
  };
};
