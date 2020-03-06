function lc() {
    echo $1 | awk '{print tolower($0)}'
}

DB_PORT=5433
PROJECT_NAME=api
PROJECT_NAME_LOWERCASE=$(lc $PROJECT_NAME)
FRONTEND_NAME=api-frontend
GIT_URL=https://gitlab.com/icarto-private/aigar.git
