require([
	"dojo/parser",
	"windypalms/Home",
	"dojo/domReady!"
],function(parser) {
	//document.body.appendChild((new Listing()).domNode);
	var node=document.getElementById('home');
	if(node){
		parser.instantiate([node]);
	}
});