import {
    SphereGeometry,
    TextureLoader,
    MeshNormalMaterial,
    MeshStandardMaterial,
    Mesh,
    ConeGeometry,
    Scene,
    BoxGeometry,
    PlaneGeometry,
    LineBasicMaterial,
    Geometry,
    Vector3,
    Line,
    CylinderGeometry,
} from "THREE";

export default class U {
    public static qsinput(cssid): HTMLInputElement {
        const ret: HTMLInputElement = (document.querySelector(cssid) as HTMLInputElement);
        return ret;
    }

    public static addEarth(scene: Scene, x: number, y: number, z: number) {
        const geometry = new SphereGeometry(30, 30, 30);
        const loader = new TextureLoader();
        const texture = loader.load('./imgs/earthmap1k.jpg');

        // マテリアルにテクスチャーを設定
        const material = new MeshStandardMaterial({
            map: texture
        });
        // メッシュを作成
        const mesh = new Mesh(geometry, material);
        mesh.position.set(x, y, z);

        // 3D空間にメッシュを追加
        scene.add(mesh);
    }

    public static addCylinder(scene: Scene, x: number, y: number, z: number) {
        const geometry = new CylinderGeometry(30, 30, 30);
        const material = new MeshNormalMaterial();

        // メッシュを作成
        const mesh = new Mesh(geometry, material);
        mesh.position.set(x, y, z);

        // 3D空間にメッシュを追加
        scene.add(mesh);
    }

    public static addCone(scene: Scene, x: number, y: number, z: number) {
        const geometry = new ConeGeometry(30, 30);
        // const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const material = new MeshNormalMaterial();

        const mesh = new Mesh(geometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
    }

    public static addSphere(scene: Scene, x: number, y: number, z: number) {
        const geometry = new SphereGeometry(30, 30);
        // const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const material = new MeshNormalMaterial();

        const mesh = new Mesh(geometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
    }

    public static addBox(scene: Scene, x: number, y: number, z: number) {
        const geometry = new BoxGeometry(30, 30, 30);
        // const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const material = new MeshNormalMaterial();

        const mesh = new Mesh(geometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
    }

    /**
     * 
     * @param scene 
     * @param sp start point. xyz
     * @param ep end point.  xyz
     */
    public static makeLine(scene: Scene, color: string, sp: { [key: string]: number }, ep: { [key: string]: number }) {
        const material = new LineBasicMaterial({
            color: color
        });
        const geometry = new Geometry();
        geometry.vertices.push(new Vector3(sp.x, sp.y, sp.z), new Vector3(ep.x, ep.y, ep.z));
        const line = new Line(geometry, material);
        scene.add(line);
    }

    // public static makeGround(scene: Scene, x: number, y: number, z: number) {
    //     const geometry = new PlaneGeometry(30, 30);
    //     // const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    //     const material = new MeshNormalMaterial();


    //     // メッシュを作成
    //     const mesh = new Mesh(geometry, material);

    //     mesh.rotation.set(90, 90, 90);

    //     // 3D空間にメッシュを追加
    //     scene.add(mesh);

    // }

    public static addAngle(base: number, add: number) {
        // 0と360の対応
        let angle = base + add;

        if (angle >= 2 * Math.PI) {
            // 360度を超えたので一周分引く
            angle -= Math.PI * 2;
        } else if (angle < 0) {
            // 0度を下回ったので一周分足す
            angle += Math.PI * 2;
        }
        return angle;
    }
    /**
     * 
     * @param base 2次元
     * @param angle 
     * @param len 
     */
    public static rotateCoord(base: number[], angle: number, len: number): { [key: string]: number } {
        // (0,0,0)から現在の角度の座標を求める
        const fixangle = U.addAngle(angle, 0); // 0, 360の調整
        const a = len * U.cos(fixangle); // x軸の差分
        const b = len * U.sin(fixangle); // z軸の差分

        // ベクトルを更新。現在の位置から求めたa,bを足す
        const x = base[0] + a;
        const z = base[1] + b;

        return {
            cos: x,
            sin: z
        };
    }

    public static sin(angle: number): number {
        if ([
            Math.PI,
            Math.PI * 2,
        ].indexOf(angle) >= 0) {
            // Mathの仕様上、0にならないため強制的に0
            return 0;
        } else {
            return Math.sin(angle);
        }
    }
    public static cos(angle: number): number {
        if ([
            Math.PI / 2,
            Math.PI / 2 * 3,
        ].indexOf(angle) >= 0) {
            // Mathの仕様上、0にならないため強制的に0
            return 0;
        } else {
            return Math.cos(angle);
        }
    }
}