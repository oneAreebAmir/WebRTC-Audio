let media_Stream;
let media_record;
let media_Track;
let recorded_Chunks = [];

async function init(){
    start_audio();
    EventBindAudio();
};

async function start_audio(){
    try{
        media_Stream = await navigator.mediaDevices.getUserMedia({
            video:false,
            audio:true
        })
    }
    catch(e){
        console.log(e);
    }

    media_Track = media_Stream.getAudioTracks()[0];
}

function EventBindAudio(){
    const btnMuteUnmute = document.getElementById('btnMuteUnmute').addEventListener('click', ()=>{
        if(!media_Track) return;

        if(media_Track.enabled == false){
            btnMuteUnmute.innerText = "Mute"
            media_Track.enabled = true;
        }
        else{
            btnMuteUnmute.innerText = "UnMute"
            media_Track.enabled = false;
        }
    });
    document.getElementById('btnStart').addEventListener('click',()=>{
        document.getElementById('btnStart').style.display = "none";
        document.getElementById('btnMuteUnmute').style.display = "flex";
        document.getElementById('btnPause').style.display = "flex";
        document.getElementById('btnResume').style.display = "flex";
        document.getElementById('btnStop').style.display = "flex";
        document.getElementById('Ctrl_audio').srcObject = media_Stream;
        setupMediaRecorder(media_Stream);
        media_record.start(1000);
    });

    document.getElementById('btnStop').addEventListener('click',()=>{
        document.getElementById('btnStart').style.display = "flex";
        document.getElementById('downloadAudio').style.display = "flex";
        document.getElementById('btnMuteUnmute').style.display = "none";
        document.getElementById('btnPause').style.display = "none";
        document.getElementById('btnResume').style.display = "none";
        document.getElementById('btnStop').style.display = "none";
        document.getElementById('Ctrl_audio').srcObject = null;
        media_record.stop();
    });

    document.getElementById('btnPause').addEventListener('click',()=>{
        console.log('Recording has been paused')
        media_record.pause();
    });
    
    document.getElementById('btnResume').addEventListener('click', ()=>{
        console.log('Recording has been resumed')
        media_record.resume();
    });
}

function setupMediaRecorder(stream){
    recorded_Chunks = [];
    media_record = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    media_record.ondataavailable = (e) =>{
        if(e.data.size > 0){
            recorded_Chunks.push(e.data);
        }
    }

    media_record.onstop = async () =>{
        let blob = new Blob(recorded_Chunks, {mimetype: 'video/webm'});

        let url = window.URL.createObjectURL(blob);
        const downloadAudio = document.getElementById('downloadAudio');
        const blob_file_name = url.substring(url.lastIndexOf('/')+1);
        const client_blob_filename = blob_file_name+".webm";
        
        downloadAudio.href = url;
        downloadAudio.setAttribute('download', client_blob_filename); 
    }
}

init();
