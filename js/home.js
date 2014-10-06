require([
	"windypalms/Listing",
	"dojo/domReady!"
],function(Listing) {
	document.body.appendChild((new Listing()).domNode);
});