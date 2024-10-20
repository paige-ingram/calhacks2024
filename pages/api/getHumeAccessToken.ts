// pages/api/getHumeAccessToken.ts
import { NextApiRequest, NextApiResponse } from "next";
import { fetchAccessToken } from "hume";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const accessToken = await fetchAccessToken({
      apiKey: String(process.env.HUME_API_KEY),
      secretKey: String(process.env.HUME_SECRET_KEY),
    });

    if (!accessToken) {
      return res.status(401).json({ error: "Failed to fetch access token" });
    }

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
