import React from 'react';
import { ResponsiveLine, Serie } from '@nivo/line';
import { AspectRatio, ScrollArea } from '@mantine/core';

interface LineData {
    data: Serie[] | undefined
};

const LineChart = ({ data }: LineData) => {
    return (
        <ScrollArea type='auto'>
            <AspectRatio ratio={5 / 2} sx={{ minWidth: "90rem", minHeight: "30rem" }}>
                {data && <ResponsiveLine
                    data={data}
                    xScale={{
                        type: "time",
                        format: "%Y-%m-%d",
                        useUTC: false,
                        precision: "day",
                    }}
                    xFormat="time:%Y-%m-%d"
                    yScale={{
                        type: "linear",
                        stacked: false,
                    }}
                    axisLeft={{
                        legend: "free spots",
                        legendOffset: -40,
                        legendPosition: "middle",
                        tickPadding: 5,
                        tickRotation: 0,
                        tickSize: 5,
                    }}
                    axisBottom={{
                        format: "%b %d",
                        tickValues: "every 5 days",
                        tickPadding: 5,
                        tickRotation: 0,
                        tickSize: 5,
                    }}
                    enablePointLabel={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    margin={{ top: 20, right: 110, bottom: 30, left: 10 }}
                    useMesh={true}
                    pointBorderWidth={2}
                    theme={{ textColor: "#ffffff" }}
                />
                }
            </AspectRatio>
        </ScrollArea>
    );
};

export default LineChart;
