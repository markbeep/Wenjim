import * as grpc from "@grpc/grpc-js";
import { promisify } from "util";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "../generated/countday";

const packageDefinition = protoLoader.loadSync(
  "../proto/generated/countday.proto",
  {
    keepCase: true,
    defaults: true,
    oneofs: true,
  },
);

const host = "localhost:50051";

const { Utility, History } = grpc.loadPackageDefinition(
  packageDefinition,
) as unknown as ProtoGrpcType;

export class UtilityService extends Utility {
  constructor() {
    super(host, grpc.credentials.createInsecure());
  }

  public async getTotalDay() {
    const dayinfo = promisify(this.TotalDay).bind(this);
    return await dayinfo({})
      .then(day => ({ day, error: null }))
      .catch(error => ({ error, day: null }));
  }

  public async getEvents() {
    const events = promisify(this.Events).bind(this);
    return await events({})
      .then(events => ({ events, error: null }))
      .catch(error => ({ error, events: null }));
  }

  public async getSingleEvent(eventId: number) {
    const event = promisify(this.SingleEvent).bind(this);
    return await event({ id: eventId })
      .then(event => ({ event, error: null }))
      .catch(error => ({ error, event: null }));
  }

  public async getLocations(eventId: number) {
    const locations = promisify(this.Locations).bind(this);
    return await locations({ eventId })
      .then(locations => ({ locations, error: null }))
      .catch(error => ({ error, locations: null }));
  }

  public async getTitles(eventId: number) {
    const titles = promisify(this.Titles).bind(this);
    return await titles({ eventId })
      .then(titles => ({ titles, error: null }))
      .catch(error => ({ error, titles: null }));
  }
}

export class HistoryService extends History {
  constructor() {
    super(host, grpc.credentials.createInsecure());
  }

  public async getHistory(
    event: { sport: string; title: string; location: string },
    dateFrom: Date,
    dateTo: Date,
  ) {
    const history = promisify(this.History).bind(this);
    return await history({
      event,
      dateFrom: Math.round(dateFrom.getTime() / 1e3),
      dateTo: Math.round(dateTo.getTime() / 1e3), // convert to seconds
    })
      .then(history => ({ history, error: null }))
      .catch(error => ({ error, history: null }));
  }

  public async getHistoryById(eventId: number, dateFrom: Date, dateTo: Date) {
    const history = promisify(this.HistoryId).bind(this);
    return await history({
      eventId,
      dateFrom: Math.round(dateFrom.getTime() / 1e3),
      dateTo: Math.round(dateTo.getTime() / 1e3), // convert to seconds
    })
      .then(history => ({ history, error: null }))
      .catch(error => ({ error, history: null }));
  }
}
