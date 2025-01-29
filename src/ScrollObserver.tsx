import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTable, Column } from 'react-table';

interface TableData {
  id: number;
  name: string;
}

interface LazyLoadTableProps {
  columns: Column<TableData>[];
  data: TableData[];
  loadMore: (page: number) => Promise<void>;
}

const LazyLoadTable: React.FC<LazyLoadTableProps> = ({ columns, data, loadMore }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const tableRef = useRef<HTMLDivElement | null>(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<TableData>({ columns, data });

  const handleObserver = useCallback<IntersectionObserverCallback>(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        setLoading(true);
        loadMore(page).then(() => {
          setPage((prevPage) => prevPage + 1);
          setLoading(false);
        });
      }
    },
    [loading, loadMore, page]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 0.85, // Trigger when 85% of the target is visible
    });

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => {
      if (tableRef.current) {
        observer.unobserve(tableRef.current);
      }
    };
  }, [handleObserver]);

  return (
    <div>
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{ borderBottom: '2px solid black', padding: '8px' }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{ padding: '8px', borderBottom: '1px solid #ddd' }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
          {loading && (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '10px' }}>
                Loading...
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Observer target placed 10 rows before the end */}
      <div ref={tableRef} style={{ height: '20px' }}></div>    </div>
  );
};

const ScrollObserver: React.FC = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchData = async (page: number): Promise<void> => {
    // Simulate an API call
    const newData = await new Promise<TableData[]>((resolve) =>
      setTimeout(() => {
        const newItems: TableData[] = Array.from({ length: 10 }, (_, i) => ({
          id: data.length + i + 1,
          name: `Item ${data.length + i + 1}`,
        }));
        resolve(newItems);
      }, 1000)
    );

    if (page === 5) {
      setHasMore(false);
    }

    setData((prevData) => [...prevData, ...newData]);
  };

  const columns: Column<TableData>[] = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
    ],
    []
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lazy Load Table</h1>
      <LazyLoadTable columns={columns} data={data} loadMore={fetchData} />
      {!hasMore && <p>No more items to load</p>}
    </div>
  );
};

export default ScrollObserver;
