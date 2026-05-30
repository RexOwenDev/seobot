const TIERS = [
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    description: 'For freelancers and small content teams.',
    features: [
      '5 CMS connections',
      '50 articles / month',
      'WordPress + Shopify publish',
      'SEO validation suite',
      'Internal link suggestions',
      'Email support',
    ],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Agency',
    price: '$199',
    period: '/mo',
    description: 'For agencies managing multiple client brands.',
    features: [
      'Unlimited CMS connections',
      '500 articles / month',
      'Everything in Starter',
      'Multi-workspace support',
      'Bulk keyword import',
      'Priority support',
      'Custom brand voice per workspace',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large teams with custom infrastructure needs.',
    features: [
      'Unlimited everything',
      'Self-hosted option',
      'Custom AI model config',
      'SSO / SAML',
      'Dedicated SLA',
      'Onboarding & training',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
] as const;

export function PricingTiers() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TIERS.map(tier => (
        <div
          key={tier.name}
          className={[
            'flex flex-col rounded-xl border p-6',
            tier.highlighted
              ? 'border-accent bg-surface ring-1 ring-accent/20'
              : 'border-stone-200 bg-surface',
          ].join(' ')}
        >
          {tier.highlighted && (
            <span className="mb-3 self-start rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-white">
              Most popular
            </span>
          )}
          <h3 className="mb-1 text-lg font-semibold">{tier.name}</h3>
          <div className="mb-2 flex items-baseline gap-0.5">
            <span className="text-3xl font-bold">{tier.price}</span>
            {tier.period && <span className="text-sm text-stone-500">{tier.period}</span>}
          </div>
          <p className="mb-5 text-sm text-stone-500">{tier.description}</p>
          <ul className="mb-6 flex-1 space-y-2">
            {tier.features.map(feature => (
              <li key={feature} className="flex items-start gap-2 text-sm text-stone-700">
                <span className="mt-0.5 text-emerald-600" aria-hidden>
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={[
              'w-full rounded-md py-2 text-sm font-medium transition-colors',
              tier.highlighted
                ? 'bg-stone-900 text-white hover:bg-stone-800'
                : 'border border-stone-300 text-stone-600 hover:border-stone-400 hover:text-stone-800',
            ].join(' ')}
          >
            {tier.cta}
          </button>
        </div>
      ))}
    </div>
  );
}
