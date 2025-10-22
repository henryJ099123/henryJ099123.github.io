#!/usr/bin/env python3
import sys
import os
from pathlib import Path
import json

# For notes in this directory (for posts),
# the first line ought to be the name of the post,
# the second line the author,
# the third the date of posting,
# and then the file as normal

def noteInfo(file : str, identifier: int):
    entry = {}
    entry["id"] = identifier
    entry["urlname"] = os.path.basename(file).split(".")[0]
    with open(file) as f:
        entry["name"] = f.readline().strip()
        entry["author"] = f.readline().strip()
        entry["date"] = f.readline().strip()
        entry["data"] = f.read()
    return entry

if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise ValueError("usage: ./mktojson.py [-r] [name_of_file/dir] [file_to_write_to]")

    lst = []

    if sys.argv[1] == '-r':
        # print(os.listdir(sys.argv[2]))
        for i, file in enumerate(os.listdir(sys.argv[2])):
            if file[-2:] != "md":
                print(f"Skipping {file}")
                continue
            entry = noteInfo(f"{sys.argv[2]}/{file}", i)
            lst.append(entry)
            print(f'Added {file}')
        
        with open(sys.argv[3], 'w') as f:
            json.dump(lst, f, indent=4)
    else:
        for i, file in enumerate(sys.argv[1:-1]):
            if not os.path.exists(file):
                raise FileNotFoundError

            if file[-2:] != "md":
                print(f"Skipping {file}")
                continue

            entry = noteInfo(file, i)
            print(f"Adding {file}")
            lst.append(entry)

    with open(sys.argv[-1], 'w') as f:
        json.dump(lst, f, indent=4)

