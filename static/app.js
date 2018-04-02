var socket = null;
window.onload = function () {
    socket = io.connect();

    socket.on('chat', function (message) {
        add(message);
        if (!focus) unreads++;
        update_title();
    });
    
    document.onfocus = function () { focus = true; unreads = 0; update_title(); };
    document.onblur = function () { focus = false; };
    
    document.querySelector('#Message').onkeypress = key;
};

function update_title() {
    document.title = (unreads  ? '('+unreads+') ' : '') + 'chincam';
}

var focus = true;
var unreads = 0;

function add(message) {
    var history = document.querySelector('#History');
    history.innerHTML += message + '\n';
    history.scrollTo(0, history.scrollHeight);
}

function key(e) {
    if (e.which === 13) {
        var name = document.querySelector('#Name').value;
        var m = (name ? '[' + name + '] ' : '') + e.target.value;
        socket.emit('message', m);
        e.target.value = '';
    }
}
