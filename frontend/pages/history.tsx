import React, { useState } from 'react'
import NavBar from '../components/navBar'
import Search from '../components/search'

const History = () => {
  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  const handleSearch = (from: Date, to: Date, activities: string[], locations: string[]) => {
    console.log(from, to, activities, locations);
  };

  return (
    <div>
      <NavBar />

      <Search
        activities={activities}
        setActivities={setActivities}
        locations={locations}
        setLocations={setLocations}
        handleSearch={handleSearch}
      />



    </div>
  )
}

export default History
