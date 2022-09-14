packages=("types" "constants" "utils" "styles" "localization" "deckgl-layers" "layers" "schemas" "table" "cloud-providers" "processors" "tasks" "actions" "reducers" "components")

for package in ${packages[@]}; do
    echo "'$package': ["
    find ./src/$package/src/ -type f \( -iname \*.ts -o -iname \*.tsx -o -iname \*.js \) | while read dir; do
        if [[ $(cat $dir) =~ (from \')([^\.][^\']*)(\') ]]; then
            echo "    '${BASH_REMATCH[2]}',"
        fi
    done
    echo "]"
done