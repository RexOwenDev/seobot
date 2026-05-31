'use client';

import { useState } from 'react';
import { useDemoState } from '@/lib/demo-state';
import { CmsConnectionCard } from '@/components/publish/cms-connection-card';
import { PublishJobTable } from '@/components/publish/publish-job-table';

export default function PublishPage() {
  const { publishJobs, connections, addCmsConnection } = useDemoState();
  const [addModal, setAddModal] = useState<'closed' | 'open' | 'saving' | 'saved'>('closed');
  const [newConn, setNewConn] = useState({ type: 'wordpress', url: '', username: '', password: '' });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Publish</h1>
        <p className="text-sm text-stone-500">
          Manage CMS connections and monitor publish jobs.
        </p>
      </div>

      {/* CMS Connections */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-stone-700">CMS connections</h2>
          <button
            type="button"
            onClick={() => setAddModal('open')}
            className="rounded-md border border-stone-300 px-3 py-2.5 text-xs text-stone-600 transition-colors hover:border-stone-400"
          >
            + Add connection
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {connections.map(conn => (
            <CmsConnectionCard key={conn.id} connection={conn} onConfigure={() => setAddModal('open')} />
          ))}
        </div>
      </section>

      {/* Publish jobs */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-medium text-stone-700">Recent publish jobs</h2>
        </div>
        <PublishJobTable jobs={publishJobs} />
      </section>

      {/* Add connection modal */}
      {addModal !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-6 shadow-xl max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <h3 className="mb-4 text-sm font-semibold text-stone-800">Add CMS connection</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-stone-500">CMS type</label>
                <select
                  value={newConn.type}
                  onChange={e => setNewConn(c => ({ ...c, type: e.target.value }))}
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                >
                  <option value="wordpress">WordPress</option>
                  <option value="shopify" disabled>Shopify (coming soon)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-stone-500">Site URL</label>
                <input
                  type="url"
                  placeholder="https://yoursite.com"
                  value={newConn.url}
                  onChange={e => setNewConn(c => ({ ...c, url: e.target.value }))}
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-stone-500">Username</label>
                <input
                  type="text"
                  placeholder="admin"
                  value={newConn.username}
                  onChange={e => setNewConn(c => ({ ...c, username: e.target.value }))}
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-stone-500">Application password</label>
                <input
                  type="password"
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={newConn.password}
                  onChange={e => setNewConn(c => ({ ...c, password: e.target.value }))}
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setAddModal('closed');
                  setNewConn({ type: 'wordpress', url: '', username: '', password: '' });
                }}
                className="rounded-md border border-stone-300 px-4 py-2.5 text-sm text-stone-600 hover:border-stone-400"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={addModal === 'saving' || addModal === 'saved'}
                onClick={async () => {
                  setAddModal('saving');
                  await new Promise(r => setTimeout(r, 1500));
                  setAddModal('saved');
                  const hostname = (() => {
                    try { return new URL(newConn.url || 'https://example.com').hostname; } catch { return newConn.url || 'example.com'; }
                  })();
                  addCmsConnection({
                    provider: newConn.type as 'wordpress' | 'shopify',
                    label: `${newConn.type === 'wordpress' ? 'WordPress' : 'Shopify'} (${hostname})`,
                    siteUrl: newConn.url || '',
                    status: 'verified',
                    lastChecked: new Date().toISOString(),
                  });
                  setTimeout(() => {
                    setAddModal('closed');
                    setNewConn({ type: 'wordpress', url: '', username: '', password: '' });
                  }, 1500);
                }}
                className="flex items-center gap-1.5 rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addModal === 'saving' && (
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-stone-400 border-t-white" aria-hidden="true" />
                )}
                {addModal === 'saving'
                  ? 'Connecting...'
                  : addModal === 'saved'
                  ? 'Connection saved ✓'
                  : 'Save connection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
