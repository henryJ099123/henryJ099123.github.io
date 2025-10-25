#!/usr/bin/env python3
import sys
import os
import json

# For notes in this directory (for posts),
# the first line ought to be the name of the post,
# the second line the author,
# the third the date of posting,
# the fourth the index (from 0) of this specific note,
# and then the file as normal

def noteInfo(file : str):
    entry = {}
    entry["urlname"] = os.path.basename(file).split(".")[0]
    with open(file) as f:
        entry["name"] = f.readline().strip()
        entry["author"] = f.readline().strip()
        entry["date"] = f.readline().strip()
        entry["id"] = int(f.readline().strip())
        entry["data"] = f.read()
    return entry

if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise ValueError("usage: ./mktojson.py [-r] [name_of_file/dir] [file_to_write_to]")

    notes = []

    if sys.argv[1] == '-r':
        # print(os.listdir(sys.argv[2]))
        for file in os.listdir(sys.argv[2]):
            if file[-2:] != "md":
                print(f"Skipping {file}")
                continue
            entry = noteInfo(f"{sys.argv[2]}/{file}")
            notes.append(entry)
            print(f'Added {file}')
        
        with open(sys.argv[3], 'w') as f:
            json.dump(notes, f, indent=4)
    else:
        for file in sys.argv[1:-1]:
            if not os.path.exists(file):
                raise FileNotFoundError

            if file[-2:] != "md":
                print(f"Skipping {file}")
                continue

            entry = noteInfo(file)
            print(f"Adding {file}")
            notes.append(entry)

    notes_ordered = sorted(notes, key=lambda item: item["id"])
    with open(sys.argv[-1], 'w') as f:
        json.dump(notes_ordered, f, indent=4)

