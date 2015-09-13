$().ready(function() {
	"use strict";
    var viewModel=new function(){
		var self = this;
		self.stationName = ko.observable("仙台駅");
		self.stops = ko.observableArray();
		self.selectedStop = ko.observable();
		self.stopInfo = ko.observable();
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
			$.getJSON("http://bus.aobayama.net/api/stations/details",{id:self.selectedStop().id},
				function(data){
					self.stopInfo(data);
				}
			);
			}else{
				 	self.stopInfo();
				}
		});
	};
	ko.applyBindings(viewModel);
});