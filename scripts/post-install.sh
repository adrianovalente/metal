if [[ $(echo "require('detect-rpi')() && console.log(1)" | node) == "1" ]]; then
  echo "Installing onoff..."
  npm install onoff
else
  echo "Skipping onoff because environment is not pi."
fi
