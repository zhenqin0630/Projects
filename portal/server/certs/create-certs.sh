#!/bin/bash

#----------------------------------------------------------------------------------------#
# use this shell to create SHA256 type KEY file , CERTIFICATE file and metadata.xml file #
#                                                                                        #
# arg1 : CN                                                                              #
#                                                                                        #
#----------------------------------------------------------------------------------------#

export TARGET_SITE=$1

mkdir ./$TARGET_SITE

openssl req -x509 -sha256 -nodes -days 3650 -newkey rsa:2048 -keyout $TARGET_SITE/key.pem -out $TARGET_SITE/cert.pem -subj /CN=$TARGET_SITE

node ./create-metadata.js $TARGET_SITE