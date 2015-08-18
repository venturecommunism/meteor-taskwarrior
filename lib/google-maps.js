GoogleMaps={
  // public methods
  config:function(options){
    _.extend(this,options);
  },
  ready:function(){
    this._loadingDependency.depend();
    return this._ready;
  },
  // private methods
  _loaded:function(){
    this._ready=true;
    this._loadingDependency.changed();
  },
  // public members
  apiKey:"",
  // private members
  _ready:false,
  _loadingDependency:new Deps.Dependency()
};

_googleMapsLoaded=function(){
  GoogleMaps._loaded();
  google.maps.event.addDomListener(window, 'load');
};
