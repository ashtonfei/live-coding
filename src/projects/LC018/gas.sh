#! /bin/bash
echo -e "\n### GAS: Build for Google Apps Script ###\n"

GAS_DIR="./gas"
DIST_DIR="./dist"

# Check if the ./dist folder created
if [ ! -d $DIST_DIR ]
then
    echo -e "\n### GAS: You Need to Build the Project First! ###\n"
    return 0
fi

# Create Root Folder gas if not created
if [ ! -d $GAS_DIR ]
then
    mkdir $GAS_DIR
fi

# Copy ./dist/index.html to ./gas/index.html

cat dist/index.html| sed -E "s/<script.+script>/<?!= includes(\"js.html\"); ?>/" | sed -E "s/<link rel=\"stylesheet\".+>/<?!= includes(\"css.html\"); ?>/"  > ./gas/index.html

echo -e "### GAS: Index.html Created! ###"

# Copy ./dist/assets/index.*.js ./gas/javascript.html
echo "<script type=\"module\" crossorigin>" > ./gas/js.html
cat ./dist/assets/index.*.js >> ./gas/js.html
echo "</script>" >> ./gas/js.html
echo -e "### GAS: js.html Created! ###"


# Copy ./dist/assets/index.*.css ./gas/css.html
echo "<style>" > ./gas/css.html
cat ./dist/assets/index.*.css >> ./gas/css.html
echo "</style>" >> ./gas/css.html
echo -e "### GAS: css.html Created! ###"

echo -e "\n### GAS: Done! ###\n"
