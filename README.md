# bioassessment
Macroinvertebrate bioassessment samples collected in CT over the last 30 years.
Show data samples collected over the past 31 years and stream aquatic life assessment value.

Data:

Biological Condition Gradient Metrics Macro-invertebrate data collected by the Connecticut Department of Energy and Environmental Protection Monitoring and Assessment Program.

Data Processing:

```command
$ csv2geojson --lat 'YLAT' --lon 'XLONG' Bug_BCG_121221.csv > BugBCG.geojson

$ ogrinfo -so BugBCG.geojson BugBCG

INFO: Open of `BugBCG.geojson'
      using driver `GeoJSON' successful.

Layer name: BugBCG
Geometry: Point
Feature Count: 1419
Extent: (-73.683200, 41.022000) - (-71.802000, 42.049500)
Layer SRS WKT:
GEOGCS["WGS 84",
    DATUM["WGS_1984",
        SPHEROID["WGS 84",6378137,298.257223563,
            AUTHORITY["EPSG","7030"]],
        AUTHORITY["EPSG","6326"]],
    PRIMEM["Greenwich",0,
        AUTHORITY["EPSG","8901"]],
    UNIT["degree",0.0174532925199433,
        AUTHORITY["EPSG","9122"]],
    AUTHORITY["EPSG","4326"]]
STA_SEQ: String (0.0)
SDATE: Date (0.0)
SYEAR: String (0.0)
BCG: String (0.0)
MEM: String (0.0)

```

Mapbox References:

Tutorial:  https://docs.mapbox.com/help/tutorials/show-changes-over-time/
Expressions: https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/
Style Circles:  https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/