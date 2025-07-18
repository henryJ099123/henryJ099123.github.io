#!/usr/bin/env python3
import sys
import os
from pathlib import Path
import json

if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise ValueError("usage: ./mktojson.py [-f|-d] [name_of_file/dir] [file_to_write_to]")

    if not os.path.exists(sys.argv[2]):
        raise FileNotFoundError

    if sys.argv[1] == '-f':
        name = os.path.basename(sys.argv[2]).split('.')[0]
        entry = {"urlname": name}
        with open(sys.argv[2]) as f:
            entry["name"] = f.readline().strip()
            entry["date"] = f.readline().strip()
            entry["data"] = f.read()
    
        with open(sys.argv[3], 'w') as f:
            json.dump(entry, f, indent=4)
    
    elif sys.argv[1] == '-d':
        lst = []
        # print(os.listdir(sys.argv[2]))
        for i, file in enumerate(os.listdir(sys.argv[2])):
            with open(f'{sys.argv[2]}/{file}') as f:
                entry = {"id": i}
                entry["urlname"] = file.split('.')[0]
                entry["name"] = f.readline().strip()
                entry["date"] = f.readline().strip()
                entry["data"] = f.read()
                lst.append(entry)
        
        with open(sys.argv[3], 'w') as f:
            json.dump(lst, f, indent=4)
    else:
        raise ValueError("Unknown flag; -d or -f")
