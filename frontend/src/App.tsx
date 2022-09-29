import './App.css';
import { useCountDay, useCountDaySport, useSports } from './api/hooks';
import { CalendarChart } from './components/calendarChart';
import { BarChart } from './components/barChart';
import { useState } from 'react';
import { Checkbox, CircularProgress, FormControlLabel, FormGroup, MenuItem, Select } from '@mui/material';

function App() {
  const { data, loading } = useCountDay();
  const { data: d2, loading: l2 } = useCountDaySport();
  const { data: sports, loading: l3 } = useSports();
  const [selectedSports, setSelectedSports] = useState<string[]>([])

  return (
    <div className='tile'>
      {loading && <CircularProgress />}
      {data && CalendarChart(data)}


      <Select
        label="Sports"
        onChange={(event, child) => {

        }}
      >
        {sports && sports.map(a => (
          <MenuItem value={a}>{a}</MenuItem>
        ))}
        {selectedSports.map(e => <p>{e}</p>)}
      </Select>

      {d2 && sports && BarChart(d2)}
    </div>
  );
}

export default App;
