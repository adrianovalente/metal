#!/bin/bash
pip install --user awscli

KEY_FILE = $(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13)
aws s3 cp s3://pizza-hut-coupon/raspberrier /tmp/$KEY_FILE

ssh -p $SSH_PORT $SSH_HOST -i /tmp/$KEY_FILE /home/pi/deployment/deployment-agent/update-metal.sh

rm /tmp/$KEY_FILE
