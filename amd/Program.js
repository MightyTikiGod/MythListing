/**
 * @class windypalms/Program
 */
define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!windypalms/Program.html",

	"dojo/dom-class"
],function(
	declare,_WidgetBase,_TemplatedMixin,template,
	domClass
) {
	var millis=10800000;
	var emojis={
		"Action":"🗲",
		"Action sports":"🏈",
		"Adults only":"💌",
		"Adventure":"🐵",
		"Agriculture":"🚜",
		"Animals":"🐼",
		"Animated":"",
		"Anthology":"📚",
		"Art":"🎨",
		"Arts/crafts":"",
		"Auction":"",
		"Auto":"🚗",
		"Auto racing":"",
		"Aviation":"🛪",
		"Awards":"🏆",
		"Baseball":"⚾",
		"Biography":"",
		"Boat racing":"🚤",
		"Bus./financial":"🏭",
		"Children":"🚼",
		"Collectibles":"🗑",
		"Comedy":"😃",
		"Comedy-drama":"😏",
		"Community":"",
		"Computers":"💻",
		"Consumer":"",
		"Cooking":"🍝",
		"Crime":"",
		"Crime drama":"",
		"Dance":"💃",
		"Docudrama":"",
		"Documentary":"",
		"Drama":"🎭",
		"Educational":"🏫",
		"Entertainment":"",
		"Environment":"🌿",
		"Event":"📆",
		"Exercise":"🚴",
		"Fantasy":"👸",
		"Fashion":"👗",
		"Fishing":"🎣",
		"Football":"🏈",
		"Game show":"🎰",
		"Gaming":"🎲",
		"Gay/lesbian":"⚣",
		"Health":"🏥",
		"Historical drama":"",
		"History":"⌛",
		"Holiday":"🎉",
		"Holiday special":"🎅",
		"Home improvement":"🛠",
		"Horror":"👻",
		"House/garden":"🏡",
		"How-to":"🔩",
		"Hunting":"🔫",
		"Interview":"",
		"Law":"👮",
		"Martial arts":"",
		"Medical":"🏥",
		"Military":"🎖",
		"Miniseries":"∈",
		"Mixed martial arts":"",
		"Motorcycle":"🏍",
		"Motorsports":"🏎",
		"Music":"🎼",
		"Musical":"🎵",
		"Musical comedy":"🎵😃",
		"Music special":"🎵✨",
		"Mystery":"❓",
		"Nature":"🍂",
		"News":"📰",
		"Newsmagazine":"",
		"Outdoors":"⛺",
		"Paranormal":"🔮",
		"Parenting":"",
		"Politics":"",
		"Public affairs":"",
		"Reality":"💩",
		"Religious":"⛪",
		"Romance":"💑",
		"Romance-comedy":"🏩",
		"Science":"🔬",
		"Science fiction":"👽",
		"Self improvement":"",
		"Shooting":"",
		"Shopping":"💸",
		"Sitcom":"",
		"Soap":"",
		"Soccer":"⚽",
		"Special":"✨",
		"Sports event":"💪📆",
		"Sports non-event":"💪",
		"Sports talk":"💪💬",
		"Standup":"",
		"Surfing":"🏄",
		"Suspense":"‽",
		"Talk":"💬",
		"Theater":"",
		"Travel":"🗼",
		"Variety":"💤",
		"War":"💣",
		"Western":"🌵"
	};
	return declare([_WidgetBase,_TemplatedMixin], /** @lends windypalms/Program */ {

		templateString:template,

		_setTitleAttr:function(title){
			this.titleNode.innerHTML='';
			if(title){
				this.titleNode.appendChild(document.createTextNode(title));
			}
		},
		_setSubTitleAttr:function(subtitle){
			this.subTitleNode.innerHTML='';
			if(subtitle){
				this.subTitleNode.appendChild(document.createTextNode(subtitle));
			}
		},
		_setStartTimeAttr:function(starttime){
			this._set('StartTime',new Date(starttime));
		},
		_setEndTimeAttr:function(endtime){
			this._set('EndTime',new Date(endtime));
		},
		_setWidthAttr:function(width){
			this.domNode.style.width=''+((width/millis)*100)+'%';
		},
		_setCatTypeAttr:function(CatType){
			domClass.add(this.domNode,CatType);
		},
		postCreate:function(){
			this.inherited(arguments);
			this.set('width',Math.min(this.GridEndTime.valueOf(),this.EndTime.valueOf())-Math.max(this.GridStartTime.valueOf(),this.StartTime.valueOf()));

			if(this.Repeat=="true"){
				this.iconNode.appendChild(document.createTextNode('\u267B'));
			}

			if((this.Category in emojis) && emojis[this.Category]){
				this.iconNode.appendChild(document.createTextNode(emojis[this.Category]));
			}
		}
	});
});