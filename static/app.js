var socket = null;
window.onload = function () {
    socket = io.connect();

    socket.on('chat', function (message) {
        add(message);
        if (!focus) unreads++;
        update_title();
    });

    socket.on('watchers', function (n) {
        document.querySelector('#Watchers').textContent = n;
    });

    window.addEventListener('beforeunload', function () {
        socket.disconnect();
    });
    
    document.onfocus = function () { focus = true; unreads = 0; update_title(); };
    document.onblur = function () { focus = false; };
    
    document.querySelector('#Message').onkeypress = key;
    
    scrollToBottom();
};

function update_title() {
    document.title = (unreads  ? '('+unreads+') ' : '') + 'chincam';
}

var focus = true;
var unreads = 0;

function scrollToBottom() {
    var history = document.querySelector('#History');
    history.scrollTo(0, history.scrollHeight);
}

function add(message) {
    var history = document.querySelector('#History');
    history.textContent += message + '\n';
    scrollToBottom();
}

function key(e) {
    if (e.which === 13) {
        var name = document.querySelector('#Name').value;
        var m = (name ? '[' + name + '] ' : '') + e.target.value;
        socket.emit('message', m);
        e.target.value = '';
    }
}
