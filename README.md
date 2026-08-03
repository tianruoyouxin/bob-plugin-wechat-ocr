# WeChat OCR Plugin for Bob

> **此仓库为 [missuo/bob-plugin-wechat-ocr](https://github.com/missuo/bob-plugin-wechat-ocr) 的二次开发版(Fork),感谢原作者 [missuo](https://github.com/missuo)。**

---

## 本项目改动说明(相对上游)

### 背景

上游插件不支持 Bob 1.20.0 升级后的 OCR 插件新接口,无法返回文本位置信息,因此不能用于 Bob 的「原图翻译」和「智能分段」。

### 改动内容

| 文件 | 改动 | 说明 |
|---|---|---|
| `src/main.js` | 新增 `supportBoundingBox()` 并返回 `true` | 声明插件支持位置信息,Bob 1.20.0 会将本插件纳入「原图翻译」可用 OCR 服务列表 |
| `src/main.js` | `ocr()` 输出携带 `boundingBox` | 用 `query.pixelWidth/pixelHeight` 将微信 OCR 返回的像素坐标(left/top/right/bottom)归一化为 `[0,1]` 四顶点;拿不到像素尺寸时自动降级,保持旧格式兼容 |
| `src/info.json` | `minBobVersion`: `1.8.0` → `1.20.0` | 使用新接口后要求 Bob ≥ 1.20.0 |
| `release.sh` | 同步 `minBobVersion` 为 `1.20.0` | 防止发布时 appcast.json 写回旧值 |
| `.gitignore` | 新增忽略 `dist/` | 打包产物不入库 |

### 兼容性

- **未实现 `regionInfos`(段落结构)**:微信 OCR API 仅返回扁平行列表,不具备段落/区域层级能力,按官方文档采用 `texts` 模式携带 `boundingBox` 即可。
- **完全向后兼容**:旧版 Bob 或未提供 `pixelWidth/pixelHeight` 时,输出与旧格式一致。

### 打包安装

```bash
# 打包 .bobplugin(需在仓库根目录执行)
mkdir -p dist && zip -r -j dist/bob-plugin-wechat-ocr-0.1.0.bobplugin src/*
```

双击安装至 Bob(≥ 1.20.0),即可在「原图翻译」的 OCR 服务列表看到 WeChat OCR。

---

## 以下为上游原 README(未改动)

A [Bob](https://bobtranslate.com/) plugin that utilizes WeChat's OCR engine for high-accuracy text recognition.

## Install Bob

[![Download on the Mac App Store](https://cdn.ripperhe.com/oss/master/2022/0626/Download_on_the_Mac_App_Store_Badge_US-UK_RGB_blk_092917.svg)](https://apps.apple.com/cn/app/id1630034110#?platform=mac)

## Installation

1. Download the latest release `.bobplugin` file from [Releases](https://github.com/missuo/bob-plugin-wechat-ocr/releases).
2. Double-click the downloaded file to install it into Bob.

## Configuration

This plugin works out of the box with the default API server.

- **WeChat API Base URL**: You can configure a custom API endpoint if needed.
  - Default: `https://ocr-api.missuo.me`

To test the accuracy of the API, you can visit the web version at [https://ocr.owo.nz](https://ocr.owo.nz).

## Self-hosting API

You can deploy the OCR API server using [wxocr](https://github.com/missuo/wxocr) or simply run:

```bash
git clone https://github.com/missuo/wxocr.git
cd wxocr
docker compose up -d --build
```

## Development

1. Clone this repository.
2. Modify `src/main.js` or `src/info.json`.
3. Zip the contents of `src` into a `.bobplugin` file to test.

## Credits

- [missuo](https://github.com/missuo)
