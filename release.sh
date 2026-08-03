version=${1#refs/tags/v}
zip -r -j bob-plugin-wechat-ocr-$version.bobplugin src/*

sha256_wechat_ocr=$(sha256sum bob-plugin-wechat-ocr-$version.bobplugin | cut -d ' ' -f 1)
echo $sha256_wechat_ocr

download_link="https://github.com/missuo/bob-plugin-wechat-ocr/releases/download/v$version/bob-plugin-wechat-ocr-$version.bobplugin"

new_version="{\"version\": \"$version\", \"desc\": \"Bump to $version.\", \"sha256\": \"$sha256_wechat_ocr\", \"url\": \"$download_link\", \"minBobVersion\": \"1.20.0\"}"

json_file='appcast.json'
json_data=$(cat $json_file)

updated_json=$(echo $json_data | jq --argjson new_version "$new_version" '.versions += [$new_version]')

echo $updated_json > $json_file
mkdir dist
mv *.bobplugin dist