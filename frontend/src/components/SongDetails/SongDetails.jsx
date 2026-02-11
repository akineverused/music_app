export default function SongDetails({ song, api }) {
    return (
        <div style={{ padding: 20, display: "flex", gap: 20, }}>
            <img
                src={`${api}/cover?title=${encodeURIComponent(
                    song.title
                )}&artist=${encodeURIComponent(song.artist)}&seed=${song.index}`}
                width={200}
                height={200}
                alt="cover"
            />
            <div style={{width: "100%"}}>
                <div style={{display: "flex", gap:20, alignItems:"center"}}>
                    <h2 style={{wrap:"noWrap", margin: 0}}>
                        {song.title}
                    </h2>
                    <audio
                        controls
                        style={{ width: '50%' }}
                        src={`${api}/audio?songId=${song.index}&seed=${song.index}`}
                    />
                </div>
                <p>from <b>{song.album}</b> by <b>{song.artist}</b></p>
                <p><b>Genre:</b> {song.genre}</p>
            </div>

        </div>
    );
}