/**
 * Created by Sandon on 2016/12/4.
 */
// 第一步：replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
var template = `
<ul>
  <% for(var i=0; i < data.supplies.length; i++) { %>
    <li>\`); \n  echo( data.supplies[i] ); \n  echo(\`</li>
  <% } %>
</ul>
`;

// 第二步： replace(expr, '`); \n $1 \n  echo(`');
template = `
<ul>
  \`); \n for(var i=0; i < data.supplies.length; i++) { \n  echo(\`
    <li>\`); \n  echo( data.supplies[i] ); \n  echo(\`</li>
  \`); \n } \n  echo(\`
</ul>
`;

// 第三步： template = 'echo(`' + template + '`);';
template = `echo(\`<ul>
  \`); \n for(var i=0; i < data.supplies.length; i++) { \n  echo(\`
    <li>\`); \n  echo( data.supplies[i] ); \n  echo(\`</li>
  \`); \n } \n  echo(\`
</ul>\`);`

// 第四步：生成script
var script =
  `(function parse(data){
    var output = "";

    function echo(html){
      output += html;
    }

    echo(\`<ul>
  \`); \n for(var i=0; i < data.supplies.length; i++) { \n  echo(\`
    <li>\`); \n  echo( data.supplies[i] ); \n  echo(\`</li>
  \`); \n } \n  echo(\`
</ul>\`);

    return output;
  })`;

// \n变成换行整理下后变成
script =
  `(function parse(data){
    var output = "";

    function echo(html){
      output += html;
    }

    echo(\`<ul>\`); 
    for(var i=0; i < data.supplies.length; i++) { 
      echo(\`<li>\`); 
      echo( data.supplies[i] ); 
      echo(\`</li>\`); 
    } 
    echo(\`</ul>\`);

    return output;
  })`

// 第五步：eval(script) 会得到
function parse(data){
  var output = "";
  
  function echo(html){
    output += html;
  }
  
  echo(`<ul>`);
  for(var i=0; i < data.supplies.length; i++) {
    echo(`<li>`);
    echo( data.supplies[i] );
    echo(`</li>`);
  }
  echo(`</ul>`);

  return output;
}