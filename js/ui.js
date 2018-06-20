// IDs : 
//      smallInfo
// Classess :
//      dialogBox,colorControl,button,bigButton

var uiPreviousOnload;
uiPreviousOnload = window.onload;
window.onload = initUI;

function initUI()
{    
    if(uiPreviousOnload)
        uiPreviousOnload();
    
    document.body.addEventListener('click',eventHandler);
    document.body.addEventListener('mousedown',eventHandler);
    document.body.addEventListener('mouseup',eventHandler);    
    document.body.addEventListener('touchstart',eventHandler);    
    document.body.addEventListener('touchend',eventHandler);

    class2Dialog('dialogBox');
    class2Dialog('form');
    
    colorControls = document.getElementsByClassName('colorControl');
    for(i=0;i<colorControls.length;i++)
    {
        colorControls[i].setAttribute('onclick','colorPicker(this)');
    }   
}

var dialogTitleBarStart = '<div class="dialogTitleBar">';
var dialogTitleBarEnd = '<a href="#" onclick="hideTag(this.parentElement.parentElement);" class="button" style="float:right"> X </a></div>';

function class2Dialog(className)
{
    dialogs = document.getElementsByClassName(className);
    for(i=0;i<dialogs.length;i++)
    {        
        titleBarCon= dialogs[i].getAttribute('titleBarCon');
        if (titleBarCon)
            titleBarCon='<span> '+
                document.getElementById(titleBarCon).innerHTML+'</span>';
        else 
            titleBarCon='';
        title= dialogs[i].getAttribute('title');
        if (title)
            title='<span class="dialogTitle">'+title+'</span>';
        else 
            title='';
        if(!dialogs[i].getAttribute('noTitleBar')) 
            dialogs[i].innerHTML = dialogTitleBarStart + title + titleBarCon 
                + dialogTitleBarEnd + dialogs[i].innerHTML;        
    }    
}

var startDragX,startDragY,dragingElement;
var dspy,dspx;
var publicEvent;
function eventHandler(e){
    //console.info(e.target);
    //console.info(e.type);
    publicEvent = e;
    switch (e.type)
    {
        case 'click':
            
            break;
        case 'mousedown':
            if(e.target.className=='dialogTitleBar')
            {
                document.body.addEventListener('mousemove',dragParent);
                dragingElement = e.target.parentElement;
                startDragX=Math.floor(e.layerX/zoom);
                startDragY=Math.floor(e.layerY/zoom);
            }
            break;
        case 'mouseup':
            if(e.target.className=='dialogTitleBar')
            {
                document.body.removeEventListener('mousemove',dragParent);
            }
            break;
        case 'touchstart':
            if(e.target.className=='dialogTitleBar')
            {
                document.body.addEventListener('touchmove',dragParentTouch);                
                dragingElement = e.target.parentElement;
                startDragX=Math.floor(e.touches[0].pageX/zoom);
                startDragY=Math.floor(e.touches[0].pageY/zoom);
                dspy = dragingElement.offsetTop;
                dspx = dragingElement.offsetLeft;
            }
            break;
        case 'touchend':
            if(e.target.className=='dialogTitleBar')
            {
               document.body.removeEventListener('touchmove',dragParentTouch);
            }
            break;
            
    }
    //console.info(Math.floor(e.layerX/zoom));
    //console.info(Math.floor(e.layerY/zoom));
    
    //document.body.addEventListener('mousemove',eventHandler);
    //document.body.addEventListener('touchmove',eventHandler);
}

function dragParent(e)
{
     if(e.target.className!='dialogTitleBar') return;
     dx = Math.floor(e.layerX/zoom) -startDragX;
     dy = Math.floor(e.layerY/zoom) -startDragY;    
     dragingElement.style['top'] = (dragingElement.offsetTop + dy ) + 'px';
     dragingElement.style['left'] = (dragingElement.offsetLeft + dx ) + 'px';
}
function dragParentTouch(e)
{
     if(e.target.className!='dialogTitleBar') return;
     dx = Math.floor(e.touches[0].pageX/zoom) -startDragX;
     dy = Math.floor(e.touches[0].pageY/zoom) -startDragY;    
     dragingElement.style['top'] = (dspy + dy ) + 'px';
     dragingElement.style['left'] = (dspx + dx ) + 'px';
}

function smallInfo(msg)
{
    document.getElementById('smallInfo').innerHTML=msg;
    document.getElementById('smallInfo').style["display"] = 'inline-block';
    putItCenter(document.getElementById('smallInfo'));
    setTimeout(function (){document.getElementById('smallInfo').style["display"]='none';}, 2000);                
}

function putItCenter(tag)
{
    tag.style['position']='absolute';
    w = tag.parentElement.offsetWidth;
    h = tag.parentElement.offsetHeight;
    tag.style.left = ((w - tag.offsetWidth)/2)+'px';
    t = ((h - tag.offsetHeight)/2);
    if (t<0) t=0;
    tag.style.top=t + 'px';
}

function showHide(tagId){
    if (document.getElementById(tagId).style["display"]=='block')
        document.getElementById(tagId).style["display"]='none';
    else
        document.getElementById(tagId).style["display"] = 'block';
}
function hide(tagId){
    document.getElementById(tagId).style["display"]='none';                               
}
function hideTag(tag){
    tag.style["display"]='none';                               
}

function closeAllForms()
{
forms =  document.getElementsByClassName('form');
for (i=0; i<forms.length;i++)
{
    if (forms[i].style['display']!='none')
        forms[i].style['display'] = 'none';
}
}

function fillForm(formData)
{
    for (key in formData)
        {
            if(document.getElementById(key))
            {
                if(document.getElementById(key).type=='checkbox')                    
                    {document.getElementById(key).checked=parseInt(formData[key]);}
                 else   
                    document.getElementById(key).value=formData[key];                
            }            
        }    
}

function radioValue(radioName){
    radios = document.getElementsByName(radioName);
    for (i=0;i< radios.length;i++)
    {
        if (radios[i].checked)
            return radios[i].value;
    }
    return false;
}

function setRadio(radioName,value){
    radios = document.getElementsByName(radioName);
    for (i=0;i< radios.length;i++)
    {
        if (radios[i].value == value){
            radios[i].checked=true;
            radios[i].parentElement.style['background-color']= selectedRadioColor;            
        }
        else{
            radios[i].checked=false;
            radios[i].parentElement.style['background-color'] = radioColor;
        }
    }
}

function showPic(pic)
{
    document.getElementById('actualPic').setAttribute('src',pic);
    showHide('actualPic');
    putItCenter(document.getElementById('actualPic'));    
}

function createListBox(titles,values,id,parent,msg,msgValue)
{
    current=document.getElementById(id);
    if(current)
        current.remove();
    select=document.createElement('select');
    select.setAttribute('id',id);
    if(msg)
        options='<option value="'+msgValue+'">'+msg+'</option>';
    else
        options='';
    for(i=0;i< values.length;i++)
    {
        options += '<option value="'+values[i]+'">'+titles[i]+'</option>';        
    }
    select.innerHTML=options;
    parent.appendChild(select);
}
///////////////////  C O L O R   P I C K E R //////////
var finalColor;
var coloredTag;
var colorEndFunction;
var defaultPallete=Array(
        'rgba(255,255,255,1)','rgba(255,0,0,1)','rgba(0,255,0,1)',
        'rgba(0,0,255,1)','rgba(0,255,255,1)','rgba(255,0,255,1)',
        'rgba(255,255,0,1)','rgba(128,255,255,1)','rgba(255,128,255,1)',
        'rgba(255,255,128,1)','rgba(128,128,255,1)','rgba(128,255,128,1)',
        'rgba(255,128,128,1)','rgba(192,255,255,1)','rgba(255,192,255,1)',
        'rgba(255,255,192,1)','rgba(128,128,128,1)',
        'rgba(0,0,0,1)');

function colorPicker(tag,endFunction)
{    
    coloredTag = tag;
    colorEndFunction = endFunction;
    document.getElementById('colorPicker').style['display']='block';
    putItCenter(document.getElementById('colorPicker'));
    changeColorPicker(tag.style.backgroundColor);
    pColors = document.getElementsByClassName('colPalette');
    for(i=0;i<pColors.length;i++)
    {
        pColors[i].style.backgroundColor = defaultPallete[i];
        pColors[i].innerHTML= i;
        pColors[i].setAttribute('onclick','changeColorPicker(this.style.backgroundColor);');
    }
}

function chooseColor()
{
    coloredTag.style.backgroundColor =finalColor;    
    if(colorEndFunction)
        colorEndFunction(finalColor);
    hide('colorPicker');
}

function cancelColor()
{
    if(colorEndFunction) colorEndFunction();
    hide('colorPicker');
}

function changeColorPicker(col)
{
    if(col)
    {
        arr = col.split('(');
        arr = arr[1].split(')');
        arr = arr[0].split(',');
        red =  parseInt(arr[0]);
        green = parseInt(arr[1]);
        blue = parseInt(arr[2]);
        brightness = 255;
        if(arr.length > 3)
            trans = parseFloat(arr[3]);
        else
            trans = 1;
        document.getElementById('rColor').value=red;
        document.getElementById('gColor').value=green;
        document.getElementById('bColor').value=blue;
        document.getElementById('brightness').value=brightness;
        document.getElementById('transparency').value=trans;
    }
    else
    {    
        red= parseInt(document.getElementById('rColor').value);
        blue= parseInt(document.getElementById('bColor').value);
        green= parseInt(document.getElementById('gColor').value);
        brightness= parseInt(document.getElementById('brightness').value);
        trans= parseFloat(document.getElementById('transparency').value);
    }
    redIns=document.getElementById('redInstance');
    blueIns=document.getElementById('blueInstance');
    greenIns=document.getElementById('greenInstance');
    transparencyIns=document.getElementById('transparencyInstance');
    brightIns=document.getElementById('brightInstance');
    finalColorBox =document.getElementById('finalColor');

    redIns.style.backgroundColor='rgba('+ red + ',0,0,1)';
    greenIns.style.backgroundColor='rgba(0,'+ green + ',0,1)';
    blueIns.style.backgroundColor='rgba(0,0,'+ blue+',1)';
    transparencyIns.style.backgroundColor='rgba(255,255,255,'+trans+')';    
    rbr=brightness/255;
    brightIns.style.backgroundColor='rgba('+ brightness + ','+brightness +','+brightness + ',1)';
    finalColor ='rgba('+ Math.round(red *rbr)  + ','+Math.round(green*rbr) +','+Math.round(blue *rbr) + ','+trans+ ')';
    finalColorBox.style.backgroundColor =finalColor;
    document.getElementById('rgba').value=finalColor;
}