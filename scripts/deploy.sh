#!/bin/bash

sshpass -p $SSH_PASS ssh -p $SSH_PORT $SSH_HOST /home/pi/deployment/deployment-agent/update-metal.sh
