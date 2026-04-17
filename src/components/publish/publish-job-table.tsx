import type { DemoPublishJob } from '@/lib/demo-data';

const STATUS_STYLES: Record<DemoPublishJob['status'], string> = {
  pending: 'text-zinc-500 bg-zinc-800 border-zinc-700',
  running: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  succeeded: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  failed: 'text-red-400 bg-red-400/10 border-red-400/20',
};

interface PublishJobTableProps {
  jobs: readonly DemoPublishJob[];
}

export function PublishJobTable({ jobs }: PublishJobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 py-10 text-center">
        <p className="text-sm text-zinc-500">No publish jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900">
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Article</th>
            <th className="hidden px-4 py-3 text-left text-xs font-medium text-zinc-500 sm:table-cell">
              CMS
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-medium text-zinc-500 md:table-cell">
              Started
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800 bg-zinc-950">
          {jobs.map(job => (
            <tr key={job.id} className="transition-colors hover:bg-zinc-900/50">
              <td className="px-4 py-3">
                <p className="line-clamp-1 text-xs text-zinc-200">{job.articleH1}</p>
                {job.externalUrl && (
                  <a
                    href={job.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block truncate text-xs text-zinc-600 hover:text-zinc-400"
                  >
                    {job.externalUrl}
                  </a>
                )}
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <span className="text-xs capitalize text-zinc-500">{job.provider}</span>
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <span className="text-xs text-zinc-500">
                  {new Date(job.startedAt).toLocaleDateString('en-CA', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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
