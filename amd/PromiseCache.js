/**
 * @class windypalms/PromiseCache
 * Just like a regular cache, but inflight get promises are returned as well as cached get results.
 */
define([
	"dojo/_base/lang",
	"dojo/when",
	"dojo/store/Cache"
],function(
	lang,when,Cache
) {
	var PromiseCache=function(masterStore, cachingStore, options){
		var inflight={};
		return lang.delegate(new Cache(masterStore,cachingStore,options),{
			get:function(id,directives){
				return when(cachingStore.get(id),function(result){
					if(result) return result;
					if(id in inflight) return inflight[id];
					return when(inflight[id]=masterStore.get(id,directives)).then(function(result){
						if(result){
							cachingStore.put(result,{id:id});
						}
						delete inflight[id];
						return result;
					},function(){
						delete inflight[id];
					});
				});
			}
		});
	};
	return PromiseCache
});