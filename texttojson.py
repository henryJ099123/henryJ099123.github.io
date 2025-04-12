#!/usr/bin/env python3
import sys
import os
import json

if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise ValueError("usage: ./texttojson.py [-f|-d] [name_of_file/dir] [file_to_write_to]")

    if not os.path.exists(sys.argv[2]):
        raise FileNotFoundError

    if sys.argv[1] == '-f':
        shader = {"name": sys.argv[2]}
        with open(sys.argv[2]) as f:
            shader["data"] = f.read()
    
        with open(sys.argv[3], 'w') as f:
            json.dump(shader, f, indent=4)
    
    elif sys.argv[1] == '-d':
        lst = []
        print(os.listdir(sys.argv[2]))
        for file in os.listdir(sys.argv[2]):
            with open(f'{sys.argv[2]}/{file}') as f:
                shader = {"name": file, "data": f.read()}
                lst.append(shader)
        
        with open(sys.argv[3], 'w') as f:
            json.dump(lst, f, indent=4)
    else:
        raise ValueError("Unknown flag; -d or -f")
