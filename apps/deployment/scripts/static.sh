#!/bin/bash

# Function to display help
function show_help {
    echo "Usage: $0 -u <url> -i <id>"
    echo "Options:"
    echo "  -u, --url       Specify a file"
    echo "  -i, --id        Project ID"
    echo "  -h, --help      Show this help message"
}

if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found."
    exit 1
fi

# Initialize variables
url=""
id=""

# Parse command line options
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -u|--url)
            url="$2"
            shift 2
            ;;
        -i|--id)
            id="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

if [ -z "$url" ]; then
    echo "Error: Please provide url."
    show_help
    exit 1
fi


if [ -z "$id" ]; then
    echo "Error: Please provide Project ID."
    show_help
    exit 1
fi

directory="$WORKING_DIRECTORY/static/$id"
if [ -d "$directory" ]; then
    echo "Pull code from repository"
    cd $directory
    git pull
else
    echo "Clone repository"
    git clone $url $directory
fi
echo $(pwd)
