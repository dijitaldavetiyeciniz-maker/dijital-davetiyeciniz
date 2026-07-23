import React, { useState, useEffect, useId } from 'react';
import { validateImageUrl } from '@/lib/validateImageUrl';
import { useAssetLoading } from './AssetLoadingContext';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  isHero?: boolean;
  fallbackSrc?: string;
}

export default function SafeImage({ 
  src, 
  alt = '', 
  isHero = false, 
  fallbackSrc, 
  className,
  onLoad,
  onError,
  ...props 
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const id = useId();
  const assetLoading = useAssetLoading();

  useEffect(() => {
    assetLoading?.registerAsset(id);
    return () => assetLoading?.removeAsset(id);
  }, [id, assetLoading]);

  const safeSrc = validateImageUrl(src) ? src : validateImageUrl(fallbackSrc) ? fallbackSrc : null;

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    assetLoading?.markAssetComplete(id);
    if (onLoad) onLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!error) {
      setError(true);
      // We don't mark complete yet if we're falling back
    } else {
      setFallbackError(true);
      assetLoading?.markAssetComplete(id); // Final failure
    }
    if (onError) onError(e);
  };

  useEffect(() => {
    if ((error || !safeSrc) && (!fallbackSrc || fallbackError)) {
      assetLoading?.markAssetComplete(id);
    }
  }, [error, safeSrc, fallbackSrc, fallbackError, id, assetLoading]);

  if (error || !safeSrc) {
    if (!fallbackSrc || fallbackError) {
      // Fallback is also broken or missing
      return (
        <div className={`bg-stone-200 flex items-center justify-center text-stone-400 ${className}`}>
          <span className="text-xs uppercase">{alt || 'Görsel'}</span>
        </div>
      );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={fallbackSrc} alt={alt} className={className} onLoad={handleLoad} onError={handleError} />;
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={safeSrc}
      alt={alt}
      loading={isHero ? "eager" : "lazy"}
      fetchPriority={isHero ? "high" : "auto"}
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={handleLoad}
      onError={handleError}
      className={className}
      {...props}
    />
  );
}
