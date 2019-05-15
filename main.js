const socket = io('https://streamthinhtps07180.herokuapp.com/');

$('#div-chat').hide();

// 
socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();
    arrUserInfo.forEach(user => {
        const { ten, peerID } = user;
        $('#ulUser').append(`<li id="${peerID}">${ten}</li>`);
    });
    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerID } = user;
        $('#ulUser').append(`<li id="${peerID}">${ten}</li>`);
    });
    socket.on('AI_DO_NGAT_KET_NOI', peerID => {
        $(`#${peerID}`).remove();
    });
});
// 
socket.on('DANG_KY_THAT_BAI', () => alert('Vui long chon username khac'));
// 




function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
// openStream().then(stream => playStream('localStream' , stream) );
const peer = new Peer({ key: 'lwjd5qra8257b9' });
peer.on('open', (id) => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const userName = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: userName, peerID: id });
    });
});

// Caller
$('#btnCall').click(() => {
    const id = $('#remoteID').val();
    openStream().then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});
//
peer.on('call', call => {
    openStream().then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    })
});
//
$('#ulUser').on('click', 'li', function () {
    const id = ($(this).attr('id'));
    openStream().then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});


