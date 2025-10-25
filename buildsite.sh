pages=hello-world
mkdir notes/
cp index.html notes/index.html

for note in $pages; do
    mkdir notes/$note
    cp index.html notes/$note/index.html
done

