#!/bin/bash

export BIN_PATH=$(cd `dirname $0`; pwd)
export PORTAL_PATH=$(cd `dirname ../$BIN_PATH`; pwd)
export CLIENT_PATH=${PORTAL_PATH}/client
export SERVER_PATH=${PORTAL_PATH}/server
export CLIENT_DIST_PATH=${CLIENT_PATH}/dist
export SERVER_PUBLIC_PATH=${SERVER_PATH}/public

echo "Build client"
cd $CLIENT_PATH
npm run build

echo "Clean server public resource [$SERVER_PUBLIC_PATH/*]"
rm -Rf $SERVER_PUBLIC_PATH/*

echo "copy dist 2 server/public"
cp -r $CLIENT_DIST_PATH/* $SERVER_PUBLIC_PATH

