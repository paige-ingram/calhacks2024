import React from 'react';

const SpotifyLoginButton: React.FC = () => {
  const loginUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI}&scope=user-read-private,user-read-email`;

  return (
    <div className="text-center">
      <a href={loginUrl} className="bg-green-500 text-white px-4 py-2 rounded">
        Login with Spotify
      </a>
    </div>
  );
};

export default SpotifyLoginButton;
