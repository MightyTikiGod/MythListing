/**
 * @class windypalms/ProgramDetail
 */
define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!windypalms/ProgramDetail.html",

	"put-selector/put",
	"dojo/date/locale"
],function(
	declare,_WidgetBase,_TemplatedMixin,template,
	put,locale
) {

	/**
	 * You can do this in less code with an array and "join", but this apparently profiles better.
	 **/
	function repeat(pattern, count) {
		if (count < 1) return '';
			var result = '';
		while (count > 1) {
			if (count & 1) result += pattern;
			count >>= 1, pattern += pattern;
		}
		return result + pattern;
	};

	/**
	 * Not really "closest." Sloppy approximation.
	 **/
	function closestVulgar(dec){
		if(dec===0) return '';
		if(dec<=0.1) return '⅒';
		if(dec<=(1/9)) return '⅑';
		if(dec<=0.125) return '⅛';
		if(dec<=(1/7)) return '⅐';
		if(dec<=(1/6)) return '⅙';
		if(dec<=0.2) return '⅕';
		if(dec<=0.25) return '¼';
		if(dec<=(1/3)) return '⅓';
		if(dec<=0.375) return '⅜';
		if(dec<=0.4) return '⅖';
		if(dec<=0.5) return '½';
		if(dec<=0.6) return '⅗';
		if(dec<=0.625) return '⅝';
		if(dec<=(2/3)) return '⅔';
		if(dec<=0.75) return '¾';
		if(dec<=0.8) return '⅘';
		if(dec<=(5/6)) return '⅚';
		if(dec<=0.875) return '⅞';
		return '⁹⁄₁₀';
	};

	return declare([_WidgetBase,_TemplatedMixin], /** @lends windypalms/ProgramDetail */ {
		templateString:template,
		_setTitleAttr:function(title){
			this.titleNode.innerHTML='';
			if(title){
				this.titleNode.appendChild(document.createTextNode(title));
			}
		},
		_setSubTitleAttr:function(subtitle){
			this.subtitleNode.innerHTML='';
			if(subtitle){
				this.subtitleNode.appendChild(document.createTextNode(subtitle));
			}
		},
		_setDescriptionAttr:function(description){
			this.descriptionNode.innerHTML='';
			if(description){
				this.descriptionNode.appendChild(document.createTextNode(description));
			}
		},
		_setStartTimeAttr:function(StartTime){
			this._set('StartTime',new Date(StartTime));
		},
		_setEndTimeAttr:function(EndTime){
			this._set('EndTime',new Date(EndTime));
		},
		_setAirdateAttr:function(Airdate){
			this._set('Airdate',new Date(Airdate));
		},
		_setStarsAttr:function(Stars){
			this.starsNode.innerHTML='';
			Stars=parseFloat(Stars);
			if(Stars){
				Stars*=5;
				var whole=Math.floor(Stars);
				var frac=Stars-whole;
				this.starsNode.appendChild(document.createTextNode(repeat('★',whole)+closestVulgar(frac)));
			}
		},

		postCreate:function(){
			this.inherited(arguments);
			var tr,td;
			if(this.StartTime && this.EndTime){
				tr=put(this.infoNode,'tr');
				put(tr,'th',"Air Time");
				put(tr,'td',locale.format(this.StartTime,{
					selector:'time',
					formatLength:'short'
				})+'\u2013'+locale.format(this.EndTime,{
					selector:'time',
					formatLength:'short'
				}));
			}
			if (this.Airdate){
				if (this.Repeat=="true"){
					tr=put(this.infoNode,'tr');
					put(tr,'th',"Original Airdate");
					put(tr,'td',locale.format(this.Airdate,{
						selector:'date',
						formatLength:'short'
					}));
				} else if (this.CatType=="movie") {
					this.titleNode.appendChild(document.createTextNode(' ('+this.Airdate.getFullYear()+')'));
				}
			}
			tr=put(this.infoNode,'tr');
			put(tr,'th',"Channel "+this.Channel.ChanNum);
			put(tr,'td',this.Channel.ChannelName);
			tr=put(this.infoNode,'tr');
			put(tr,'th',"Category");
			put(tr,'td',this.Category);
		}
	});
});