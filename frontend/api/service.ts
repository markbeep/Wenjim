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

const utilityService = (
  grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType
).Utility;

const host = "localhost:50051";

export class UtilityService extends utilityService {
  constructor() {
    super(host, grpc.credentials.createInsecure());
  }

  public async getTotalDay() {
    const dayinfo = promisify(this.totalDay).bind(this);
    return await dayinfo({})
      .then(day => ({ day, error: null }))
      .catch(error => ({ error, day: null }));
  }
}
