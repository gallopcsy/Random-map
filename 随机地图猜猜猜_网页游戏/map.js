      // 定义随机范围的最大值和最小值
      const maxLat = 80; // 最大纬度
      const minLat = -60; // 最小纬度
      const maxLng = 180; // 最大经度
      const minLng = -180; // 最小经度
      const map = L.map('map', { minZoom: 5, maxZoom: 15, attributionControl: false }).setView([0, 0], 5);
      // 不含地名的地图服务
      const noLabelsLayer1 = L.tileLayer('https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=b1ae5a87ceab5e23d2ec414743d4d406', {
        attribution: '© 天地图 - 矢量'
      });
      const noLabelsLayer2 = L.tileLayer('https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=b1ae5a87ceab5e23d2ec414743d4d406', {
        attribution: '© 天地图 - 影像'
      });
      const noLabelsLayer3 = L.tileLayer('https://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=b1ae5a87ceab5e23d2ec414743d4d406', {
        attribution: '© 天地图 - 地形'
      });
      // 只显示地名的透明图层
      var labelsLayer = L.tileLayer('https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=b1ae5a87ceab5e23d2ec414743d4d406', {
        attribution: '© 天地图 - 地名标签'
      });
      var ibo = L.tileLayer('https://t0.tianditu.gov.cn/ibo_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ibo&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=b1ae5a87ceab5e23d2ec414743d4d406', {
        attribution: '© 天地图 - 全球境界'
      });
      // 创建图层
      let lonLatGridLineLayer = L.featureGroup();
      // 经纬网格生成方法
      let addLonLatLine = () => {
        let zoom = map.getZoom();
        let bounds = map.getBounds();
        let north = bounds.getNorth();
        let east = bounds.getEast();
        // 经纬度间隔，修改为10度
        let d = 10;
        // 经线网格
        for (let index = -180; index <= 360; index += d) {
          // 判断当前视野内
          if (bounds.contains([north, index])) {
            let lonLine = L.polyline(
              [
                [-90, index],
                [90, index],
              ],
              { weight: 1, color: "grey", dashArray: [5, 5] } 
            );
            lonLatGridLineLayer.addLayer(lonLine);
            let text = index.toFixed(1) + "°";
            // 动态计算小数位数
            if (zoom > 10) {
              text = index.toFixed((zoom - 8) / 2) + "°";
            }
            let divIcon = L.divIcon({
              className: '',
              html: `<div style="white-space: nowrap;color:black;font-weight:thin;z-index:999;background-color:transparent;">${text}</div>`, 
              iconAnchor: [0, 0],
            });
            let textMarker = L.marker([north, index], { icon: divIcon });
            lonLatGridLineLayer.addLayer(textMarker);
          }
        }
        // 纬线网格
        for (let index = -90; index <= 90; index += d) {
          if (bounds.contains([index, east])) {
            let lonLine = L.polyline(
              [
                [index, -180],
                [index, 360],
              ],
              { weight: 1, color: "grey", dashArray: [5, 5] } 
            );
            lonLatGridLineLayer.addLayer(lonLine);
            let text = index.toFixed(1) + "°";
            if (zoom > 10) {
              text = index.toFixed((zoom - 8) / 2) + "°";
            }
            let divIcon = L.divIcon({
              className: '',
              html: `<span style="white-space: nowrap;color:black;font-weight:thin;z-index:999;background-color:transparent;">${text}</span>`, 
              iconAnchor: [(text.length + 1) * 6, 0],
            });
            let textMarker = L.marker([index, east], { icon: divIcon });
            lonLatGridLineLayer.addLayer(textMarker);
          }
        }
      };
      map.on("idle", addLonLatLine); // 确保地图加载后立即显示经纬度标注
      map.on("moveend", () => {
        lonLatGridLineLayer.clearLayers();
        addLonLatLine();
      });
      var baseMaps = {
        "矢量地图": noLabelsLayer1,
        "影像地图": noLabelsLayer2,
        "地形地图": noLabelsLayer3
      };
      var overlayMaps = {
        "地名": labelsLayer,
        "全球境界": ibo,
        "经纬线": lonLatGridLineLayer
      };
      L.control.scale({
        maxWidth: 200,
        metric: true,
        imperial: false,
        position: 'bottomleft'
      }).addTo(map);
      // 添加图层控制器
      L.control.layers(baseMaps, overlayMaps).addTo(map);
      noLabelsLayer1.addTo(map);
      // 随机范围变量
      var currentBounds;
      // 随机范围生成函数
      function generateMap() {
      var bounds;
      do {
          // 在定义的范围内生成随机范围
          var southWest = L.latLng(Math.random() * (maxLat - minLat) + minLat, Math.random() * (maxLng - minLng) + minLng);
          var northEast = L.latLng(Math.random() * (maxLat - minLat) + minLat + 10, Math.random() * (maxLng - minLng) + minLng + 10);
          bounds = L.latLngBounds(southWest, northEast);
      } while (currentBounds && currentBounds.overlaps(bounds));
      currentBounds = bounds;
      map.fitBounds(bounds);
      let center = map.getCenter();
      map.panBy([1, 1]);
      setTimeout(() => {
        map.panTo(center);
      }, 1000);
          map.eachLayer(function (layer) {
              if (layer instanceof L.Marker) {
                  map.removeLayer(layer);
              } 
          });
          L.marker(center).addTo(map);
          // 在生成新地图后调用 getCountryName 获取新位置的国家名称
          getCountryName(function() {
          });
      }
      // 按钮事件监听器
      document.getElementById('button').addEventListener('click', generateMap);
            // 获取输入框，提交按钮和结果区域的元素
            var input = document.getElementById('country');
            var submit = document.getElementById('submit');
            var result = document.getElementById('result');
            const maxScore = 10;
            // 定义一个变量，用于存储正确的国家名
            var correctCountry;
            document.getElementById('submit').addEventListener('click', compareCountryName);
            function getCountryName() {
              return new Promise((resolve, reject) => {
                var center = map.getCenter();
                var QQkey = 'PPIBZ-QGYLV-3W3PV-5PYN4-5DXSZ-6WBFR';
                var url = 'https://apis.map.qq.com/ws/geocoder/v1/';
      
                $.ajax({
                  type: 'get',
                  url: url,
                  dataType: 'jsonp',
                  data: {
                    key: QQkey,
                    location: center.lat + "," + center.lng,
                    output: "jsonp"
                  },
                  success: function (data) {
                    if (data.status === 0) {
                      correctCountry = data.result.address_component.nation;
                      if (correctCountry === 'Ocean') {
                        generateMap();
                        reject('Ocean detected, regenerating map');
                      } else {
                        resolve();
                      }
                    } else {
                      console.error("API Error:", data.status, data.message);
                      generateMap();
                      reject('API Error: ' + data.status + ' ' + data.message);
                    }
                  },
                  error: function () {
                    console.error("Network error");
                    generateMap();
                    reject('Network error');
                  }
                });
              });
            }
            function showResult(message) {
                result1.innerHTML = message;
            }
            function compareCountryName() {
              getCountryName().then(() => {
                // 确保 AJAX 异步请求已经完成，correctCountry 已经被设置
                var userCountry = input.value;
                if (userCountry === '') {
                  showResult('你还没有输入呢，快点输入吧。😊');
                  return;
                }
                if (!correctCountry) {
                  showResult('请等待国家名获取完成再提交。😊');
                  return;
                }
                if (correctCountry.toLowerCase()===(userCountry.toLowerCase().trim())) {
                  showResult('恭喜你，你猜对了！这里是' + correctCountry + '。👏');
                   } else {
                showResult('很遗憾，你猜错了。这里是' + correctCountry + '。😥');
            }
              }).catch((error) => {
              console.error(error);
              });
          }
          // 定义一个函数，用于显示结果
          function showResult(message) {
            result1.innerHTML = message;
          }
          // 调用获取国家名的函数
          getCountryName(function() {
            // 给提交按钮添加点击事件监听器，调用比对国家名的函数
            submit.addEventListener('click', compareCountryName);
          });