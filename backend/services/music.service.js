let cachedToken = null;
let tokenExpiresAt = 0;

async function getToken() {
    if(cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const credentials = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials'
        })
    })

    if(!response.ok) {
        throw new Error(`Falha ao obter token do Spotify: ${response.status}`)
    }

    const data = await response.json();

    cachedToken = data.access_token;

    tokenExpiresAt = Date.now() + (data.expires_in -60) * 1000;

    return cachedToken;
}

async function buscarMusica(req, res) {
    const clientId = process.env.CLIENT_ID;
    const secret = process.env.CLIENT_SECRET;
    const query = String(req.query.q ?? '').trim();

    if (query.length < 2) {
        return res.json({ tracks: [] })
    }

    try {
        const token = await getToken();

        const params = new URLSearchParams({
            q: query,
            type: 'track',
            limit: 10,
            market: 'US'
        })

        const response = await fetch(`https://api.spotify.com/v1/search?q=${params}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!response.ok) {
            return res.status(response.status).json({
                message: 'O Spotify não conseguiu completar a busca.'
            })
        }

        const data = await response.json();

        const tracks = (data.tracks?.items ?? []).map((track) => ({
            id: track.id,
            title: track.name,
            artists: track.artists.map((artist) => artist.name).join(', '),
            album: track.album.name,
            imageUrl: track.album.images?.[0]?.url ?? null,
            spotifyUrl: track.external_urls?.spotify
        }));

        return res.json({ tracks })
    } catch (error) {
        console.error(error);
        return res.status(500).json(error)
    }
}

module.exports = {
    buscarMusica
}