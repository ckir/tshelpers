#!/bin/bash
currentDir="$( dirname "$( command -v "$0" )" )"
scriptsCommonUtilities="$( dirname "$currentDir" )/../vendor/scripts-common/utilities.sh"
[ ! -f "$scriptsCommonUtilities" ] && echo -e "ERROR: scripts-common utilities not found, you must install it before using this script (checked path: $scriptsCommonUtilities)" >&2 && exit 1
scriptsCommonUtilitiesColor="$( dirname "$currentDir" )/../vendor/scripts-common-color-print.sh"
[ ! -f "$scriptsCommonUtilitiesColor" ] && echo -e "ERROR: scripts-common utilities not found, you must install it before using this script (checked path: $scriptsCommonUtilitiesColor)" >&2 && exit 1
# shellcheck disable=1090
# BSC_LOG_FILE="$currentDir/tsconfig_patch_apply.log"
. "$scriptsCommonUtilities"
. "$scriptsCommonUtilitiesColor"

# printYellow "colored"
checkBin jd
checkBin jq
jd -p tsconfig.ckir.patch ../tsconfig.json | jq > ./tsconfig.patched.json
mv ../tsconfig.json ../tsconfig.orig.json
mv ./tsconfig.patched.json ../tsconfig.json
