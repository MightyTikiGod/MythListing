/**
 * @class windypalms/Listing
 */
define([
	"dojo/_base/declare",
	"dijit/layout/LayoutContainer",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!windypalms/Listing.html",

	"dojo/_base/lang",
	"dojo/date/locale",
	"dojo/when",
	"dojo/on",
	"dijit/registry",
	"dijit/popup",
	"dijit/TooltipDialog",
	"put-selector/put",
	"windypalms/Program",

	"dojo/store/JsonRest",
	"dojo/store/Memory",
	"windypalms/PromiseCache",
	"dgrid/Grid",
	"dgrid/ColumnSet",
	"dgrid/Keyboard",
	"windypalms/ProgramDetail",

	"dijit/form/TimeTextBox",
	"dijit/form/DateTextBox"
],function(
	declare,LayoutContainer,_TemplatedMixin,_WidgetsInTemplateMixin,template,
	lang,locale,when,on,registry,popup,TooltipDialog,put,Program,
	JsonRest,Memory,Cache,Grid,ColumnSet,Keyboard,ProgramDetail
) {
	var GridClass=declare([Grid,ColumnSet,Keyboard]);

	return declare([
		LayoutContainer,_TemplatedMixin,_WidgetsInTemplateMixin
	], /** @lends windypalms/Listing */ {

		templateString:template,
		programStores:{},
		ttg:new TooltipDialog({}),

		_setStartTimeAttr:function(start){
			this._set('StartTime',new Date(start));
			this.timeControlNode.set('value',new Date(start));
			this.dateControlNode.set('value',new Date(start));
			var end=new Date(start);
			end.setHours(end.getHours()+3);
			this.set('EndTime',end);
		},

		getProgramStore:function(ChanId) {
			if(!(ChanId in this.programStores)){
				this.programStores[ChanId]=new Cache(new JsonRest({
					idProperty:"StartTime",
					target:"/rest/Guide/GetProgramDetails/"+ChanId+"/?StartTime=",
					_getTarget:function(id){ return this.target+id; }
				}),new Memory({
					idProperty:"StartTime"
				}));;
			}
			return this.programStores[ChanId];
		},

		renderHeaderCell:function(myself,th){
			myself.headerCell=th;
			th.innerHTML='';
			var row = put(th,"table tr");
			var d=new Date(myself.StartTime);
			var e=new Date(d);
			e.setHours(e.getHours()+3);
			while(d < e){
				put(row,"td",locale.format(d,{
					selector:'time',
					formatLength:'short'
				}));
				d.setMinutes(d.getMinutes()+30);
			}
		},
		renderCell:function(myself,object,value,td){
			for(var i=0;i<object['Programs'].length;i++){
				td.appendChild((new Program(lang.mixin({GridStartTime:myself.StartTime,GridEndTime:myself.EndTime},object['Programs'][i]))).domNode);
			}
		},

		reRender:function(){
			when(this.listingStore.get(this.StartTime)).then(lang.hitch(this,function(result){
				if(this.headerCell){
					this.renderHeaderCell(this,this.headerCell);
				}
				this.grid.refresh();
				this.grid.renderArray(result['ProgramGuide']['Channels']);
			}));
		},

		newDetailPopup:function(initializer){
			if(this.detailPopup){
				this.detailPopup.destroy();
			}
			this.detailPopup=new ProgramDetail(initializer);
			this.ttg.set('content',this.detailPopup);
		},

		onBack3Hours:function(evt){
			evt.preventDefault();
			var s=new Date(this.get('StartTime'));
			s.setHours(s.getHours()-3)
			this.set('StartTime',s);
			this.reRender();
		},
		onForward3Hours:function(evt){
			evt.preventDefault();
			var s=new Date(this.get('StartTime'));
			s.setHours(s.getHours()+3)
			this.set('StartTime',s);
			this.reRender();
		},
		onBack1Day:function(evt){
			evt.preventDefault();
			var s=new Date(this.get('StartTime'));
			s.setDate(s.getDate()-1)
			this.set('StartTime',s);
			this.reRender();
		},
		onForward1Day:function(evt){
			evt.preventDefault();
			var s=new Date(this.get('StartTime'));
			s.setDate(s.getDate()+1)
			this.set('StartTime',s);
			this.reRender();
		},
		onChangeTime:function(d){
			var s=new Date(this.get('StartTime'));
			s.setHours(d.getHours());
			s.setMinutes(d.getMinutes());
			this.set('StartTime',s);
			this.reRender();
		},
		onChangeDate:function(d){
			var s=new Date(this.get('StartTime'));
			s.setDate(d.getDate());
			s.setMonth(d.getMonth());
			this.set('StartTime',s);
			this.reRender();
		},

		onClickProgram:function(evt){
			evt.stopPropagation();
			var row = this.grid.row(evt);
			var w=registry.getEnclosingWidget(evt.target);
			when(this.getProgramStore(row.data['ChanId']).get(w.get('StartTime').toISOString())).then(lang.hitch(this,function(programData){
				this.newDetailPopup(programData['Program']);
				popup.open({
					popup:this.ttg,
					around:evt.target
				});
				on.once(document.body,'click',lang.hitch(this,function(evt2){
					evt2.preventDefault();
					evt2.stopPropagation();
					popup.close(this.ttg);
				}));
			}));
		},

		postCreate:function(){
			this.inherited(arguments);
			var start=new Date();
			start.setSeconds(0);
			start.setMilliseconds(0);
			start.setMinutes((start.getMinutes()<30)?0:30);
			this.set('StartTime',start);
			var d=new Date(start);
			d.setHours(0);
			d.setMinutes(0);
			d.setDate(d.getDate()-1);
			var e=new Date(d);
			e.setDate(e.getDate()+15);
			this.dateControlNode.constraints.min=d;
			this.dateControlNode.constraints.max=e;

			this.grid=new GridClass({
				columnSets:[
					[{ChanNum:{
						renderHeaderCell:function(th){},
						renderCell:function(object,value,td){
							put(td,"span.ChanNum",object["ChanNum"]);
							put(td,"span.CallSign",object["CallSign"]);
						},
						sortable: false
					}}],
					[{Programs:{
						renderHeaderCell:lang.partial(this.renderHeaderCell,this),
						renderCell:lang.partial(this.renderCell,this),
						sortable: false
					}}]
				]
			});

			var listingRestStore=new JsonRest({
				target:"/rest/Guide/GetProgramGuide/",
				_getTarget:lang.hitch(this,function(id){
					var start=new Date(id);
					var finish=new Date(start);
					finish.setHours(finish.getHours()+3);
					start.setSeconds(1);
					finish.setSeconds(-1);
					return listingRestStore.target+"?StartTime="+start.toISOString()+"&EndTime="+finish.toISOString();
				})
			});
			this.listingStore=new Cache(listingRestStore,new Memory({
				idProperty:"StartTime"
			}));

			this.contentNode.set('content',this.grid);

			this.grid.on(".dgrid-content .dgrid-cell .Program:click",lang.hitch(this,this.onClickProgram));

			this.grid.on(".dgrid-header .dgrid-cell td:click",lang.hitch(this,function(evt){
				evt.stopPropagation();
				var td=evt.target;
				var i=0;
				while(td.previousSibling){
					td=td.previousSibling;
					i++;
				}
				if(i){
					var start=new Date(this.StartTime);
					start.setMinutes(start.getMinutes()+(i*30));
					this.set('StartTime',start);
					this.reRender();
				}
			}));
			this.reRender();
		}
	});
});