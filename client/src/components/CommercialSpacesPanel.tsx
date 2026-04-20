import { useMemo, useState } from 'react';
import type { CommercialPropertyType, CommercialSpaceRecommendation } from '../lib/types';

interface CommercialSpacesPanelProps {
  listings: CommercialSpaceRecommendation[];
  isLoading: boolean;
  error: string | null;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(value);
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 65) return 'text-lime-400';
  if (score >= 45) return 'text-amber-400';
  return 'text-red-400';
}

export default function CommercialSpacesPanel({
  listings,
  isLoading,
  error,
}: CommercialSpacesPanelProps) {
  const [maxRent, setMaxRent] = useState('');
  const [minSquareFeet, setMinSquareFeet] = useState('');
  const [propertyType, setPropertyType] = useState<'Any' | CommercialPropertyType>('Any');

  const propertyTypes = useMemo(
    () => ['Any', ...new Set(listings.map((listing) => listing.propertyType))] as Array<'Any' | CommercialPropertyType>,
    [listings],
  );

  const filteredListings = useMemo(() => {
    const rentLimit = maxRent ? Number(maxRent) : null;
    const sizeFloor = minSquareFeet ? Number(minSquareFeet) : null;

    return listings.filter((listing) => {
      if (rentLimit && listing.askingRentMonthly > rentLimit) return false;
      if (sizeFloor && listing.squareFeet < sizeFloor) return false;
      if (propertyType !== 'Any' && listing.propertyType !== propertyType) return false;
      return true;
    });
  }, [listings, maxRent, minSquareFeet, propertyType]);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Available Commercial Spaces Nearby
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-gray-500">
            Commercial listings near the evaluated area, ranked by how well they fit the business type and location priorities.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs text-gray-400">
            <span className="mb-1 block font-medium uppercase tracking-wide text-gray-500">Max monthly rent</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={maxRent}
              onChange={(event) => setMaxRent(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Any"
            />
          </label>
          <label className="text-xs text-gray-400">
            <span className="mb-1 block font-medium uppercase tracking-wide text-gray-500">Min square feet</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={minSquareFeet}
              onChange={(event) => setMinSquareFeet(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Any"
            />
          </label>
          <label className="text-xs text-gray-400">
            <span className="mb-1 block font-medium uppercase tracking-wide text-gray-500">Property type</span>
            <select
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value as 'Any' | CommercialPropertyType)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type} className="bg-slate-900 text-gray-100">
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 rounded-xl border border-white/5 bg-white/5 p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
            <svg className="h-5 w-5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-medium text-gray-300">Finding commercial spaces that fit this concept...</p>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/5 bg-white/5 p-6 text-center">
          <p className="text-sm font-medium text-gray-300">No commercial spaces match the current filters</p>
          <p className="mt-1 text-xs text-gray-500">Try widening the rent or size filters to see more listings.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {filteredListings.map((listing) => (
            <article
              key={listing.id}
              className="rounded-2xl border border-white/10 bg-[#0f172a] p-5 transition-all hover:border-blue-500/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-100">{listing.title}</h3>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-gray-400">
                      {listing.propertyType}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">{listing.address}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${scoreColor(listing.fitScore)}`}>{listing.fitScore}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Fit score</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-400">{listing.shortDescription}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Monthly rent</p>
                  <p className="mt-1 text-sm font-semibold text-gray-100">{formatCurrency(listing.askingRentMonthly)}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Square feet</p>
                  <p className="mt-1 text-sm font-semibold text-gray-100">{listing.squareFeet.toLocaleString()} sq ft</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Distance</p>
                  <p className="mt-1 text-sm font-semibold text-gray-100">{listing.distanceKm.toFixed(1)} km</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 sm:col-span-2 xl:col-span-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Use compatibility</p>
                  <p className="mt-1 text-sm font-semibold text-gray-100">
                    {listing.zoningOrUse}
                    {listing.parkingSpaces !== null ? ` • ${listing.parkingSpaces} parking` : ''}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {listing.matchReasons.map((reason, index) => (
                  <li key={`${listing.id}-reason-${index}`} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
