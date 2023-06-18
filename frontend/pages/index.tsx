import {
  Input,
  Text,
  Center,
  Title,
  Flex,
  SimpleGrid,
  Loader,
  Affix,
  Button,
  Transition,
  FocusTrap,
  TextInput,
} from "@mantine/core";
import { useEvents } from "../api/grpc";
import { Event } from "../generated/countday_pb";
import { useEffect, useState } from "react";
import EventCard from "../components/eventCard";
import fuzzysort from "fuzzysort";
import InfiniteScroll from "react-infinite-scroller";
import useResize from "../components/resize";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";

interface SearchEvent {
  search: string;
  event: Event;
}

function searchFilter(events: Event[], search: string): Event[] {
  const formatted: SearchEvent[] = events.map(e => {
    return { search: e.getTitle() + e.getSport() + e.getLocation(), event: e };
  });
  const results = fuzzysort.go(search, formatted, {
    key: "search",
    threshold: -10000,
    all: true,
  });
  return results.map(e => e.obj.event);
}

export default function Index() {
  const { isLoading, data } = useEvents();
  const [search, setSearch] = useState("");
  const pageSize = 50;
  const [elements, setElements] = useState(pageSize);
  const loadMore = () => setElements(a => a + pageSize);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [desktop, _] = useResize();
  const [scroll, scrollTo] = useWindowScroll();

  useEffect(() => {
    if (data) {
      setSearchResults(searchFilter(data.getEventsList(), search));
    }
  }, [data, search]);

  return (
    <>
      <Affix position={{ bottom: "2rem", right: "2rem" }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {transitionStyles => (
            <Button
              leftIcon={<IconArrowUp size="1rem" />}
              style={transitionStyles}
              bg={"blue"}
              onClick={() => scrollTo({ y: 0 })}
            >
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>

      <Flex direction="column" w="100%" align="center" mt={50}>
        <Title>Wenjim</Title>
        <Text mb="xl">When gym.</Text>
        <FocusTrap active>
          <TextInput
            tabIndex={1}
            placeholder="Fitness"
            mb="xl"
            w="80%"
            maw="60rem"
            onChange={v => setSearch(v.target.value)}
            autoFocus
            style={{ fontSize: 16 }}
          />
        </FocusTrap>

        {isLoading && (
          <Center>
            <Loader mb="lg" color="gray" variant="dots" />
          </Center>
        )}

        {data && (
          <InfiniteScroll
            loadMore={loadMore}
            loader={
              <Center mt="sm">
                <Loader color="gray" variant="dots" />
              </Center>
            }
            hasMore={elements < searchResults.length}
          >
            <SimpleGrid
              cols={desktop ? 4 : 2}
              maw="80rem"
              px={desktop ? "xl" : "sm"}
            >
              {searchResults.slice(0, elements).map(e => (
                <div
                  style={{ width: "15vw", minWidth: "10rem", height: "6rem" }}
                  key={e.getId()}
                >
                  <EventCard event={e} />
                </div>
              ))}
            </SimpleGrid>
          </InfiniteScroll>
        )}
      </Flex>
    </>
  );
}
