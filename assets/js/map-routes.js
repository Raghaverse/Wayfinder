// Canvas and context
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// Image of the campus map
const mapImage = new Image();
mapImage.src = 'assets/images/playford-map.png'; // Path to your campus map image

// Define locations with coordinates
const locations = [
    { id: 3, name: 'Physical Performance Centre', x: 240, y: 355 },
    { id: 6, name: 'Hospitality Function Centre', x: 300, y: 200 },
    { id: 10, name: 'Playford Alternative Learning', x: 230, y: 160 },
    // Add more locations as needed
];

// Define paths between locations (by ID of the start and end points)
const paths = [
    { start: 3, end: 10, points: [[240, 355], [240, 190], [230, 190], [230, 160]] },
    { start: 10, end: 3, points: [[230, 160], [230, 190], [240, 190], [240, 355]] },
    { start: 6, end: 10, points: [[300, 200], [300, 180], [230, 180], [230, 160]] },
    { start: 10, end: 6, points: [[230, 160], [230, 180], [300, 180], [300, 200]] },
    { start: 3, end: 6, points: [[240, 355], [240, 180], [300, 180], [300, 200]] },
    { start: 6, end: 3, points: [[300, 200], [300, 180], [240, 180], [240, 355]] },
    // Additional paths can be added as needed
];

// Initial loading of the map image and drawing setup
mapImage.onload = () => {
    drawMap(); // Draw the initial map
    drawLocations(); // Draw the initial location points
    populateSelectOptions(); // Populate the dropdown options with locations
};

// Function to draw the map on the canvas
function drawMap() {
    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
}

// Function to draw location points on the map
function drawLocations() {
    ctx.fillStyle = 'red';
    locations.forEach(loc => {
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '12px Arial';
    });
}

// Populate dropdowns with location names
function populateSelectOptions() {
    const startSelect = document.getElementById('start');
    const endSelect = document.getElementById('end');

    locations.forEach(loc => {
        const startOption = document.createElement('option');
        startOption.value = loc.id;
        startOption.textContent = loc.name;
        startSelect.appendChild(startOption);

        const endOption = document.createElement('option');
        endOption.value = loc.id;
        endOption.textContent = loc.name;
        endSelect.appendChild(endOption);
    });
}

// Function to handle the drawing of selected paths between two destinations
function drawSelectedPath() {
    // First, redraw the map and locations to reset the canvas
    drawMap();
    drawLocations();
    // Now draw the selected path based on dropdown choices
    drawPath();
}

// Function to get waypoints between selected destinations and draw the path with arrows
function drawPath() {
    // Get selected start and end locations
    const startId = parseInt(document.getElementById('start').value);
    const endId = parseInt(document.getElementById('end').value);

    // Find the path that matches the selected start and end IDs
    const selectedPath = paths.find(
        (path) => path.start === startId && path.end === endId
    );

    // If no path exists for the selected start-end pair, show an alert
    if (!selectedPath) {
        alert('No path defined between selected destinations.');
        return;
    }

    // Set line style
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    // Draw the path using the waypoints defined in the path's points array
    ctx.beginPath();
    ctx.moveTo(selectedPath.points[0][0], selectedPath.points[0][1]);

    // Draw the full path as lines
    for (let i = 1; i < selectedPath.points.length; i++) {
        const startX = selectedPath.points[i - 1][0];
        const startY = selectedPath.points[i - 1][1];
        const endX = selectedPath.points[i][0];
        const endY = selectedPath.points[i][1];

        // Draw the line segment
        ctx.lineTo(endX, endY);
    }
    ctx.stroke();

    // Draw arrows separately on each line segment
    for (let i = 1; i < selectedPath.points.length; i++) {
        const startX = selectedPath.points[i - 1][0];
        const startY = selectedPath.points[i - 1][1];
        const endX = selectedPath.points[i][0];
        const endY = selectedPath.points[i][1];

        // Draw an arrow to indicate direction
        drawArrow(startX, startY, endX, endY);
    }
}

// Function to draw an arrowhead from (startX, startY) to (endX, endY)
function drawArrow(startX, startY, endX, endY) {
    const arrowLength = 12; // Length of the arrowhead
    const arrowWidth = 6;   // Width of the arrowhead

    // Calculate the angle of the line segment
    const angle = Math.atan2(endY - startY, endX - startX);

    // Calculate the position of the arrow at a set distance from the end of the segment
    const arrowX = endX - arrowLength * Math.cos(angle);
    const arrowY = endY - arrowLength * Math.sin(angle);

    // Draw the arrowhead
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        arrowX + arrowWidth * Math.cos(angle + Math.PI / 2),
        arrowY + arrowWidth * Math.sin(angle + Math.PI / 2)
    );
    ctx.lineTo(
        arrowX + arrowWidth * Math.cos(angle - Math.PI / 2),
        arrowY + arrowWidth * Math.sin(angle - Math.PI / 2)
    );
    ctx.closePath();
    ctx.fill();
}

// Event listener to handle 'Show Route' button click and draw the path
document.getElementById('showRouteButton').addEventListener('click', drawSelectedPath);
