import React, { useCallback, useEffect, useRef, useState } from 'react';
import './InfiniteScroll.css'

const Infinite = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    // Fetch data from the API based on the current page
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${currentPage}`);
            const newData = await response.json();
            if (newData.length === 0) {
                setHasMore(false);
            } else {
                setItems((prevData) => [...prevData, ...newData]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasMore) {
            fetchData();
        }
    }, [currentPage]);

    const lastElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div>
            <h1>Infinite Scroll Example</h1>
            <div>
                {items.map((item, index) => {
                    // Attach the ref to the last element
                    if (items.length === index + 1) {
                        return (
                            <div
                                key={item.id}
                                ref={lastElementRef}
                            >
                                <h3>{item.title}</h3>
                                <p>{item.body}</p>
                            </div>
                        );
                    } else {
                        return (
                            <div key={item.id}>
                                <h3>{item.title}</h3>
                                <p>{item.body}</p>
                            </div>
                        );
                    }
                })}
            </div>
            {loading && <p>Loading...</p>}
            {!hasMore && <p>No more data to load.</p>}
        </div>
    );
};

export default Infinite;