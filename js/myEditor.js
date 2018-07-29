
/*
 myEditor.js
 Copyright (C) 2018  Mehdi Pedram
    myEditor.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    myEditor.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <https://www.gnu.org/licenses/>. */

myEdPreviousOnload = window.onload;
previousWinResize = window.onresize;
window.onload = initEditor;
window.onresize = changeToolbarPosition;
var myToolbar;
var currentEditor=false;

function initEditor()
{
    if(myEdPreviousOnload)
        myEdPreviousOnload();
    myToolbar = document.getElementById('myEdToolbar');
    myEditors = document.getElementsByClassName('myEditors');
    for(i=0;i<myEditors.length;i++)
    {
        myEditors[i].setAttribute('onfocus','showMyEdToolbar(this);');
        myEditors[i].setAttribute('onblur','removeMyEdToolbar();');
        myEditors[i].setAttribute('contenteditable','true');
        myEditors[i].setAttribute('onclick','myEdInsertMedia()');
    }
    if(typeof variable == 'undefined')zoom=1;
    initMyFxEditors();
    addHTMLs();
}
function initMyFxEditors()
{
    myFxEditors = document.getElementsByClassName('myFxEditors');
    for(i=0;i<myFxEditors.length;i++)
    {
        myFxEditors[i].setAttribute('onfocus','showMyFxEdToolbar(this);');
        myFxEditors[i].setAttribute('onblur','myEdBlur();');
        myFxEditors[i].setAttribute('contenteditable','true');
        myFxEditors[i].addEventListener('click',checkMyFxEdDoubleClick,true);
    }
}
function showMyEdToolbar(editor)
{
    currentEditor = editor;
    clearMyEdTime();
    createMyEdToolBar(currentEditor);
    changeToolbarPosition();
}
function myEdBlur()
{
    myEdRemoveMediaBar();
    if(saveFxEdFunction)
        saveFxEdFunction();
    removeMyEdToolbar();
    if(currentFxEditor)
        currentFxEditor.setAttribute('contenteditable','false');
    if(currentEditor)
        currentEditor.setAttribute('contenteditable','false');
}

var myEdClearToolbar;
function removeMyEdToolbar()
{
    myEdClearToolbar = setTimeout(function(){document.body.removeChild(myToolbar);},500);
}
function clearMyEdTime()
{
    setTimeout(function(){clearTimeout(myEdClearToolbar);},60);
}
var myFxEdClickTime;

function checkMyFxEdDoubleClick(e)
{
    myEdInsertMedia();
    currentFxEditor=this;
    if (Date.now() - myFxEdClickTime < 900)
    {
        this.setAttribute('contenteditable','false');
        if( ! hasParentInClass( e.target,'myFxEdParts'))
            newFxPart(e,this);
        return;
    }
    else
    {
        myFxEdClickTime = Date.now();
        if( hasParentInClass( e.target,'myFxEdParts'))
            return;
        if(this.childNodes.length==this.children.length)
            this.innerHTML += '&nbsp;';
        this.setAttribute('contenteditable','true');
        this.focus();
    }
}

function showMyFxEdToolbar(editor)
{
    currentEditor = editor;
    clearTimeout(myEdClearToolbar);
    createMyEdToolBar(currentEditor,1);
    changeToolbarPosition();
}

function changeToolbarPosition()
{
    if(previousWinResize)
        previousWinResize();
    if(currentEditor)
    {
        pos = globalPosition(currentEditor);
        //myToolbar.style.top = (pos.y - myToolbar.offsetHeight)+'px';
        extraWidth=myToolbar.offsetWidth-(document.body.offsetWidth- pos.x);
        if(extraWidth>0)
            x= pos.x - extraWidth-3;
        else
            x= pos.x;
        myToolbar.style.left = x+'px';
        myToolbar.style.top = (pos.y - myToolbar.offsetHeight+4+ currentEditor.parentElement.scrollTop)+'px';
        //console.info('ed y :' + pos.y + ' tool: '+ (pos.y - myToolbar.offsetHeight) + myToolbar.style.top);

    }
}


function createMyEdToolBar(editor,fx)
{
    if(myToolbar)
    {
        myToolbar.remove();
        clearTimeout(myEdClearToolbar);
    }
    myToolbar = document.createElement('div');
    myToolbar.setAttribute('id','myEdToolbar');
    myToolbar.setAttribute('class','unselectable');
    myToolbar.setAttribute('unselectable','on');
    myToolbar.addEventListener('mousedown',clearMyEdTime,true);
    if(document.body.offsetWidth>450)
        myToolbar.innerHTML = myEdToolBarCode1+myEdToolBarCode3+myEdToolBarCode2;
    else
        myToolbar.innerHTML = myEdToolBarCode1+myEdToolBarCode2;
    if(fx)
        myToolbar.innerHTML += myEdFxTools;
    myToolbar.style['display']='block';
    document.body.appendChild(myToolbar);

    document.getElementById('myEdWhole').checked =false;
    document.getElementById('myEdWhole').style.backgroundColor ='white';

    buttons = document.getElementById('myEdToolbar').children;
    for(i=0;i<buttons.length;i++)
    {
        buttons[i].setAttribute('onclick','myEdButton(this);');
    }
    document.getElementById('myEdWhole').checked =false;
}
myEdToolBarCode1 =
            '<input id="myEdBold" type="button" value="B" style="font-weight: bold;" title="Bold">'+
            '<input id="myEdItalic" type="button" value="I" style="font-style: italic;" title="Italic">'+
            '<input id="myEdUnderline" type="button"  value="U" style="text-decoration: underline;" title="Underline">'+
            '<input id="myEdLink" type="button"  value="L" style="text-decoration: underline;" title="Link" >'+
            '<input id="myEdTable" type="button"  value="T" title="Table">'+
            '<input id="myEdForeCol" class="colorControl" value="FC" title="Forecolor" type="button" style="background-color: rgb(0,0,0);color: white">'+
            '<input id="myEdBackCol" class="colorControl" value="BC" type="button" title="Background color">';
myEdToolBarCode2=
            '<input id="myEdUL" type="button" value="UL" title="Unordered list">'+
            '<input id="myEdOL" type="button" value="OL" title="Ordered list">'+
            '<input id="myEdWhole" type="button" value="All" "Apply to all">'+
            '<input id="myEdExtra" type="button" value=".." title="Add media">'+
            '<input id="myEdFullScreen" type="button" value="F">'+
            '<input id="myEdHTML" type="button" value="H" title="HTML code">'+
            '<input id="myEdClear" type="button" value="C" title="Clear all">';
myEdToolBarCode3='<input id="myEdEn2Fa" type="button" value="E2F" title="English to Farsi">'+
            '<input id="myEdFa2En" type="button"  value="F2E" title="Farsi to English">'+
            '<input id="myEdrtl" type="button" value="<" title="Right to left" >'+
            '<input id="myEdltr" type="button" value=">" title="Left to right">' ;

myEdFxTools = ''; //'<br/><input id="myEdFxTextMode" type="button" value="Tex">';

function myEdButton(button){
     text = selectedText();
     changeIt= true;
    switch(button.id)
    {
        case 'myEdBold':
            sTag ='<b>';
            eTag ='</b>';
            break;
        case 'myEdItalic':
            sTag ='<i>';
            eTag ='</i>';
            break;
        case 'myEdUnderline':
            sTag ='<u>';
            eTag ='</u>';
            break;
        case 'myEdEn2Fa':
            sTag ='';
            eTag ='';
            text=changeTextLang(text,'enToFa');
            break;
        case 'myEdFa2En':
            sTag ='';
            eTag ='';
            text=changeTextLang(text,'faToEn');
            break;
        case 'myEdOL':
            sTag ='<ol><li>';
            eTag ='</li><ol>';
            break;
        case 'myEdUL':
            sTag ='<ul><li>';
            eTag ='</li><ul>';
            break;
        case 'myEdltr':
            sTag ='<div style="direction:ltr">';
            eTag ='</div>';
            break;
        case 'myEdrtl':
            sTag ='<div style="direction:rtl">';
            eTag ='</div>';
            break;
        case 'myEdLink':
            myEdLinkBox();
            return false;
            break;
        case 'myEdTable':
            myEdTableBox();
            return false;
            break;
        case 'myEdExtra':
            myEdExtraBox();
            return false;
            break;
        case 'myEdForeCol':
            colorPicker(button,applyForeColorFuncion);
            return false;
            break;
        case 'myEdBackCol':
            colorPicker(button,applyBackColorFuncion);
            return false;
            break;
        case 'myEdClear':
            if(currentEditor.className=='myFxEdParts')
            {
                currentEditor.parentElement.removeChild(currentEditor);
                myEdBlur();
                return false;
            }
            else
            {
                ans = confirm('Are you sure to clear everything?');
                if(!ans) return false;
                currentEditor.innerHTML='';
                sTag ='&nbsp;';
                eTag ='';
            }
            break;
        case 'myEdFullScreen':
            if (myEdFullScreen)
            {
                myEdFullScreen =false;
                unFullScreen();
            }
            else
            {
                fullScreen();
            }
            changeIt= false;
            break;
        case 'myEdHTML':
                if (myEdHTML)
                {
                    myEdHTML =false;
                    unHTML();
                }
                else
                {
                    codeHTML();
                }
                changeIt= false;
                break;
        case 'myEdWhole':
            if (document.getElementById('myEdWhole').checked)
            {
                document.getElementById('myEdWhole').checked =false;
                document.getElementById('myEdWhole').style.backgroundColor ='white';
            }
            else
            {
                document.getElementById('myEdWhole').checked =true;
                document.getElementById('myEdWhole').style.backgroundColor ='gray';
            }
            changeIt= false;
            break;
        default :
            changeIt= false;
    }
    if(changeIt)
    {
        if(document.getElementById('myEdWhole').checked)
        {
            currentEditor.innerHTML = sTag + currentEditor.innerHTML + eTag;
        }
        else
            pasteHtmlAtCaret(sTag + text + eTag,false);
    }
    return false;
}

function selectedText()
{
    if (window.getSelection)
    {
        sel = window.getSelection();
        text = sel.toString();
    }
    else
        text=document.selection.createRange().text;
    if (text=='') text='&nbsp;';
    return text;
}

var myEdSelected,myEdRange,myEdLinkClickFunc=false;
var myEdCurrentLink=false;
function myEdLinkBox()
{
    myEdSelected = window.getSelection();
    myEdRange= myEdSelected.getRangeAt(0);
    linkBox=document.getElementById('myEdLink');
    linkBox.style['display']='block';
    putItCenter(linkBox);

    if(myEdRange.startContainer.parentElement.tagName=="A")
    {
        myEdCurrentLink = myEdRange.startContainer.parentElement;
        url = myEdCurrentLink.getAttribute('href');
        lClass = myEdCurrentLink.className;
        lText = myEdCurrentLink.innerHTML;
        document.getElementById('myEdLinkText').value=lText;
        document.getElementById('myEdLinkURL').value=url;
        document.getElementById('myEdLinkClass').value=lClass;
    }
    else
        lText=selectedText();
    linkText = document.getElementById('myEdLinkText');
    linkText.value = lText;
}
function myEdLink()
{
    linkText = document.getElementById('myEdLinkText').value;
    url = document.getElementById('myEdLinkURL').value;
    lWindow = document.getElementById('myEdLinkWindow').value;
    linkClass = document.getElementById('myEdLinkClass').value;
    if(myEdCurrentLink)
        link=myEdCurrentLink;
    else
        link= document.createElement('a');
    link.setAttribute('class',linkClass);
    link.setAttribute('href',url);
    link.setAttribute('target',lWindow);
    link.innerHTML=linkText;
    if(myEdLinkClickFunc)
        link.setAttribute('onclick',myEdLinkClickFunc);
    if(myEdCurrentLink)
        myEdCurrentLink =false;
    else
        {
        myEdRange.deleteContents();
        myEdRange.insertNode(link);
        }
    document.getElementById('myEdLink').style['display']='none';
}

function myEdUnLink()
{
    text=myEdRange.startContainer.textContent;
    tn=document.createTextNode(text);
    if(myEdRange.startContainer.parentElement.tagName=="A")
        {
        myEdRange.startContainer.parentElement.remove();
        //myEdRange.deleteContents();
        myEdRange.insertNode(tn);
        }
}
////////////////   T A B L E  ///////////////////////
function myEdTableBox()
{
    myEdSelected = window.getSelection();
    myEdRange= myEdSelected.getRangeAt(0);
    tableBox=document.getElementById('myEdTable');
    tableBox.style['display']='block';
    putItCenter(tableBox);
}
function myEdTable()
{
    cols = document.getElementById('myEdTableCols').value;
    rows = document.getElementById('myEdTableRows').value;
    tableCode='';
    for(i=1;i<=rows;i++)
    {
        tableCode += '<tr>';
        for(j=1;j<=cols;j++)
        {
            tableCode += '<td>&nbsp;</td>';
        }
        tableCode += '</tr>';
    }
    tbl=document.createElement('table');
    tbl.innerHTML=tableCode;
    //tbl.setAttribute('style','border:1px black solid;');
    tbl.setAttribute('border','1');
    //console.info(tableCode );
    myEdRange.deleteContents();
    myEdRange.insertNode(tbl);
     document.getElementById('myEdTable').style['display']='none';
}

function myEdUnTable()
{
    if(myEdRange.startContainer.parentElement.tagName=="TD")
    {
        tPart=myEdRange.startContainer.parentElement;
        while(tPart.tagName!='TABLE')
        {
            tPart= tPart.parentElement;
        }
        text = tPart.innerText;
        tPart.remove();
        //myEdRange.insertNode(text);
    }
}

function myEdTableInsertRow(beforeAfter)
{
    myEdSelected = window.getSelection();
    myEdRange= myEdSelected.getRangeAt(0);
    tPart=myEdRange.startContainer.parentElement;
    if(tPart.tagName=="TD")
    {
        currentRow = tPart.parentElement;
        while(tPart.tagName!='TABLE')
        {
            tPart= tPart.parentElement;
        }
        var row = tPart.insertRow(currentRow.rowIndex+beforeAfter);

        for(i=0;i<currentRow.cells.length;i++)
        {
            cell=row.insertCell(i);
            cell.innerHTML="&nbsp;";
        }
    }
}

function myEdTableInsertCol(beforeAfter)
{
    myEdSelected = window.getSelection();
    myEdRange= myEdSelected.getRangeAt(0);
    tPart=myEdRange.startContainer.parentElement;
    if(tPart.tagName=="TD")
    {
        cellIndex = tPart.cellIndex ;
        console.info (cellIndex);
        while(tPart.tagName!='TABLE')
        {
            tPart= tPart.parentElement;
        }

        for(i=0;i<tPart.rows.length;i++)
        {
            cell=tPart.rows[i].insertCell(cellIndex+beforeAfter);
            cell.innerHTML="&nbsp;";
        }
    }
}
///////////// E X T R A   B U T T O N ///////////////////
var myEdLoadMediaFunction;
function myEdExtraBox()
{
    myEdSelected = window.getSelection();
    myEdRange= myEdSelected.getRangeAt(0);
    document.getElementById('myEdMediaURL').innerHTML='';
    extraButtonsBox = document.getElementById('myEdExtraButtons');
    extraButtonsBox.style['display']='block';
    myEdLoadMediaFunction();
    putItCenter(extraButtonsBox);
}

function myEdAddMedia(method)
{
    mediaURL=document.getElementById('myEdMediaURL').innerHTML;
    if(mediaURL=='')
    {
        alert("You have to fisrt choose a file!");
        return;
    }

    lowerCase =  mediaURL.toLowerCase();
    /// Images
    if(lowerCase.indexOf('.jpg')>1 || lowerCase.indexOf('.jpeg')>1 || lowerCase.indexOf('.png')>1 || lowerCase.indexOf('.gif')>1 ||lowerCase.indexOf('.bmp')>1)
    {
        code ='<img src="'+ mediaURL + '" />';

    }
    // Audios
    if(lowerCase.indexOf('.mp3')>1 || lowerCase.indexOf('.wav')>1 || lowerCase.indexOf('.ogg')>1 || lowerCase.indexOf('.amr')>1 )
        {
            code = '<audio controls class="myEdAudio">'+
                    '<source src="'+mediaURL+'" >'+
                    'Your browser does not support the audio element.</audio>';
        }
     // web Page or txt Files
     if( lowerCase.indexOf('.html')>1  || lowerCase.indexOf('.htm')>1 || lowerCase.indexOf('.txt')>1)
     {
         code = '<a href="#" onclick="showInternalBrowser();navigateInternalBrowser(\'' +mediaURL+ '\');">Text File</a>';
     }

     myEdRange.deleteContents();
     mBox = document.createElement('div');
     mBox.setAttribute('onclick','myEdShowMediaBar(this);');
     mBox.setAttribute('mediaURL',mediaURL);
     mBox.setAttribute('contenteditable','false');
     mBox.innerHTML= code;
     if (method=='courser')
     {
        //mBox.setAttribute('class','myEdMediaBoxRelative');
        myEdRange.insertNode(mBox);
     }
     if (method=='click')
     {
        myEdInsertMediaFlag =true;
        //mBox.setAttribute('class','myEdMediaBoxAbsolute');
     }

}

var myEdInsertMediaFlag=false;

function myEdInsertMedia()
{
    if(myEdInsertMediaFlag)
    {
        mBox.setAttribute('style','position:absolute;top:'+publicEvent.layerY +'px;left:'+publicEvent.layerX+'px;');
        currentEditor.appendChild(mBox);
        myEdInsertMediaFlag=false;
    }
}

var myEdMediaBarCode =
        '<input type="button" value="F">'+
        '<input type="button" value="C" onclick="myEdMediaBarAction(this);">';
var myEdMediaBar;
function myEdShowMediaBar(mediaBox)
{
    myEdRemoveMediaBar();
    myEdMediaBar=document.createElement('div');
    myEdMediaBar.setAttribute('class','myEdMediaBar unselectable');
    myEdMediaBar.setAttribute('unselectable','on');
    if (mediaBox.style['position']=='absolute')
    {
        myEdMediaBar.style['top']='0px';
        myEdMediaBar.style['left']='0px';
    }
    else
    {
        myEdMediaBar.style['top']=mediaBox.offsetTop+'px';
        myEdMediaBar.style['left']=mediaBox.offsetLeft+'px';
    }
   myEdMediaBar.innerHTML=myEdMediaBarCode;
   mediaBox.appendChild(myEdMediaBar);

    buttons = myEdMediaBar.children;
    for(i=0;i<buttons.length;i++)
    {
        buttons[i].setAttribute('onclick','myEdMediaBarAction(this);');
        buttons[i].addEventListener('mousedown',function(){dontRemoveMediaBar=true;},false);
    }
}
var dontRemoveMediaBar=false;
function myEdRemoveMediaBar()
{
    if(myEdMediaBar)
    {
        if (dontRemoveMediaBar)
            dontRemoveMediaBar=false;
        else
            myEdMediaBar.remove();
    }
}

function myEdMediaBarAction(button)
{
    bb=button;
    switch(button.value)
    {
        case 'C':
            mBox= button.parentElement.parentElement;
            if (removeMediaFromEditor(mBox.getAttribute('mediaurl')))
                mBox.remove();
            break;
    }
}
/////
var previousEditor;
var myEdFullScreen=false;
function fullScreen()
{
    myEdFullScreen =true;
    previousEditor=currentEditor;
    currentEditor = document.getElementById('myEdFullScreenEditor');
    currentEditor.innerHTML = previousEditor.innerHTML;
    currentEditor.style['display']='block';
    putItCenter(currentEditor);
    createMyEdToolBar(currentEditor);
    document.getElementById('myEdFullScreen').style['background-color']='gray';
    myToolbar.style.top =  (currentEditor.offsetTop)+'px';
    myToolbar.style.left = (currentEditor.offsetLeft)+'px';
    if(previousWinResize)
        window.onresize = previousWinResize;
    else
        window.onresize = null;
}

function unFullScreen()
{
    myEdFullScreen=false;
    previousEditor.innerHTML=currentEditor.innerHTML;
    currentEditor.style['display']='none';
    currentEditor=previousEditor;
    createMyEdToolBar(currentEditor);
    window.onresize = changeToolbarPosition;
    changeToolbarPosition();
}

var myEdHTML=false;
function unHTML()
{
  mmyEdHTML=false;
  previousEditor.innerHTML=currentEditor.value;
  currentEditor.style['display']='none';
  currentEditor=previousEditor;
  createMyEdToolBar(currentEditor);
  window.onresize = changeToolbarPosition;
  changeToolbarPosition();
}

function codeHTML()
{
  myEdHTML =true;
  previousEditor=currentEditor;
  currentEditor = document.getElementById('myEdHtmlEditor');
  currentEditor.innerHTML = previousEditor.innerHTML ;
  currentEditor.style['display']='block';
  putItCenter(currentEditor);
  //createMyEdToolBar(currentEditor);
  document.getElementById('myEdHTML').style['background-color']='gray';
  myToolbar.style.top =  (currentEditor.offsetTop)+'px';
  myToolbar.style.left = (currentEditor.offsetLeft)+'px';
  if(previousWinResize)
      window.onresize = previousWinResize;
  else
      window.onresize = null;
}

function pasteHtmlAtCaret(html, selectPastedContent,preSel) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        console.info(preSel);
        if(preSel)
            {sel=preSel;console.info('sd'); }
        else
            sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            var firstNode = frag.firstChild;
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                if (selectPastedContent) {
                    range.setStartBefore(firstNode);
                } else {
                    range.collapse(true);
                }
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        // IE < 9
        var originalRange = sel.createRange();
        originalRange.collapse(true);
        sel.createRange().pasteHTML(html);
        if (selectPastedContent) {
            range = sel.createRange();
            range.setEndPoint("StartToStart", originalRange);
            range.select();
        }
    }
}

var faDict = {};
var enDict= {};
function changeTextLang(text,dir)
{
    //sel = window.getSelection();
    //text = sel.toString();
    if(enDict['q']!='ض')//initialize
    {
        fa= '،آ' + 'ضصثقفغعهخحجچ'+'شسیبلاتنمکگ' +'ظطزرذدئو./'+'پ';
        en='TH' + "qwertyuiop[]"+"asdfghjkl;'"+"zxcvbnm,./"+'\\';
        faArr = fa.split('');
        enArr = en.split('');
        for(i=0;i<faArr.length;i++)
            {
                enDict[enArr[i]]=faArr[i];
                faDict[faArr[i]]=enArr[i];
            }
    }
    var r='';
    if(dir=='enToFa')
    {
        for(i=0;i<text.length;i++)
        {
            if(enDict[text[i]])
                r += enDict[text[i]];
            else
                r += text[i];
        }
    }
    else
    {
        for(i=0;i<text.length;i++)
        {
            if(faDict[text[i]])
                r += faDict[text[i]];
            else
                r += text[i];
        }
    }
    //range=sel.getRangeAt(0);
    //range.deleteContents();
    //range.insertNode(document.createTextNode(r));
    return r;
}
///////////////////  F x(flexible) E d i t o r ////////
var myFxEditorPartCount=0;
var saveFxEdFunction=false;
var currentFxEditor;
function newFxPart(e,parentEditor)
{
    if (parentEditor.className !='myFxEditors') return;
    currentFxEditor=parentEditor;
    myFxEditorPartCount++;
    x= Math.floor(e.layerX/zoom);//clientX- document.getElementById('calNote').offsetLeft;
    y=Math.floor(e.layerY/zoom); //- document.getElementById('calNote').offsetTop;
    id ='myFxEdPart' + myFxEditorPartCount;
    myFxEdPart = document.createElement('div');
    myFxEdPart.style.top= y+ 'px';
    myFxEdPart.style.left=x+'px';
    myFxEdPart.setAttribute('id',id);
    myFxEdPart.setAttribute('class','myFxEdParts');
    myFxEdPart.setAttribute('contenteditable','true');
    myFxEdPart.setAttribute('onblur','myFxEdPartBlur();');
    currentFxEditor.appendChild(myFxEdPart);
    showMyEdToolbar(myFxEdPart);
    myFxEdPart.addEventListener('click',myFxEdPartClick,true);
    myFxEdPart.addEventListener('mousedown',myFxEdMouseDown,true);
    myFxEdPart.addEventListener('mouseup',myFxEdMouseUp,true);
    myFxEdPart.addEventListener('mousemove',myFxEdMouseMove,true);

    myFxEdPart.addEventListener('touchstart',myFxEdPartTouch,true);
    myFxEdPart.addEventListener('touchend',myFxEdMouseUp,true);
    myFxEdPart.addEventListener('touchmove',myFxEdMouseMove,true);
    myFxEdPart.innerHTML='&nbsp;';
    myFxEdPart.focus();
    currentFxEdPart = myFxEdPart;
}

function myFxEdPartClick(e)
{
    myEdInsertMedia();
    currentFxEditor = this.parentElement;
    currentFxEditor.setAttribute('contenteditable','false');
    this.setAttribute('contenteditable','true');
    clearTimeout(myEdClearToolbar);
    showMyEdToolbar(this);
    //e.stopPropagation();
}
function myFxEdPartBlur()
{
    currentFxEdPart.setAttribute('contenteditable','false');
    //console.info(myEdMediaBar);
    removeMyEdToolbar();
    myEdRemoveMediaBar();
    //console.info(myEdMediaBar);
    if(saveFxEdFunction)
        saveFxEdFunction();
}

myEdFxMouseD=false;
var myFxEdSx,myFxEdSy,myFxEdSpx,myFxEdSpy;
var currentFxEdPart;
function myFxEdMouseDown(e)
{
    myEdFxMouseD=true;
    currentFxEdPart=this;
    myFxEdSpy = parseInt(currentFxEdPart.style.top);
    myFxEdSpx = parseInt(currentFxEdPart.style.left);
    myFxEdSx=Math.floor(e.clientX/zoom);
    myFxEdSy=Math.floor(e.clientY/zoom);
    currentFxEditor = this.parentElement;
    currentFxEditor.addEventListener('mousemove',myFxEdDragPosition,true);
}

function myFxEdPartTouch(e){
    myEdFxMouseD=true;
    currentFxEdPart=this;
    myFxEdSpy = parseInt(currentFxEdPart.style.top);
    myFxEdSpx = parseInt(currentFxEdPart.style.left);
    myFxEdSx=Math.floor(e.touches[0].clientX/zoom);
    myFxEdSy=Math.floor(e.touches[0].clientY/zoom);
    //document.getElementById('calNotePart1').innerHTML='dx:' +dx+' myFxEdSx:'+ myFxEdSx+ ' dy:'+myFxEdSpy;
    currentFxEditor.addEventListener('touchmove',myFxEdDragPositionTouch,true);
}

var dx,dy;
function myFxEdDragPosition(e){
    dx=Math.floor(e.clientX/zoom)-myFxEdSx;
    dy=Math.floor(e.clientY/zoom)-myFxEdSy;
}
function myFxEdDragPositionTouch(e){
    dx=Math.floor(e.touches[0].clientX/zoom)-myFxEdSx;
    dy=Math.floor(e.touches[0].clientY/zoom)-myFxEdSy;
}

function myFxEdMouseUp(e)
{
    myEdFxMouseD=false;
    document.getElementById('calNote').removeEventListener('mousemove',myFxEdDragPosition,true);
}

function myFxEdMouseMove(e)
{
    if(myEdFxMouseD)
        {
          currentFxEdPart.style.top= (myFxEdSpy+dy)+'px';//tt++;document.getElementById('calNotePart1').innerHTML=currentFxEdPart.id+(myFxEdSpy);
          currentFxEdPart.style.left=(myFxEdSpx+dx)+'px';
        }
        e.preventDefault();
}

function setMyFxEdPartEvents()
{
    preSysParts = document.getElementsByClassName('calNotePart');
    myFxParts = document.getElementsByClassName('myFxEdParts');
    myFxEditorPartCount=myFxParts.length;
    all=[myFxParts,preSysParts];
    for(j=0;j<2;j++)
    {
    for(i=0;i<all[j].length;i++)
    {
        all[j][i].setAttribute('onblur','myFxEdPartBlur();');
        all[j][i].addEventListener('click',myFxEdPartClick,true);
        all[j][i].addEventListener('mousedown',myFxEdMouseDown,true);
        all[j][i].addEventListener('mouseup',myFxEdMouseUp,true);
        all[j][i].addEventListener('mousemove',myFxEdMouseMove,true);

        all[j][i].addEventListener('touchstart',myFxEdPartTouch,true);
        all[j][i].addEventListener('touchend',myFxEdMouseUp,true);
        all[j][i].addEventListener('touchmove',myFxEdMouseMove,true);
    }
    }
}

function applyForeColorFuncion(col)
{
    text = selectedText();
    if(col)
    {
        if(document.getElementById('myEdWhole').checked)
        {
            if(currentEditor.className=='myFxEdParts')
            {
                style = currentEditor.getAttribute('style');
                style = 'color: ' + finalColor+';' + style;
                currentEditor.setAttribute('style',style);
            }
            else
                currentEditor.innerHTML = '<div style="color:'+ finalColor +';" >' + currentEditor.innerHTML +'&nbsp;</div>';
        }
        else
            pasteHtmlAtCaret('<span style="color:'+ finalColor +';" >' + text +'</span>',true);
    }
}
function applyBackColorFuncion(col)
{
    text = selectedText();
    if(col)
    {
        if(document.getElementById('myEdWhole').checked)
        {
            if(currentEditor.className=='myFxEdParts')
            {
                style = currentEditor.getAttribute('style');
                style = 'background-color: ' + finalColor+';' + style;
                currentEditor.setAttribute('style',style);
            }
            else
                currentEditor.innerHTML = '<div style="background-color:'+ finalColor +';" >' + currentEditor.innerHTML +'&nbsp;</div>';
        }
        else
            pasteHtmlAtCaret('<span style="background-color:'+ finalColor +';" >' + text +'</span>',true);
    }
}

///////////////////////
function globalPosition(tag)
{
    y=tag.scrollTop;
    x=tag.scrollLeft;
    while(tag != document.body)
    {
        y = y + tag.offsetTop -tag.scrollTop;
        x = x + tag.offsetLeft -tag.scrollLeft;
        tag = tag.parentElement;
    }
    return {'y':y ,'x': x};
}

function hasParentInClass(tag,className)
{
    while (tag!= document.body)
    {
        if (tag.className==className)
            return true;
        tag = tag.parentElement;
    }
    return false;
}

function addHTMLs()
{
	var myEditorHTMLs = document.createElement("DIV");
	document.body.appendChild(myEditorHTMLs);
	//myEditorHTMLs.style['display'] = "none";
	myEditorHTMLs.innerHTML=  '<div id="myEdFullScreenEditor" contenteditable="true"> </div> \
  <textarea id="myEdHtmlEditor"> </textarea> \
        <div id="myEdLink" class="dialogBox unselectable" title="Link">            \
            <label style="width:65px;display: inline-block;">Text:</label>\
            <input id="myEdLinkText" type="text" ><br>\
            <label style="width:65px;display: inline-block;">URL:</label>\
            <input id="myEdLinkURL" type="text"  ><br>\
            <label style="width:65px;display: inline-block;">Window:</label>\
            <select id="myEdLinkWindow">                \
                <option value="internalFrame">Internal Window</option>\
                <option value="_blank">External Window</option>\
                <option value="_self">This Window</option>\
            </select><br>\
            <label style="width:65px;display: inline-block;">Class:</label>\
            <input id="myEdLinkClass" type="text"  ><br>\
            <a href="#" class="button" onclick="myEdLink();">Link</a>\
            <a href="#" class="button" onclick="myEdUnLink();">Unlink</a>\
            <a href="#" class="button" onclick="hide(\'myEdLink\');">close</a><br/>\
        </div>\
\
        <div id="myEdTable" class="dialogBox unselectable" title="Table">            \
            <label style="width:70px;display: inline-block;">Rows:</label>\
            <input id="myEdTableRows" type="number" ><br>\
            <label style="width:70px;display: inline-block;">Columns:</label>\
            <input id="myEdTableCols" type="number"  ><br>            \
            <a href="#" class="button" onclick="myEdTable();">Create Table</a>            \
            <a href="#" class="button" onclick="myEdUnTable();">Clear Table</a><br>\
            <a href="#" class="button" onclick="myEdTableInsertRow(0);">Insert Row Before</a>\
            <a href="#" class="button" onclick="myEdTableInsertRow(1);">Insert Row After</a><br>\
            <a href="#" class="button" onclick="myEdTableInsertCol(0);">Insert Col Before</a>\
            <a href="#" class="button" onclick="myEdTableInsertCol(1);">Insert Col After</a>\
        </div>\
\
        <div id="myEdExtraButtons" title="Extra features" class="dialogBox">\
            Add at:\
            <a href="#" class="button" onclick="myEdAddMedia(\'courser\');">courser</a>\
            <a href="#" class="button" onclick="myEdAddMedia(\'click\');">click</a>\
            <hr>\
            Content:<br>\
            \
            <span id="myEdMediaURL"></span>&nbsp;\
            <div id="mediaSelector"></div>\
            <hr>\
            <a name="ff" href="#" class="button" onclick="document.getElementById(\'uploadButtonEditor\').click();">\
                <span>Add Media</span>\
                <input id="uploadButtonEditor" style="display: none;" type="file" value ="ss" name="file" onchange="uploadForEditor();"/>\
            </a>\
            <a href="#" class="button" onclick="removeMediaFromEditor();">Delete</a>\
        </div>	\
        \
                <div id="colorPicker" class="dialogBox" title="Pick a Color" style="display:none"  >\
             <div style="clear: both;">\
                <div id="finalColor">Your Color!</div>\
                <div style="float: left;">\
                    <a href="#" class="button" onclick="chooseColor();">Choose</a>\
                    <a href="#" class="button" onclick="hide(\'colorPicker\');">close</a>                    \
                </div>                \
            </div> <br style="clear: both;"/>\
            <div id="palette">\
                <a href="#" class="colPalette"></a><a href="#" class="colPalette"></a>\
                <a href="#" class="colPalette"></a><a href="#" class="colPalette"></a>\
                <a href="#" class="colPalette"></a><a href="#" class="colPalette"></a>\
                <a href="#" class="colPalette"></a><a href="#" class="colPalette"></a>\
                <a href="#" class="colPalette"></a><a href="#" class="colPalette"></a>\
                <a href="#" class="colPalette"></a><a href="#" class="colPalette"></a>\
                <a href="#" class="colPalette"></a><a href="#" class="colPalette"></a>\
                <a href="#" class="colPalette"></a><a href="#" class="colPalette"></a>\
                <a href="#" class="colPalette"></a><a href="#" class="colPalette"></a>\
            </div><br style="clear: both;"/>\
            <div class="colorOption" id="redOption">\
                <input onchange="changeColorPicker();" type="range" min="0" max="255" step="1" name="rColor" id="rColor" value="255">                \
            </div>\
            <div class="colorInstance" id="redInstance"></div>\
            <div class="colorOption" id="greenOption">\
                <input onchange="changeColorPicker();" type="range" min="0" max="255" step="1" name="gColor" id="gColor" value="255">                \
            </div>\
            <div class="colorInstance" id="greenInstance"></div>\
            <div class="colorOption" id="blueOption">\
                <input onchange="changeColorPicker();" type="range" min="0" max="255" step="1" name="bColor" id="bColor" value="255">                \
            </div>\
            <div class="colorInstance" id="blueInstance"></div>\
            <div class="colorOption">\
                <input onchange="changeColorPicker();" type="range" min="0" max="255" step="1" name="brightness" id="brightness" value="255">                \
            </div>\
            <div class="colorInstance" id="brightInstance"> </div>\
            <div class="colorOption">\
                <input onchange="changeColorPicker();" type="range" min="0" max="1" step="0.01" name="transparency" id="transparency" value="1">                \
            </div>\
            <div class="colorInstance" id="transparencyInstance"> </div>\
            <br style="clear: both"/>  \
            rgba: <input type="text" id="rgba" disabled="disabled" /><br/>\
        </div>\
        ';

}
