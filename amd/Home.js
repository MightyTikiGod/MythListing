/**
 * @class windypalms/Home
 */
define([
	"dojo/_base/declare",
	"dijit/layout/LayoutContainer",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!windypalms/Home.html",

	"dijit/layout/ContentPane",
	"windypalms/Listing",
],function(
	declare,LayoutContainer,_TemplatedMixin,_WidgetsInTemplateMixin,template
) {
	return declare([LayoutContainer,_TemplatedMixin,_WidgetsInTemplateMixin], /** @lends windypalms/Home */ {
		templateString:template,
		design:'headline'
	});
});