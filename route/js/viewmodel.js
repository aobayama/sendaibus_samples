$().ready(function () {
    "use strict";
    var viewModel = function () {
        ko.bindingHandlers.datepicker = {
        init: function(element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};
        $(element).datepicker(options);

      //when a user changes the date, update the view model
      ko.utils.registerEventHandler(element, "changeDate", function(event) {
             var value = valueAccessor();
             if (ko.isObservable(value)) {
                 value(event.date);
             }                
      });
    },
    update: function(element, valueAccessor)   {
        var widget = $(element).data("datepicker");
         //when the view model is updated, update the widget
        if (widget) {
            widget.date = ko.utils.unwrapObservable(valueAccessor());
            if (widget.date) {
                widget.setValue();            
            }
        }
    }
};
        

        self.deptStationName = ko.observable();
        self.deptStations = ko.observableArray();
        self.deptStation = ko.observable();

        self.arrStationName = ko.observable();
        self.arrStations = ko.observableArray();
        self.arrStation = ko.observable();

        self.daytype = ko.observable("0");
        self.queryMethod = ko.observable("0");
        
        self.queryTime = ko.observable(new Date()); 
        
        self.routeResult = ko.observable();

        // 出発駅検索
        ko.computed(function () {
            if (self.deptStationName() != null && self.deptStationName() !== "") {
                $.getJSON("http://bus.aobayama.net/api/v1/stations/search", {
                        name: self.deptStationName()
                    },
                    function (data) {
                      self.deptStations(data);
                    }
                );
            } else {
                self.deptStations([]);
            }
        });

        // 到着駅検索
        ko.computed(function () {
            if (self.arrStationName() != null && self.arrStationName() !== "") {
                $.getJSON("http://bus.aobayama.net/api/v1/stations/search", {
                        name: self.arrStationName()
                    },
                    function (data) {
                      self.arrStations(data);
                    }
                );
            } else {
                self.arrStations([]);
            }
        });


        // ルート検索
        ko.computed(function () {
            if (self.arrStation() != null && self.deptStation() != null) {
                $.getJSON("http://bus.aobayama.net/api/v1/route/search", {
                        from: self.deptStation().id,
                        to: self.arrStation().id,
                        daytype: self.daytype(),
                        method: self.queryMethod(),
                        queryTime: moment(self.queryTime()).format("HH:mm"),
                        count: 5
                    },
                    function (data) {
                        self.routeResult(data);
                    }
                );
            } else {
                self.routeResult(null);
            }
        });
    };
    ko.applyBindings(new viewModel());
});
