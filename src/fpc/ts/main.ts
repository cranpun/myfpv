import {
    Scene,
    AxesHelper,
    DirectionalLight,
    WebGLRenderer,
    LineBasicMaterial,
    Geometry,
    Vector3,
    Line,
    PerspectiveCamera,
    Clock
} from "three";

import { FirstPersonControls } from "../../../node_modules/three/examples/jsm/controls/FirstPersonControls";

/**
 * world parameter
 */
const wp = {
    w: 960,
    h: 540,

};

let _renderer: WebGLRenderer;
let _camera: PerspectiveCamera;
let _scene: Scene;
let _controls: FirstPersonControls;
let _clock: Clock;

/**
 * mouse parameter
 */
const mp = {
    now: 0,
    next: 0
}

function addLight() {
    // 平行光源
    const directionalLight: DirectionalLight = new DirectionalLight(0xFFFFFF);
    directionalLight.position.set(50, 50, 50);

    // シーンに追加
    _scene.add(directionalLight);
}

function makeRenderer() {
    // レンダラーを作成
    _renderer = new WebGLRenderer({
        canvas: document.querySelector('#myCanvas')
    });
    _renderer.setSize(wp.w, wp.h);
}

function makeControls() {
    _camera = new PerspectiveCamera(45, wp.w / wp.h, 0.1, 1000);
    _controls = new FirstPersonControls(_camera, _renderer.domElement);

    // 設定
    _camera.position.x = 100;
    _camera.position.y = 10;
    _camera.position.z = 10;
    _camera.lookAt(new Vector3(0, 0, 0));

    _controls.lookSpeed = 0.4;
    _controls.movementSpeed = 20;
    _controls.lookVertical = true;
    _controls.constrainVertical = true;
    _controls.verticalMin = 1.0;
    _controls.verticalMax = 2.0;
    // _controls.noFly = true;
    // _controls.lon = -150;
    // _controls.lat = 120;    
}

/**
 * 
 * @param scene 
 * @param sp start point. xyz
 * @param ep end point.  xyz
 */
function makeLine(scene: Scene, color: string, sp: { [key: string]: number }, ep: { [key: string]: number }) {
    const material = new LineBasicMaterial({
        color: color
    });
    const geometry = new Geometry();
    geometry.vertices.push(new Vector3(sp.x, sp.y, sp.z), new Vector3(ep.x, ep.y, ep.z));
    const line = new Line(geometry, material);
    scene.add(line);
}


function makeScene() {
    // シーンを作成
    _scene = new Scene();

    const axes = new AxesHelper(2500);
    _scene.add(axes);
    const lines = -30000;
    const linee = 30000;
    const linei = 5000;
    const colorx = "#FF0000";
    const colory = "#00FF00";
    const colorz = "#0000FF";

    // line
    for (let x = lines; x < linee; x += linei) {
        for (let y = lines; y < linee; y += linei) {
            for (let z = lines; z < linee; z += linei) {
                // x軸
                makeLine(_scene,
                    colorx,
                    {
                        x: lines,
                        y: y,
                        z: z
                    },
                    {
                        x: linee,
                        y: y,
                        z: z
                    });
                // y軸
                makeLine(_scene,
                    colory,
                    {
                        x: x,
                        y: lines,
                        z: z
                    },
                    {
                        x: x,
                        y: linee,
                        z: z
                    });
                // z軸
                makeLine(_scene,
                    colorz,
                    {
                        x: x,
                        y: y,
                        z: lines
                    },
                    {
                        x: x,
                        y: y,
                        z: linee
                    });
            }
        }
    }
}

function animate() {

	requestAnimationFrame( animate );

    // required if controls.enableDamping or controls.autoRotate are set to true
    const delta = _clock.getDelta();
	_controls.update(delta);

	_renderer.render( _scene, _camera );
}

window.addEventListener("load", function() {
    makeRenderer();
    makeScene();
    makeControls();
    addLight();
    _clock = new Clock();

    animate();
});