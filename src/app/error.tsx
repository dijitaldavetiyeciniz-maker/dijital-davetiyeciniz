'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Bir şeyler ters gitti!</h2>
      <p className="text-slate-500 max-w-md mb-8">
        Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin veya daha sonra tekrar dönün.
      </p>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl text-left text-xs mb-8 max-w-2xl w-full overflow-auto">
          <p className="font-bold mb-2">Hata Detayı:</p>
          <p className="mb-2 font-mono">{error.message}</p>
          <pre className="whitespace-pre-wrap">{error.stack}</pre>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
        >
          Sayfayı Yenile
        </button>
        <button
          onClick={() => reset()}
          className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
