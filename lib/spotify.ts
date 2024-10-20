import SpotifyWebApi from 'spotify-web-api-node';

// Initialize Spotify API instance with credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID as string,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI as string,
});

// Function to get access token using OAuth
export const getAccessToken = async (code: string): Promise<string | null> => {
  try {
    // Log the incoming authorization code
    console.log('Authorization Code:', code);

    // Log the environment variables to ensure they are being read correctly
    console.log('Spotify Client ID:', process.env.SPOTIFY_CLIENT_ID);
    console.log('Spotify Client Secret:', process.env.SPOTIFY_CLIENT_SECRET ? 'Exists' : 'Missing');
    console.log('Spotify Redirect URI:', process.env.SPOTIFY_REDIRECT_URI);

    const data = await spotifyApi.authorizationCodeGrant(code);

    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];

    // Log success with access and refresh tokens
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    return accessToken;
  } catch (error: any) {
    // Log detailed error information, including the response data and status code
    if (error.response) {
      console.error('Error fetching access token:', error.response.status, error.response.data);
    } else {
      console.error('Error fetching access token:', error.message);
    }
    return null;
  }
};

// Fetch recommended tracks based on the user's emotion
export const fetchRecommendedMusic = async (emotion: string): Promise<SpotifyApi.RecommendationTrackObject[]> => {
  const genreMapping: Record<string, string> = {
    happy: 'pop',
    sad: 'acoustic',
    angry: 'rock',
  };

  const genre = genreMapping[emotion] || 'pop';

  try {
    // Log the emotion and the genre used for recommendations
    console.log('Emotion:', emotion);
    console.log('Genre for recommendation:', genre);

    const response = await spotifyApi.getRecommendations({
      seed_genres: [genre],
      limit: 10,
    });

    // Log the successful response
    console.log('Successfully fetched recommendations:', response.body.tracks);

    return response.body.tracks;
  } catch (error: any) {
    // Log detailed error information
    if (error.response) {
      console.error('Error fetching music recommendations:', error.response.status, error.response.data);
    } else {
      console.error('Error fetching music recommendations:', error.message);
    }
    return [];
  }
};
