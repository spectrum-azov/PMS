import { useState, useCallback, useRef, useEffect } from 'react';

interface UseInfiniteScrollOptions<T> {
    fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number; totalOverall?: number }>;
    pageSize: number;
    deps: unknown[];
    enabled?: boolean;
}

interface UseInfiniteScrollResult<T> {
    items: T[];
    hasMore: boolean;
    loadMore: () => void;
    loadingMore: boolean;
    totalCount: number;
    totalOverallCount: number;
}

const EMPTY_LOAD_MORE = () => { };

export function useInfiniteScroll<T extends { id?: string }>({
    fetchFn,
    pageSize,
    deps,
    enabled = true,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalOverallCount, setTotalOverallCount] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const isFetching = useRef(false);
    const [version, setVersion] = useState(0);
    const isFirstMount = useRef(true);

    // Reset when deps change (filters, sort, etc.) — skip on first mount
    useEffect(() => {
        if (!enabled) return;
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        setItems([]);
        setPage(1);
        setTotalCount(0);
        setTotalOverallCount(0);
        setInitialLoaded(false);
        setVersion(v => v + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, enabled]);

    // Fetch data when page or version changes — single trigger per change
    useEffect(() => {
        if (!enabled) return;
        if (isFetching.current) return;

        const doFetch = async () => {
            isFetching.current = true;
            setLoadingMore(true);
            try {
                const result = await fetchFn(page, pageSize);
                setItems(prev => {
                    if (page === 1) return result.data;
                    return [...prev, ...result.data];
                });
                setTotalCount(result.total);
                setTotalOverallCount(result.totalOverall ?? result.total);
                setInitialLoaded(true);
            } finally {
                setLoadingMore(false);
                isFetching.current = false;
            }
        };

        doFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, version, enabled]);

    const hasMore = initialLoaded && items.length < totalCount;

    const loadMore = useCallback(() => {
        if (!isFetching.current && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [hasMore]);

    if (!enabled) {
        return { items: [], hasMore: false, loadMore: EMPTY_LOAD_MORE, loadingMore: false, totalCount: 0, totalOverallCount: 0 };
    }

    return {
        items,
        hasMore,
        loadMore,
        loadingMore,
        totalCount,
        totalOverallCount,
    };
}

