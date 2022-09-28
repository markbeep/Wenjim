import './App.css';
import { useCountDay } from './api/hooks';
import { CalendarChart } from './components/calendarChart';

function App() {
  const { data, loading } = useCountDay();

  console.log(data);

  return (
    <div className='tile'>
      {loading && "Loading"}
      {data && CalendarChart(data)}
    </div>
  );
}

export default App;
