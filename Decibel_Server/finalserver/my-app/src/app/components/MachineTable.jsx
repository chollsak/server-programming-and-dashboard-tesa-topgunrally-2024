// Your Page component

export default function Page() {
    const [historicalData, setHistoricalData] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
  
    // Fetch data function
    const handleDateRangeFetch = async () => {
      if (startDate && endDate) {
        try {
          setIsLoading(true);
          setError(null);
  
          const response = await fetch(`/api/machine/history?startDate=${startDate}&endDate=${endDate}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Fetched Data:", data);
          
          setHistoricalData(data);
          setDisplayedData(data.slice(0, 10));
          setCurrentPage(1);
  
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error.message);
          setHistoricalData([]);
          setDisplayedData([]);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    // Handle viewing more data
    const handleViewMore = () => {
      const nextPage = currentPage + 1;
      const newItems = historicalData.slice(0, nextPage * 10);
      setDisplayedData(newItems);
      setCurrentPage(nextPage);
    };
  
    // Format date for display
    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleString('en-GB', { 
        timeZone: 'UTC',
        dateStyle: 'medium',
        timeStyle: 'medium'
      });
    };
  
    return (
      <div>
        {/* Date Range Selector */}
        <div className="m-4 flex space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded"
            disabled={isLoading}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded"
            disabled={isLoading}
          />
          <button 
            onClick={handleDateRangeFetch} 
            className={`px-4 py-2 bg-blue-500 text-white rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>
  
        {/* Error Message */}
        {error && (
          <div className="m-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}
  
        {/* Loading Message */}
        {isLoading && (
          <div className="m-4 p-4 bg-gray-100 border border-gray-400 text-gray-700 rounded">
            Loading data...
          </div>
        )}
  
        {/* Data Table */}
        {!isLoading && displayedData.length > 0 && (
          <>
            <TableContainer component={Paper} style={{ maxHeight: 400, overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Power</TableCell>
                    <TableCell>Pressure</TableCell>
                    <TableCell>Force</TableCell>
                    <TableCell>Position</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedData.map((entry, index) => (
                    <TableRow key={entry._id || index}>
                      <TableCell>{formatDate(entry.timestamp)}</TableCell>
                      <TableCell>{entry.Energy_Consumption?.Power}</TableCell>
                      <TableCell>{entry.Pressure}</TableCell>
                      <TableCell>{entry.Force}</TableCell>
                      <TableCell>{entry.Position_of_the_Punch}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
  
            {/* View More Button */}
            {displayedData.length < historicalData.length && (
              <Button 
                onClick={handleViewMore} 
                variant="contained" 
                color="primary" 
                style={{ margin: '1rem' }}
              >
                View More
              </Button>
            )}
          </>
        )}
      </div>
    );
  }