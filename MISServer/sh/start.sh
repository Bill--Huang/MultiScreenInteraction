#!/bin/sh

#comments
sh stop.sh
cd ../bin
echo "go to dir -> "
pwd
nohup node www> mis.log &
echo "Start MISServer"