import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTable, Column } from 'react-table';

interface TableData {
  id: number;
  name: string;
}

interface LazyLoadTableProps {
  columns: Column<TableData>[];
  data: TableData[];
  loadMore: (page: number) => Promise<void>;
  hasMore: boolean;
}

const NUM_ROWS = 10; // Number of rows before the end to trigger loading
const ROW_HEIGHT = 50; // Approximate row height


const LazyLoadTable: React.FC<LazyLoadTableProps> = ({ columns, data, loadMore, hasMore }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<TableData>({ columns, data });

  const handleScroll = useCallback(() => {
    if (!tableContainerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
    // Check if the user is near the bottom (e.g., 10 rows away)
    if (scrollHeight - (scrollTop + clientHeight) < NUM_ROWS * ROW_HEIGHT) { // 50 is an approximate row height
      setLoading(true);
      loadMore(page).then(() => {
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      });
    }
  }, [loading, loadMore, page, hasMore]);

  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div
      ref={tableContainerRef}
      style={{ height: '400px', overflowY: 'auto', border: '1px solid #ddd' }}
    >
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
      {!hasMore && (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          No more items to load
        </div>
      )}
    </div>
  );
};

const scrollHeight: React.FC = () => {
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
      <LazyLoadTable
        columns={columns}
        data={data}
        loadMore={fetchData}
        hasMore={hasMore}
      />
    </div>
  );
};

export default scrollHeight;
