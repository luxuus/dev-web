var _agent=new Object();
var _lastDateSubmitted;
var _lastDateValidated=0;
var _pprHistoryLength=history.length;
var _pprSubmitCount=0;
var _pprRequestCount=0;
var _pprUnloaded=false;
var _initialFormState;
var _navDirty;
function _atLeast(
a0,
a1
)
{
return(!a0||(a0==_agent.kind))&&
(!a1||(a1<=_agent.version));
}
function _atMost(
a0,
a1
)
{
return(a0==_agent.kind)&&(a1>=_agent.version);
}
function _agentInit()
{
var a0=navigator.userAgent.toLowerCase();
var a1=parseFloat(navigator.appVersion);
var a2=false;
var a3=false;
var a4=false;
var a5=false;
var a6="unknown";
var a7=false;
var a8=false;
if(a0.indexOf("msie")!=-1)
{
a3=true;
var a9=a0.match(/msie (.*);/);
a1=parseFloat(a9[1]);
a6="ie";
}
else if(a0.indexOf("opera")!=-1)
{
a2=true
a6="opera";
}
else if((a0.indexOf('mozilla')!=-1)&&
(a0.indexOf('spoofer')==-1)&&
(a0.indexOf('compatible')==-1))
{
if(a1>=5.0)
{
a5=true;
a6="mozilla"
}
else
{
a4=true;
a6="nn";
}
}
else if(a0.indexOf('gecko/')!=-1)
{
a5=true;
a6="mozilla";
a1=5.0;
}
if(a0.indexOf('win')!=-1)
{
a7=true;
}
else if(a0.indexOf('mac')!=-1)
{
a8=true;
}
_agent.isIE=a3;
_agent.isNav=a4;
_agent.isOpera=a2;
_agent.isMozilla=a5;
_agent.version=a1
_agent.kind=a6;
_agent.isWindows=a7;
_agent.isMac=a8;
_agent.atLeast=_atLeast;
_agent.atMost=_atMost;
}
_agentInit();
var _ieFeatures=
{
channelmode:1,
copyhistory:1,
directories:1,
fullscreen:1,
height:1,
location:1,
menubar:1,
resizable:1,
scrollbars:1,
status:1,
titlebar:1,
toolbar:1,
width:1
};
var _nnFeatures=
{
alwayslowered:1,
alwaysraised:1,
copyhistory:1,
dependent:1,
directories:1,
height:1,
hotkeys:1,
innerheight:1,
innerwidth:1,
location:1,
menubar:1,
outerwidth:1,
outerheight:1,
resizable:1,
scrollbars:1,
status:1,
titlebar:1,
toolbar:1,
width:1,
"z-lock":1
}
var _modelessFeatureOverrides=
{
};
var _modalFeatureOverrides=
{
};
var _featureDefaults=
{
document:
{
channelmode:false,
copyhistory:true,
dependent:false,
directories:true,
fullscreen:false,
hotkeys:false,
location:true,
menubar:true,
resizable:true,
scrollbars:true,
status:true,
toolbar:true
},
dialog:
{
channelmode:false,
copyhistory:false,
dependent:true,
directories:false,
fullscreen:false,
hotkeys:true,
location:false,
menubar:false,
resizable:true,
scrollbars:true,
status:true
}
}
var _signedFeatures=
{
alwayslowered:1,
alwaysraised:1,
titlebar:1,
"z-lock":1
};
var _booleanFeatures=
{
alwayslowered:1,
alwaysraised:1,
channelmode:1,
copyhistory:1,
dependent:1,
directories:1,
fullscreen:1,
hotkeys:1,
location:1,
menubar:1,
resizable:1,
scrollbars:1,
status:1,
titlebar:1,
toolbar:1,
"z-lock":1
};
function _getContentWidth(
a0,
a1,
a2
)
{
var a3=a0.childNodes;
var a4=_agent.isMozilla;
var a5=(a4)
?"tagName"
:"canHaveHTML"
var a6=0;
for(var a7=0;a7<a3.length;a7++)
{
var a8=a3[a7];
if(a8[a5]&&(a8.offsetWidth>0))
{
var a9=0;
var a10=a8["offsetWidth"];
if(a4)
{
if(a10==a1)
{
a9=_getContentWidth(a8,
a10,
a8.offsetLeft);
}
else
{
a9=a10;
}
}
else
{
a9=a8["clientWidth"];
if(a9==0)
{
a9=_getContentWidth(a8,
a10,
a8.offsetLeft);
}
}
if(a9>a6)
{
a6=a9;
}
}
}
if(a6==0)
a6=a1;
var a11=10;
if(_isLTR()||(a2<=5))
{
a11=2*a2;
}
return a6+a11;
}
function _getTop(
a0
)
{
if(!_agent.isMozilla)
{
return top;
}
else
{
var a1=(a0)
?a0.window
:window;
while(a1.parent&&(a1.parent!=a1))
{
a1=a1.parent;
}
return a1;
}
}
function _sizeWin(
a0,
a1,
a2
)
{
var a3=_agent.isMozilla;
var a4=_agent.isIE;
if(!(a3||(a4&&_agent.isWindows)))
return;
var a5=a0.window.document.body;
if(a5)
{
var a6=(!a4&&(a5.scrollWidth>a5.clientWidth))
?a5.scrollWidth
:_getContentWidth(a5,a5.offsetWidth,a5.offsetLeft);
var a7=0;
if(a3)
{
a7=a5.offsetHeight+(window.outerHeight-window.innerHeight);
a7+=30;
a6+=(window.outerWidth-a5.offsetWidth);
}
else
{
a7=a5.scrollHeight+(a5.offsetHeight-a5.clientHeight);
a7+=21;
a6+=a5.offsetWidth-a5.clientWidth+16;
a7+=parseInt(a5.topMargin)+parseInt(a5.bottomMargin);
a6+=parseInt(a5.leftMargin)+parseInt(a5.rightMargin);
}
if(a1)
a6+=a1;
if(a2)
a7+=a2;
_getTop(a0).resizeTo(a6,a7);
}
}
function _onModalClickNN(
a0
)
{
if(_getValidModalDependent(self))
{
return false;
}
else
{
self.routeEvent(a0);
return true;
}
}
var _mozClickEH=new Object();
function _onModalClickMoz(
a0
)
{
dump(a0);
}
_mozClickEH["handleEvent"]=_onModalClickMoz;
function _onModalFocus()
{
var a0=self.document.body;
var a1=_getValidModalDependent(self);
var a2=_agent.atLeast("ie",5)&&_agent.isWindows;
if(a1)
{
if(!_agent.isMozilla)
a1.focus();
if(a2)
{
a0.setCapture();
}
}
else
{
if(a2)
{
a0.releaseCapture();
}
}
}
function openWindow(
a0,
a1,
a2,
a3,
a4,
a5,
a6
)
{
if(a0)
{
if(a4==(void 0))
a4=false;
if(!a5)
{
a5=(a4)?"dialog":"document";
}
if(!a2)
a2="_blank";
var a7=_featureDefaults[a5];
if(a7==(void 0))
{
a5="document";
a7=_featureDefaults[a5];
}
var a8=(a4)
?_modalFeatureOverrides
:_modelessFeatureOverrides;
var a9=(_agent.isIE)
?_ieFeatures
:_nnFeatures;
var a10="";
for(featureName in a9)
{
var a11=a8[featureName];
if(a11==(void 0))
{
if(a3)
a11=a3[featureName];
if(a11==(void 0))
a11=a7[featureName];
}
if(a11!=(void 0))
{
var a12=_booleanFeatures[featureName]!=(void 0);
if(a11||!a12)
{
a10+=featureName;
if(!a12)
{
a10+="="+a11;
}
a10+=",";
}
}
}
if(a10.length!=0)
{
a10=a10.substring(0,a10.length-1);
}
if(a6)
{
_setDependent(a0,a2,a6);
}
var a13=_agent.atMost("ie",4.99);
var a14=false;
var a15=a0.document.body;
if(a4&&!a13)
{
if(_agent.atLeast("ie",4))
{
a15.style.filter="alpha(opacity=50)";
a14=true;
}
if((_agent.atLeast("ie",5)&&_agent.isWindows))
{
a15.setCapture();
}
else if(_agent.isNav)
{
a0.captureEvents(Event.CLICK);
a0.onclick=_onModalClickNN;
}
else if(_agent.isMozilla)
{
a15.addEventListener(Event.CLICK,_mozClickEH,true);
}
a0.onfocus=_onModalFocus;
}
var a16=a0.open(a1,a2,a10);
if(a4&&!a13)
{
_setDependent(a0,"modalWindow",a16);
}
a16.focus();
if(a14)
{
a0.setTimeout("_clearAlphaFilter()",1000);
}
return a16;
}
else
{
return null;
}
}
function _getDependents(
a0,
a1
)
{
var a2;
if(a0)
{
a2=a0["_dependents"];
if(a2==(void 0))
{
if(a1)
{
a2=new Object();
a0["_dependents"]=a2;
}
}
}
return a2;
}
function _getDependent(
a0,
a1
)
{
var a2=_getDependents(a0);
var a3;
if(a2)
{
a3=a2[a1];
}
return a3;
}
function _setDependent(
a0,
a1,
a2
)
{
var a3=_getDependents(a0,true);
if(a3)
{
a3[a1]=a2;
}
}
function _getModalDependent(
a0
)
{
return _getDependent(a0,"modalWindow");
}
function _getValidModalDependent(
a0
)
{
var a1=_getModalDependent(a0);
if(a1)
{
if(a1.closed)
{
_setDependent(a0,"modalWindow",(void 0));
a1=(void 0);
}
}
return a1;
}
function _isModalDependent(
a0,
a1
)
{
return(a1==_getModalDependent(a0));
}
function _clearAlphaFilter()
{
if(_getValidModalDependent(self)!=null)
{
self.setTimeout("_clearAlphaFilter()",1000);
}
else
{
self.document.body.style.filter=null;
}
}
function _checkUnload(
a0
)
{
if(_isModalAbandoned())
return;
var a1=_getModalDependent(window);
if(a1!=null)
{
_setModalAbandoned(a1);
a1.close();
}
_pprUnloaded=true;
var a2=_getTop();
if(!a2)
return;
var a3=a2["opener"];
if(!a3)
return;
var a4=_getDependent(a3,self.name);
if(_isModalDependent(a3,self))
{
_setDependent(a3,"modalWindow",(void 0));
a3.onfocus=null;
var a5=a3.document.body;
if(_agent.atLeast("ie",4))
{
if(_agent.atLeast("ie",5)&&_agent.isWindows)
{
a5.releaseCapture();
}
a5.style.filter=null;
}
if(_agent.isNav)
{
a3.releaseEvents(Event.CLICK);
a3.onclick=null;
}
if(_agent.isMozilla)
{
a5.removeEventListener(Event.CLICK,
_mozClickEH,
true);
}
}
if(a4!=(void 0))
{
_setDependent(a3,self.name,(void 0));
if(a0==(void 0))
a0=self.event;
a4(a2,a0);
}
}
function _isModalAbandoned()
{
var a0=_getTop();
return a0._abandoned;
}
function _setModalAbandoned(
a0
)
{
a0._abandoned=true;
}
function _focusChanging()
{
if(_agent.isIE)
{
return(window.event.srcElement!=window.document.activeElement);
}
else
{
return true;
}
}
function _getKeyValueString(
a0,
a1,
a2
)
{
var a3=a0[a1];
if(typeof(a3)=="function")
{
a3="[function]";
}
var a4=(_agent.isMozilla)
?((a2+1)%3==0)
?'\n'
:'    '
:'\t';
return a1+':'+a3+a4;
}
function _dump(
a0
)
{
dump(a0,{innerText:1,outerText:1,outerHTML:1,innerHTML:1});
}
function dump(
a0,
a1,
a2
)
{
var a3="";
if(a0)
{
if(!a2)
{
a2=a0["name"];
}
var a4="return _getKeyValueString(target, key, index);";
if(_agent.atLeast("ie",5)||_agent.isMozilla)
a4="try{"+a4+"}catch(e){return '';}";
var a5=new Function("target","key","index",a4);
var a6=0;
var a7=new Array();
for(var a8 in a0)
{
if((!a1||!a1[a8])&&!a8.match(/DOM/))
{
a7[a6]=a8;
a6++;
}
}
a7.sort();
for(var a9=0;a9<a7.length;a9++)
{
a3+=a5(a0,a7[a9],a9);
}
}
else
{
a2="(Undefined)";
}
if(a3=="")
{
a3="No properties";
}
alert(a2+":\n"+a3);
}
function _validateForm(
a0
)
{
var a1='_'+a0.name+'Validater';
var a2=window[a1];
if(a2)
return a2(a0);
return false;
}
function _getNextNonCommentSibling(
a0,
a1
)
{
var a2=a0.children;
for(var a3=a1+1;a3<a2.length;a3++)
{
var a4=a2[a3];
if(a4&&(a4.tagName!="!"))
{
return a4;
}
}
return null;
}
function _valField(
formName,
nameInForm
)
{
if(nameInForm)
{
var target=document.forms[formName][nameInForm];
var blurFunc=target.onblur;
if(blurFunc)
{
var valFunc=blurFunc.toString();
var valContents=valFunc.substring(valFunc.indexOf("{")+1,
valFunc.lastIndexOf("}"));
var targetString="document.forms['"+
formName+
"']['"+
nameInForm+
"']";
valContents=valContents.replace(/this/,targetString);
var lastArg=valContents.lastIndexOf(",");
valContents=valContents.substring(0,lastArg)+")";
eval(valContents);
}
}
}
function _validateField(
a0,
a1,
a2,
a3,
a4
)
{
var a5=_agent.isNav;
var a6=false;
if(a5&&a4)
{
return;
}
if(a5||_agent.isMac||_agent.isMozilla)
{
var a7=new Date();
var a8=250;
if(_agent.isMac)
{
a8=600;
}
var a9=a7-_lastDateValidated;
if((a9>=0)&&(a9<a8))
{
return;
}
_lastDateValidated=a7;
}
var a10=a3||(_getValue(a0)!=0);
if(a10&&!window._validating&&_focusChanging())
{
if(a4)
{
var a11=window.document.activeElement;
if(a11)
{
var a12=a0.parentElement;
if(a12==a11.parentElement)
{
var a13=a12.children;
for(var a14=0;a14<a13.length;a14++)
{
if(a0==a13[a14])
{
a10=(a11!=_getNextNonCommentSibling(a12,a14));
}
}
}
}
}
if(a10)
{
var a15=_getValidationError(a0,a1);
if(a15)
{
window._validating=a0;
a0.select();
if(!a5)
{
a0.focus();
if(window["_failedPos"]!=(void 0))
{
if(a0.createTextRange)
{
var a16=a0.createTextRange();
a16.moveStart("character",window["_failedPos"]);
a16.select();
}
else if(a0.selectionStart!=(void 0))
{
a0.selectionStart=window["_failedPos"];
}
window["_failedPos"]=(void 0);
}
}
var a17=_getErrorString(a0,a2,
a15);
if(a17)
{
alert(a17);
_lastDateValidated=new Date();
}
if(a5)
{
a0.focus();
}
}
}
}
}
function _unvalidateField(
a0
)
{
if(window._validating==a0)
{
window._validating=void 0;
}
}
function submitForm(
a0,
a1,
a2
)
{
var a3=new Date();
if(_lastDateSubmitted)
{
var a4=a3-_lastDateSubmitted;
if((a4>=0)&&(a4<500))
return;
}
_lastDateSubmitted=a3;
if((typeof a0)=="string")
{
a0=document[a0];
}
else if((typeof a0)=="number")
{
a0=document.forms[a0];
}
if(!a0)
return false;
if(a1==(void 0))
a1=true;
var a5=true;
if(a1&&!_validateForm(a0))
a5=false;
var a6=window["_"+a0.name+"_Submit"];
if(a6!=(void 0))
{
var a7=new Function("doValidate",a6);
a0._tempFunc=a7;
var a8=a0._tempFunc(a1);
a0._tempFunc=(void 0);
if(a1&&(a8==false))
{
a5=false;
}
}
if(a5)
{
_resetHiddenValues(a0);
if(a2)
{
for(paramName in a2)
{
var a9=a2[paramName];
if(a9!=(void 0))
{
var a10=a0[paramName];
if(a10)
{
a10.value=a9;
}
}
}
}
a0.submit();
}
return a5;
}
function _resetHiddenValues(
a0
)
{
var a1=window["_reset"+a0.name+"Names"];
if(a1)
{
for(var a2=0;a2<a1.length;a2++)
{
var a3=a0[a1[a2]];
if(a3)
{
a3.value='';
}
}
}
}
function _getValue(a0)
{
var a1=a0.type
if(!a1&&a0.length)
{
a1=a0[0].type;
}
if(a1=="checkbox")
{
return a0.checked;
}
else if(a1.substring(0,6)=="select")
{
var a2=a0.selectedIndex;
if(a2!=(void 0)&&
a2!=null&&
a2>=0)
{
var a3=a0.options[a2];
var a4=a3.value;
if(!a4)
{
for(var a5=0;a5<a0.options.length;a5++)
{
if(a0.options[a5].value)
return a4;
}
return a3.text;
}
return a4;
}
return"";
}
else if(a1=="radio")
{
if(a0.length)
{
for(var a5=0;a5<a0.length;a5++)
{
if(a0[a5].checked)
{
return a0[a5].value;
}
}
}
else
{
if(a0.checked)
{
return a0.value;
}
}
return"";
}
else
{
return a0.value;
}
}
function _multiValidate(
a0,
a1
)
{
var a2="";
if(a1)
{
var a3=_getValidations(a0);
if(a3)
{
var a4=true;
for(var a5=0;a5<a1.length;a5+=4)
{
var a6=a0[a1[a5+1]];
var a7=a6.type;
if(!a7&&a6.length)
{
if(a6[0].type!="radio")
{
a6=a6[0];
}
}
var a8=a1[a5+3];
var a9=_getValue(a6);
if(!(a8&&(a9=="")))
{
var a10=_getValidationError(a6,a1[a5],
a3);
if(a10)
{
if(a4)
{
if(a6.focus)
a6.focus();
if(a6.type=="text")
a6.select();
a4=false;
}
var a11=_getErrorString(a6,
a1[a5+2],
a10);
a2+='\n'+a11;
}
}
}
}
}
return a2;
}
function _getID(
a0
)
{
if(!_agent.isNav)
{
var a1=a0.id;
var a2=a0.type;
if(!a2&&a0.length)
a2=a0[0].type;
if(a2=="radio")
{
var a3;
if(a0.length)
{
a3=a0[0].parentNode;
}
else
{
a3=a0.parentNode;
}
a1=a3.id;
}
return a1;
}
else
{
var a4=_getForm(a0);
var a5=window["_"+a4.name+"_NameToID"];
if(a5)
{
var a6=_getName(a0);
return a5[a6];
}
}
}
function _getForm(
a0
)
{
var a1=a0.form;
if(a1==(void 0))
{
var a2=a0.type;
if(!a2&&a0.length)
a2=a0[0].type;
if(a2=="radio"&&a0.length)
{
a1=a0[0].form;
}
}
return a1;
}
function _getName(
a0
)
{
var a1=a0.name;
if(a1==(void 0))
{
var a2=a0.type;
if(!a2&&a0.length)
a2=a0[0].type;
if(a2=="radio"&&a0.length)
{
a1=a0[0].name;
}
}
return a1;
}
function _instanceof(
a0,
a1
)
{
if(a1==(void 0))
return false;
while(typeof(a0)=="object")
{
if(a0.constructor==a1)
return true;
a0=a0.prototype;
}
return false;
}
function _getErrorString(
a0,
a1,
a2
)
{
var a3;
var a4=_getForm(a0);
var a5=_getValue(a0);
if(_instanceof(a2,window["ParseException"]))
{
a3=a2.parseString;
}
else
{
var a6=window["_"+a4.name+"_Formats"];
if(a6)
{
a3=a6[a1];
}
}
if(a3)
{
var a7=window["_"+a4.name+"_Labels"];
var a8;
if(a7)
{
a8=a7[_getID(a0)];
}
var a9=_formatErrorString(a3,
{
"value":a5,
"label":a8
});
return a9;
}
}
function _getValidations(
a0
)
{
return window["_"+a0.name+"_Validations"];
}
function _getValidationError(
input,
validationIndex,
validations
)
{
if(!validations)
{
validations=_getValidations(input.form);
}
if(validations)
{
var validator=validations[validationIndex];
if(validator)
{
var trueValidator=validator.replace(/%value%/g,"_getValue(input)");
return(eval(trueValidator));
}
}
return(void 0);
}
function _formatErrorString(
a0,
a1
)
{
var a2=a0;
for(currToken in a1)
{
var a3=a1[currToken];
if(!a3)
{
a3="";
}
var a4="%"+currToken+"%";
a2=a2.replace(new RegExp('{'+currToken+'}','g'),
a4);
var a5=a2.indexOf(a4);
if(a5>=0)
{
a2=a2.substring(0,a5)+
a3+
a2.substring(a5+a4.length);
}
}
return a2;
}
function _chain(
a0,
a1,
a2,
a3,
a4
)
{
var a5=_callChained(a0,a2,a3);
if(a4&&(a5==false))
return false;
var a6=_callChained(a1,a2,a3);
return!((a5==false)||(a6==false));
}
function _callChained(
a0,
a1,
a2
)
{
if(a0&&(a0.length>0))
{
if(a2==(void 0))
{
a2=a1.window.event;
}
var a3=new Function("event",a0);
a1._tempFunc=a3;
var a4=a1._tempFunc(a2);
a1._tempFunc=(void 0);
return!(a4==false);
}
else
{
return true;
}
}
function _checkLength(a0,a1,a2)
{
elementLength=a0.value.length;
if(elementLength>a1)
{
a0.value=a0.value.substr(0,a1);
return false;
}
if(elementLength<a1)
return true;
if((elementLength==a1)&&(a2.type=='change'))
return true;
if(a2&&(a2.which<32))
return true;
return false;
}
function _getElementById(
a0,
a1
)
{
if((_agent.kind!="ie")||(_agent.version>=5))
{
var a2=a0.getElementById(a1);
if((a2==null)||(a2.id==a1))
return a2;
return _findElementById(a0,a1);
}
else
{
return a0.all[a1];
}
}
function _findElementById(
a0,
a1
)
{
if(a0.id==a1)
return a0;
if(a0.childNodes)
{
var a2=a0.childNodes;
for(var a3=0;a3<a2.length;a3++)
{
var a4=_findElementById(a2.item(a3),a1);
if(a4!=null)
return a4;
}
}
return null;
}
function _addParameter(
a0,
a1,
a2
)
{
var a3=a0.indexOf('?');
if(a3==-1)
{
return a0+'?'+a1+'='+a2;
}
else
{
var a4=a0.indexOf(a1+'=',a3+1);
if(a4==-1)
{
return a0+'&'+a1+'='+a2;
}
else
{
var a5=a4+a1.length+1;
var a6=a0.substring(0,a5);
a6+=a2;
var a7=a0.indexOf('&',a5);
if(a7!=-1)
{
a6+=a0.substring(a7,a1.length);
}
return a6;
}
}
}
function _addFormParameter(
a0,
a1,
a2
)
{
var a3=new Object();
if(a0)
{
for(var a4 in a0)
a3[a4]=a0[a4];
}
a3[a1]=a2;
return a3;
}
function _firePCUpdateMaster(
a0,
a1,
a2,
a3
)
{
var a4=a1+'_dt';
var a5=window[a4];
if(a5!=a0.id)
{
window[a4]=a0.id;
if(a5)
{
var a6=_getElementById(document,a5);
if(a6)
{
_updateDetailIcon(a6,'/marlin/cabo/images/cache/c-sdtl.gif');
}
}
_updateDetailIcon(a0,'/marlin/cabo/images/cache/c-dtl.gif');
_firePartialChange(a2,a3);
}
}
function _updateDetailIcon(
a0,
a1
)
{
a0.firstChild.src=a1;
}
function _firePartialChange(a0)
{
var a1=_addParameter(a0,
_getPartialParameter(),
"true");
var a2=_getElementById(document,'_pprIFrame');
_pprRequestCount++;
if(_agent.isIE)
{
a2.contentWindow.location.replace(a1);
}
else
{
a2.contentDocument.location.replace(a1);
}
}
function _submitPartialChange(
a0,
a1,
a2
)
{
if((typeof a0)=="string")
a0=document[a0];
if(!a0)
return false;
a2=_addFormParameter(a2,_getPartialParameter(),"true");
var a3=a0.target;
a0.target="_pprIFrame";
_pprRequestCount++;
_pprSubmitCount++;
var a4=submitForm(a0,a1,a2);
if(!a4)
{
_pprRequestCount--;
_pprSubmitCount--;
}
a0.target=a3;
}
function _getPartialParameter()
{
if(window._pprPartialParam)
return window._pprPartialParam;
return"partial";
}
function _setOuterHTML(
a0,
a1,
a2
)
{
var a3=a2.tagName;
if(_agent.isIE)
{
var a4=true;
var a5=((a3=="TD")||
(a3=="TH")||
(a3=="CAPTION"));
var a6=!a5&&
((a3=="COL")||
(a3=="COLGROUP")||
(a3=="TR")||
(a3=="TFOOT")||
(a3=="THEAD")||
(a3=="TBODY"));
if(a5||a6)
{
var a7=a0.createElement(a3);
a7.mergeAttributes(a2);
if(a5)
{
a7.innerHTML=a2.innerHTML;
}
else
{
if(a6)
{
var a8=a2.firstChild;
while(a8!=null)
{
a7.appendChild(_setOuterHTML(a0,
null,
a8));
a8=a8.nextSibling;
}
}
}
if(a1)
{
a1.parentNode.replaceChild(a7,a1);
}
else
{
a1=a7;
}
a4=false;
}
if(a4)
{
a1.outerHTML=a2.outerHTML;
}
}
else
{
var a9;
var a7=a0.createElement(a3);
var a10=a2.innerHTML;
if((a10!=null)&&(a10.length>0))
a7.innerHTML=a2.innerHTML;
var a11=a2.attributes;
for(a9=0;a9<a11.length;a9++)
a7.setAttribute(a11[a9].name,a11[a9].value);
a1.parentNode.insertBefore(a7,a1);
a1.parentNode.removeChild(a1);
}
return a1;
}
function _partialUnload()
{
if((parent._pprRequestCount<=0)&&!parent._pprUnloaded)
{
var a0=0;
if(!_agent.isMozilla)
{
a0=parent._pprHistoryLength-parent.history.length;
}
else if(parent._pprSubmitCount&&(parent._pprSubmitCount>0))
{
a0=-(parent._pprSubmitCount+1);
}
parent._pprSubmitCount=0;
if(a0<0)
{
parent._pprHistoryLength=parent.history.length;
if(!_agent.isMozilla&&(parent.document.referrer!=null))
{
parent.history.go(parent.document.referrer);
}
else
{
parent.history.go(a0);
}
}
}
}
function _partialRedirect(a0)
{
if(a0&&(parent._pprRequestCount>0))
{
if(((typeof a0)=="string")&&(a0.length>0))
{
parent._pprRequestCount--;
parent._pprSubmitCount=0;
parent.location.href=a0;
}
}
}
function _partialChange(a0)
{
if(parent._pprRequestCount<=0)
return;
parent._pprRequestCount--;
if(a0)
_fixAllLinks(a0,parent);
var a1=document;
var a2=parent.document;
var a3=_getParentActiveElement();
var a4=null;
var a5=false;
for(var a6=0;a6<_pprTargets.length;a6++)
{
var a7=_pprTargets[a6];
var a8=_getElementById(a1,a7);
var a9=_getElementById(a2,a7);
if(a8&&a9)
{
var a10=_isDescendent(a3,a9);
_setOuterHTML(a2,a9,a8);
if((a10)&&(a4==null))
{
a9=_getElementById(a2,a9.id);
a4=_getNewActiveElement(a2,
a9,
a3);
if(a4==null)
{
a4=_getFirstFocusable(a9);
if(a4!=null)
a5=true;
}
}
}
}
_eval(parent,_getCommentedScript("_pprScripts"));
_restoreFocus(a4,a5);
}
function _fullChange()
{
if(parent._pprRequestCount>0)
{
parent._pprRequestCount--;
var a0=_getCommentedScript("_pprScripts");
if(a0!=null)
{
var a1=_getElementById(document,"_pprScripts");
a1.text=a0;
}
var a2=_getElementById(document,"_pprDisableWrite");
a2.text="var _pprDocumentWrite = document.write;"+
"var _pprDocumentWriteln = document.writeln;"+
"document.write = new Function('return;');"+
"document.writeln = new Function('return;');";
var a3=_getElementById(document,"_pprEnableWrite");
a3.text="document.write = _pprDocumentWrite;"+
"document.writeln = _pprDocumentWriteln";
var a4=document.body;
var a5=a4.getAttribute("onload");
var a6=a4.getAttribute("onunload");
a4.setAttribute("onload",_getCommentedScript("_pprFullOnload"));
a4.setAttribute("onunload",_getCommentedScript("_pprFullOnunload"));
var a7=_getDocumentContent();
a4.setAttribute("onload",a5);
a4.setAttribute("onunload",a6);
var a8=parent.document;
if(_agent.isIE)
{
var a9=document.charset;
a8.open();
a8.charset=a9;
}
a8.write(a7);
a8.close();
}
}
function _getParentActiveElement()
{
if(parent.document.activeElement)
{
_eval(parent,"_saveActiveElement()");
return parent._pprActiveElement;
}
return null;
}
function _saveActiveElement()
{
if(document.activeElement)
window._pprActiveElement=document.activeElement;
else
window._pprActiveElement=null;
}
function _getNewActiveElement(a0,a1,a2)
{
if(a2.id)
{
var a3=_getElementById(a0,
a2.id);
if(_isFocusable(a3))
return a3;
}
return null;
}
function _getFirstFocusable(a0)
{
if((a0==null)||_isFocusable(a0))
return a0;
if(a0.hasChildNodes)
{
var a1=a0.childNodes;
for(var a2=0;a2<a1.length;a2++)
{
var a3=a1[a2];
var a4=_getFirstFocusable(a3);
if(a4!=null)
return a4;
}
}
return null;
}
function _restoreFocus(a0,a1)
{
if(a0==null)
return;
var a2=_getAncestorByName(a0,"DIV");
if(!a2)
{
a0.focus();
}
else
{
var a3=a2.scrollTop;
var a4=a2.scrollLeft;
if(((a3==0)&&(a4==0))||!a1)
a0.focus();
}
if((_agent.isIE)
&&(a0.tagName=='INPUT')
&&(_getAncestorByName(a0,'TABLE')))
{
a0.focus();
}
}
function _getAncestorByName(
a0,
a1
)
{
a1=a1.toUpperCase();
while(a0)
{
if(a1==a0.nodeName)
return a0;
a0=a0.parentNode;
}
return null;
}
function _isDescendent(
a0,
a1
)
{
if(a0==null)
return false;
while(a0.parentNode)
{
if(a0==a1)
return true;
a0=a0.parentNode;
}
return false;
}
function _isFocusable(a0)
{
if(a0==null)
return false;
var a1=a0.nodeName.toLowerCase();
if(('a'==a1)&&(a0.href))
{
if(!_agent.isIE)
return true;
var a2=a0.childNodes;
if((a2)&&(a2.length==1))
{
var a3=a2[0].nodeName;
if('img'==a3.toLowerCase())
return false;
}
return true;
}
if(a0.disabled)
return false;
if('input'==a1)
{
return(a0.type!='hidden');
}
return(('select'==a1)||
('button'==a1)||
('textarea'==a1));
}
function _getCommentedScript(a0)
{
var a1=_getElementById(document,a0);
if(a1!=null)
{
var a2=a1.text;
var a3=0;
var a4=a2.length-1;
while(a3<a4)
{
if(a2.charAt(a3)=='*')
break;
a3++;
}
while(a4>a3)
{
if(a2.charAt(a4)=='*')
break;
a4--;
}
return a2.substring(a3+1,a4);
}
return null;
}
function _eval(targetWindow,code)
{
if(code==null)
return;
if(_agent.isIE)
targetWindow.execScript(code);
else
targetWindow.eval(code);
}
function _getDocumentContent()
{
if(_agent.isIE)
return document.documentElement.outerHTML;
var a0="<html"
var a1=document.documentElement.attributes;
for(var a2=0;a2<a1.length;a2++)
{
a0+=" ";
a0+=a1[a2].name;
a0+="=\""
a0+=a1[a2].value;
a0+="\"";
}
a0+=">";
a0+=document.documentElement.innerHTML;
a0+="</html>";
return a0;
}
function _fixAllLinks(a0,a1)
{
_initialFormState=_getFormState(a0);
if(window!=a1)
{
if(a1._initialFormState==null)
a1._initialFormState=new Object();
var a2=_initialFormState;
var a3=a1._initialFormState;
for(key in a2)
a3[key]=a2[key];
}
var a4;
var a5=document.links;
var a6=a1.location.href+'#';
for(a4=0;a4<a5.length;a4++)
{
var a7=a5[a4].href;
if(!a7||
(a7.substr(0,a6.length)==a6)||
(a7.substr(0,11).toLowerCase()=="javascript:"))
{
continue;
}
if(!_agent.isNav)
a7=escape(a7);
a5[a4].href="javascript:_submitNav('"+a0+"','"+a7+"')";
}
}
function _getFormState(a0)
{
var a1=new Object();
var a2=document[a0];
var a3;
for(a3=0;a3<a2.length;a3++)
{
var a4=a2.elements[a3].name;
if(a4)
{
var a5=a2[a4];
if(a5)
{
if(!a5.type||(a5.type!='hidden'))
a1[a4]=_getValue(a5);
}
}
}
return a1;
}
function _submitNav(a0,a1)
{
var a2=false;
if(_navDirty)
a2=true;
else
{
var a3=_getFormState(a0);
for(var a4 in a3)
{
if(a3[a4]!=_initialFormState[a4])
{
a2=true;
break;
}
}
}
if(a2)
{
var a5=window["_onNavigate"];
if((a5==(void 0))||!(a5(a0,a1)==false))
submitForm(a0,0,{'event':'navigate','uri':a1});
}
else
document.location.href=a1;
}
function _getInputField(a0)
{
var a1=(void 0);
var a2=(void 0);
if(window.event)
{
kc=window.event.keyCode;
a2=window.event.srcElement;
}
else if(a0)
{
kc=a0.which;
a2=a0.target;
}
if(a2!=(void 0)
&&(a2.tagName=="INPUT"||
a2.tagName=="TEXTAREA"))
a1=a2;
return a1;
}
function _enterField(
a0
)
{
var a1;
var a2;
var a3=true;
var a1=_getInputField(a0);
if(a1!=(void 0))
{
a1.form._mayResetByInput=false;
if(a1!=window._validating)
{
a1._validValue=a1.value;
}
a3=false;
}
return a3;
}
function _resetOnEscape(a0)
{
var a1;
var a2=_getInputField(a0);
if(a2!=(void 0))
{
var a3=a2.form;
if(a1==27)
{
var a4=false;
if((a2.selectionStart!=(void 0))&&
(a2.selectionEnd!=(void 0)))
{
a4=(a2.selectionStart!=a2.selectionEnd);
}
else if(document.selection)
{
a4=(document.selection.createRange().text.length!=0);
}
if(!a4)
{
a2.value=a2._validValue;
if(a3._mayResetByInput==true)
{
a3.reset();
a3._mayResetByInput=false;
}
else
{
a3._mayResetByInput=true;
}
}
return false;
}
else
{
a3._mayResetByInput=false;
}
}
return true;
}
function _checkLoad(
a0,
a1
)
{
for(var a2=0;a2<document.forms.length;a2++)
{
var a3=document.forms[a2];
if(a3.addEventListener)
{
a3.addEventListener('focus',_enterField,true);
a3.addEventListener('keydown',_resetOnEscape,true);
}
else if(a3.attachEvent)
{
a3.attachEvent('onfocusin',_enterField);
a3.attachEvent('onkeydown',_resetOnEscape);
}
}
if(a1!=(void 0))
{
_fixAllLinks(a1,window);
}
if((self!=top)&&top["_blockReload"])
{
document.onkeydown=_noReload;
}
}
function _noReload(a0)
{
if(!a0)a0=window.event;
var a1=a0.keyCode;
if((a1==116)||(a1==82&&a0.ctrlKey))
{
if(a0.preventDefault)a0.preventDefault();
a0.keyCode=0;
return false;
}
}
function _isEmpty(a0)
{
var a1=""+a0;
var a2=0;
while(a2<a1.length)
{
if(a1.charAt(a2)!=' ')
return false;
a2++;
}
return true;
}
function _isLTR()
{
return document.documentElement["dir"].toUpperCase()=="LTR";
}
