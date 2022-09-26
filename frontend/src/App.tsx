import './App.css';
import { useAllTimeData } from './api/hooks';

function App() {
  const {data, loading} = useAllTimeData("Polyterasse", "Tennis");

  return (
    <div>
      {loading && "Loading"}
      {!loading && data && data.map((res) => res.location)}
    </div>
  );
}

export default App;
