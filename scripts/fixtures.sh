#!/bin/bash

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"
(cd "${this_dir}/../tools" && bash fixtures.sh)
