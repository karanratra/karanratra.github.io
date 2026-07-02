(function () {
  var canvas = document.getElementById("retailNetworkBackground");
  if (!canvas) return;

  var context = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pointer = { x: 0, y: 0 };
  var width = 0;
  var height = 0;
  var dpr = 1;
  var nodes = [];
  var routes = [];
  var nodeByLabel = {};

  var nodeSpecs = [
    ["Fulfillment Orchestration", "fulfillment", 0, 86, 180, 15, true],
    ["Cloud", "platform", -210, 164, 104, 10, true],
    ["Distributed Systems", "platform", 250, 170, 102, 10, true],
    ["Artificial Intelligence", "platform", -370, 92, 118, 8, false],
    ["Analytics", "platform", -120, -8, 88, 8, false],
    ["Comms", "platform", 112, 0, 70, 7, false],
    ["Inbound Supply Chain", "supply", -790, -70, 112, 10, true],
    ["Inventory", "supply", -750, 56, 106, 9, true],
    ["Allocation", "supply", -820, 164, 82, 8, false],
    ["Forecasting", "supply", -698, 252, 92, 8, false],
    ["Replenishment", "supply", -804, 366, 72, 8, false],
    ["Customers", "channel", -200, -120, 108, 8, false],
    ["Sellers", "channel", 690, 70, 86, 8, false],
    ["Marketplace Sellers", "channel", 560, -68, 112, 10, true],
    ["Local Marketplace Sellers", "channel", 790, 12, 82, 8, false],
    ["Drop Ship Vendors", "channel", 760, 136, 78, 8, false],
    ["Stores", "channel", 804, 286, 68, 8, false],
    ["Fulfillment Centers", "fulfillment", 510, 214, 100, 8, false],
    ["Sort Centers", "fulfillment", 702, -126, 78, 8, false],
    ["Packages", "fulfillment", 46, 310, 58, 7, false],
    ["Cross Border Fulfillment", "fulfillment", 288, 304, 88, 8, false],
    ["Multi Channel Shipment", "fulfillment", -804, 720, 82, 8, false],
    ["Payments", "exception", -470, 2, 88, 8, false],
    ["Remediations", "exception", 194, -120, 108, 9, true],
    ["Reverse Logistics", "exception", 790, 430, 82, 8, false],
    ["Last Mile Delivery Network", "delivery", 800, 700, 102, 9, true],
    ["National Carriers", "delivery", -218, 394, 76, 8, false],
    ["External Delivery Partners", "delivery", 182, 430, 74, 8, false],
    ["Drivers", "delivery", 800, 600, 70, 8, false],
    ["Drone Delivery", "delivery", 850, 800, 50, 4, false],
    ["Air Shipment Delivery", "delivery", -276, 660, 66, 8, false]
  ];

  var routeLabels = [
    ["Inbound Supply Chain", "Inventory"],
    ["Inventory", "Allocation"],
    ["Forecasting", "Replenishment"],
    ["Replenishment", "Inventory"],
    ["Inventory", "Fulfillment Orchestration"],
    ["Allocation", "Fulfillment Orchestration"],
    ["Artificial Intelligence", "Forecasting"],
    ["Artificial Intelligence", "Fulfillment Orchestration"],
    ["Analytics", "Artificial Intelligence"],
    ["Analytics", "Fulfillment Orchestration"],
    ["Customers", "Comms"],
    ["Comms", "Fulfillment Orchestration"],
    ["Marketplace Sellers", "Sellers"],
    ["Local Marketplace Sellers", "Marketplace Sellers"],
    ["Drop Ship Vendors", "Marketplace Sellers"],
    ["Sellers", "Fulfillment Orchestration"],
    ["Stores", "Fulfillment Orchestration"],
    ["Fulfillment Orchestration", "Fulfillment Centers"],
    ["Fulfillment Orchestration", "Sort Centers"],
    ["Fulfillment Centers", "Sort Centers"],
    ["Fulfillment Orchestration", "Packages"],
    ["Fulfillment Orchestration", "Cross Border Fulfillment"],
    ["Fulfillment Orchestration", "Multi Channel Shipment"],
    ["Fulfillment Orchestration", "Last Mile Delivery Network"],
    ["Fulfillment Orchestration", "National Carriers"],
    ["Fulfillment Orchestration", "External Delivery Partners"],
    ["Last Mile Delivery Network", "Drivers"],
    ["Last Mile Delivery Network", "Drone Delivery"],
    ["External Delivery Partners", "Air Shipment Delivery"],
    ["National Carriers", "Air Shipment Delivery"],
    ["Fulfillment Orchestration", "Remediations"],
    ["Remediations", "Comms"],
    ["Fulfillment Orchestration", "Payments"],
    ["Fulfillment Orchestration", "Reverse Logistics"],
    ["Cloud", "Fulfillment Orchestration"],
    ["Cloud", "Distributed Systems"],
    ["Distributed Systems", "Analytics"],
    ["Cloud", "Artificial Intelligence"]
  ];

  function cssValue(name, fallback) {
    var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function clusterColor(cluster) {
    return cssValue("--retail-network-" + cluster, cssValue("--retail-network-accent", "#267b8c"));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildScene();
  }

  function buildScene() {
    var scale = Math.max(0.54, Math.min(width / 1540, 1));
    var centerX = width * 0.5;
    var topBandCenter = width < 760 ? 220 : 250;
    var centerY = Math.min(Math.max(height * 0.2, 205), topBandCenter);

    nodeByLabel = {};
    nodes = nodeSpecs.map(function (spec, index) {
      var node = {
        label: spec[0],
        cluster: spec[1],
        baseX: centerX + spec[2] * scale,
        baseY: centerY + spec[3] * scale,
        z: spec[4],
        radius: spec[5] * scale,
        major: spec[6],
        phase: index * 0.57,
        color: clusterColor(spec[1])
      };
      nodeByLabel[node.label] = node;
      return node;
    });

    routes = routeLabels.map(function (pair, index) {
      return {
        from: nodeByLabel[pair[0]],
        to: nodeByLabel[pair[1]],
        offset: index / routeLabels.length,
        strength: pair[0] === "Fulfillment Orchestration" || pair[1] === "Fulfillment Orchestration" ? 1 : 0.66
      };
    }).filter(function (route) {
      return route.from && route.to;
    });
  }

  function project(node, time) {
    var depth = 1 + node.z / 460;
    var orbit = node.major ? 7 : 5;
    var driftX = Math.cos(time * 0.00022 + node.phase) * orbit;
    var driftY = Math.sin(time * 0.0002 + node.phase) * (orbit * 0.8);
    var parallaxX = pointer.x * (node.z / 420) * 10;
    var parallaxY = pointer.y * (node.z / 420) * 6;

    return {
      x: node.baseX + driftX + parallaxX,
      y: node.baseY + driftY + parallaxY,
      depth: depth,
      radius: node.radius * depth
    };
  }

  function drawGrid(time) {
    var spacing = Math.max(42, Math.min(64, width / 24));
    context.save();
    context.translate(width * 0.5, Math.min(430, height * 0.46));
    context.rotate(-0.1);
    context.scale(1.7, 0.72);
    context.lineWidth = 1;
    context.strokeStyle = cssValue("--retail-network-grid", "rgba(73, 96, 124, 0.16)");

    for (var x = -width; x <= width; x += spacing) {
      context.beginPath();
      context.moveTo(x + Math.sin(time * 0.0002 + x) * 4, -height);
      context.lineTo(x, height);
      context.stroke();
    }

    for (var y = -height; y <= height; y += spacing) {
      context.beginPath();
      context.moveTo(-width, y);
      context.lineTo(width, y + Math.cos(time * 0.0002 + y) * 4);
      context.stroke();
    }

    context.restore();
  }

  function quadratic(a, b, c, t) {
    return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  }

  function drawRoute(route, time) {
    var a = project(route.from, time);
    var b = project(route.to, time);
    var pulse = (time * 0.00015 + route.offset) % 1;
    var midX = (a.x + b.x) / 2;
    var midY = (a.y + b.y) / 2 - 18 * route.strength;
    var px = quadratic(a.x, midX, b.x, pulse);
    var py = quadratic(a.y, midY, b.y, pulse);

    context.save();
    context.globalAlpha = 0.62 * route.strength;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.quadraticCurveTo(midX, midY, b.x, b.y);
    context.strokeStyle = cssValue("--retail-network-route", "rgba(73, 96, 124, 0.25)");
    context.lineWidth = Math.max(1.35, 1.9 * route.strength * ((a.depth + b.depth) / 2));
    context.stroke();

    var gradient = context.createLinearGradient(a.x, a.y, b.x, b.y);
    gradient.addColorStop(0, "rgba(38, 123, 140, 0)");
    gradient.addColorStop(Math.max(0, pulse - 0.12), "rgba(38, 123, 140, 0)");
    gradient.addColorStop(pulse, route.to.color);
    gradient.addColorStop(Math.min(1, pulse + 0.16), "rgba(53, 95, 147, 0)");
    gradient.addColorStop(1, "rgba(53, 95, 147, 0)");

    context.globalAlpha = 0.88;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.quadraticCurveTo(midX, midY, b.x, b.y);
    context.strokeStyle = gradient;
    context.lineWidth = Math.max(1.7, 2.7 * route.strength);
    context.stroke();

    context.globalAlpha = 0.94;
    context.beginPath();
    context.arc(px, py, 2.5 + route.strength * 1.3, 0, Math.PI * 2);
    context.fillStyle = route.to.color;
    context.shadowBlur = 15;
    context.shadowColor = route.to.color;
    context.fill();
    context.restore();
  }

  function roundedRect(x, y, w, h, r) {
    if (context.roundRect) {
      context.roundRect(x, y, w, h, r);
      return;
    }

    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
  }

  function drawLabel(node, p, alpha) {
    var fontSize = node.label === "Fulfillment Orchestration" ? 12 : 10.5;
    var weight = node.major ? "800" : "700";
    context.font = weight + " " + fontSize + "px IBM Plex Sans, system-ui, sans-serif";

    var text = node.label;
    var widthText = context.measureText(text).width;
    var paddingX = 9;
    var boxWidth = widthText + paddingX * 2;
    var boxHeight = 24;
    var labelToLeft = p.x > width * 0.68;
    var preferredX = labelToLeft ? p.x - p.radius - boxWidth - 8 : p.x + p.radius + 8;
    var x = Math.min(Math.max(preferredX, 12), width - boxWidth - 12);
    var y = Math.min(Math.max(p.y - boxHeight / 2, 12), height - boxHeight - 12);

    context.globalAlpha = alpha * 0.96;
    context.beginPath();
    roundedRect(x, y, boxWidth, boxHeight, 10);
    context.fillStyle = cssValue("--retail-network-label-bg", "rgba(255, 255, 255, 0.82)");
    context.fill();
    context.strokeStyle = cssValue("--retail-network-label-border", "rgba(64, 88, 116, 0.16)");
    context.lineWidth = 1;
    context.stroke();

    context.globalAlpha = alpha;
    context.fillStyle = cssValue("--retail-network-label", "rgba(35, 49, 68, 0.9)");
    context.fillText(text, x + paddingX, y + boxHeight * 0.66);
  }

  function drawNode(node, time) {
    var p = project(node, time);
    var showLabel = width >= 760 || node.major;

    context.save();
    context.globalAlpha = node.major ? 0.34 : 0.22;
    context.beginPath();
    context.arc(p.x, p.y, p.radius * (node.major ? 4.5 : 3.4), 0, Math.PI * 2);
    context.fillStyle = node.color;
    context.fill();

    context.globalAlpha = node.major ? 0.98 : 0.82;
    context.beginPath();
    context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    context.fillStyle = node.color;
    context.shadowBlur = node.major ? 21 : 13;
    context.shadowColor = node.color;
    context.fill();
    context.shadowBlur = 0;

    if (showLabel) {
      var labelAlpha = node.major ? 1 : 0.92;
      drawLabel(node, p, labelAlpha);
    }

    context.restore();
  }

  function drawCommerceIcon(time) {
    if (width < 820) return;

    var x = width * 0.5 + pointer.x * 5;
    var y = Math.min(330, height * 0.32) + Math.sin(time * 0.0004) * 4;
    var s = Math.max(0.68, Math.min(1, width / 1380));

    context.save();
    context.globalAlpha = 0.3;
    context.lineWidth = 3 * s;
    context.strokeStyle = cssValue("--retail-network-commerce-icon", "#6b42e8");
    context.shadowBlur = 18;
    context.shadowColor = "rgba(107, 66, 232, 0.28)";
    context.strokeRect(x - 34 * s, y - 58 * s, 56 * s, 94 * s);

    context.beginPath();
    context.moveTo(x - 10 * s, y - 22 * s);
    context.lineTo(x + 20 * s, y - 22 * s);
    context.lineTo(x + 14 * s, y + 18 * s);
    context.lineTo(x + 2 * s, y + 18 * s);
    context.stroke();

    context.beginPath();
    context.moveTo(x + 2 * s, y - 22 * s);
    context.lineTo(x + 36 * s, y - 22 * s);
    context.lineTo(x + 28 * s, y + 18 * s);
    context.stroke();

    context.beginPath();
    context.arc(x + 6 * s, y + 28 * s, 4 * s, 0, Math.PI * 2);
    context.arc(x + 27 * s, y + 28 * s, 4 * s, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    drawGrid(time);
    routes.forEach(function (route) {
      drawRoute(route, time);
    });
    nodes
      .slice()
      .sort(function (a, b) {
        return a.z - b.z;
      })
      .forEach(function (node) {
        drawNode(node, time);
      });
    drawCommerceIcon(time);
  }

  function animate(time) {
    draw(time);

    if (!reduceMotion) {
      window.requestAnimationFrame(animate);
    }
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", function (event) {
    pointer.x = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
    pointer.y = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
  });

  resize();
  window.requestAnimationFrame(animate);
}());
