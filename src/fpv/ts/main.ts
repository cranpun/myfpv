import { Scene, AxesHelper, DirectionalLight, WebGLRenderer } from "three";
import U from "./U";
import FpvCamera from "./FpvCamera";

/**
 * world parameter
 */
const wp = {
    w: 960,
    h: 540,

    renderer: null, // renderer
    camera: null,
    scene: null,
};

const _camera: FpvCamera = new FpvCamera(wp.w, wp.h);

/**
 * mouse parameter
 */
const mp = {
    now: 0,
    next: 0
}

function addLight() {
    // 平行光源
    const directionalLight = new DirectionalLight(0xFFFFFF);
    directionalLight.position.set(50, 50, 50);

    // シーンに追加
    wp.scene.add(directionalLight);
}

function makeRenderer() {
    // レンダラーを作成
    wp.renderer = new WebGLRenderer({
        canvas: document.querySelector('#myCanvas')
    });
    wp.renderer.setSize(wp.w, wp.h);
}

function updateDisplay() {
    // 初期値を読み込み

    const vecs = {
        p: _camera.pos,
        l: _camera.look
    };

    for (let k of ["p", "l"]) {
        for (let d of ["x", "y", "z"]) {
            const input = U.qsinput(`#${k}${d}`);
            input.value = vecs[k][d].toString();
        }
    }

    const angle = U.qsinput("#angle");
    angle.value = (_camera.angle * 180 / Math.PI).toString();
}

function keydownhandler(ev) {
    const funcs = {
        // position。視点も同じく移動。
        "w": function () { _camera.updatePos("g"); },
        "s": function () { _camera.updatePos("b"); },
        "d": function () { _camera.updatePos("r"); },
        "a": function () { _camera.updatePos("l"); },

        "e": function () { _camera.updatePos("u"); },
        "q": function () { _camera.updatePos("d"); },

        // lookAt
        "l": function () { _camera.updateLook("r"); },
        "j": function () { _camera.updateLook("l"); },

        // test
        "p": function () { _camera.test(); }
    };

    const keycode = ev.key;
    if (keycode in funcs) {
        funcs[keycode]();
    }
    updateDisplay();
}

// function mousemovehandler(ev) {
//     // 前回のポイントをnowに
//     mp.now = mp.next;

//     // 今回のポイントをnextに
//     mp.next = ev.clientX;

//     if (mp.now < mp.next) {
//         lookright();
//         console.log("right");
//     } else if (mp.now > mp.next) {
//         lookleft();
//         console.log("left");
//     } else {
//         console.log("not move");
//     }
// }

function makeScene() {
    // シーンを作成
    wp.scene = new Scene();

    const axes = new AxesHelper(2500);
    wp.scene.add(axes);
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
                U.makeLine(wp.scene,
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
                U.makeLine(wp.scene,
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
                U.makeLine(wp.scene,
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

function tick() {
    updateDisplay();
    _camera.updateCamera();

    // レンダリング
    wp.renderer.render(wp.scene, _camera.camera);
    requestAnimationFrame(tick);
}


// ページの読み込みを待つ
window.addEventListener('load', function () {
    makeScene();
    makeRenderer();
    U.addSphere(wp.scene, 100, 0, 0); // north
    U.addCone(wp.scene, 0, 0, 100); // east
    U.addBox(wp.scene, -100, 0, 0); // south
    U.addCylinder(wp.scene, 0, 0, -100); // west
    addLight();

    document.addEventListener("keydown", keydownhandler);
    // document.addEventListener("mousemove", mousemovehandler);

    updateDisplay();
    tick();
});
