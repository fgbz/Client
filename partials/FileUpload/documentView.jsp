<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	//String swfFilePath=session.getAttribute("swfpath").toString();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript" src="../../js/lib/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="../../js/flex-view/flexpaper.js"></script>
<script type="text/javascript" src="../../js/flex-view/flexpaper_handlers.js"></script>
<style type="text/css"> 
html,body
{
    margin:0;
    height:100%;
}
body { margin:0; padding:0; overflow:auto; }   
#flashContent { display:none; }
</style>

<title>文档在线预览系统</title>
</head>
<body> 
        <div style="position:absolute;left:239px;top:10px;">
	       <div id="documentViewer" class="flexpaper_viewer" style="height:800px; width:750px;"></div>
 
	        <script type="text/javascript"> 

	        var startDocument = "Paper";
	        	function GetQueryString(name)
	        	{
	        	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	        	     var r = window.location.search.substr(1).match(reg);
	        	     if(r!=null)return  unescape(r[2]); return null;
	        	}
	
	        $('#documentViewer').FlexPaperViewer(
	                { config : {

	                    SWFFile : GetQueryString("url"),

	                    Scale : 0.6,
	                    ZoomTransition : 'easeOut',
	                    ZoomTime : 0.5,
	                    ZoomInterval : 0.2,
	                    FitPageOnLoad : true,
	                    FitWidthOnLoad : false,
	                    FullScreenAsMaxWindow : false,
	                    ProgressiveLoading : false,
	                    MinZoomSize : 0.2,
	                    MaxZoomSize : 5,
	                    SearchMatchAll : false,
	                    InitViewMode : 'Portrait',
	                    RenderingOrder : 'flash',
	                    StartAtPage : '',

	                    ViewModeToolsVisible : true,
	                    ZoomToolsVisible : true,
	                    NavToolsVisible : true,
	                    CursorToolsVisible : true,
	                    SearchToolsVisible : true,
	                    WMode : 'window',
	                    localeChain: 'en_US'
	                }}
	        );
	   
	        </script>            
        </div>
</body>
</html>