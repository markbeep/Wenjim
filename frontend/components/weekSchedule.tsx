import { HeatMapSerie, ResponsiveHeatMap } from '@nivo/heatmap';
import React from 'react';
import { StringDatum, StringExtraProps } from '../pages/api/interfaces';

interface WeekScheduleData {
    data: HeatMapSerie<StringDatum, StringExtraProps>[];
};

const WeekSchedule = ({ data }: WeekScheduleData) => {
    return (
        <ResponsiveHeatMap
            data={data}
            margin={{ left: 50, right: 10, bottom: 10, top: 50 }}
            theme={{ textColor: "#ffffff" }}
        />
    );
};

export default WeekSchedule;
