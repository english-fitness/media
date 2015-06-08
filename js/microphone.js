$.fn.extend({
    microphone: function(settings) {
        var _this = this;
        window.requestAnimFrame = (function(){

            return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(callback, element){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
        settings = settings?settings:[];
        // Global Variables for Audio
        var audioContext,
        // Global Variables for Drawing
            x = 0,
            canvasWidth  = settings.canvasWidth?settings.canvasWidth:220,
            canvasHeight = settings.canvasHeight?settings.canvasHeight:130,
            ctx,
            allowedAudio = false,
            sourceNode,
            analyserNode,
            javascriptNode = [],
            playbackSourceNode,
            audioStream,
            array = [],
            checkSquelch = 0,
            appropriateAudio = settings.appropriateAudio?settings.appropriateAudio:170,
            appropriateNumber = Math.round(canvasWidth/ 4),
            recording = null,  // this is the cumulative buffer for your recording,
            audioBufferNode = null,
            audioBuffer = null,
            canvasOptions =settings.canvasOptions?settings.canvasOptions:"",
            canvasID = settings.canvasId?settings.canvasId:"canvas",




        // Uses the chroma.js library by Gregor Aisch to create a tasteful color gradient
        // download from https://github.com/gka/chroma.js
        hot = new chroma.ColorScale({
            colors:['#000000', '#ff0000', '#ffff00', '#ffffff'],
            positions:[0, .25, .75, 1],
            mode:'rgb',
            limits:[0, 256]
        });


        window.craicAudioContext = (function(){
            return  window.webkitAudioContext || window.AudioContext ;
        })();

        navigator.getMedia = ( navigator.mozGetUserMedia ||
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.msGetUserMedia);

        var audioSelect = document.querySelector("select#selectDeviceMicro");
        function gotSources(sourceInfos) {
            $("#selectDeviceMicro").html("");
            for (var i = 0; i != sourceInfos.length; ++i) {
                var sourceInfo = sourceInfos[i];
                var option = document.createElement("option");
                option.value = sourceInfo.id;
                if (sourceInfo.kind === 'audio') {
                    option.text = sourceInfo.label || 'microphone ' + (audioSelect.length + 1);
                    audioSelect.appendChild(option);
                }
            }
        }
        var source_id;

        $("#selectDeviceMicro").change(function(){
            source_id = $(this).val();
            createAudioNotice();
        });
        if (typeof MediaStreamTrack === 'undefined'){
            //alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
        } else if(audioSelect) {

            MediaStreamTrack.getSources?MediaStreamTrack.getSources(gotSources):'';
        }



        function createAudioNotice() {
            // Check that the browser can handle web audio
            try {
                //            audioContext = new webkitAudioContext();
                audioContext = new craicAudioContext();
            }
            catch(e) {
                //alert('Web Audio API is not supported in this browser');
            }

            // get the input audio stream and set up the nodes
            try {
                // calls the function setupAudioNodes
                //            navigator.webkitGetUserMedia({audio:true}, setupAudioNodes, onError);
                source_id = source_id?source_id:true;
                navigator.getMedia({audio:source_id}, setupAudioNodes, onError);

            } catch (e) {
                //alert('webkitGetUserMedia threw exception :' + e);
            }
        }
        settings.disable_audio = function(){
            javascriptNode.onaudioprocess = null;
            $("#disable_audio").hide();
            if(audioStream)  audioStream.stop();
            if(sourceNode)  sourceNode.disconnect();
            allowedAudio = false;
            settings.guide?settings.guide(settings):"";
        }
        $(document).ready(function() {
            // get the context from the canvas to draw on
            $(_this.selector).html("<canvas id='"+canvasID+"' height='"+canvasHeight+"' width='"+canvasWidth+"'></canvas>");
            ctx = $("#"+canvasID).get()[0].getContext("2d");
            clearCanvas();
            settings.events?settings.events(settings):"";
            settings.guide?settings.guide(settings):"";

            // Start recording by setting onaudioprocess to the function that manages the recording buffer
            $("body").on('click', "#start_button",function(e) {
                e.preventDefault();
                recording = null;
                // execute every time a new sample has been acquired
                if(allowedAudio) {
                    clearCanvas();
                    javascriptNode.onaudioprocess = function (e) {
                        addSampleToRecording(e.inputBuffer);
                        // Analyze the frequencies in this sample and add to the spectorgram
                        analyserNode.getByteFrequencyData(array);
                        requestAnimFrame(drawSpectrogram);
                    }}else{
                    createAudioNotice();
                }
                $("#playback_button").hide();
            });


            // Play the recording
            $("body").on('click', "#playback_button",function(e) {
                e.preventDefault();
                playRecording();
                settings.playback?settings.playback(settings):"";
            });

            $("body").on("click","#disable_audio",function(){
                settings.disable_audio();
            });
        });



        /* view Canvas */
        settings.viewCanvas = function(txt) {
            clearCanvas();
            canvasOptions = canvasOptions?canvasOptions:[];
            ctx.font= canvasOptions.font?canvasOptions.font:"12px Arial";
            ctx.fillStyle = canvasOptions.fillStyle?canvasOptions.fillStyle:"#eeeeee";
            canvasTextMulti(ctx,txt,canvasOptions);
        }

        function onError(e) {
            console.log(e);
        }


        // Add this buffer to the recording
        // recording is a global
        function addSampleToRecording(inputBuffer) {
            var currentBuffer = inputBuffer.getChannelData(0);

            if (recording ==  null) {
                // handle the first buffer
                recording = currentBuffer;
            } else {
                // allocate a new Float32Array with the updated length
                newlen = recording.length + currentBuffer.length;
                var newBuffer = new Float32Array(newlen);
                newBuffer.set(recording, 0);
                newBuffer.set(currentBuffer, recording.length);
                recording = newBuffer;
            }
        }

        /* playRecording */
        function playRecording() {
            // You need to create the buffer node every time we play the sound
            // Are we able to cleanup that memory or does the footprint grow over time ??
            if ( recording != null ) {
                // create the Buffer from the recording
                audioBuffer = audioContext.createBuffer( 1, recording.length, audioContext.sampleRate );
                audioBuffer.getChannelData(0).set(recording, 0);

                // create the Buffer Node with this Buffer
                audioBufferNode = audioContext.createBufferSource();
                audioBufferNode.buffer = audioBuffer;
                console.log('recording buffer length ' + audioBufferNode.buffer.length.toString());
                // connect the node to the destination and play the audio
                audioBufferNode.connect(audioContext.destination);
                audioBufferNode.start(1);
            }
        }

        /* setup Audio Nodes */
        function setupAudioNodes(stream) {
            var sampleSize = 1024;  // number of samples to collect before analyzing FFT
            // decreasing this gives a faster sonogram, increasing it slows it down
            audioStream = stream;

            // The nodes are:  sourceNode -> analyserNode -> javascriptNode -> destination

            // create an audio buffer source node
            sourceNode = audioContext.createMediaStreamSource(audioStream);

            // Set up the javascript node - this uses only one channel - i.e. a mono microphone

            if(!audioContext.createScriptProcessor){
                javascriptNode = audioContext.createJavaScriptNode(sampleSize, 1, 1);
            }else{
                javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
            }
            // setup the analyser node
            analyserNode = audioContext.createAnalyser();
            analyserNode.smoothingTimeConstant = 0.0;
            analyserNode.fftSize = 1024; // must be power of two

            // connect the nodes together
            sourceNode.connect(analyserNode);
            analyserNode.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);
            // optional - connect input to audio output (speaker)
            // This will echo your input back to your speakers - Beware of Feedback !!
            // sourceNode.connect(audioContext.destination);

            // allocate the array for Frequency Data
            array = new Uint8Array(analyserNode.frequencyBinCount);
            allowedAudio = true;
            $("#start_button").click();
            $("#disable_audio").show();
        }


        // Draw the Spectrogram from the frequency array
        // adapted from http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
        function drawSpectrogram() {
            var count;
            for (var i = 0; i < array.length; i += 1) {

                // Get the color for each pixel from a color map
                var value = array[i];
                if(appropriateAudio<=value) {
                    checkSquelch = checkSquelch +1;
                }
                ctx.beginPath();
                ctx.strokeStyle = hot.getColor(value).hex();

                // draw a 1 pixel wide rectangle on the canvas
                var y = canvasHeight - i;
                ctx.moveTo(x, y);
                ctx.lineTo(x+1, y);
                ctx.closePath();
                ctx.stroke();
            }
            // loop around the canvas when we reach the end
            x = x + 1;
            if(x >canvasWidth) {
                x = 0;
                clearCanvas();
                if(checkSquelch>=appropriateNumber) {
                    settings.success?settings.success(settings):settings.viewCanvas("success");
                    javascriptNode.onaudioprocess = null;
                    $("#playback_button").show();
                }else{
                    settings.error?settings.error(settings):settings.viewCanvas("errors");
                    javascriptNode.onaudioprocess = null;
                }
                checkSquelch = 0;
            }
        }


        /* canvas Text Multi */
        function canvasTextMulti(ctx,txt,options){
            options = options?options:[];
            var x = options.x?options.x:10,
                y = options.y?options.y:40,
                lineHeight = options.lineHeight?options.lineHeight:20,
                lines = txt.split('\n');
            for (var i = 0; i<lines.length; i++)
                ctx.fillText(lines[i], x, y + (i*lineHeight) );
        }

        /* clear Canvas */
        function clearCanvas() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            x = 0;
        }
    }
});
