/* automatically generated by JSCoverage - do not edit */
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    _$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (typeof _$jscoverage !== 'object') {
  _$jscoverage = {};
}
if (! _$jscoverage['plugins/video.js']) {
  _$jscoverage['plugins/video.js'] = [];
  _$jscoverage['plugins/video.js'][7] = 0;
  _$jscoverage['plugins/video.js'][9] = 0;
  _$jscoverage['plugins/video.js'][21] = 0;
  _$jscoverage['plugins/video.js'][22] = 0;
  _$jscoverage['plugins/video.js'][33] = 0;
  _$jscoverage['plugins/video.js'][34] = 0;
  _$jscoverage['plugins/video.js'][35] = 0;
  _$jscoverage['plugins/video.js'][37] = 0;
  _$jscoverage['plugins/video.js'][38] = 0;
  _$jscoverage['plugins/video.js'][43] = 0;
  _$jscoverage['plugins/video.js'][44] = 0;
  _$jscoverage['plugins/video.js'][46] = 0;
  _$jscoverage['plugins/video.js'][47] = 0;
  _$jscoverage['plugins/video.js'][93] = 0;
  _$jscoverage['plugins/video.js'][95] = 0;
  _$jscoverage['plugins/video.js'][96] = 0;
  _$jscoverage['plugins/video.js'][97] = 0;
  _$jscoverage['plugins/video.js'][98] = 0;
  _$jscoverage['plugins/video.js'][99] = 0;
  _$jscoverage['plugins/video.js'][101] = 0;
  _$jscoverage['plugins/video.js'][102] = 0;
  _$jscoverage['plugins/video.js'][103] = 0;
  _$jscoverage['plugins/video.js'][104] = 0;
  _$jscoverage['plugins/video.js'][105] = 0;
  _$jscoverage['plugins/video.js'][106] = 0;
  _$jscoverage['plugins/video.js'][107] = 0;
  _$jscoverage['plugins/video.js'][111] = 0;
  _$jscoverage['plugins/video.js'][113] = 0;
}
_$jscoverage['plugins/video.js'].source = ["<span class=\"c\">/**</span>","<span class=\"c\"> * video&#25554;&#20214;&#65292; &#20026;UEditor&#25552;&#20379;&#35270;&#39057;&#25554;&#20837;&#25903;&#25345;</span>","<span class=\"c\"> * @file</span>","<span class=\"c\"> * @since 1.2.6.1</span>","<span class=\"c\"> */</span>","","UE<span class=\"k\">.</span>plugins<span class=\"k\">[</span><span class=\"s\">'video'</span><span class=\"k\">]</span> <span class=\"k\">=</span> <span class=\"k\">function</span> <span class=\"k\">()</span><span class=\"k\">{</span>","","    <span class=\"k\">var</span> me <span class=\"k\">=</span><span class=\"k\">this</span><span class=\"k\">,</span>","        div<span class=\"k\">;</span>","","    <span class=\"c\">/*</span>","<span class=\"c\">     * &#21019;&#24314;&#25554;&#20837;&#35270;&#39057;&#23383;&#31526;&#31388;</span>","<span class=\"c\">     * @param url &#35270;&#39057;&#22320;&#22336;</span>","<span class=\"c\">     * @param width &#35270;&#39057;&#23485;&#24230;</span>","<span class=\"c\">     * @param height &#35270;&#39057;&#39640;&#24230;</span>","<span class=\"c\">     * @param align &#35270;&#39057;&#23545;&#40784;</span>","<span class=\"c\">     * @param toEmbed &#26159;&#21542;&#20197;flash&#20195;&#26367;&#26174;&#31034;</span>","<span class=\"c\">     * @param addParagraph  &#26159;&#21542;&#38656;&#35201;&#28155;&#21152;P &#26631;&#31614;</span>","<span class=\"c\">     */</span>","    <span class=\"k\">function</span> creatInsertStr<span class=\"k\">(</span>url<span class=\"k\">,</span>width<span class=\"k\">,</span>height<span class=\"k\">,</span>id<span class=\"k\">,</span>align<span class=\"k\">,</span>toEmbed<span class=\"k\">)</span><span class=\"k\">{</span>","        <span class=\"k\">return</span>  <span class=\"k\">!</span>toEmbed <span class=\"k\">?</span>","","                <span class=\"s\">'&lt;img '</span> <span class=\"k\">+</span> <span class=\"k\">(</span>id <span class=\"k\">?</span> <span class=\"s\">'id=\"'</span> <span class=\"k\">+</span> id<span class=\"k\">+</span><span class=\"s\">'\"'</span> <span class=\"k\">:</span> <span class=\"s\">''</span><span class=\"k\">)</span> <span class=\"k\">+</span> <span class=\"s\">' width=\"'</span><span class=\"k\">+</span> width <span class=\"k\">+</span><span class=\"s\">'\" height=\"'</span> <span class=\"k\">+</span> height <span class=\"k\">+</span> <span class=\"s\">'\" _url=\"'</span><span class=\"k\">+</span>url<span class=\"k\">+</span><span class=\"s\">'\" class=\"edui-faked-video\"'</span>  <span class=\"k\">+</span>","                <span class=\"s\">' src=\"'</span> <span class=\"k\">+</span> me<span class=\"k\">.</span>options<span class=\"k\">.</span>UEDITOR_HOME_URL<span class=\"k\">+</span><span class=\"s\">'themes/default/images/spacer.gif\" style=\"background:url('</span><span class=\"k\">+</span>me<span class=\"k\">.</span>options<span class=\"k\">.</span>UEDITOR_HOME_URL<span class=\"k\">+</span><span class=\"s\">'themes/default/images/videologo.gif) no-repeat center center; border:1px solid gray;'</span><span class=\"k\">+(</span>align <span class=\"k\">?</span> <span class=\"s\">'float:'</span> <span class=\"k\">+</span> align <span class=\"k\">+</span> <span class=\"s\">';'</span><span class=\"k\">:</span> <span class=\"s\">''</span><span class=\"k\">)+</span><span class=\"s\">'\" /&gt;'</span>","","                <span class=\"k\">:</span>","                <span class=\"s\">'&lt;embed type=\"application/x-shockwave-flash\" class=\"edui-faked-video\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\"'</span> <span class=\"k\">+</span>","                <span class=\"s\">' src=\"'</span> <span class=\"k\">+</span> url <span class=\"k\">+</span> <span class=\"s\">'\" width=\"'</span> <span class=\"k\">+</span> width  <span class=\"k\">+</span> <span class=\"s\">'\" height=\"'</span> <span class=\"k\">+</span> height  <span class=\"k\">+</span> <span class=\"s\">'\"'</span>  <span class=\"k\">+</span> <span class=\"k\">(</span>align <span class=\"k\">?</span> <span class=\"s\">' style=\"float:'</span> <span class=\"k\">+</span> align <span class=\"k\">+</span> <span class=\"s\">'\"'</span><span class=\"k\">:</span> <span class=\"s\">''</span><span class=\"k\">)</span> <span class=\"k\">+</span>","                <span class=\"s\">' wmode=\"transparent\" play=\"true\" loop=\"false\" menu=\"false\" allowscriptaccess=\"never\" allowfullscreen=\"true\" &gt;'</span><span class=\"k\">;</span>","    <span class=\"k\">}</span>","","    <span class=\"k\">function</span> switchImgAndEmbed<span class=\"k\">(</span>root<span class=\"k\">,</span>img2embed<span class=\"k\">)</span><span class=\"k\">{</span>","        utils<span class=\"k\">.</span>each<span class=\"k\">(</span>root<span class=\"k\">.</span>getNodesByTagName<span class=\"k\">(</span>img2embed <span class=\"k\">?</span> <span class=\"s\">'img'</span> <span class=\"k\">:</span> <span class=\"s\">'embed'</span><span class=\"k\">),</span><span class=\"k\">function</span><span class=\"k\">(</span>node<span class=\"k\">)</span><span class=\"k\">{</span>","            <span class=\"k\">if</span><span class=\"k\">(</span>node<span class=\"k\">.</span>getAttr<span class=\"k\">(</span><span class=\"s\">'class'</span><span class=\"k\">)</span> <span class=\"k\">==</span> <span class=\"s\">'edui-faked-video'</span><span class=\"k\">)</span><span class=\"k\">{</span>","","                <span class=\"k\">var</span> html <span class=\"k\">=</span> creatInsertStr<span class=\"k\">(</span> img2embed <span class=\"k\">?</span> node<span class=\"k\">.</span>getAttr<span class=\"k\">(</span><span class=\"s\">'_url'</span><span class=\"k\">)</span> <span class=\"k\">:</span> node<span class=\"k\">.</span>getAttr<span class=\"k\">(</span><span class=\"s\">'src'</span><span class=\"k\">),</span>node<span class=\"k\">.</span>getAttr<span class=\"k\">(</span><span class=\"s\">'width'</span><span class=\"k\">),</span>node<span class=\"k\">.</span>getAttr<span class=\"k\">(</span><span class=\"s\">'height'</span><span class=\"k\">),</span><span class=\"k\">null</span><span class=\"k\">,</span>node<span class=\"k\">.</span>getStyle<span class=\"k\">(</span><span class=\"s\">'float'</span><span class=\"k\">)</span> <span class=\"k\">||</span> <span class=\"s\">''</span><span class=\"k\">,</span>img2embed<span class=\"k\">);</span>","                node<span class=\"k\">.</span>parentNode<span class=\"k\">.</span>replaceChild<span class=\"k\">(</span>UE<span class=\"k\">.</span>uNode<span class=\"k\">.</span>createElement<span class=\"k\">(</span>html<span class=\"k\">),</span>node<span class=\"k\">)</span>","            <span class=\"k\">}</span>","        <span class=\"k\">}</span><span class=\"k\">)</span>","    <span class=\"k\">}</span>","","    me<span class=\"k\">.</span>addOutputRule<span class=\"k\">(</span><span class=\"k\">function</span><span class=\"k\">(</span>root<span class=\"k\">)</span><span class=\"k\">{</span>","        switchImgAndEmbed<span class=\"k\">(</span>root<span class=\"k\">,</span><span class=\"k\">true</span><span class=\"k\">)</span>","    <span class=\"k\">}</span><span class=\"k\">);</span>","    me<span class=\"k\">.</span>addInputRule<span class=\"k\">(</span><span class=\"k\">function</span><span class=\"k\">(</span>root<span class=\"k\">)</span><span class=\"k\">{</span>","        switchImgAndEmbed<span class=\"k\">(</span>root<span class=\"k\">)</span>","    <span class=\"k\">}</span><span class=\"k\">);</span>","","    <span class=\"c\">/**</span>","<span class=\"c\">     * &#25554;&#20837;&#35270;&#39057;</span>","<span class=\"c\">     * @command insertvideo</span>","<span class=\"c\">     * @method execCommand</span>","<span class=\"c\">     * @param { String } cmd &#21629;&#20196;&#23383;&#31526;&#20018;</span>","<span class=\"c\">     * @param { KeyValueMap } videoObj &#38190;&#20540;&#23545;&#23545;&#35937;&#65292; &#25551;&#36848;&#19968;&#20010;&#35270;&#39057;&#30340;&#25152;&#26377;&#23646;&#24615;</span>","<span class=\"c\">     * @example</span>","<span class=\"c\">     * ```javascript</span>","<span class=\"c\">     *</span>","<span class=\"c\">     * //editor &#26159;&#32534;&#36753;&#22120;&#23454;&#20363;</span>","<span class=\"c\">     * editor.execCommand( 'insertvideo', {</span>","<span class=\"c\">     *</span>","<span class=\"c\">     * } );</span>","<span class=\"c\">     * ```</span>","<span class=\"c\">     */</span>","","    <span class=\"c\">/**</span>","<span class=\"c\">     * &#25554;&#20837;&#35270;&#39057;</span>","<span class=\"c\">     * @command insertvideo</span>","<span class=\"c\">     * @method execCommand</span>","<span class=\"c\">     * @param { String } cmd &#21629;&#20196;&#23383;&#31526;&#20018;</span>","<span class=\"c\">     * @param { Array } videoArr &#38656;&#35201;&#25554;&#20837;&#30340;&#35270;&#39057;&#30340;&#25968;&#32452;&#65292; &#20854;&#20013;&#30340;&#27599;&#19968;&#20010;&#20803;&#32032;&#37117;&#26159;&#19968;&#20010;&#38190;&#20540;&#23545;&#23545;&#35937;&#65292; &#25551;&#36848;&#20102;&#19968;&#20010;&#35270;&#39057;&#30340;&#25152;&#26377;&#23646;&#24615;</span>","<span class=\"c\">     * @example</span>","<span class=\"c\">     * ```javascript</span>","<span class=\"c\">     *</span>","<span class=\"c\">     * //editor &#26159;&#32534;&#36753;&#22120;&#23454;&#20363;</span>","<span class=\"c\">     * editor.execCommand( 'insertvideo', [  ] );</span>","<span class=\"c\">     * ```</span>","<span class=\"c\">     */</span>","","    <span class=\"c\">/**</span>","<span class=\"c\">     * &#26597;&#35810;&#24403;&#21069;&#20809;&#26631;&#25152;&#22312;&#22788;&#26159;&#21542;&#26159;&#19968;&#20010;&#35270;&#39057;</span>","<span class=\"c\">     * @command insertvideo</span>","<span class=\"c\">     * @method queryCommandState</span>","<span class=\"c\">     * @param { String } cmd &#38656;&#35201;&#26597;&#35810;&#30340;&#21629;&#20196;&#23383;&#31526;&#20018;</span>","<span class=\"c\">     * @return { int } &#22914;&#26524;&#24403;&#21069;&#20809;&#26631;&#25152;&#22312;&#22788;&#30340;&#20803;&#32032;&#26159;&#19968;&#20010;&#35270;&#39057;&#23545;&#35937;&#65292; &#21017;&#36820;&#22238;1&#65292;&#21542;&#21017;&#36820;&#22238;0</span>","<span class=\"c\">     * @example</span>","<span class=\"c\">     * ```javascript</span>","<span class=\"c\">     *</span>","<span class=\"c\">     * //editor &#26159;&#32534;&#36753;&#22120;&#23454;&#20363;</span>","<span class=\"c\">     * editor.queryCommandState( 'insertvideo' );</span>","<span class=\"c\">     * ```</span>","<span class=\"c\">     */</span>","    me<span class=\"k\">.</span>commands<span class=\"k\">[</span><span class=\"s\">\"insertvideo\"</span><span class=\"k\">]</span> <span class=\"k\">=</span> <span class=\"k\">{</span>","        execCommand<span class=\"k\">:</span> <span class=\"k\">function</span> <span class=\"k\">(</span>cmd<span class=\"k\">,</span> videoObjs<span class=\"k\">)</span><span class=\"k\">{</span>","            videoObjs <span class=\"k\">=</span> utils<span class=\"k\">.</span>isArray<span class=\"k\">(</span>videoObjs<span class=\"k\">)?</span>videoObjs<span class=\"k\">:[</span>videoObjs<span class=\"k\">];</span>","            <span class=\"k\">var</span> html <span class=\"k\">=</span> <span class=\"k\">[],</span>id <span class=\"k\">=</span> <span class=\"s\">'tmpVedio'</span><span class=\"k\">;</span>","            <span class=\"k\">for</span><span class=\"k\">(</span><span class=\"k\">var</span> i<span class=\"k\">=</span><span class=\"s\">0</span><span class=\"k\">,</span>vi<span class=\"k\">,</span>len <span class=\"k\">=</span> videoObjs<span class=\"k\">.</span>length<span class=\"k\">;</span>i<span class=\"k\">&lt;</span>len<span class=\"k\">;</span>i<span class=\"k\">++)</span><span class=\"k\">{</span>","                 vi <span class=\"k\">=</span> videoObjs<span class=\"k\">[</span>i<span class=\"k\">];</span>","                 html<span class=\"k\">.</span>push<span class=\"k\">(</span>creatInsertStr<span class=\"k\">(</span> vi<span class=\"k\">.</span>url<span class=\"k\">,</span> vi<span class=\"k\">.</span>width <span class=\"k\">||</span> <span class=\"s\">420</span><span class=\"k\">,</span>  vi<span class=\"k\">.</span>height <span class=\"k\">||</span> <span class=\"s\">280</span><span class=\"k\">,</span> id <span class=\"k\">+</span> i<span class=\"k\">,</span><span class=\"k\">null</span><span class=\"k\">,</span><span class=\"k\">false</span><span class=\"k\">));</span>","            <span class=\"k\">}</span>","            me<span class=\"k\">.</span>execCommand<span class=\"k\">(</span><span class=\"s\">\"inserthtml\"</span><span class=\"k\">,</span>html<span class=\"k\">.</span>join<span class=\"k\">(</span><span class=\"s\">\"\"</span><span class=\"k\">),</span><span class=\"k\">true</span><span class=\"k\">);</span>","            <span class=\"k\">var</span> rng <span class=\"k\">=</span> <span class=\"k\">this</span><span class=\"k\">.</span>selection<span class=\"k\">.</span>getRange<span class=\"k\">();</span>","            <span class=\"k\">for</span><span class=\"k\">(</span><span class=\"k\">var</span> i<span class=\"k\">=</span> <span class=\"s\">0</span><span class=\"k\">,</span>len<span class=\"k\">=</span>videoObjs<span class=\"k\">.</span>length<span class=\"k\">;</span>i<span class=\"k\">&lt;</span>len<span class=\"k\">;</span>i<span class=\"k\">++)</span><span class=\"k\">{</span>","                <span class=\"k\">var</span> img <span class=\"k\">=</span> <span class=\"k\">this</span><span class=\"k\">.</span>document<span class=\"k\">.</span>getElementById<span class=\"k\">(</span><span class=\"s\">'tmpVedio'</span><span class=\"k\">+</span>i<span class=\"k\">);</span>","                domUtils<span class=\"k\">.</span>removeAttributes<span class=\"k\">(</span>img<span class=\"k\">,</span><span class=\"s\">'id'</span><span class=\"k\">);</span>","                rng<span class=\"k\">.</span>selectNode<span class=\"k\">(</span>img<span class=\"k\">).</span>select<span class=\"k\">();</span>","                me<span class=\"k\">.</span>execCommand<span class=\"k\">(</span><span class=\"s\">'imagefloat'</span><span class=\"k\">,</span>videoObjs<span class=\"k\">[</span>i<span class=\"k\">].</span>align<span class=\"k\">)</span>","            <span class=\"k\">}</span>","        <span class=\"k\">}</span><span class=\"k\">,</span>","        queryCommandState <span class=\"k\">:</span> <span class=\"k\">function</span><span class=\"k\">()</span><span class=\"k\">{</span>","            <span class=\"k\">var</span> img <span class=\"k\">=</span> me<span class=\"k\">.</span>selection<span class=\"k\">.</span>getRange<span class=\"k\">().</span>getClosedNode<span class=\"k\">(),</span>","                flag <span class=\"k\">=</span> img <span class=\"k\">&amp;&amp;</span> <span class=\"k\">(</span>img<span class=\"k\">.</span>className <span class=\"k\">==</span> <span class=\"s\">\"edui-faked-video\"</span><span class=\"k\">);</span>","            <span class=\"k\">return</span> flag <span class=\"k\">?</span> <span class=\"s\">1</span> <span class=\"k\">:</span> <span class=\"s\">0</span><span class=\"k\">;</span>","        <span class=\"k\">}</span>","    <span class=\"k\">}</span><span class=\"k\">;</span>","<span class=\"k\">}</span><span class=\"k\">;</span>"];
_$jscoverage['plugins/video.js'][7]++;
UE.plugins.video = (function () {
  _$jscoverage['plugins/video.js'][9]++;
  var me = this, div;
  _$jscoverage['plugins/video.js'][21]++;
  function creatInsertStr(url, width, height, id, align, toEmbed) {
    _$jscoverage['plugins/video.js'][22]++;
    return ((! toEmbed)? ("<img " + (id? ("id=\"" + id + "\""): "") + " width=\"" + width + "\" height=\"" + height + "\" _url=\"" + url + "\" class=\"edui-faked-video\"" + " src=\"" + me.options.UEDITOR_HOME_URL + "themes/default/images/spacer.gif\" style=\"background:url(" + me.options.UEDITOR_HOME_URL + "themes/default/images/videologo.gif) no-repeat center center; border:1px solid gray;" + (align? ("float:" + align + ";"): "") + "\" />"): ("<embed type=\"application/x-shockwave-flash\" class=\"edui-faked-video\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\"" + " src=\"" + url + "\" width=\"" + width + "\" height=\"" + height + "\"" + (align? (" style=\"float:" + align + "\""): "") + " wmode=\"transparent\" play=\"true\" loop=\"false\" menu=\"false\" allowscriptaccess=\"never\" allowfullscreen=\"true\" >"));
}
  _$jscoverage['plugins/video.js'][33]++;
  function switchImgAndEmbed(root, img2embed) {
    _$jscoverage['plugins/video.js'][34]++;
    utils.each(root.getNodesByTagName((img2embed? "img": "embed")), (function (node) {
  _$jscoverage['plugins/video.js'][35]++;
  if ((node.getAttr("class") == "edui-faked-video")) {
    _$jscoverage['plugins/video.js'][37]++;
    var html = creatInsertStr((img2embed? node.getAttr("_url"): node.getAttr("src")), node.getAttr("width"), node.getAttr("height"), null, (node.getStyle("float") || ""), img2embed);
    _$jscoverage['plugins/video.js'][38]++;
    node.parentNode.replaceChild(UE.uNode.createElement(html), node);
  }
}));
}
  _$jscoverage['plugins/video.js'][43]++;
  me.addOutputRule((function (root) {
  _$jscoverage['plugins/video.js'][44]++;
  switchImgAndEmbed(root, true);
}));
  _$jscoverage['plugins/video.js'][46]++;
  me.addInputRule((function (root) {
  _$jscoverage['plugins/video.js'][47]++;
  switchImgAndEmbed(root);
}));
  _$jscoverage['plugins/video.js'][93]++;
  me.commands.insertvideo = {execCommand: (function (cmd, videoObjs) {
  _$jscoverage['plugins/video.js'][95]++;
  videoObjs = (utils.isArray(videoObjs)? videoObjs: [videoObjs]);
  _$jscoverage['plugins/video.js'][96]++;
  var html = [], id = "tmpVedio";
  _$jscoverage['plugins/video.js'][97]++;
  for (var i = 0, vi, len = videoObjs.length; (i < len); (i++)) {
    _$jscoverage['plugins/video.js'][98]++;
    vi = videoObjs[i];
    _$jscoverage['plugins/video.js'][99]++;
    html.push(creatInsertStr(vi.url, (vi.width || 420), (vi.height || 280), (id + i), null, false));
}
  _$jscoverage['plugins/video.js'][101]++;
  me.execCommand("inserthtml", html.join(""), true);
  _$jscoverage['plugins/video.js'][102]++;
  var rng = this.selection.getRange();
  _$jscoverage['plugins/video.js'][103]++;
  for (var i = 0, len = videoObjs.length; (i < len); (i++)) {
    _$jscoverage['plugins/video.js'][104]++;
    var img = this.document.getElementById(("tmpVedio" + i));
    _$jscoverage['plugins/video.js'][105]++;
    domUtils.removeAttributes(img, "id");
    _$jscoverage['plugins/video.js'][106]++;
    rng.selectNode(img).select();
    _$jscoverage['plugins/video.js'][107]++;
    me.execCommand("imagefloat", videoObjs[i].align);
}
}), queryCommandState: (function () {
  _$jscoverage['plugins/video.js'][111]++;
  var img = me.selection.getRange().getClosedNode(), flag = (img && (img.className == "edui-faked-video"));
  _$jscoverage['plugins/video.js'][113]++;
  return (flag? 1: 0);
})};
});
