#!/bin/bash
export SRCDIR=$(pwd)

cd ..
echo;

if [ -d "package_script" ]; then
  rm -fr package_script
fi
b_split=(${config_git//|/ })
git clone ${b_split[0]} -b ${b_split[1]} package_script
cd package_script
git submodule init
git submodule update

./build.sh
