// filler code
var html = [
    '<html>',
    '<head>',
    '   <title>Hello World!</title>',
    '</head>',
    '<body>',
    '   <h1> Hello World! </h1>',
    '   <div>',
    '       <p>',
    '           This is a sample paragraph inside a div with a class container',
    '       </p>',
    '   </div>',
    '</body>',
    '</html>'
];

var css = [
    'h1{',
    '   color: red;',
    '}',
    '.container{',
    '   text-align: center;',
    '   font-size: 10px;',
    '   border: none;',
    '   float: left;',
    '}'
];

var js = [
    'function hello(){',
    '   var msg = hello world!;',
    '   alert(Message:  + msg)',
    '}',
    ' ',
    'var x = 2;',
    'var y = 3;',
    'console.log(x+y);'
];


var htmlBg = '#BED4EE', // 62A3EE',
    cssBg =  '#FFCCE3', // FF73B1', //FFC361
    jsBg = '#FFECCC'; // 64AD82';


// Returns the min value in an array
Array.min = function (array) {
  return Math.min.apply(null, array);
}

// Returns the key of an input value inside an object
function val2key(val,array){
    for (var key in array) {
        if(array[key][1] === val){
            return key;
        }
    }
}

function createWrapperContentDiv(type, width, topvalue, left, color){
    $('#wrapper-container').append($("<div>", {class: "wrapper-content", id: type+"-wrapper"}));

    $('#'+type+'-wrapper').css('width', width+'em');
    $('#'+type+'-wrapper').css('top', topvalue+'px');
    $('#'+type+'-wrapper').css('left', left+'%');
    $('#'+type+'-wrapper').css('background-color', color);
}

function wrap(type, i){
    var arr, color;
    if (type === 'html') 
        {arr = html; color = htmlBg;}
    else if (type === 'css') 
        {arr = css; color = cssBg;}
    else 
        {arr = js; color = jsBg;}

    var inputWidth = arr[i].length / 2 + 0.85; 
    var input = '<input type="text" class="'+type+'" value="' + arr[i] 
                + '" style = "width: ' + inputWidth 
                + 'em; background-color: ' + color + '">';
    $('#'+type+'-wrapper').append($("<div>", {class: "row", id:"r"+i}));
    $('#r'+i).append(input);
}


function wrapAll(){
    $('#wrapper-container').html('');
    // decide on the order of the divs
    // get the width and height of each div
    var dims = {
        html: [0, 0, htmlBg],
        css: [0,0, cssBg],
        js: [0,0, jsBg]
    };

    for (var i = 0; i < html.length; i++) {
        //HTML
        // width
        var tmp = html[i].length / 2 + 0.85;
        if(tmp > dims.html[0])
            dims.html[0] = tmp;

        // height
        dims.html[1] += 22;

        //CSS
        if (i < css.length) {
            // width
            var tmp = css[i].length / 2 + 0.85;
            if(tmp > dims.css[0])
                dims.css[0] = tmp;

            // height
            dims.css[1] += 22;
        }

        // JS
        if (i < js.length) {
            // width
            var tmp = js[i].length / 2 + 0.85;
            if(tmp > dims.js[0])
                dims.js[0] = tmp;

            // height
            dims.js[1] += 22;
        }
    };


    // array dims array acc based on height
    var dimssorted = {};
    var tmp = [dims.html[1], dims.css[1], dims.js[1]];
    for (var i = 0; i < 3; i++) {
        var min = val2key(Array.min(tmp), dims);
        // console.log(min);

        if(min == 'html') {
            dimssorted['html'] = dims.html;
            tmp.splice(0, 1);
        }
        else if(min == 'css'){ 
            dimssorted['css'] = dims.css;
            tmp.splice(1, 1);
        }
        if(min == 'js'){
            dimssorted['js'] = dims.js;
            tmp.splice(2, 1);
        }
    };
    // console.log(dimssorted);

    // display the shortest first
    var color, width, topvalue = 3, left = 6,
        currentheight = 300, fullheight = 632;
    for(dim in dimssorted){
        // console.log(dimssorted[dim]);
        // console.log(topvalue);

        width = dimssorted[dim][0];
        color = dimssorted[dim][2];

        if(currentheight > fullheight){
            left += width/3;
            topvalue = dimssorted[dim][1]/4;
        }
        else {
            currentheight += dimssorted[dim][1];
        }

        createWrapperContentDiv(dim, width/1.5, topvalue, left, color);


        topvalue += dimssorted[dim][1];
    }

    // wrap filler content
    for (var i = 0; i < html.length; i++) {
        wrap('html', i);

        if (i < css.length) {
            wrap('css', i);
        };

        if (i < js.length) {
            wrap('js', i);
        };
    }; 
}


wrapAll();


// text editor
$(document).on('keyup', 'input[type="text"]', function(ele) {
    // if enter key is pressed
    // create input element below this one
    if (ele.keyCode === 13){
        var addToRow = parseInt($(this).parent().attr('id').substr(1)) + 1;
        console.log($(this).attr('class'));

        if ($(this).attr('class') === 'html'){
            html.splice(addToRow, 0, '');
            
        }
        else if ($(this).attr('class') === 'css'){
            css.splice(addToRow, 0, '');

        }
        else if ($(this).attr('class') === 'js'){
            js.splice(addToRow, 0, '');
        }
        
        wrapAll();
    }

    // else if delete key is pressed 
    else if (ele.keyCode === 8){
        var rowToDelete = parseInt($(this).parent().attr('id').substr(1));
        
        // if line is empty delete it
        if ($(this).val().length === 0){
            if ($(this).attr('class') === 'html'){
                html.splice(rowToDelete, 1);
            }
            else if ($(this).attr('class') === 'css'){
                css.splice(rowToDelete, 1);

            }
            else if ($(this).attr('class') === 'js'){
                js.splice(rowToDelete, 1);
            }
        }
        // edit line width
        else{
            var inputWidth =  $(this).val().length / 2 + 0.85;
            $(this).css("width", inputWidth+"em");

            // update value in the array
            if ($(this).attr('class') === 'html'){
                html[rowToDelete] = $(this).val();
            }
            else if ($(this).attr('class') === 'css'){
                css[rowToDelete] = $(this).val();
            }
            else if ($(this).attr('class') === 'js'){
                js[rowToDelete] = $(this).val();
            }
        }

        wrapAll();
    }


    // else rewrap current line
    else{
        // update length
        var inputWidth =  $(this).val().length / 2 + 0.85;
        $(this).css("width", inputWidth+"em");

        // update value in the array
        var rowToEdit = parseInt($(this).parent().attr('id').substr(1));
        if ($(this).attr('class') === 'html'){
            html[rowToEdit] = $(this).val();
        }
        else if ($(this).attr('class') === 'css'){
            css[rowToEdit] = $(this).val();
        }
        else if ($(this).attr('class') === 'js'){
            js[rowToEdit] = $(this).val();
        }

        // wrapAll();
    }
});