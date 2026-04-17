import { DEMO_CMS_CONNECTIONS, DEMO_PUBLISH_JOBS } from '@/lib/demo-data';
import { CmsConnectionCard } from '@/components/publish/cms-connection-card';
import { PublishJobTable } from '@/components/publish/publish-job-table';

export default function PublishPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Publish</h1>
        <p className="text-sm text-zinc-400">
          Manage CMS connections and monitor publish jobs.
        </p>
      </div>

      {/* CMS Connections */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-300">CMS connections</h2>
          <button
            type="button"
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-600"
          >
            + Add connection
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {DEMO_CMS_CONNECTIONS.map(conn => (
            <CmsConnectionCard key={conn.id} connection={conn} />
          ))}
        </div>
      </section>

      {/* Publish jobs */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-medium text-zinc-300">Recent publish jobs</h2>
        </div>
        <PublishJobTable jobs={DEMO_PUBLISH_JOBS} />
      </section>
    </div>
  );
}
