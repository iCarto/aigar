#!/bin/bash

set -euo pipefail

find ./back -type f -name "*.pyc" -delete
find ./back -type d -name "__pycache__" -delete
find ./back -type f -path "*.egg-info*" -delete
find ./back -type d -path "*.egg-info" -delete
