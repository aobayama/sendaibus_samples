$().ready(function() {
	"use strict";
    var viewModel=function(){
		var self = this;
		self.dayType = [{id:0,name:"平日"},{id:1,name:"土曜"},{id:2,name:"休日"}];
		self.stationName = ko.observable("仙台駅");
		self.stops = ko.observableArray();
		self.selectedStop = ko.observable();
		self.stopInfo = ko.observable();
		self.selectedDay = ko.observable();
		self.selectedLine = ko.observable();
		self.services = ko.observableArray();
		self.selectedService = ko.observable();
		self.serviceInfo = ko.observable();
		self.lines = ko.computed(function(){
			if(self.selectedDay()==null||self.stopInfo()==null){
					return;
				}
			var result;
			switch(self.selectedDay().id){
				case 0:
					return self.stopInfo().lines.weekday;
				case 1:
					return self.stopInfo().lines.saturday;
				case 2:
					return self.stopInfo().lines.holiday;
				default:
					return null;
				}
				
			});
		ko.computed(function(){
			if(self.stationName()!=null&&self.stationName()!==""){
			$.getJSON("http://bus.aobayama.net/api/stations/search",{name:self.stationName()},
				function(data){
					self.stops(data);
				}
			);
			}else{
				 	self.stops([]);
				}
		});
		ko.computed(function(){
			if(self.selectedStop()!=null){
			$.getJSON("http://bus.aobayama.net/api/stations/summary",{id:self.selectedStop().id},
				function(data){
					self.stopInfo(data);
				}
			);
			}else{
				 	self.stopInfo(null);
				}
		});
		ko.computed(function(){
			if(self.selectedStop()!=null&&self.selectedLine()!=null){
			$.getJSON("http://bus.aobayama.net/api/stations/details",{id:self.selectedStop().id,line_id:self.selectedLine().id},
				function(data){
					self.services(data.timetable);
				}
			);
			}else{
				 	self.services(null);
				}
		});
		ko.computed(function(){
			if(self.selectedService()!=null){
			$.getJSON("http://bus.aobayama.net/api/buses/details",{id:self.selectedService().bus_id},
				function(data){
					self.serviceInfo(data);
				}
			);
			}else{
				 	self.serviceInfo(null);
				}
		});
	};
	ko.applyBindings(new viewModel());
});