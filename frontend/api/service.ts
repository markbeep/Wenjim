import * as grpc from "@grpc/grpc-js";
import { promisify } from "util";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "../generated/countday";
import { HistorySortType } from "../generated/HistorySortType";

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
    const dayinfo = promisify(this.Events).bind(this);
    return await dayinfo({})
      .then(events => ({ events, error: null }))
      .catch(error => ({ error, events: null }));
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
    orderBy: HistorySortType,
  ) {
    const history = promisify(this.History).bind(this);
    return await history({
      event,
      dateFrom: Math.round(dateFrom.getTime() / 1e3),
      dateTo: Math.round(dateTo.getTime() / 1e3), // convert to seconds
      orderBy,
    })
      .then(history => ({ history, error: null }))
      .catch(error => ({ error, history: null }));
  }
}
