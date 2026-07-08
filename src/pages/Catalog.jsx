import { useSearchParams } from 'react-router-dom';
import CardGrid from '../components/Cardgrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import useCards, { CARDS_PER_PAGE } from '../hooks/useCards.js';

const SORT_LABELS = {
  az: 'A-Z',
  za: 'Z-A',
  atkHigh: 'ATK high to low',
  atkLow: 'ATK low to high',
};

function buildVisiblePages(currentPage, totalPages) {
  const pages = [];

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const isEdgePage = pageNumber === 1 || pageNumber === totalPages;
    const isNearCurrent = Math.abs(pageNumber - currentPage) <= 1;

    if (totalPages <= 7 || isEdgePage || isNearCurrent) {
      pages.push(pageNumber);
    }
  }

  return pages.reduce((result, pageNumber) => {
    const previousPage = result[result.length - 1];

    if (typeof previousPage === 'number' && pageNumber - previousPage > 1) {
      result.push(`ellipsis-${previousPage}-${pageNumber}`);
    }

    result.push(pageNumber);
    return result;
  }, []);
}

function Catalog () {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') ?? '';
    const typeFilter = searchParams.get('type') ?? '';
    const attributeFilter = searchParams.get('attribute') ?? '';
    const sortOrder = searchParams.get('sort') ?? '';
    const parsedPage = Number(searchParams.get('page') ?? '1');
    const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const { cards, loading, error, hasNextPage, totalPages, totalResults } = useCards({ page, pageSize: CARDS_PER_PAGE });

    const typeOptions = Array.from(
      new Set(cards.map((card) => card.type).concat(typeFilter).filter(Boolean))
    ).sort((left, right) => left.localeCompare(right));

    const attributeOptions = Array.from(
      new Set(cards.map((card) => card.attribute).concat(attributeFilter).filter(Boolean))
    ).sort((left, right) => left.localeCompare(right));

    const updateParam = (key, value, resetPage = false) => {
      const nextParams = new URLSearchParams(searchParams);

      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }

      if (resetPage) {
        nextParams.delete('page');
      }

      setSearchParams(nextParams);
    };

    const clearBrowseState = () => {
      setSearchParams(new URLSearchParams());
    };

    const visiblePages = buildVisiblePages(page, totalPages);
    const activeChips = [
      search ? { key: 'search', label: `Search: ${search}`, value: '' } : null,
      typeFilter ? { key: 'type', label: `Type: ${typeFilter}`, value: '' } : null,
      attributeFilter ? { key: 'attribute', label: `Attribute: ${attributeFilter}`, value: '' } : null,
      sortOrder ? { key: 'sort', label: `Sort: ${SORT_LABELS[sortOrder] ?? sortOrder}`, value: '' } : null,
    ].filter(Boolean);
    const visibleCardCount = cards.filter((card) => (
      card.name.toLowerCase().includes(search.toLowerCase()) &&
      (!typeFilter || card.type === typeFilter) &&
      (!attributeFilter || card.attribute === attributeFilter)
    )).length;
    const pageStart = visibleCardCount === 0 ? 0 : ((page - 1) * CARDS_PER_PAGE) + 1;
    const pageEnd = visibleCardCount === 0 ? 0 : pageStart + visibleCardCount - 1;
    const resultSummary = loading
      ? `Loading page ${page} of ${totalPages}.`
      : error
        ? 'Catalog results are currently unavailable.'
        : `Showing cards ${pageStart}-${pageEnd} of ${totalResults} on page ${page} of ${totalPages}.`;

    return (
    <>
    <div className="page-content page-header">
    <h1>Catalog</h1>
<p>
  Browse Yu-Gi-Oh! cards pulled from the YGOProDeck API, then filter by name and sort the results.
</p>
<SearchBar search={search} setSearch={(value) => updateParam('search', value, true)} />
<div className="filter-row">
  <label className="filter-field">
    <span>Type</span>
    <select aria-label="Type" value={typeFilter} onChange={(event) => updateParam('type', event.target.value, true)}>
      <option value="">All types</option>
      {typeOptions.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </label>

  <label className="filter-field">
    <span>Attribute</span>
    <select aria-label="Attribute" value={attributeFilter} onChange={(event) => updateParam('attribute', event.target.value, true)}>
      <option value="">All attributes</option>
      {attributeOptions.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </label>
</div>
</div>
<p className="page-content result-summary">{resultSummary}</p>
{activeChips.length > 0 ? (
  <div className="page-content active-chip-row" aria-label="Active catalog filters">
    {activeChips.map((chip) => (
      <button
        key={chip.key}
        type="button"
        className="filter-chip"
        onClick={() => updateParam(chip.key, chip.value, chip.key !== 'sort')}
      >
        {chip.label} x
      </button>
    ))}
    <button
      type="button"
      className="filter-chip clear-all-chip"
      onClick={clearBrowseState}
    >
      Clear all
    </button>
  </div>
) : null}
<CardGrid
  cards={cards}
  loading={loading}
  error={error}
  search={search}
  typeFilter={typeFilter}
  attributeFilter={attributeFilter}
  sortOrder={sortOrder}
  onSortChange={(value) => updateParam('sort', value)}
/>
<div className="pagination-controls page-content">
  <button type="button" onClick={() => updateParam('page', String(page - 1))} disabled={page === 1 || loading}>
    Previous
  </button>
  <div className="page-number-list" aria-label="Page navigation">
    {visiblePages.map((pageNumber) => (
      typeof pageNumber === 'string' ? (
        <span key={pageNumber} className="page-ellipsis" aria-hidden="true">...</span>
      ) : (
        <button
          key={pageNumber}
          type="button"
          className={pageNumber === page ? 'page-number-button active' : 'page-number-button'}
          onClick={() => updateParam('page', pageNumber === 1 ? '' : String(pageNumber))}
          disabled={loading && pageNumber === page}
          aria-current={pageNumber === page ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      )
    ))}
  </div>
  <span>Page {page}</span>
  <button type="button" onClick={() => updateParam('page', String(page + 1))} disabled={!hasNextPage || loading || Boolean(error)}>
    Next
  </button>
</div>
</> 
);
}

export default Catalog;