import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { UtilityService } from "../../api/service";
import Shell from "../../components/shell";

export default function Lesson({
  events,
  error,
}: {
  events: Event[];
  error: string;
}) {
  const router = useRouter();
  const { pid } = router.query;

  return (
    <Shell events={events}>
      <div>{pid}</div>
    </Shell>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const utilityService = new UtilityService();
    const { events, error } = await utilityService.getEvents();

    if (events) {
      return {
        props: {
          events: events.events,
          error,
        },
      };
    } else {
      throw "No result";
    }
  } catch (error) {
    return {
      props: { error },
    };
  }
};
