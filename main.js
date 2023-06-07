"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

var camera, scene, renderer;
var windowScale;
var cameraControls;
var clock = new THREE.Clock();
var newTime = 0, oldTime = 0, ruleTime = 0;
var cubeSizeLength = 20;
var goldColor = "#FFDF00";
var greyColor = "#808080";
var whiteColor = "#FFFFFF";
var N = 10;
var vector3D = [];
var cubos = [];
var probabilidad = 15;


function drawCube(x, y, z, color, transparent) {
    var cube;
    if (transparent) {
        var wireMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0 });
    } else {
        var wireMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 });
    }
    var cubeGeometry = new THREE.CubeGeometry(cubeSizeLength, cubeSizeLength, cubeSizeLength);

    cube = new THREE.Mesh(cubeGeometry, wireMaterial);
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    scene.add(cube);

    return cube;
}

function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    // SCENE
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x808080, 20000, 40000);

    // LIGHTS
    scene.add(new THREE.DirectionalLight(0xFFFFFF, 1));

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(scene.fog.color, 1);

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // CAMERA
    camera = new THREE.PerspectiveCamera(80, canvasRatio, 1, 4000);
    camera.position.set(250, 250, 500);

    // CONTROLS
    cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);

    create();
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function render() {
    var delta = clock.getDelta();
    newTime += delta;

    if (newTime > oldTime + 1 / 60) {
        var renderDelta = newTime - oldTime;

        if (ruleTime === 30) {
            reglas();
            ruleTime = -1;
        }

        cameraControls.update(renderDelta);
        renderer.render(scene, camera);
        oldTime = newTime;
        ruleTime++;
    }

}

function create() {
    for (var i = 0; i < N; i++) {
        var vector2D = [];
        for (var j = 0; j < N; j++) {
            var vector1D = [];
            for (var k = 0; k < N; k++) {
                var numeroAleatorio = Math.floor(Math.random() * 99) + 1;
                if (numeroAleatorio < probabilidad) {
                    vector1D.push(1);
                }
                else {
                    vector1D.push(0);
                }
            }
            vector2D.push(vector1D);
        }
        vector3D.push(vector2D);
    }

    for (var i = 0; i < N; i++) {
        var vector2D = [];
        for (var j = 0; j < N; j++) {
            var vector1D = [];
            for (var k = 0; k < N; k++) {
                if (vector3D[i][j][k] === 1) {
                    vector1D.push(drawCube(i * cubeSizeLength, j * cubeSizeLength, k * cubeSizeLength, goldColor, false));

                }
                else {
                    vector1D.push(drawCube(i * cubeSizeLength, j * cubeSizeLength, k * cubeSizeLength, greyColor, true));
                }
            }
            vector2D.push(vector1D);
        }
        cubos.push(vector2D);
    }
}

function reglas() {
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            for (var k = 0; k < N; k++) {
                var celulas = sumCelulas(i, j, k);
                if (vector3D[i][j][k] === 0) {

                    if (celulas === 3) {
                        cubos[i][j][k].material = new THREE.MeshBasicMaterial({ color: goldColor, transparent: true, opacity: 0.5 });
                        vector3D[i][j][k] = 1;
                    }
                }
                else if (vector3D[i][j][k] === 1) {
                    if (celulas > 3 || celulas <= 1) {
                        cubos[i][j][k].material = new THREE.MeshBasicMaterial({ color: whiteColor, transparent: true, opacity: 0 });
                        vector3D[i][j][k] = 0;
                    }
                }
            }
        }
    }
}

function sumCelulas(x, y, z) {
    var sum = 0;
    if ((x > 0 && x < N - 1) && (y > 0 && y < N - 1) && (z > 0 && z < N - 1)) {
        for (var i = -1; i <= 1; i++) {
            sum += vector3D[x - 1][y - 1][z + i];
            sum += vector3D[x - 1][y][z + i];
            sum += vector3D[x - 1][y + 1][z + i];
            sum += vector3D[x][y - 1][z + i];
            sum += vector3D[x][y + 1][z + i];
            sum += vector3D[x + 1][y - 1][z + i];
            sum += vector3D[x + 1][y][z + i];
            sum += vector3D[x + 1][y + 1][z + i];
        }
    }
    else {
        if (x === 0) {
            if (y === 0) {
                if (z === 0) {
                    for (var i = 0; i <= 1; i++) {
                        sum += vector3D[x][y + 1][z + i];
                        sum += vector3D[x + 1][y][z + i];
                        sum += vector3D[x + 1][y + 1][z + i];
                    }
                } else if (z === N - 1) {
                    for (var i = -1; i <= 0; i++) {
                        sum += vector3D[x][y + 1][z + i];
                        sum += vector3D[x + 1][y][z + i];
                        sum += vector3D[x + 1][y + 1][z + i];
                    }
                }
            } else if (y === N - 1) {
                if (z === 0) {
                    for (var i = 0; i <= 1; i++) {
                        sum += vector3D[x][y - 1][z + i];
                        sum += vector3D[x + 1][y - 1][z + i];
                        sum += vector3D[x + 1][y][z + i];
                    }
                } else if (z === N - 1) {
                    for (var i = -1; i <= 0; i++) {
                        sum += vector3D[x][y - 1][z + i];
                        sum += vector3D[x + 1][y - 1][z + i];
                        sum += vector3D[x + 1][y][z + i];
                    }
                }
            }
        } else if (x === N - 1) {
            if (y === 0) {
                if (z === 0) {
                    for (var i = 0; i <= 1; i++) {
                        sum += vector3D[x - 1][y][z + i];
                        sum += vector3D[x - 1][y + 1][z + i];
                        sum += vector3D[x][y + 1][z + i];
                    }
                } else if (z === N - 1) {
                    for (var i = -1; i <= 0; i++) {
                        sum += vector3D[x - 1][y][z + i];
                        sum += vector3D[x - 1][y + 1][z + i];
                        sum += vector3D[x][y + 1][z + i];
                    }
                }
            } else if (y === N - 1) {
                if (z === 0) {
                    for (var i = 0; i <= 1; i++) {
                        sum += vector3D[x - 1][y - 1][z + i];
                        sum += vector3D[x - 1][y][z + i];
                        sum += vector3D[x][y - 1][z + i];
                    }
                } else if (z === N - 1) {
                    for (var i = -1; i <= 0; i++) {
                        sum += vector3D[x - 1][y - 1][z + i];
                        sum += vector3D[x - 1][y][z + i];
                        sum += vector3D[x][y - 1][z + i];
                    }
                }
            }
        }
    }
    return sum;
}

init();
animate();
