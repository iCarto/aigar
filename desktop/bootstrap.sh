#!/bin/bash

# https://stackoverflow.com/questions/21799443/wine-error-application-tried-to-create-a-window-but-no-driver-could-be-loaded
# https://superuser.com/questions/902175/run-wine-totally-headless

# Inspirado en: https://github.com/cdrx/docker-pyinstaller
# Combinaciones que no funcionan:
# * Ubuntu 18.04 + winehq-stable + Python 3.6.8
#
# Combinaciones que sí funcionan:
# * Ubuntu 16.04 + winehq-staging + Python 3.7.5

set -e

export PYTHON_VERSION=3.11.3

export W_DRIVE_C=/wine/drive_c
export PYTHON_FOLDER_WIN='C:\Python311'
export PYTHON_FOLDER_LIN="${W_DRIVE_C}/Python311"
export GOMI=/vagrant/gomi

# https://serverfault.com/questions/500764/
# https://unix.stackexchange.com/questions/22820
# https://unix.stackexchange.com/questions/146283/
# Take care DEBIAN_FRONTEND and -o Dpkg::Options::=--force-confnew can
# set not desired configurations. Maybe set it in each needed call will be
# better
export DEBIAN_FRONTEND=noninteractive
export UCF_FORCE_CONFFNEW=1

apt update
apt upgrade -y

download() {
    local URL="${1}"
    local FILE
    FILE="${GOMI}/$(basename "${URL}")"
    [[ -f "${FILE}" ]] || curl -C - -L -o "${FILE}" "${URL}"
}

unzip_electron() {
    local URL="${1}"
    local FILE
    local FOLDER
    apt install -y --install-recommends unzip
    FILE="${GOMI}/$(basename "${URL}")"
    FOLDER="${FILE%.zip}"
    [[ -d "${FOLDER}" ]] || unzip "${FILE}" -d "${FOLDER}"
    rm -rf "${GOMI}/$(date +%y%m%d)_aigar"
    mv "${FOLDER}" "${GOMI}/$(date +%y%m%d)_aigar"
}

install_wine() {
    local WINE_VERSION=winehq-stable # winehq-staging winehq-stable winehq-devel

    # repo versions is too old
    if [[ -x "$(command -v wine)" ]]; then
        echo 'wine is installed'
        return
    fi

    dpkg --add-architecture i386
    mkdir -p /etc/apt/keyrings
    chmod -R 755 /etc/apt/keyrings
    wget -O /etc/apt/keyrings/winehq-archive.key https://dl.winehq.org/wine-builds/winehq.key
    # wget --no-verbose -nc https://dl.winehq.org/wine-builds/winehq.key
    # apt-key add winehq.key
    # rm winehq.key
    wget -NP /etc/apt/sources.list.d/ https://dl.winehq.org/wine-builds/ubuntu/dists/jammy/winehq-$(lsb_release -sc).sources
    apt update

    # apt-add-repository -u "deb https://dl.winehq.org/wine-builds/ubuntu/ $(lsb_release -sc) main"

    # if [[ $(lsb_release -rs) == "18.04" ]]; then
    #     wget --no-verbose -nc https://download.opensuse.org/repositories/Emulators:/Wine:/Debian/xUbuntu_18.04/Release.key
    #     apt-key add Release.key
    #     rm Release.key
    #     apt-add-repository -u 'deb https://download.opensuse.org/repositories/Emulators:/Wine:/Debian/xUbuntu_18.04/ ./'
    # fi

    apt install -y --install-recommends "${WINE_VERSION}"

    wget --no-verbose -nv https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks
    chmod +x winetricks
    mv winetricks /usr/local/bin
}

install_python() {
    # Esta forma no ha funcionado
    # https://forum.winehq.org/viewtopic.php?t=1390
    # https://docs.python.org/3/using/windows.html
    # PYTHON_URL=https://www.python.org/ftp/python/3.6.8/python-3.6.8-amd64.exe
    # download "${PYTHON_URL}"
    # xvfb-run wine python-3.6.8-amd64.exe /quiet
    # wine python-3.6.8-amd64.exe /quiet

    if [[ -f "${PYTHON_FOLDER_LIN}/python.exe" ]]; then
        echo "Python is installed"
        return
    fi

    export WINEARCH=win64
    export WINEDEBUG=fixme-all
    export WINEPREFIX=/wine
    set -x
    winetricks win7
    for msifile in core dev exe lib path pip tcltk tools; do
        wget --no-verbose --no-check-certificate -nv "https://www.python.org/ftp/python/${PYTHON_VERSION}/amd64/${msifile}.msi"
        wine msiexec /i "${msifile}.msi" /qb TARGETDIR="${PYTHON_FOLDER_WIN}"
        rm "${msifile}.msi"
    done
}

install_dll() {
    export W_WINDIR_UNIX="${W_DRIVE_C}/windows"
    export W_SYSTEM64_DLLS="${W_WINDIR_UNIX}/system32"
    export W_TMP="${W_DRIVE_C}/windows/temp/_$0"
    rm -f "${W_TMP}"/*

    if [[ -f "${W_SYSTEM64_DLLS}/msvcp140.dll" ]]; then
        echo "visual studios dll are installed"
        return
    fi

    apt install -y --install-recommends winbind cabextract
    wget --no-verbose -P "${W_TMP}" https://download.visualstudio.microsoft.com/download/pr/11100230/15ccb3f02745c7b206ad10373cbca89b/VC_redist.x64.exe
    cabextract -q --directory="${W_TMP}" "${W_TMP}"/VC_redist.x64.exe
    cabextract -q --directory="${W_TMP}" "${W_TMP}/a10"
    cabextract -q --directory="${W_TMP}" "${W_TMP}/a11"
    cd "${W_TMP}"
    rename 's/_/\-/g' *.dll
    cp "${W_TMP}"/*.dll "${W_SYSTEM64_DLLS}"/
}

install_app() {
    export WINEARCH=win64
    export WINEDEBUG=fixme-all
    export WINEPREFIX=/wine
    local DATE
    DATE=$(date +%y%m%d)
    unzip_electron "${ELECTRON_URL}"
    # mv "${GOMI}/src" "${GOMI}/${DATE}_aigar/"
    wine "${PYTHON_FOLDER_WIN}\Scripts\pip.exe" install "${GOMI}/aigar-24.8.29.tar.gz"

    # No deberíamos montar runserver_plus en en build para reducir el tamaño
    # y dependencias
    # wine "${PYTHON_FOLDER_WIN}\Scripts\pip.exe" install Werkzeug
    wine "${PYTHON_FOLDER_WIN}\Scripts\pip.exe" install django-debug-toolbar
    wine "${PYTHON_FOLDER_WIN}\Scripts\pip.exe" install django-extensions

    cp -R "${PYTHON_FOLDER_LIN}" "${GOMI}/${DATE}_aigar/"

    rm "${GOMI}/${DATE}_aigar/electron.exe"
    cp "${GOMI}/electron.exe" "${GOMI}/${DATE}_aigar/AIGAR.exe"
    cp -R /vagrant/app "${GOMI}/${DATE}_aigar/resources/"
    sed -i "s/\"version\":.*/\"version\": \"${DATE}\",/" "${GOMI}/${DATE}_aigar/resources/app/package.json"
    mv "${GOMI}/.env" "${GOMI}/${DATE}_aigar/Python311/Lib/site-packages/aigar"
}

copy_license() {
    DATE=$(date +%y%m%d)
    mv "${GOMI}/${DATE}_aigar/LICENSE" "${GOMI}/${DATE}_aigar/ELECTRON_LICENSE"
    mv "${GOMI}/${DATE}_aigar/src/LICENSE" "${GOMI}/${DATE}_aigar/LICENSE"
    mv "${GOMI}/${DATE}_aigar/src/README.md" "${GOMI}/${DATE}_aigar/README.md"
    cp /vagrant/NOTICE "${GOMI}/${DATE}_aigar/"
}

prepare_empty_app() {
    DATE=$(date +%y%m%d)
    cp -r "${GOMI}/${DATE}_aigar/" "${GOMI}/${DATE}_aigar_empty/"
    rm "${GOMI}/${DATE}_aigar/src/db.sqlite3.empty"
    mv "${GOMI}/${DATE}_aigar_empty/src/db.sqlite3.empty" "${GOMI}/${DATE}_aigar_empty/src/db.sqlite3"
}

ELECTRON_URL=https://github.com/electron/electron/releases/download/v8.2.1/electron-v8.2.1-win32-x64.zip

mkdir -p "${GOMI}"

download "${ELECTRON_URL}"

install_wine
install_python
install_dll
install_app
# copy_license
# prepare_empty_app
