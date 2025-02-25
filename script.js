
    // Define a graph representing roads with distances
    const graph = {
        library: { rec_mart: 50, main_hall: 100 },
        rec_mart: { library: 50, hut_cafe: 80, main_hall: 60 },
        main_hall: { library: 100, rec_mart: 60, central_workshop: 90 },
        hut_cafe: { rec_mart: 80, maggi_spot: 40, aero_block: 70 },
        maggi_spot: { hut_cafe: 40, rec_cafe: 60 },
        rec_cafe: { maggi_spot: 60, hertiage_hall: 110 },
        hertiage_hall: { rec_cafe: 110, central_workshop: 75 },
        central_workshop: { main_hall: 90, mechnical_workshop: 55, hertiage_hall: 75 },
        mechnical_workshop: { central_workshop: 55, aero_block: 50 },
        aero_block: { hut_cafe: 70, mechnical_workshop: 50, indoor_auditorium: 120 },
        indoor_auditorium: { aero_block: 120 }
    };

    // Coordinates of locations on the map
    const coordinates = {
        library: { x: 87, y: 13 },
        rec_mart: { x: 100, y: 220 },
        main_hall: { x: 8, y: 308 },
        hut_cafe: { x: 254, y: 254 },
        maggi_spot: { x: 158, y: 258 },
        rec_cafe: { x: 160, y: 497 },
        hertiage_hall: { x: 257, y: 497 },
        central_workshop: { x: 253, y: 301 },
        mechnical_workshop: { x: 252, y: 355 },
        aero_block: { x: 255, y: 430 },
        indoor_auditorium: { x: 157, y: 13 }
    };

    // Dijkstra's Algorithm to find the shortest path
    function findShortestPath(start, end) {
        let distances = {};
        let previous = {};
        let queue = new Set(Object.keys(graph));

        // Initialize distances
        for (let node in graph) {
            distances[node] = Infinity;
            previous[node] = null;
        }
        distances[start] = 0;

        while (queue.size > 0) {
            // Get the node with the shortest distance
            let closestNode = [...queue].reduce((a, b) => (distances[a] < distances[b] ? a : b));
            queue.delete(closestNode);

            if (closestNode === end) break;

            for (let neighbor in graph[closestNode]) {
                let alt = distances[closestNode] + graph[closestNode][neighbor];
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = closestNode;
                }
            }
        }

        // Construct the path
        let path = [];
        let step = end;
        while (step) {
            path.unshift(step);
            step = previous[step];
        }

        return path.length > 1 ? path : null;
    }

    // Draw the shortest route on the map
    function drawRoute(path) {
        if (!path) {
            alert("No valid route found!");
            return;
        }

        let canvas = document.getElementById("path");
        let ctx = canvas.getContext("2d");

        canvas.width = document.getElementById("map-container").clientWidth;
        canvas.height = document.getElementById("map-container").clientHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.shadowColor = "blue";
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(coordinates[path[0]].x, coordinates[path[0]].y);

        for (let i = 1; i < path.length; i++) {
            let point = coordinates[path[i]];
            ctx.lineTo(point.x, point.y);
        }
        
        ctx.stroke();
    }

    function navigate() {
        let start = document.getElementById("start").value;
        let end = document.getElementById("end").value;

        if (start === end) {
            alert("Start and destination are the same!");
            return;
        }

        let path = findShortestPath(start, end);
        drawRoute(path);

        document.getElementById("directions").innerText = path 
            ? `Route: ${path.join(" → ")}`
            : "No valid route found!";
    }

    function toggleChat() {
        let chatContainer = document.getElementById("chatbot-container");
        if (chatContainer.style.display === "none" || chatContainer.style.display === "") {
            chatContainer.style.display = "flex";
        } else {
            chatContainer.style.display = "none";
        }
    }
