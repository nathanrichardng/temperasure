angular
    .module('temperasure')
    .directive('timeChart', timeChart);

function timeChart() {
    var data = [];

    var link = function(scope, el, attrs) {

        scope.$watch('chartData', function(value) {
            console.log('data ' + value);
            if(value) {
                data = value;
                var chart = c3.generate({
                    bindto: '#timeChart',
                    data: {
                        x: 'x',
                //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
                        columns: data
                    },
                    axis: {
                        x: {
                            localtime: true,
                            type: 'timeseries',
                            tick: {
                                format: '%Y-%m-%d'
                            }
                        },
                        y: {
                            inner: false,
                            tick: {
                                format: function(d) {
                                    return Math.round(d*100)/100;
                                }
                            }
                        }
                    },
                    zoom: {
                        enabled: true,
                        rescale: true
                    }
                });
            }
        });
    }

    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="timeChart"></div>',
        scope: {
            chartData: '='
        },
        link: link
    }
}