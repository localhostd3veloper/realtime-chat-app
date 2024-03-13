set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RESET='\033[0m'

echo -e "${GREEN} Hello!"
echo " This script will set up the project for you."
echo -e "${BLUE} It will install the dependencies in both the client and server."
echo -e "${RESET} For faster setup, it will be installing ${GREEN}pnpm${RESET} instead of npm."

echo -e "${GREEN} Installing pnpm... ${RESET}"
npm i -g pnpm

cd server
pnpm install
cd ../client
pnpm install

echo -e "${GREEN} Setup complete!"
echo -e "${BLUE} Please proceed with the instructions in the README.md file."
