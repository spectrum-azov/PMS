import { useState, useCallback, useRef, useEffect } from 'react';

interface UseInfiniteScrollOptions<T> {
    fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>;
    pageSize: number;
    deps: unknown[];
}

interface UseInfiniteScrollResult<T> {
    items: T[];
    hasMore: boolean;
    loadMore: () => void;
    loadingMore: boolean;
    totalCount: number;
}

export function useInfiniteScroll<T extends { id?: string }>({
    fetchFn,
    pageSize,
    deps,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const isFetching = useRef(false);

    // Reset when deps change (filters, sort, etc.)
    useEffect(() => {
        setItems([]);
        setPage(1);
        setTotalCount(0);
        setInitialLoaded(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    // Fetch data when page changes or after reset
    useEffect(() => {
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
                setInitialLoaded(true);
            } finally {
                setLoadingMore(false);
                isFetching.current = false;
            }
        };

        doFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, ...deps]);

    const hasMore = initialLoaded && items.length < totalCount;

    const loadMore = useCallback(() => {
        if (!isFetching.current && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [hasMore]);

    return {
        items,
        hasMore,
        loadMore,
        loadingMore,
        totalCount,
    };
}
