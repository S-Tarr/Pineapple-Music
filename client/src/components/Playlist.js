import React from "react"

export default function Playlist({ playlist, choosePlaylist }) {
  function handleRedirect() {
      choosePlaylist(playlist);
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer", display:"flex", flexDirection:'row' }}
      onClick={handleRedirect}
    >
      <img src={playlist.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3">
        <div>{playlist.title}</div>
        <div className="text-muted">{playlist.artist}</div>
      </div>
    </div>
  )
}