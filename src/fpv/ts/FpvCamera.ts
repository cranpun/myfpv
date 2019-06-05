import { PerspectiveCamera, Vector3 } from "THREE";
import U from "./U";

export default class FpvCamera {
    /**
     * カメラオブジェクト
     */
    private _camera: PerspectiveCamera;

    /**
     * カメラの位置
     */
    private _pos: Vector3;

    /**
     * カメラの向き。現在の位置から一歩分の長さ。
     */
    private _look: Vector3;
    private _angle: number; // 現在の角度。

    /**
     * Vector3の次元 for setComponent
     * https://threejs.org/docs/index.html#api/en/math/Vector3.setComponent
     */
    static readonly DIM: { [key: string]: number } = {
        x: 0,
        y: 1,
        z: 2
    };

    static readonly LEN: number = 10.0;
    static readonly ANGLE: number = Math.PI / 10; // 単位はラジアン。2πで360。

    constructor(w: number, h: number) {
        this._camera = new PerspectiveCamera(100, w / h, 1, 10000);
        this._pos = new Vector3(0, 0, 0);
        this._look = new Vector3(FpvCamera.LEN, 0, 0); // 初期値はx方向
        this._angle = 0;
        this._camera.lookAt(this._look);
    }

    // *******************************************************
    // method
    // *******************************************************
    /**
     * 
     * @param dir g, b, r, l, u, d
     */
    updatePos(dir: string) {


        if (["u", "d"].indexOf(dir) >= 0) {
            // 縦軸は単純に加算
            const dirs = {
                "u": +1,
                "d": -1,
            };
            const y = this._pos.y + (FpvCamera.LEN * dirs[dir]);
            this._pos.setY(y);

            // lookも更新
            this._look.setY(y);
        } else {
            let angle;

            switch (dir) {
                case "g":
                    // goの場合、現在のベクトル分方向
                    angle = 0;
                    break;
                case "b":
                    // backの場合、現在のベクトルの逆
                    angle = Math.PI;
                    break;
                case "r":
                    // rightなら現在の角度の+90度
                    angle = Math.PI / 2;
                    break;
                case "l":
                    // leftなら現在の角度の-90度
                    angle = Math.PI / 2 * 3;
                    break;
            }
            // 現在の方向と移動先の角度を基に、移動する座標の差分を算出、現在位置に加算
            const coord = U.rotateCoord([this._pos.x, this._pos.z], this._angle + angle, FpvCamera.LEN);
            this._pos.setX(coord.cos);
            this._pos.setZ(coord.sin);

            // posが新しい位置になったため方向も更新
            const look = U.rotateCoord([this._pos.x, this._pos.z], this._angle, FpvCamera.LEN);
            this._look.setX(look.cos);
            this._look.setZ(look.sin);
        }
    }

    /**
     * 
     * @param dir l or r
     */
    updateLook(dir: string) {
        // 次の角度へ移動
        const dirs = {
            "l": -1,
            "r": +1
        }
        this._angle = U.addAngle(this._angle, dirs[dir] * FpvCamera.ANGLE);
        const coord = U.rotateCoord([this._pos.x, this._pos.z], this._angle, FpvCamera.LEN);

        this._look.setX(coord.cos);
        this._look.setZ(coord.sin);
    }

    updateCamera() {
        // カメラに反映
        this._camera.position.set(this._pos.x, this._pos.y, this._pos.z);
        this._camera.lookAt(this._look);
    }


    // *******************************************************
    // getter / setter
    // *******************************************************
    get camera(): PerspectiveCamera {
        return this._camera;
    }

    get pos(): Vector3 {
        return this._pos;
    }
    // set pos(v: Vector3) {
    //     this._pos = v;
    // }

    get look(): Vector3 {
        return this._look;
    }
    // set look(v: Vector3) {
    //     this._look = v;
    // }

    get angle(): number {
        return this._angle;
    }
}