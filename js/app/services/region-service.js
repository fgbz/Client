define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('region-service', ['http-service','$cacheFactory','$q',function (http,$cacheFactory,$q) {

        this.GetRoot = function(regionCode) {

            return http.get('Region/Root?RegionCode=' + regionCode);
        };

        this.GetSub = function (code,level) {

            return http.get('Region/Sub?r=' + code + '&l=' + level);
        };

        this.MapBoundary = function (regionId) {
            return http.get('Region/Boundary?regionId=' + regionId, { cache: true });
        }
        
       this.GetAllProvince = function(lever) {

            return http.get('Region/GetAllProvince?lever='+lever);
        };

    }]);
});