#!/bin/bash

# Inspirado en: https://github.com/cdrx/docker-pyinstaller
# Combinaciones que no funcionan:
# * Ubuntu 18.04 + winehq-stable + Python 3.6.8
#
# Combinaciones que sí funcionan:
# * Ubuntu 16.04 + winehq-staging + Python 3.7.5

set -e

# https://serverfault.com/questions/500764/
# https://unix.stackexchange.com/questions/22820
# https://unix.stackexchange.com/questions/146283/
# Take care DEBIAN_FRONTEND and -o Dpkg::Options::=--force-confnew can
# set not desired configurations. Maybe set it in each needed call will be
# better
export DEBIAN_FRONTEND=noninteractive
export UCF_FORCE_CONFFNEW=1

apt-get update
apt-get upgrade -y

update_apt_db_if_need() {
    # En versiones de Ubuntu 18.04 no es necesario hacer apt update después de
    # apt-add-repository
    local current_version
    current_version=$(lsb_release -rs)
    local no_need_version='18.04'
    if (($(echo "$current_version $no_need_version" | awk '{print ($1 < $2)}'))); then apt-get update; fi
}

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
    apt-get install -y --install-recommends unzip
    FILE="${GOMI}/$(basename "${URL}")"
    FOLDER="${FILE%.zip}"
    [[ -d "${FOLDER}" ]] || unzip "${FILE}" -d "${FOLDER}"
    rm -rf "${GOMI}/$(date +%y%m%d)_aigar"
    mv "${FOLDER}" "${GOMI}/$(date +%y%m%d)_aigar"
}

install_wine() {
    local WINE_VERSION=winehq-staging # winehq-stable

    # repo versions is too old
    if [ -x "$(command -v wine)" ]; then
        echo 'wine is installed'
        return
    fi

    dpkg --add-architecture i386
    wget --no-verbose -nc https://dl.winehq.org/wine-builds/winehq.key
    apt-key add winehq.key
    rm winehq.key
    apt-add-repository -u "deb https://dl.winehq.org/wine-builds/ubuntu/ $(lsb_release -sc) main"

    if [[ $(lsb_release -rs) == "18.04" ]]; then
        wget --no-verbose -nc https://download.opensuse.org/repositories/Emulators:/Wine:/Debian/xUbuntu_18.04/Release.key
        apt-key add Release.key
        rm Release.key
        apt-add-repository -u 'deb https://download.opensuse.org/repositories/Emulators:/Wine:/Debian/xUbuntu_18.04/ ./'
    fi

    apt-get install -y --install-recommends "${WINE_VERSION}"

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
    export PYTHON_VERSION=3.7.5
    export PYTHON_FOLDER_LIN='/wine/drive_c/Python37'
    export PYTHON_FOLDER_WIN='C:/Python37'

    if [[ -f "${PYTHON_FOLDER_LIN}/python.exe" ]]; then
        echo "Python is installed"
        return
    fi

    export WINEARCH=win64
    export WINEDEBUG=fixme-all
    export WINEPREFIX=/wine
    set -x
    winetricks win7
    for msifile in $(echo core dev exe lib path pip tcltk tools); do
        wget --no-verbose --no-check-certificate -nv "https://www.python.org/ftp/python/${PYTHON_VERSION}/amd64/${msifile}.msi"
        wine msiexec /i "${msifile}.msi" /qb TARGETDIR="${PYTHON_FOLDER_WIN}"
        rm "${msifile}.msi"
    done
}

install_python_2() {
    cd "${PYTHON_FOLDER_LIN}"
    echo 'wine '\''C:\Python37\python.exe'\'' "$@"' > /usr/bin/python
    echo 'wine '\''C:\Python37\Scripts\easy_install.exe'\'' "$@"' > /usr/bin/easy_install
    echo 'wine '\''C:\Python37\Scripts\pip.exe'\'' "$@"' > /usr/bin/pip
    echo 'wine '\''C:\Python37\Scripts\pyinstaller.exe'\'' "$@"' > /usr/bin/pyinstaller
    echo 'wine '\''C:\Python37\Scripts\pyupdater.exe'\'' "$@"' > /usr/bin/pyupdater
    echo 'assoc .py=PythonScript' | wine cmd
    echo 'ftype PythonScript=c:\Python37\python.exe "%1" %*' | wine cmd
    while pgrep wineserver > /dev/null; do
        echo "Waiting for wineserver"
        sleep 1
    done
    chmod +x /usr/bin/python /usr/bin/easy_install /usr/bin/pip /usr/bin/pyinstaller /usr/bin/pyupdater
    (pip install -U pip || true)
    rm -rf /tmp/.wine-*
}

install_dll() {
    export W_DRIVE_C=/wine/drive_c
    export W_WINDIR_UNIX="$W_DRIVE_C/windows"
    export W_SYSTEM64_DLLS="$W_WINDIR_UNIX/system32"
    export W_TMP="$W_DRIVE_C/windows/temp/_$0"
    rm -f "$W_TMP"/*

    if [[ -f "${W_SYSTEM64_DLLS}/msvcp140.dll" ]]; then
        echo "visual studios dll are installed"
        return
    fi

    apt-get install -y --install-recommends winbind cabextract
    wget --no-verbose -P "$W_TMP" https://download.visualstudio.microsoft.com/download/pr/11100230/15ccb3f02745c7b206ad10373cbca89b/VC_redist.x64.exe
    cabextract -q --directory="$W_TMP" "$W_TMP"/VC_redist.x64.exe
    cabextract -q --directory="$W_TMP" "$W_TMP/a10"
    cabextract -q --directory="$W_TMP" "$W_TMP/a11"
    cd "$W_TMP"
    rename 's/_/\-/g' *.dll
    cp "$W_TMP"/*.dll "$W_SYSTEM64_DLLS"/
}

install_app() {
    export WINEARCH=win64
    export WINEDEBUG=fixme-all
    export WINEPREFIX=/wine
    local DATE
    DATE=$(date +%y%m%d)
    unzip_electron "${ELECTRON_URL}"
    mv "${GOMI}/src" "${GOMI}/${DATE}_aigar/"
    wine 'C:\Python37\Scripts\pip.exe' install -r "${GOMI}/${DATE}_aigar/src/requirements.txt"
    wine 'C:\Python37\Scripts\pip.exe' install Werkzeug
    wine 'C:\Python37\Scripts\pip.exe' install django-debug-toolbar

    cp -R /wine/drive_c/Python37/ "${GOMI}/${DATE}_aigar/"

    rm "${GOMI}/${DATE}_aigar/electron.exe"
    cp "${GOMI}/electron.exe" "${GOMI}/${DATE}_aigar/AIGAR.exe"
    cp -R /vagrant/app "${GOMI}/${DATE}_aigar/resources/"
    sed -i "s/\"version\":.*/\"version\": \"${DATE}\",/" "${GOMI}/${DATE}_aigar/resources/app/package.json"
}

copy_license() {
    DATE=$(date +%y%m%d)
    mv "${GOMI}/${DATE}_aigar/LICENSE" "${GOMI}/${DATE}_aigar/ELECTRON_LICENSE"
    mv "${GOMI}/${DATE}_aigar/src/LICENSE" "${GOMI}/${DATE}_aigar/LICENSE"
    mv "${GOMI}/${DATE}_aigar/src/README" "${GOMI}/${DATE}_aigar/README"
    cp /vagrant/NOTICE "${GOMI}/${DATE}_aigar/"
}

GOMI=/vagrant/gomi
ELECTRON_URL=https://github.com/electron/electron/releases/download/v8.2.1/electron-v8.2.1-win32-x64.zip

mkdir -p ${GOMI}

download "${ELECTRON_URL}"

install_wine
install_python
install_dll
install_app
copy_license
# install_python_2
