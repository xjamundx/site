---
layout: docs
title: About
permalink: /about/
name: about
---

**JSHint** is a community-driven tool to detect errors and potential problems in
JavaScript code and to enforce your team's coding conventions. It is very
flexible so you can easily adjust it to your particular coding guidelines and
the environment you expect your code to execute in.

<div class="bigtext">
The goal of this project is to help JavaScript developers write complex programs
without worrying about typos and language gotchas.
</div>

Any code base eventually becomes huge at some point, and simple mistakes--that
would not show themselves when written--can become show stoppers and waste
hours of debugging. And this is when static code analysis tools come into play
and help developers to spot such problems. JSHint scans a program written in
JavaScript and reports about commonly made mistakes and potential bugs. The
potential problem could be a syntax error, a bug due to implicit type
conversion, a leaking variable or something else.

The chart below shows that only 15% of all programs linted on this website
passed the JSHint checks. In all other cases, JSHint found some red flags
that could've been bugs or potential problems.

<div id="stats-lints">
</div>

Please note, that while static code analysis tools can spot many different kind
of mistakes, it can't detect if your program is correct, fast or has memory
leaks. You should always combine tools like JSHint with unit and functional
tests as well as with code reviews.

<script type="text/javascript">
var Keen=Keen||{configure:function(e){this._cf=e},addEvent:function(e,t,n,i){this._eq=this._eq||[],this._eq.push([e,t,n,i])},setGlobalProperties:function(e){this._gp=e},onChartsReady:function(e){this._ocrq=this._ocrq||[],this._ocrq.push(e)}};(function(){var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src=("https:"==document.location.protocol?"https://":"http://")+"dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();

Keen.configure({
    projectId: "50e24abc3843312ecb000002",
    readKey: "d766ce12f9dc48680e1642a6eb2d6c0c21e287b6093abbc5d9b2333c924d5cb5a4682ab54e2f5f8b174aee658a29a6496501a5e3bfcc126df572f29c2a4225c0bb6acd13427b6f8a0c7d0a1fc9ac94e76ae91a5751efa2314564c68a8283a2e7062b46650d5c8079290f834e04959933",
    writeKey: "70c2f6c374616275eda384c613b64f817b485bb288711b0640435bacfc157d89966a3616b234c8ef16c9d4f1617a7fbe85aa0faafa1410693993dfbdb3d24e23cb431ba38f92a0abce03cb31abb979e3ec08fd288b1d54b86f86d2af78bfa3be0e5ab0d205ba11bcd7035bfc04ff24f6"
});

Keen.onChartsReady(function() {
  var metric = new Keen.Metric("lint", {
    analysisType: "count",
    targetProperty: "keen.timestamp",
    groupBy: "success"
  });

  metric.draw(document.getElementById("stats-lints"), {
  	labelMapping: { "true": "Runs w/o warnings", "false": "Runs with warnings" }
  });
});
</script>
