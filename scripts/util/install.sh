#!/bin/bash
set -e

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    sudo apt install software-properties-common python-software-properties
    sudo apt-get install python3.6 nodejs npm
elif [[ "$OSTYPE" == "darwin"* ]]; then
    brew install python3.6 nodejs npm
fi

sudo npm cache clean -f
sudo npm install -g n

exit
