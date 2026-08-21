import * as THREE from 'three'

// Cinematic WebGL scene. The hero opens in crisp daylight above a sea of
// cumulus clouds (111 W 57th-style), then descends into a dusk city as the
// scroll progresses. Camera rides a spline driven by global progress (0..1).

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  const scene = new THREE.Scene()
  const FOG_DAY = new THREE.Color(0xc3d2e2)
  const FOG_NIGHT = new THREE.Color(0x05060a)
  scene.fog = new THREE.FogExp2(0xc3d2e2, 0.004)

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 700)

  // ------------------------------------------------------------ sky dome
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uDay: { value: 1 },
      uSunDir: { value: new THREE.Vector3(0.6, 0.22, -0.45).normalize() },
    },
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec3 vDir;
      uniform float uDay;
      uniform vec3 uSunDir;
      void main() {
        float h = clamp(vDir.y, -0.12, 1.0);
        // day: deep blue zenith -> softer mid -> warm cream horizon
        vec3 dayTop = vec3(0.28, 0.44, 0.62);
        vec3 dayMid = vec3(0.52, 0.66, 0.80);
        vec3 dayBot = vec3(0.88, 0.84, 0.76);
        vec3 day = h < 0.22
          ? mix(dayBot, dayMid, smoothstep(-0.12, 0.22, h))
          : mix(dayMid, dayTop, smoothstep(0.22, 0.85, h));
        vec3 nightTop = vec3(0.016, 0.022, 0.040);
        vec3 nightMid = vec3(0.030, 0.040, 0.070);
        vec3 nightBot = vec3(0.055, 0.070, 0.115);
        vec3 night = h < 0.22
          ? mix(nightBot, nightMid, smoothstep(-0.12, 0.22, h))
          : mix(nightMid, nightTop, smoothstep(0.22, 0.85, h));
        vec3 col = mix(night, day, uDay);
        // warm sun bloom on the right
        float sun = pow(max(dot(normalize(vDir), uSunDir), 0.0), 14.0);
        col += vec3(1.0, 0.86, 0.62) * sun * 0.55 * uDay;
        float halo = pow(max(dot(normalize(vDir), uSunDir), 0.0), 3.0);
        col += vec3(0.95, 0.82, 0.62) * halo * 0.10 * uDay;
        gl_FragColor = vec4(col, 1.0);
      }`,
  })
  const sky = new THREE.Mesh(new THREE.SphereGeometry(520, 32, 20), skyMat)
  scene.add(sky)

  // ---------------------------------------------------------------- lighting
  const sun = new THREE.DirectionalLight(0xfff1d8, 3.4)
  sun.position.set(55, 75, 30)
  scene.add(sun)
  const ambient = new THREE.AmbientLight(0x9fb4cc, 4.2)
  scene.add(ambient)
  const warm = new THREE.PointLight(0xd9b370, 20, 90, 1.8)
  warm.position.set(6, 24, 8)
  scene.add(warm)

  // ------------------------------------------------------------------ tower
  const tower = new THREE.Group()
  scene.add(tower)

  const FLOORS = 38
  const FLOOR_H = 1.15
  const W = 9
  const D = 7

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(W, FLOORS * FLOOR_H, D),
    new THREE.MeshPhysicalMaterial({
      color: 0x8fb0d0,
      metalness: 0.85,
      roughness: 0.22,
      envMapIntensity: 1.2,
      transparent: true,
      opacity: 0.98,
    })
  )
  body.position.y = (FLOORS * FLOOR_H) / 2
  tower.add(body)

  const slabMat = new THREE.MeshStandardMaterial({
    color: 0xd6dde6,
    metalness: 0.6,
    roughness: 0.45,
  })
  const finGeo = new THREE.BoxGeometry(W + 0.35, 0.09, D + 0.35)
  for (let i = 0; i <= FLOORS; i++) {
    const fin = new THREE.Mesh(finGeo, slabMat)
    fin.position.y = i * FLOOR_H
    tower.add(fin)
  }

  // glowing windows — instanced quads on front/back faces (night only)
  const winGeo = new THREE.PlaneGeometry(0.62, 0.68)
  const winMat = new THREE.MeshBasicMaterial({
    color: 0xe8c98a,
    transparent: true,
    opacity: 0,
  })
  const cols = 10
  const positions = []
  for (let f = 0; f < FLOORS; f++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.42) continue
      positions.push([
        -W / 2 + 0.65 + c * ((W - 1.3) / (cols - 1)),
        f * FLOOR_H + FLOOR_H / 2,
        D / 2 + 0.02,
        0,
      ])
      if (Math.random() > 0.5)
        positions.push([
          -W / 2 + 0.65 + c * ((W - 1.3) / (cols - 1)),
          f * FLOOR_H + FLOOR_H / 2,
          -D / 2 - 0.02,
          Math.PI,
        ])
    }
  }
  const winMesh = new THREE.InstancedMesh(winGeo, winMat, positions.length)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  positions.forEach((p, i) => {
    q.setFromEuler(new THREE.Euler(0, p[3], 0))
    m.compose(new THREE.Vector3(p[0], p[1], p[2]), q, new THREE.Vector3(1, 1, 1))
    winMesh.setMatrixAt(i, m)
  })
  tower.add(winMesh)

  const crown = new THREE.Mesh(
    new THREE.BoxGeometry(W * 0.55, 0.5, D * 0.55),
    new THREE.MeshBasicMaterial({ color: 0xf0d9a8 })
  )
  crown.position.y = FLOORS * FLOOR_H + 0.3
  tower.add(crown)

  // -------------------------------------------- neighbour spires in the clouds
  // A handful of slender towers whose tips pierce the cloud deck, like the
  // reference frame. They read pale blue-grey by day, near-silhouette at night.
  const spireMat = new THREE.MeshStandardMaterial({
    color: 0xa9bbcd,
    metalness: 0.5,
    roughness: 0.5,
  })
  const SPIRES = [
    [-36, -14, 21, 3.4],
    [30, -34, 17.5, 3.0],
    [52, 16, 23, 3.8],
    [-62, 26, 16, 2.6],
    [20, 48, 14.5, 2.4],
    [-24, 60, 18, 2.8],
  ]
  const spires = new THREE.Group()
  SPIRES.forEach(([x, z, h, s]) => {
    const g = new THREE.Group()
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(s, h, s), spireMat)
    shaft.position.y = h / 2
    g.add(shaft)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(s * 0.55, h * 0.16, s * 0.55), spireMat)
    cap.position.y = h + h * 0.08
    g.add(cap)
    const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, h * 0.4, 6), spireMat)
    needle.position.y = h * 1.16 + h * 0.2
    g.add(needle)
    g.position.set(x, 0, z)
    spires.add(g)
  })
  scene.add(spires)

  // ------------------------------------------------------------- city below
  const cityMat = new THREE.MeshStandardMaterial({
    color: 0x93a3b5,
    metalness: 0.4,
    roughness: 0.7,
  })
  const boxGeo = new THREE.BoxGeometry(1, 1, 1)
  const cityMesh = new THREE.InstancedMesh(boxGeo, cityMat, 260)
  for (let i = 0; i < 260; i++) {
    const a = Math.random() * Math.PI * 2
    const r = 18 + Math.random() * 90
    const h = 2 + Math.random() * 14 * (1 - r / 140)
    const s = 2 + Math.random() * 5
    m.compose(
      new THREE.Vector3(Math.cos(a) * r, h / 2, Math.sin(a) * r),
      new THREE.Quaternion(),
      new THREE.Vector3(s, h, s)
    )
    cityMesh.setMatrixAt(i, m)
  }
  scene.add(cityMesh)

  const groundMat = new THREE.MeshStandardMaterial({ color: 0x8494a6, roughness: 1 })
  const ground = new THREE.Mesh(new THREE.CircleGeometry(260, 48), groundMat)
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  // -------------------------------------------------------------- particles
  const starGeo = new THREE.BufferGeometry()
  const N = 900
  const pos = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 240
    pos[i * 3 + 1] = 10 + Math.random() * 120
    pos[i * 3 + 2] = (Math.random() - 0.5) * 240
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xbfd0ee,
      size: 0.18,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    })
  )
  scene.add(stars)

  // ------------------------------------------------------------- cloud sea
  // Structured cumulus: each cloud is a CLUSTER of shaded puff sprites —
  // wide bright base puffs with smaller ones stacked on top — over a soft
  // deck plane that seals the gaps to the horizon.
  const puffCanvas = document.createElement('canvas')
  puffCanvas.width = puffCanvas.height = 256
  const pctx = puffCanvas.getContext('2d')
  const pg = pctx.createRadialGradient(128, 118, 12, 128, 128, 120)
  pg.addColorStop(0, 'rgba(255,255,255,1)')
  pg.addColorStop(0.4, 'rgba(251,252,255,0.85)')
  pg.addColorStop(0.72, 'rgba(238,243,250,0.35)')
  pg.addColorStop(1, 'rgba(255,255,255,0)')
  pctx.fillStyle = pg
  pctx.fillRect(0, 0, 256, 256)
  // bake blue-grey shading into the lower third so clouds read volumetric
  pctx.globalCompositeOperation = 'source-atop'
  const shade = pctx.createLinearGradient(0, 128, 0, 256)
  shade.addColorStop(0, 'rgba(148,168,196,0)')
  shade.addColorStop(1, 'rgba(148,168,196,0.5)')
  pctx.fillStyle = shade
  pctx.fillRect(0, 0, 256, 256)
  const puffTex = new THREE.CanvasTexture(puffCanvas)

  const CLOUD_Y = 9
  const clouds = new THREE.Group()
  const cloudSprites = []
  function addCloud(x, z, size, opacity) {
    const cluster = new THREE.Group()
    const puffs = 5 + ((Math.random() * 4) | 0)
    for (let i = 0; i < puffs; i++) {
      const mat = new THREE.SpriteMaterial({
        map: puffTex,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      })
      const s = new THREE.Sprite(mat)
      const along = (i / puffs - 0.5) * size * 1.5
      const lift = i % 2 === 0 ? 0 : size * (0.16 + Math.random() * 0.2)
      s.position.set(along + (Math.random() - 0.5) * size * 0.3, lift, (Math.random() - 0.5) * size * 0.5)
      const sc = size * (i % 2 === 0 ? 0.9 + Math.random() * 0.4 : 0.5 + Math.random() * 0.3)
      s.scale.set(sc, sc * 0.62, 1)
      s.userData.base = opacity * (0.75 + Math.random() * 0.25)
      cloudSprites.push(s)
      cluster.add(s)
    }
    cluster.position.set(x, CLOUD_Y + Math.random() * 1.5, z)
    cluster.rotation.y = Math.random() * Math.PI
    clouds.add(cluster)
  }
  // near ring — bold, defined masses around the tower
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + Math.random() * 0.3
    const r = 16 + Math.random() * 30
    addCloud(Math.cos(a) * r, Math.sin(a) * r, 9 + Math.random() * 7, 0.95)
  }
  // mid ring
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 + Math.random() * 0.3
    const r = 50 + Math.random() * 45
    addCloud(Math.cos(a) * r, Math.sin(a) * r, 14 + Math.random() * 10, 0.85)
  }
  // far horizon banks — big and soft
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4
    const r = 110 + Math.random() * 70
    addCloud(Math.cos(a) * r, Math.sin(a) * r, 26 + Math.random() * 16, 0.7)
  }
  scene.add(clouds)

  // deck plane sealing the gaps beneath the puffs
  const deckMat = new THREE.MeshBasicMaterial({
    color: 0xe9edf3,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  })
  const deck = new THREE.Mesh(new THREE.CircleGeometry(340, 48), deckMat)
  deck.rotation.x = -Math.PI / 2
  deck.position.y = CLOUD_Y - 1.6
  scene.add(deck)

  // gold dust near the tower (night)
  const dustGeo = new THREE.BufferGeometry()
  const DN = 350
  const dpos = new Float32Array(DN * 3)
  for (let i = 0; i < DN; i++) {
    dpos[i * 3] = (Math.random() - 0.5) * 30
    dpos[i * 3 + 1] = Math.random() * 46
    dpos[i * 3 + 2] = (Math.random() - 0.5) * 30
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3))
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      color: 0xe8c98a,
      size: 0.09,
      transparent: true,
      opacity: 0,
    })
  )
  scene.add(dust)

  // ----------------------------------------------------------- camera spline
  const TOP = FLOORS * FLOOR_H // ~43.7
  const camPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 17, 64), // 0.00 arrival — at the cloud line, tower filling frame
      new THREE.Vector3(-38, 28, 62), // approach sweep
      new THREE.Vector3(-34, 22, 34), // 0.2 architecture — orbit facade
      new THREE.Vector3(-16, 26, -26), // around the back
      new THREE.Vector3(14, 30, -18), // 0.42 interior — close to glass
      new THREE.Vector3(11, 31, 9), // slide across face
      new THREE.Vector3(0, 33, 13), // 0.6 lifestyle — hover terrace level
      new THREE.Vector3(-9, 38, 15), // 0.72 stats — rising
      new THREE.Vector3(-4, 47, 19), // 0.85 floorplan — above crown
      new THREE.Vector3(0, 30, 44), // 0.95 pull back
      new THREE.Vector3(0, 21, 60), // 1.00 final reveal — hero framing
    ],
    false,
    'catmullrom',
    0.35
  )
  const lookPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 26, 0),
      new THREE.Vector3(0, 22, 0),
      new THREE.Vector3(0, 20, 0),
      new THREE.Vector3(0, 24, 0),
      new THREE.Vector3(4, 29, 0),
      new THREE.Vector3(0, 31, 0),
      new THREE.Vector3(0, 32, 0),
      new THREE.Vector3(0, 36, 0),
      new THREE.Vector3(0, TOP, 0),
      new THREE.Vector3(0, 26, 0),
      new THREE.Vector3(0, 22, 0),
    ],
    false,
    'catmullrom',
    0.35
  )

  // day ↔ night material palettes
  const BODY_DAY = new THREE.Color(0x8fb0d0)
  const BODY_NIGHT = new THREE.Color(0x0c1220)
  const SLAB_DAY = new THREE.Color(0xd6dde6)
  const SLAB_NIGHT = new THREE.Color(0x2a2f3d)
  const SPIRE_DAY = new THREE.Color(0xa9bbcd)
  const SPIRE_NIGHT = new THREE.Color(0x0d1320)
  const CITY_DAY = new THREE.Color(0x93a3b5)
  const CITY_NIGHT = new THREE.Color(0x0a0e18)
  const GROUND_DAY = new THREE.Color(0x8494a6)
  const GROUND_NIGHT = new THREE.Color(0x06080e)
  const SUN_DAY = new THREE.Color(0xfff1d8)
  const SUN_NIGHT = new THREE.Color(0x8fa5c8)
  const AMB_DAY = new THREE.Color(0x9fb4cc)
  const AMB_NIGHT = new THREE.Color(0x1a2033)

  // ------------------------------------------------------------------ state
  let progress = 0
  let smooth = 0
  let mouseX = 0
  let mouseY = 0
  let smX = 0
  let smY = 0
  let raf
  const clock = new THREE.Clock()

  const onMouse = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('mousemove', onMouse)

  const camPos = new THREE.Vector3()
  const camLook = new THREE.Vector3()

  function tick() {
    raf = requestAnimationFrame(tick)
    const t = clock.getElapsedTime()

    smooth += (progress - smooth) * 0.06
    smX += (mouseX - smX) * 0.04
    smY += (mouseY - smY) * 0.04

    const p = THREE.MathUtils.clamp(smooth, 0, 1)
    camPath.getPointAt(p, camPos)
    lookPath.getPointAt(p, camLook)

    camPos.x += smX * 2.2 + Math.sin(t * 0.3) * 0.4
    camPos.y += -smY * 1.4 + Math.cos(t * 0.23) * 0.3
    camera.position.copy(camPos)
    camera.lookAt(camLook)

    // day → night: full daylight at the hero, dusk by ~14% scroll
    const d = THREE.MathUtils.clamp(1 - p / 0.14, 0, 1)
    skyMat.uniforms.uDay.value = d

    // crisp air by day, dense atmosphere at night that thins on the ascent
    scene.fog.density = THREE.MathUtils.lerp(0.0165 - p * 0.008, 0.0038, d)
    scene.fog.color.copy(FOG_NIGHT).lerp(FOG_DAY, d)

    body.material.color.copy(BODY_NIGHT).lerp(BODY_DAY, d)
    slabMat.color.copy(SLAB_NIGHT).lerp(SLAB_DAY, d)
    spireMat.color.copy(SPIRE_NIGHT).lerp(SPIRE_DAY, d)
    cityMat.color.copy(CITY_NIGHT).lerp(CITY_DAY, d)
    groundMat.color.copy(GROUND_NIGHT).lerp(GROUND_DAY, d)
    sun.color.copy(SUN_NIGHT).lerp(SUN_DAY, d)
    sun.intensity = 1.6 + d * 1.9
    ambient.color.copy(AMB_NIGHT).lerp(AMB_DAY, d)
    ambient.intensity = 2.2 + d * 2.2
    warm.intensity = 60 - d * 45

    stars.material.opacity = 0.7 * (1 - d)
    dust.material.opacity = 0.55 * (1 - d)
    winMat.opacity = (0.82 + Math.sin(t * 2.1) * 0.05) * (1 - d * 0.9)
    crown.material.color.setHSL(0.11, 0.55, 0.62 + Math.sin(t * 1.6) * 0.08)

    // clouds live in daylight, dissolve into the dusk
    clouds.rotation.y = t * 0.0028
    deckMat.opacity = 0.92 * d
    for (let i = 0; i < cloudSprites.length; i++) {
      const s = cloudSprites[i]
      s.material.opacity = s.userData.base * d
    }

    stars.rotation.y = t * 0.004
    dust.rotation.y = -t * 0.02
    dust.position.y = Math.sin(t * 0.4) * 0.6

    renderer.render(scene, camera)
  }
  tick()

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  return {
    setProgress(p) {
      progress = p
    },
    dispose() {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      renderer.dispose()
    },
  }
}
