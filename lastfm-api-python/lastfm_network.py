# -*- coding: utf-8 -*-
# vim: set fileencoding=utf-8

from __future__ import unicode_literals
import pylast
import json
import re
import sys

API_KEY = ""
API_SECRET = ""
MAX_SIMILAR = 12
MATCH_CUTOFF = 0.07


network = pylast.LastFMNetwork(api_key=API_KEY, api_secret=API_SECRET,
                               username=None, password_hash=None)

network.enable_rate_limit()

def id_for(track):
    id = ''
    if isinstance(track, dict):
        id = "_".join([track["name"], track["artist"]])
    else:
        id = "_".join([track.title, track.artist.name])

    id = id.lower()
    id = re.sub(r"\s+", "_", id)
    id = re.sub(r"\W+", "", id)
    return id


def get_similar(root):
    print root
    name = root["name"]
    artist = root["artist"]
    track = network.get_track(artist, name)
    results = track.get_similar()

    songs = []

    for r in results:
        if r.match > MATCH_CUTOFF:
            song = {}
            song["match"] = r.match
            song["name"] = r.item.title
            song["artist"] = r.item.artist.name
            song["id"] = id_for(r.item)
            # print song["artist"], song["name"]
            try:
                song["playcount"] = r.item.get_playcount()  # api call
            except UnicodeDecodeError, err:
                print err
                print song
                sys.exit(1)
            songs.append(song)
    return songs


def links_for(origin, songs):
    links = []
    for song in songs:
        link = {"source": origin["id"], "target": song["id"]}
        reverse_link = {"source": song["id"], "target": origin["id"]}
        if link not in links and reverse_link not in links:
            links.append(link)

    return links


def unseen_songs(current_songs, new_songs):
    unseen = []
    current_song_ids = []
    for song in current_songs:
        current_song_ids.append(song["id"])

    for new_song in new_songs:
        if new_song["id"] not in current_song_ids:
            unseen.append(new_song)

    return unseen


def expand(songs, links, root):
    new_songs = get_similar(root)
    unseen = unseen_songs(songs, new_songs)[:MAX_SIMILAR + 1]
    new_links = links_for(root, unseen)
    return [unseen, new_links]


def grab(root, output_filename):
    links = []
    all_songs = []

    first_iteration, new_links = expand(all_songs, links, root)
    all_songs.extend(first_iteration)
    links.extend(new_links)
    print len(all_songs)

    unlinked_songs = []
    for iteration in first_iteration[1:]:
        print iteration["name"]
        new_songs, new_links = expand(all_songs, links, iteration)
        all_songs.extend(new_songs)
        unlinked_songs.extend(new_songs)
        links.extend(new_links)
        print len(all_songs)

    data = {}
    data["nodes"] = all_songs
    data["links"] = links

    f = open(output_filename, "w")
    f.writelines(json.dumps(data, indent=4))


# root = {"name": "helplessness blues", "artist": "Fleet Foxes", "filename": "helplessness_blues.json"}
root = {"name": "The Killing Moon", "artist": "Echo & the Bunnymen",
        "filename": "killing_moon.json"}
root["id"] = id_for(root)
grab(root, root["filename"])
