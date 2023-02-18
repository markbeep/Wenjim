import { useRouter } from "next/router";
import React from "react";
import { UtilityClient } from "../../generated/countday_grpc_web_pb";
import { LocationsRequest } from "../../generated/countday_pb";

export default function Lesson({}) {
  const router = useRouter();

  const client = new UtilityClient("http://localhost:50051", null, null);
  client.events(new LocationsRequest(), {}, console.log);

  return (
    <>
      {/* {events && (
        <Shell events={events}>
          {event && (
            <>
              <Title>
                {event.sport}: {event.title}
              </Title>

              {locations && (
                <Select
                  placeholder={event.location}
                  searchable
                  dropdownPosition="bottom"
                  data={locations.map(e => ({
                    value: e.eventId?.toString() ?? "",
                    label: e.location ?? "",
                  }))}
                  onChange={v => router.push(`/lessons/${v}`)}
                />
              )}
              <Text color="dimmed">
                {event.location} | Niveau: {event.niveau}
              </Text>
              {history && <HistoryTable history={history} />}
            </>
          )}
        </Shell>
      )} */}
    </>
  );
}

// export const getServerSideProps$: GetServerSideProps = async context => {
//   try {
//     const utilityService = new UtilityService();
//     const { events, error } = await utilityService.getEvents();
//     const historyService = new HistoryService();
//     const { history, error: err2 } = await historyService.getHistoryById(
//       Number(context.query.eventId),
//       new Date("2000-01-01"),
//       new Date("2030-12-31"),
//     );
//     const { event, error: err3 } = await utilityService.getSingleEvent(
//       Number(context.query.eventId),
//     );
//     const { locations, error: err4 } = await utilityService.getLocations(
//       Number(context.query.eventId),
//     );
//     const { titles, error: err5 } = await utilityService.getTitles(
//       Number(context.query.eventId),
//     );

//     if (event && events && locations && titles && history) {
//       return {
//         props: {
//           event,
//           events: events.events,
//           locations: locations.locations,
//           titles: titles.titles,
//           history: history.rows.map(e => ({
//             ...e,
//             date: Number(e.date) * 1e3,
//           })), // convert to milliseconds
//         },
//       };
//     } else {
//       throw error ? error : "No result";
//     }
//   } catch (error) {
//     return {
//       props: { error },
//     };
//   }
// };
