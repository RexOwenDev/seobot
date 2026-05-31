import Link from 'next/link';
import type { DemoPublishJob } from '@/lib/demo-data';

const STATUS_STYLES: Record<DemoPublishJob['status'], string> = {
  pending: 'text-stone-500 bg-stone-100 border-stone-200',
  running: 'text-blue-600 bg-blue-50 border-blue-200',
  succeeded: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  failed: 'text-red-600 bg-red-50 border-red-200',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

interface PublishJobTableProps {
  jobs: readonly DemoPublishJob[];
}

export function PublishJobTable({ jobs }: PublishJobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-stone-50 py-10 text-center">
        <p className="text-sm text-stone-500">No publish jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200">
      <table className="w-full text-sm" aria-label="Publish jobs">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500">Article</th>
            <th className="hidden px-4 py-3 text-left text-xs font-medium text-stone-500 sm:table-cell">
              CMS
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-medium text-stone-500 md:table-cell">
              Started
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-stone-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 bg-surface">
          {jobs.map(job => (
            <tr key={job.id} className="transition-colors hover:bg-stone-50">
              <td className="px-4 py-3">
                <Link
                  href={`/articles/${job.articleId}`}
                  className="line-clamp-1 text-xs text-stone-800 hover:text-accent transition-colors"
                >
                  {job.articleH1}
                </Link>
                {job.externalUrl && (
                  <a
                    href={job.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block text-xs text-stone-400 hover:text-stone-500"
                  >
                    View article &rarr;
                  </a>
                )}
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <span className="text-xs capitalize text-stone-500">{job.provider}</span>
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <span className="text-xs text-stone-500">
                  {formatDate(job.startedAt)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={[
                    'rounded border px-2 py-0.5 text-xs capitalize',
                    STATUS_STYLES[job.status],
                  ].join(' ')}
                >
                  {job.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
