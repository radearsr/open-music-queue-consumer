const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool;
  }

  async getPlaylistSongs(playlistId, owner) {
    const queryPlaylist = {
      text: "SELECT pl.id, pl.name FROM playlists AS pl LEFT JOIN collaborations AS clb ON pl.id = clb.playlist_id LEFT JOIN users AS usr ON pl.owner = usr.id WHERE (clb.playlist_id = $1 AND clb.user_id = $2) OR (pl.id = $1 AND pl.owner = $2)",
      values: [playlistId, owner],
    };
    const resultDetailPlaylist = await this._pool.query(queryPlaylist);
    const [detailplaylists] = resultDetailPlaylist.rows;

    const querySongs = {
      text: "SELECT so.id, so.title, so.performer FROM songs AS so LEFT JOIN playlistsongs AS pls ON so.id = pls.song_id WHERE pls.playlist_id = $1 ORDER BY so.id;",
      values: [playlistId],
    };

    const { rows } = await this._pool.query(querySongs);

    const resultPlaylistSongs = Object.assign(detailplaylists, { songs: rows });

    return resultPlaylistSongs;
  }
}

module.exports = PlaylistsService;
