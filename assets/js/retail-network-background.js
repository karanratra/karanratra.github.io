(function () {
  var canvas = document.getElementById("retailNetworkBackground");
  if (!canvas) return;

  var context = canvas.getContext("2d");
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduceMotion = motionQuery.matches;
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var lowPower = false;
  var frameInterval = 0;
  var lastFrameTime = 0;
  var animationFrame = 0;
  var running = false;
  var pointer = { x: 0, y: 0, screenX: -1000, screenY: -1000 };
  var pointerTarget = { x: 0, y: 0, screenX: -1000, screenY: -1000 };
  var scrollState = { progress: 0, velocity: 0, direction: 1 };
  var width = 0;
  var height = 0;
  var dpr = 1;
  var nodes = [];
  var routes = [];
  var nodeByLabel = {};
  var projectedNodes = {};
  var activeNode = null;
  var ripples = [];
  var lastRipple = 0;
  var colors = {};
  var pageMode = "default";
  var staticMode = false;

  var modeWeights = {
    about: { fulfillment: 1, platform: 0.9, supply: 0.88, channel: 0.8, delivery: 0.84, exception: 0.78 },
    publications: { platform: 1, fulfillment: 0.62, supply: 0.42, channel: 0.35, delivery: 0.35, exception: 0.48 },
    repositories: { platform: 1, fulfillment: 0.8, supply: 0.45, channel: 0.42, delivery: 0.4, exception: 0.5 },
    volunteering: { platform: 0.72, fulfillment: 0.7, supply: 0.58, channel: 1, delivery: 0.84, exception: 0.62 },
    memberships: { platform: 0.82, fulfillment: 0.66, supply: 0.5, channel: 0.72, delivery: 0.64, exception: 0.54 },
    resume: { platform: 0.62, fulfillment: 0.58, supply: 0.42, channel: 0.4, delivery: 0.4, exception: 0.4 },
    article: { platform: 0.58, fulfillment: 0.5, supply: 0.38, channel: 0.38, delivery: 0.38, exception: 0.38 },
    default: { platform: 0.76, fulfillment: 0.76, supply: 0.62, channel: 0.62, delivery: 0.62, exception: 0.62 }
  };

  var nodeSpecs = [
    ["Customers · Sellers · Stores", "channel", -500, -115, 100, 10, true],
    ["Inventory & Supply", "supply", -500, 135, 100, 10, true],
    ["Cloud Platform", "platform", -270, -15, 90, 9, true],
    ["Multi-Tenant Platform", "platform", -165, 235, 105, 10, true],
    ["Fulfillment Orchestration", "fulfillment", 0, 85, 180, 16, true],
    ["Event Streams", "platform", 185, -75, 90, 9, true],
    ["Fulfillment Centers", "fulfillment", 445, -50, 105, 10, true],
    ["Cross-Border Transactions", "exception", 500, 145, 100, 10, true],
    ["Last-Mile Delivery", "delivery", 395, 335, 100, 10, true],
    ["Remediation & Comms", "exception", 70, 355, 95, 9, true]
  ];

  var routeLabels = [
    ["Customers · Sellers · Stores", "Fulfillment Orchestration"],
    ["Inventory & Supply", "Fulfillment Orchestration"],
    ["Cloud Platform", "Multi-Tenant Platform"],
    ["Multi-Tenant Platform", "Fulfillment Orchestration"],
    ["Event Streams", "Fulfillment Orchestration"],
    ["Fulfillment Orchestration", "Fulfillment Centers"],
    ["Fulfillment Orchestration", "Cross-Border Transactions"],
    ["Cross-Border Transactions", "Fulfillment Centers"],
    ["Fulfillment Centers", "Last-Mile Delivery"],
    ["Fulfillment Orchestration", "Remediation & Comms"],
    ["Remediation & Comms", "Customers · Sellers · Stores"]
  ];

  function cssValue(name, fallback) {
    var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function detectPageMode() {
    var path = window.location.pathname;
    if (document.body.classList.contains("layout-about") || path === "/") return "about";
    if (path.indexOf("publications") !== -1) return "publications";
    if (path.indexOf("repositories") !== -1) return "repositories";
    if (path.indexOf("volunteer") !== -1) return "volunteering";
    if (path.indexOf("membership") !== -1 || path.indexOf("recognition") !== -1) return "memberships";
    if (path.indexOf("cv") !== -1 || path.indexOf("resume") !== -1) return "resume";
    if (document.body.classList.contains("layout-post")) return "article";
    return "default";
  }

  function cacheColors() {
    colors.grid = cssValue("--retail-network-grid", "rgba(73, 96, 124, 0.16)");
    colors.route = cssValue("--retail-network-route", "rgba(73, 96, 124, 0.25)");
    colors.labelBg = cssValue("--retail-network-label-bg", "rgba(255, 255, 255, 0.82)");
    colors.labelBorder = cssValue("--retail-network-label-border", "rgba(64, 88, 116, 0.16)");
    colors.label = cssValue("--retail-network-label", "rgba(35, 49, 68, 0.9)");
    colors.icon = cssValue("--retail-network-commerce-icon", "#6b42e8");
  }

  function clusterWeight(cluster) {
    var weight = (modeWeights[pageMode] || modeWeights.default)[cluster] || 0.5;
    if (pageMode !== "about") return weight;
    var stage = Math.min(3, Math.floor(scrollState.progress * 4));
    var stageClusters = ["platform", "supply", "fulfillment", "delivery"];
    return cluster === stageClusters[stage] ? Math.min(1.08, weight + 0.18) : weight;
  }

  function clusterColor(cluster) {
    return cssValue("--retail-network-" + cluster, cssValue("--retail-network-accent", "#267b8c"));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    lowPower = Boolean(reduceMotion || width < 760 || connection && connection.saveData || navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    frameInterval = lowPower && !reduceMotion ? 1000 / (width < 760 ? 24 : 30) : 0;
    dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    cacheColors();
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
        color: clusterColor(spec[1]),
        weight: clusterWeight(spec[1])
      };
      nodeByLabel[node.label] = node;
      return node;
    });

    routes = routeLabels.map(function (pair, index) {
      return {
        index: index,
        from: nodeByLabel[pair[0]],
        to: nodeByLabel[pair[1]],
        offset: index / routeLabels.length,
        strength: pair[0] === "Fulfillment Orchestration" || pair[1] === "Fulfillment Orchestration" ? 1 : 0.66,
        speed: 0.000055 + (index % 7) * 0.000006,
        packetOffset: (index * 0.173) % 1,
        packetGap: 0.58 + (index % 5) * 0.09
      };
    }).filter(function (route) {
      return route.from && route.to;
    });
  }

  function project(node, time) {
    var depth = 1 + node.z / 460;
    var orbit = staticMode ? 0 : (node.major ? 3.2 : 2.4);
    var driftX = Math.cos(time * 0.00022 + node.phase) * orbit;
    var driftY = Math.sin(time * 0.0002 + node.phase) * (orbit * 0.8);
    var scrollDepth = staticMode ? 0 : (scrollState.progress - 0.5) * (node.z / 460) * 12;
    var parallaxX = staticMode ? 0 : pointer.x * (node.z / 420) * 7;
    var parallaxY = staticMode ? 0 : pointer.y * (node.z / 420) * 4 + scrollDepth;

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
    context.strokeStyle = colors.grid;

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
    var a = projectedNodes[route.from.label];
    var b = projectedNodes[route.to.label];
    var packetCycle = time * route.speed + route.packetOffset;
    var pulse = packetCycle % route.packetGap / route.packetGap;
    var packetVisible = !staticMode && pulse < 0.72;
    var routeWeight = (route.from.weight + route.to.weight) / 2;
    var connected = activeNode && (route.from === activeNode || route.to === activeNode);
    var midX = (a.x + b.x) / 2;
    var midY = (a.y + b.y) / 2 - 18 * route.strength;
    var px = quadratic(a.x, midX, b.x, pulse);
    var py = quadratic(a.y, midY, b.y, pulse);

    context.save();
    context.globalAlpha = (staticMode ? 0.24 : (connected ? 0.9 : 0.48)) * route.strength * routeWeight;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.quadraticCurveTo(midX, midY, b.x, b.y);
    context.strokeStyle = colors.route;
    context.lineWidth = Math.max(1.35, 1.9 * route.strength * ((a.depth + b.depth) / 2));
    context.stroke();

    var gradient = context.createLinearGradient(a.x, a.y, b.x, b.y);
    gradient.addColorStop(0, "rgba(38, 123, 140, 0)");
    gradient.addColorStop(Math.max(0, pulse - 0.12), "rgba(38, 123, 140, 0)");
    gradient.addColorStop(pulse, route.to.color);
    gradient.addColorStop(Math.min(1, pulse + 0.16), "rgba(53, 95, 147, 0)");
    gradient.addColorStop(1, "rgba(53, 95, 147, 0)");

    context.globalAlpha = packetVisible ? (connected ? 1 : 0.82) * routeWeight : 0;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.quadraticCurveTo(midX, midY, b.x, b.y);
    context.strokeStyle = gradient;
    context.lineWidth = Math.max(1.7, 2.7 * route.strength);
    context.stroke();

    if (packetVisible) {
      context.globalAlpha = (connected ? 1 : 0.9) * routeWeight;
      context.beginPath();
      context.arc(px, py, 2.2 + route.strength * 1.35, 0, Math.PI * 2);
      context.fillStyle = route.to.color;
      context.shadowBlur = connected ? 22 : 14;
      context.shadowColor = route.to.color;
      context.fill();
    }
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
    context.fillStyle = colors.labelBg;
    context.fill();
    context.strokeStyle = colors.labelBorder;
    context.lineWidth = 1;
    context.stroke();

    context.globalAlpha = alpha;
    context.fillStyle = colors.label;
    context.fillText(text, x + paddingX, y + boxHeight * 0.66);
  }

  function drawNode(node, time) {
    var p = projectedNodes[node.label];
    var isActive = node === activeNode;
    var showLabel = !staticMode && (width >= 760 || node === nodeByLabel["Fulfillment Orchestration"] || isActive);
    var emphasis = isActive ? 1.34 : node.weight;

    context.save();
    context.globalAlpha = (node.major ? 0.34 : 0.2) * emphasis;
    context.beginPath();
    context.arc(p.x, p.y, p.radius * (node.major ? 4.5 : 3.4) * (isActive ? 1.22 : 1), 0, Math.PI * 2);
    context.fillStyle = node.color;
    context.fill();

    context.globalAlpha = Math.min(1, (node.major ? 0.98 : 0.76) * emphasis);
    context.beginPath();
    context.arc(p.x, p.y, p.radius * (isActive ? 1.14 : 1), 0, Math.PI * 2);
    context.fillStyle = node.color;
    context.shadowBlur = node.major ? 21 : 13;
    context.shadowColor = node.color;
    context.fill();
    context.shadowBlur = 0;

    if (showLabel) {
      var labelAlpha = isActive ? 1 : (node.major ? 1 : 0.88) * node.weight;
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
    context.strokeStyle = colors.icon;
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
    pointer.x += (pointerTarget.x - pointer.x) * 0.075;
    pointer.y += (pointerTarget.y - pointer.y) * 0.075;
    pointer.screenX += (pointerTarget.screenX - pointer.screenX) * 0.12;
    pointer.screenY += (pointerTarget.screenY - pointer.screenY) * 0.12;
    nodes.forEach(function (node) {
      node.weight = clusterWeight(node.cluster);
      projectedNodes[node.label] = project(node, time);
    });

    activeNode = null;
    var closestDistance = width < 760 ? 92 : 132;
    nodes.forEach(function (node) {
      var p = projectedNodes[node.label];
      var distance = Math.hypot(p.x - pointer.screenX, p.y - pointer.screenY);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeNode = node;
      }
    });

    if (activeNode && time - lastRipple > 1150) {
      ripples.push({ node: activeNode, started: time });
      lastRipple = time;
    }

    context.clearRect(0, 0, width, height);
    drawGrid(time);
    routes.forEach(function (route) {
      if (width < 760 && route.index % 2 === 1 && !activeNode) return;
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
    ripples = ripples.filter(function (ripple) {
      var age = (time - ripple.started) / 900;
      if (age >= 1) return false;
      var p = projectedNodes[ripple.node.label];
      context.save();
      context.globalAlpha = (1 - age) * 0.42;
      context.strokeStyle = ripple.node.color;
      context.lineWidth = 1.5;
      context.beginPath();
      context.arc(p.x, p.y, p.radius + age * 32, 0, Math.PI * 2);
      context.stroke();
      context.restore();
      return true;
    });
  }

  function animate(time) {
    if (!running) return;
    if (frameInterval && time - lastFrameTime < frameInterval) {
      animationFrame = window.requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = time;
    draw(time);

    if (!reduceMotion && !staticMode) {
      animationFrame = window.requestAnimationFrame(animate);
    } else {
      running = false;
    }
  }

  function start() {
    if (running || document.hidden) return;
    running = true;
    lastFrameTime = 0;
    animationFrame = window.requestAnimationFrame(animate);
  }

  function stop() {
    running = false;
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  var resizeTimer = 0;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  }, { passive: true });
  window.addEventListener("pointermove", function (event) {
    pointerTarget.x = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
    pointerTarget.y = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    pointerTarget.screenX = event.clientX;
    pointerTarget.screenY = event.clientY;
  });
  window.addEventListener("pointerleave", function () {
    pointerTarget.screenX = -1000;
    pointerTarget.screenY = -1000;
  });
  window.addEventListener("site:scroll", function (event) {
    scrollState.progress = event.detail.progress || 0;
    scrollState.velocity = event.detail.velocity || 0;
    scrollState.direction = event.detail.direction || 1;
  });
  window.addEventListener("site:modal-open", stop);
  window.addEventListener("site:modal-close", start);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });
  motionQuery.addEventListener("change", function (event) {
    reduceMotion = event.matches;
    stop();
    resize();
    start();
  });
  if (connection && connection.addEventListener) {
    connection.addEventListener("change", function () {
      stop();
      resize();
      start();
    });
  }
  new MutationObserver(function (mutations) {
    if (!mutations.some(function (mutation) { return mutation.attributeName === "data-theme"; })) return;
    cacheColors();
    nodes.forEach(function (node) { node.color = clusterColor(node.cluster); });
    if (reduceMotion || staticMode) {
      stop();
      start();
    }
  }).observe(document.documentElement, { attributes: true });

  pageMode = detectPageMode();
  staticMode = pageMode !== "about";
  resize();
  start();
}());
