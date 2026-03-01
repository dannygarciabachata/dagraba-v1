#!/bin/bash

# Setup colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Audio Systems Engineer: Stem Automation Setup ===${NC}"

# Check for Python
if ! command -v python3 &> /dev/null
then
    echo "Python3 not found. Please install Python 3 from python.org"
    exit
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate venv and install dependencies
source venv/bin/activate
echo -e "${BLUE}Installing dependencies (librosa, watchdog, numpy, soundfile)...${NC}"
pip install librosa numpy soundfile watchdog pydub

echo -e "${GREEN}Setup Complete!${NC}"
echo -e ""
echo -e "To start the automation watcher, run:"
echo -e "${GREEN}source venv/bin/activate && python3 stem_manager.py${NC}"
echo -e ""
echo -e "Don't forget to export your stems to: ${BLUE}/Users/odgmusic/DAW_Exports_Auto${NC}"
