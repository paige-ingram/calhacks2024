import { NextApiRequest, NextApiResponse } from "next";
import { fetchAccessToken } from "hume";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_HUME_SECRET_KEY;

    if (!apiKey || !secretKey) {
      return res.status(401).json({ error: "API keys are missing" });
    }

    const accessToken = await fetchAccessToken({
      apiKey: String(apiKey),
      secretKey: String(secretKey),
    });

    if (!accessToken) {
      return res.status(401).json({ error: "Failed to fetch access token" });
    }

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error fetching access token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
