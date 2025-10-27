// Written by Dor Verbin, October 2021
// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/
// Safari compatibility fixes added

function playVids(videoId) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);

    var position = 0.5;
    var vidWidth = 0;
    var vidHeight = 0;
    var mergeContext = videoMerge.getContext("2d");
    var isInitialized = false;

    // Safari-compatible initialization function
    function initializeVideo() {
        // Check if video dimensions are available
        if (vid.videoWidth > 0 && vid.videoHeight > 0) {
            vidWidth = vid.videoWidth / 2;
            vidHeight = vid.videoHeight;
            
            // Set canvas dimensions
            videoMerge.width = vidWidth;
            videoMerge.height = vidHeight;
            
            isInitialized = true;
            console.log('Video initialized - Width:', vidWidth, 'Height:', vidHeight);
            
            // Start the video and drawing loop
            startVideoPlayback();
        } else {
            // Retry after a short delay if dimensions not ready
            setTimeout(initializeVideo, 100);
        }
    }

    function startVideoPlayback() {
        // Try to play the video
        var playPromise = vid.play();
        
        if (playPromise !== undefined) {
            playPromise.then(function() {
                console.log('Video started playing');
                setupEventListeners();
                startDrawLoop();
            }).catch(function(error) {
                console.log('Autoplay prevented:', error);
                // If autoplay fails, set up event listeners anyway for manual play
                setupEventListeners();
                startDrawLoop();
            });
        } else {
            // Fallback for older browsers
            setupEventListeners();
            startDrawLoop();
        }
    }

    function setupEventListeners() {
        function trackLocation(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.pageX - bcr.x) / bcr.width);
        }
        
        function trackLocationTouch(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.touches[0].pageX - bcr.x) / bcr.width);
        }

        videoMerge.addEventListener("mousemove", trackLocation, false);
        videoMerge.addEventListener("touchstart", trackLocationTouch, false);
        videoMerge.addEventListener("touchmove", trackLocationTouch, false);
    }

    function startDrawLoop() {
        function drawLoop() {
            if (!isInitialized || vidWidth === 0 || vidHeight === 0) {
                requestAnimationFrame(drawLoop);
                return;
            }

            try {
                // Clear canvas
                mergeContext.clearRect(0, 0, vidWidth, vidHeight);
                
                // Draw left half (original)
                mergeContext.drawImage(vid, 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);
                
                // Draw right half (enhanced) based on slider position
                var colStart = Math.floor(vidWidth * position);
                var colWidth = Math.floor(vidWidth - colStart);
                mergeContext.drawImage(vid, colStart + vidWidth, 0, colWidth, vidHeight, colStart, 0, colWidth, vidHeight);

                // Draw UI elements
                drawUIElements();
                
            } catch (error) {
                console.log('Draw error:', error);
            }
            
            requestAnimationFrame(drawLoop);
        }
        
        drawLoop();
    }

    function drawUIElements() {
        var arrowLength = 0.09 * vidHeight;
        var arrowheadWidth = 0.025 * vidHeight;
        var arrowheadLength = 0.04 * vidHeight;
        var arrowPosY = vidHeight / 10;
        var arrowWidth = 0.007 * vidHeight;
        var currX = vidWidth * position;

        // Draw circle
        mergeContext.beginPath();
        mergeContext.arc(currX, arrowPosY, arrowLength*0.7, 0, Math.PI * 2, false);
        mergeContext.fillStyle = "#FFD79340";
        mergeContext.fill();

        // Draw border
        mergeContext.beginPath();
        mergeContext.moveTo(vidWidth*position, 0);
        mergeContext.lineTo(vidWidth*position, vidHeight);
        mergeContext.strokeStyle = "#444444";
        mergeContext.lineWidth = 5;
        mergeContext.stroke();

        // Draw arrow
        mergeContext.beginPath();
        mergeContext.moveTo(currX, arrowPosY - arrowWidth/2);

        // Move right until meeting arrow head
        mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowWidth/2);

        // Draw right arrow head
        mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowheadWidth/2);
        mergeContext.lineTo(currX + arrowLength/2, arrowPosY);
        mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowheadWidth/2);
        mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowWidth/2);

        // Go back to the left until meeting left arrow head
        mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowWidth/2);

        // Draw left arrow head
        mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowheadWidth/2);
        mergeContext.lineTo(currX - arrowLength/2, arrowPosY);
        mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY  - arrowheadWidth/2);
        mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY);

        mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY - arrowWidth/2);
        mergeContext.lineTo(currX, arrowPosY - arrowWidth/2);

        mergeContext.closePath();
        mergeContext.fillStyle = "#444444";
        mergeContext.fill();
    }

    // Start initialization
    initializeVideo();
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};


function resizeAndPlay(element)
{
  var cv = document.getElementById(element.id + "Merge");
  
  // Safari-compatible video initialization
  function waitForVideoDimensions() {
    if (element.videoWidth > 0 && element.videoHeight > 0) {
      cv.width = element.videoWidth / 2;
      cv.height = element.videoHeight;
      element.style.height = "0px";  // Hide video without stopping it
      
      // Start the video comparison
      playVids(element.id);
    } else {
      // Retry after a short delay if dimensions not ready
      setTimeout(waitForVideoDimensions, 50);
    }
  }
  
  // Start waiting for video dimensions
  waitForVideoDimensions();
}
