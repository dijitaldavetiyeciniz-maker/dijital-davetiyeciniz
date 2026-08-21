import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const fullItems = [
    { name: 'Ana Sayfa', url: '/' },
    ...items
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://dijital-davetiyeciniz.vercel.app${item.url}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Sayfa İşaret Yolu" className="py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl my-4 text-xs">
        <ol className="flex items-center flex-wrap gap-1.5 text-slate-500">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            return (
              <li key={item.url} className="flex items-center gap-1.5">
                {index === 0 ? (
                  <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-rose-500 font-medium transition-colors">
                    <Home className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                ) : isLast ? (
                  <span className="font-bold text-slate-800" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.url} className="text-slate-600 hover:text-rose-500 font-medium transition-colors">
                    {item.name}
                  </Link>
                )}
                {!isLast && <ChevronRight className="w-3 h-3 text-slate-400" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
