// Triple synchronized video comparison script
// Extends the original video_comparison.js to support three synchronized sliders

// Global synchronized position (0 to 1)
var globalSliderPosition = 0.5;

// Track all active video players
var activeVideoPlayers = [];

function playTripleVids(videoLeftId, videoMiddleId, videoRightId) {
    var videoLeft = document.getElementById(videoLeftId);
    var videoMiddle = document.getElementById(videoMiddleId);
    var videoRight = document.getElementById(videoRightId);

    var canvasLeft = document.getElementById(videoLeftId + "Merge");
    var canvasMiddle = document.getElementById(videoMiddleId + "Merge");
    var canvasRight = document.getElementById(videoRightId + "Merge");

    var vidWidth = 0;
    var vidHeight = 0;
    var isInitialized = false;

    var ctxLeft = canvasLeft.getContext("2d");
    var ctxMiddle = canvasMiddle.getContext("2d");
    var ctxRight = canvasRight.getContext("2d");

    // Store player reference for cleanup
    var player = {
        videoLeft: videoLeft,
        videoMiddle: videoMiddle,
        videoRight: videoRight,
        canvasLeft: canvasLeft,
        canvasMiddle: canvasMiddle,
        canvasRight: canvasRight,
        ctxLeft: ctxLeft,
        ctxMiddle: ctxMiddle,
        ctxRight: ctxRight,
        isActive: true,
        animationFrameId: null
    };

    activeVideoPlayers.push(player);

    // Safari-compatible initialization function
    function initializeVideos() {
        // Check if all videos have dimensions available
        if (videoLeft.videoWidth > 0 && videoMiddle.videoWidth > 0 && videoRight.videoWidth > 0) {
            vidWidth = videoLeft.videoWidth / 2;
            vidHeight = videoLeft.videoHeight;

            // Set canvas dimensions for all three
            canvasLeft.width = vidWidth;
            canvasLeft.height = vidHeight;
            canvasMiddle.width = vidWidth;
            canvasMiddle.height = vidHeight;
            canvasRight.width = vidWidth;
            canvasRight.height = vidHeight;

            isInitialized = true;
            console.log('Triple videos initialized - Width:', vidWidth, 'Height:', vidHeight);

            // Start the videos and drawing loop
            startVideoPlayback();
        } else {
            // Retry after a short delay if dimensions not ready
            setTimeout(initializeVideos, 100);
        }
    }

    function startVideoPlayback() {
        // Try to play all videos
        var playPromises = [
            videoLeft.play(),
            videoMiddle.play(),
            videoRight.play()
        ];

        Promise.all(playPromises).then(function() {
            console.log('All videos started playing');
            setupEventListeners();
            startDrawLoop();
        }).catch(function(error) {
            console.log('Autoplay prevented:', error);
            // If autoplay fails, set up event listeners anyway for manual play
            setupEventListeners();
            startDrawLoop();
        });
    }

    function setupEventListeners() {
        function trackLocation(e) {
            // Get the canvas that triggered the event
            var canvas = e.currentTarget;
            var bcr = canvas.getBoundingClientRect();

            // Calculate position and update global position
            globalSliderPosition = ((e.pageX - bcr.x) / bcr.width).clamp(0, 1);
        }

        function trackLocationTouch(e) {
            var canvas = e.currentTarget;
            var bcr = canvas.getBoundingClientRect();
            globalSliderPosition = ((e.touches[0].pageX - bcr.x) / bcr.width).clamp(0, 1);
        }

        // Add event listeners to all three canvases for synchronized control
        [canvasLeft, canvasMiddle, canvasRight].forEach(function(canvas) {
            canvas.addEventListener("mousemove", trackLocation, false);
            canvas.addEventListener("touchstart", trackLocationTouch, false);
            canvas.addEventListener("touchmove", trackLocationTouch, false);
        });
    }

    function startDrawLoop() {
        function drawLoop() {
            if (!player.isActive) {
                return; // Stop drawing if player was stopped
            }

            if (!isInitialized || vidWidth === 0 || vidHeight === 0) {
                player.animationFrameId = requestAnimationFrame(drawLoop);
                return;
            }

            try {
                // Use global synchronized position for all three videos
                var position = globalSliderPosition;

                // Draw left video comparison
                drawVideoComparison(videoLeft, ctxLeft, vidWidth, vidHeight, position);

                // Draw middle video comparison
                drawVideoComparison(videoMiddle, ctxMiddle, vidWidth, vidHeight, position);

                // Draw right video comparison
                drawVideoComparison(videoRight, ctxRight, vidWidth, vidHeight, position);

            } catch (error) {
                console.log('Draw error:', error);
            }

            player.animationFrameId = requestAnimationFrame(drawLoop);
        }

        drawLoop();
    }

    function drawVideoComparison(video, ctx, width, height, position) {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw left half (original)
        ctx.drawImage(video, 0, 0, width, height, 0, 0, width, height);

        // Draw right half (enhanced) based on slider position
        var colStart = Math.floor(width * position);
        var colWidth = Math.floor(width - colStart);
        ctx.drawImage(video, colStart + width, 0, colWidth, height, colStart, 0, colWidth, vidHeight);

        // Draw UI elements (slider line and arrows)
        drawUIElements(ctx, width, height, position);
    }

    function drawUIElements(ctx, width, height, position) {
        var arrowLength = 0.09 * height;
        var arrowheadWidth = 0.025 * height;
        var arrowheadLength = 0.04 * height;
        var arrowPosY = height / 10;
        var arrowWidth = 0.007 * height;
        var currX = width * position;

        // Draw circle
        ctx.beginPath();
        ctx.arc(currX, arrowPosY, arrowLength*0.7, 0, Math.PI * 2, false);
        ctx.fillStyle = "#FFD79340";
        ctx.fill();

        // Draw border line
        ctx.beginPath();
        ctx.moveTo(width * position, 0);
        ctx.lineTo(width * position, height);
        ctx.strokeStyle = "#444444";
        ctx.lineWidth = 5;
        ctx.stroke();

        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(currX, arrowPosY - arrowWidth/2);

        // Move right until meeting arrow head
        ctx.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowWidth/2);

        // Draw right arrow head
        ctx.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowheadWidth/2);
        ctx.lineTo(currX + arrowLength/2, arrowPosY);
        ctx.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowheadWidth/2);
        ctx.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowWidth/2);

        // Go back to the left until meeting left arrow head
        ctx.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowWidth/2);

        // Draw left arrow head
        ctx.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowheadWidth/2);
        ctx.lineTo(currX - arrowLength/2, arrowPosY);
        ctx.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY  - arrowheadWidth/2);
        ctx.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY);

        ctx.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY - arrowWidth/2);
        ctx.lineTo(currX, arrowPosY - arrowWidth/2);

        ctx.closePath();
        ctx.fillStyle = "#444444";
        ctx.fill();
    }

    // Start initialization
    initializeVideos();

    return player;
}

// Helper function to clamp values
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

// Function to initialize and play all three videos
function resizeAndPlayTriple(videoLeft, videoMiddle, videoRight) {
    var canvasLeft = document.getElementById(videoLeft.id + "Merge");
    var canvasMiddle = document.getElementById(videoMiddle.id + "Merge");
    var canvasRight = document.getElementById(videoRight.id + "Merge");

    // Safari-compatible video initialization
    function waitForVideoDimensions() {
        if (videoLeft.videoWidth > 0 && videoMiddle.videoWidth > 0 && videoRight.videoWidth > 0) {
            // Set canvas dimensions
            canvasLeft.width = videoLeft.videoWidth / 2;
            canvasLeft.height = videoLeft.videoHeight;
            canvasMiddle.width = videoMiddle.videoWidth / 2;
            canvasMiddle.height = videoMiddle.videoHeight;
            canvasRight.width = videoRight.videoWidth / 2;
            canvasRight.height = videoRight.videoHeight;

            // Hide videos without stopping them
            videoLeft.style.height = "0px";
            videoMiddle.style.height = "0px";
            videoRight.style.height = "0px";

            // Stop any existing players
            stopAllPlayers();

            // Start the synchronized video comparison
            playTripleVids(videoLeft.id, videoMiddle.id, videoRight.id);
        } else {
            // Retry after a short delay if dimensions not ready
            setTimeout(waitForVideoDimensions, 50);
        }
    }

    // Start waiting for video dimensions
    waitForVideoDimensions();
}

// Function to stop all active players when switching videos
function stopAllPlayers() {
    activeVideoPlayers.forEach(function(player) {
        player.isActive = false;
        if (player.animationFrameId) {
            cancelAnimationFrame(player.animationFrameId);
        }
    });
    activeVideoPlayers = [];
}
