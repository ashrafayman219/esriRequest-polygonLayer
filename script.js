var cntry = document.getElementById("cnt")

require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/request",
  "esri/Graphic",
  "esri/rest/route",
  "esri/rest/support/RouteParameters",
  "esri/rest/support/FeatureSet",
  "esri/widgets/Track",
  "esri/widgets/Locate",
  "esri/layers/RouteLayer",
  "esri/layers/GraphicsLayer",
  "esri/geometry/geometryEngineAsync",
  "esri/geometry/Point"
], (
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
  esriRequest,
  Graphic,
  route,
  RouteParameters,
  FeatureSet,
  Track,
  Locate,
  RouteLayer,
  GraphicsLayer,
  geometryEngineAsync,
  Point
) => {

  esriConfig.apiKey =
    "AAPK0f1f265391ac4ce3bf612ba0e57cd15bCmtNyrTEfVrWnGx9lB1L-OyOoSyaN5brwXC2X4C8IwiMgzH6z2VlPFDDnHME9P5Z";

    var myPopup = {
      // autocasts as new PopupTemplate()
      title: "Here a few information about {ward_name}",
      // Set content elements in the order to display.
      // The first element displayed here is the fieldInfos.
      content: [
        {
          // It is also possible to set the fieldInfos outside of the content
          // directly in the popupTemplate. If no fieldInfos is specifically set
          // in the content, it defaults to whatever may be set within the popupTemplate.
          type: "fields", // FieldsContentElement
          fieldInfos: [
            {
              fieldName: "OBJECTID",
              visible: true,
              label: "OBJECTID",
              // format: {
              //     places: 0,
              //     digitSeparator: true
              // }
            },
            {
              fieldName: "longitude",
              visible: true,
              label: "Longitude",
              // format: {
              //     places: 0,
              //     digitSeparator: true
              // },
              // statisticType: "sum"
            },
            {
              fieldName: "latitude",
              visible: true,
              label: "Latitude",
              // format: {
              //     places: 0,
              //     digitSeparator: true
              // },
              // statisticType: "sum"
            },
            {
              fieldName: "building_id",
              visible: true,
              label: "building_id",
            },
            {
              fieldName: "city",
              visible: true,
              label: "City",
            },
            {
              fieldName: "state",
              visible: true,
              label: "State",
            },
            {
              fieldName: "Shape__Area",
              visible: true,
              label: "Shape__Area",
            },
          ],
        },
      ],
    };
    var myRenderer = {
      type: "simple",
      field: "id",
      symbol: {
        type: "picture-marker",
        url: "https://arcgis.github.io/arcgis-samples-javascript/sample-data/cat3.png",
        // color: "#69dcff",
        width: "38px",
        height: "38px",
      },
    
    };

  var myLayer = new FeatureLayer({
    url: "https://services.arcgis.com/4SrAYCaubJDWUxZq/ArcGIS/rest/services/New_Footprints_gdb/FeatureServer/0",
    outFields: ["*"],
    definitionExpression: "OBJECTID <= 49",
    popupTemplate: myPopup,
    // renderer: myRenderer,

  });

  const map = new Map({
    basemap: "hybrid",
    layers: [myLayer],
  });
  const view = new MapView({
    center: [31.554, 30.5689],
    container: "viewDiv",
    map: map,
    zoom: 3,
  });
  view.ui.add("getFeatures", "top-right");
  view.ui.add(cntry, "top-left");

  var reqURL =
    "https://services.arcgis.com/4SrAYCaubJDWUxZq/ArcGIS/rest/services/New_Footprints_gdb/FeatureServer/0/query";

  var reqOpt = {
    responseType: "json",
    query: {
      where: "1=1",
      outFields: ["OBJECTID, latitude, longitude, building_id, Shape__Area"],
      f: "json",
    },
  };

  document.getElementById("getFeatures").addEventListener("click", function () {
    // alert(propertyValue.value)
    // var subExpression = `OBJECTID < ${propertyValue.value}`;
    // var definitionExpression = createDefinitionExpression(subExpression);
    // myLayer.definitionExpression = `OBJECTID <= 1500`;
    myLayer.queryExtent().then(function (result) {
      console.log(result); //count
      view.goTo(
        {
          target: result.extent,
          // zoom: 13
        },
        {
          duration: 2500,
        }
      );
    });
    reqOpt.query.where = `OBJECTID <= 49`;
    esriRequest(reqURL, reqOpt).then(function (result) {
      console.log(result.data, "fffff"); // will return
      document.getElementById('cnt').innerHTML = '';
      for (let i = 0; i < result.data.features.length; i++) {
        var opt = document.createElement("li")
        // opt.value = result.data.features[i].attributes.building_id
        
        document.getElementById('cnt').style.visibility = "visible";
        opt.textContent = `Building ID for this property is: ${result.data.features[i].attributes.building_id}, 
        and it's Area is: ${result.data.features[i].attributes.Shape__Area}`;
        cntry.appendChild(opt)
      }
    });
  });










});
