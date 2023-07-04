// MapLibre GL JSの読み込み
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// OpacityControlプラグインの読み込み
import OpacityControl from 'maplibre-gl-opacity';
import 'maplibre-gl-opacity/dist/maplibre-gl-opacity.css';


const map = new maplibregl.Map({
    container: 'map', // div要素のid
    zoom: 5, // 初期表示のズーム
    center: [138, 37], // 初期表示の中心
    minZoom: 5, // 最小ズーム
    maxZoom: 18, // 最大ズーム
    maxBounds: [122, 20, 154, 50], // 表示可能な範囲
    style: {
        version: 8,
        sources: {
            // 背景地図ソース
            osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                maxzoom: 19,
                tileSize: 256,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
            gsi: {
                type: 'raster', // ラスタータイル
                tiles: [
                    'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
                ],
                maxzoom: 18,
                tileSize: 256,
                attribution:
                    '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
            },
            skhb: {
                // 医療機関ベクトルタイル
                    type: 'vector',
                    tiles: [
                        `https://k96mz.github.io/20230704/medical/public/skhb/{z}/{x}/{y}.pbf`
                    ],
                    minzoom: 4,
                    maxzoom: 10,
                    attribution: 
                    '<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P04-v3_0.html" target="_blank">国土数値情報 医療機関データ</a>',
                },
        },
        layers: [
            // 背景地図レイヤー
            {
                id: 'osm-layer',
                source: 'osm',
                type: 'raster',
            },
            {
                id: 'gsi-layer',
                source: 'gsi', // 使うデータをsourcesのkeyで指定する
                type: 'raster', // データをどのように表示するか指定する
                layout: {visibility: 'none'}, // デフォルトでは非表示
            },
            {
                id: 'skhb-layer-clinic',
                source: 'skhb',
                'source-layer': 'skhb',
                type: 'circle',
                paint: {
                // 'circle-color': '#6666cc',
                'circle-color': [
                    // アイコンの色を属性値によって塗り分ける
                    'interpolate',
                    ['linear'],
                    ['get', 'P04_001'], // P04_001は医療機関分類コードを示す
                    1, 'rgba(255,0,0,0)', // 病院は赤
                    2, 'rgba(0,255,0,1)', // 診療所は緑
                    3, 'rgba(0,0,255,0)', // 歯科診療所は青
                ],
                'circle-radius': [ // ズームレベルに応じた円の大きさ
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    5,
                    2,
                    14,
                    6,
                ], 
                // 'circle-stroke-width': 1,
                // 'circle-stroke-color': '#ffffff',
                },
            },
        ],
    },
});

map.on('load', () => {
    // 背景地図のコントロール
    const opacity = new OpacityControl({
        baseLayers: {
            'osm-layer': 'OSM', // layer-id: レイヤー名
            'gsi-layer': '地理院地図',
        },
    });
    map.addControl(opacity, 'top-left'); // 第二引数で場所を指定
});
