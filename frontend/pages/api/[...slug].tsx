import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const slug = req.query.slug as string[];
  res.redirect(`${publicRuntimeConfig.ENVOY_PROXY}/${slug.join("/")}`);
}
