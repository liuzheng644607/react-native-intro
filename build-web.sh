#!/bin/bash

buildTarget=${target//[\"\']/}
if [[ ${1}x != "x" ]]; then
    buildTarget=$1
fi

buildType=${build_type//[\"\']/}
if [[ ${3}x != "x" ]]; then
    buildType=$3
fi

isRelease=${4}

# 是否构建业务js，默认是
buildBiz="true"
# 是否构建平台js，默认否
buildPlatform=""

if [[ ${buildType}x == "allx" ]];then
    buildPlatform="true"
#elif [[ ${buildType}x == "bizx" ]]; then
# here do nothing
elif [[ ${buildType}x == "platformx" ]]; then
    buildBiz="false"
    buildPlatform="true"
fi


if [[ $buildTarget"x" == "x" ]];then
    echo "target not specified, please run with: sh build-web.sh dev|beta|prod";
    exit 250
fi

enableSourceMap="true"
# 显式关闭或者非dev环境都关闭sourcemap
if [[ ${2}x == "falsex" ]];then
    enableSourceMap="false"
elif [[ ${2}x != "truex" ]] && [[ $buildTarget != "dev" ]]; then
    enableSourceMap="false"
fi

echo "start building..."

if [[ -d prd  ]];then
    rm -rf prd
fi
mkdir prd

if [[ -d ver  ]];then
    rm -rf ver
fi
mkdir ver

nodeVersion=`node --version`
if [[ ${nodeVersion/v[4-9]/} == $nodeVersion ]]; then
    export NODE=/home/q/node/node-v4.2.4-linux-x64/bin/node
else
    export NODE=node
fi

if [[ -f $NODE  ]];then
    echo "build with $NODE" 
else
    echo "$NODE not found"
    exit 250
fi

if [[ ${buildBiz}x == "truex" ]]; then
    echo "start building biz.js..."
    ${NODE} -e 'require(require("path").resolve(process.cwd(),"node_modules/react-native/cli.js")).run()' _placeholder_ bundle --entry-file index.js --platform web --bundle-output ./index.bundle --sourcemap-url ./index.map --dev false --sourcemap-output index.map --minify --bundleType biz --assets-dest prd/staticAssets.json --releaseType ${buildTarget}
    echo "create versions map..."
    ver=""
    if [[ -f /sbin/md5 ]];then
        ver=`cat index.bundle | /sbin/md5 | grep "[0-9a-z]\+" -o`
    else
        ver=`cat index.bundle | /usr/bin/md5sum | grep "[0-9a-z]\+" -o`
    fi
    if [[ ${isRelease}x == "x" ]]; then
        if [[ $enableSourceMap == "true" ]]; then
            sed "s/\/\/# sourceMappingURL=.\/index.map/\/\/# sourceMappingURL=.\/biz@${ver}.map/" index.bundle > prd/biz\@${ver}.js
        else
            sed "s/\/\/# sourceMappingURL=.\/index.map//" index.bundle > prd/biz\@${ver}.js
        fi
        mv index.map prd/biz\@${ver}.map
        mv staticAssets.json prd/staticAssets\@${ver}.json
        echo ${ver} > ver/biz.js.ver
    else
        sed "s/\/\/# sourceMappingURL=.\/index.map//" index.bundle > prd/biz.js
        mv index.map prd/biz.map
        mv staticAssets.json prd/staticAssets.json
    fi
    rm index.bundle
    echo "end building biz.js..."
else
    echo "ignore building biz.js"
fi

if [[ ${buildPlatform}x == "truex" ]]; then
    echo 
    echo "start building platform.js..."
    ${NODE} -e 'require(require("path").resolve(process.cwd(),"node_modules/react-native/cli.js")).run()' _placeholder_ bundle --entry-file node_modules/react-native/packager/react-packager/src/bundlePlatform.web.js --platform web --bundle-output ./index.bundle --sourcemap-url ./index.map --dev false --sourcemap-output index.map --minify --bundleType platform --assets-dest prd/staticAssets.json --releaseType ${buildTarget}
    echo "create versions map..."
    ver=""
    if [[ -f /sbin/md5 ]];then
        ver=`cat index.bundle | /sbin/md5 | grep "[0-9a-z]\+" -o`
    else
        ver=`cat index.bundle | /usr/bin/md5sum | grep "[0-9a-z]\+" -o`
    fi
    if [[ ${isRelease}x == "x" ]]; then
        if [[ $enableSourceMap == "true" ]]; then
            sed "s/\/\/# sourceMappingURL=.\/index.map/\/\/# sourceMappingURL=.\/platform@${ver}.map/" index.bundle > prd/platform\@${ver}.js
        else
            sed "s/\/\/# sourceMappingURL=.\/index.map//" index.bundle > prd/platform\@${ver}.js
        fi
        mv index.map prd/platform\@${ver}.map
        echo ${ver} > ver/platform.js.ver
    else
        sed "s/\/\/# sourceMappingURL=.\/index.map//" index.bundle > prd/platform.js
        mv index.map prd/platform.map
    fi
    rm index.bundle
    echo "end building platform.js..."
else
    echo "ignore building platform.js"
fi
echo "finish building"
exit 0
