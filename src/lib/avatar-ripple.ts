/**
 * Native WebGL Image UV Refraction Water Ripple & CSS Tilt Avatar.
 * Replaces 3D mesh rendering with lightweight 2D image UV refraction.
 *
 * - Source image: rin-chrome-head-v1.png
 * - Max 5 ripple pulses, hover throttled to 200ms small disturbance, click amplitude 0.008 UV
 * - Wave packet expands outward ~1.6s with exponential damping
 * - Crisp facial features preserved; white background unrefracted with zero rings/fringing
 * - CSS transform on avatar-drag-layer: rotateY +-7deg, rotateX +-4deg smooth follow; drag +-12deg with spring return
 * - Fallbacks: zero-JS, load failure, reduced-motion, offscreen/hidden pause, complete GPU cleanup
 */

export interface AvatarRippleController {
  destroy: () => void;
  setHeroVisible: (visible: boolean) => void;
}

interface Pulse {
  u: number;
  v: number;
  time: number;
  amp: number;
}

const VERTEX_SHADER_SRC = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexture;

uniform vec2 uPulseCenter[5];
uniform float uPulseTime[5];
uniform float uPulseAmp[5];
uniform int uPulseCount;

void main() {
  vec2 totalOffset = vec2(0.0);
  float PI = 3.141592653589793;

  for (int i = 0; i < 5; i++) {
    if (i >= uPulseCount) break;
    float t = uPulseTime[i];
    if (t < 0.0 || t > 1.6) continue;

    vec2 center = uPulseCenter[i];
    vec2 toPixel = vUv - center;
    float d = length(toPixel);
    vec2 dir = (d > 0.0001) ? toPixel / d : vec2(0.0, 1.0);

    float r = t * 0.72;
    float delta = d - r;
    // Wave packet expands outward ~1.6s with exponential damping
    float envelope = exp(-pow(delta / 0.10, 2.0)) * exp(-t * 2.2);
    float carrier = sin(delta * 2.0 * PI / 0.08);
    float wave = carrier * envelope * uPulseAmp[i];

    totalOffset += dir * wave;
  }

  // 1. Clamping displacement to preserve facial sharpness
  float len = length(totalOffset);
  if (len > 0.015) {
    totalOffset = (totalOffset / len) * 0.015;
  }

  // 2. UV sampling margin: at least 5% edge dampening to prevent hair clipping near edges
  float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float edgeFactor = clamp(edgeDist / 0.05, 0.0, 1.0);
  totalOffset *= edgeFactor;

  vec2 sampleUv = vUv + totalOffset;

  if (sampleUv.x < 0.0 || sampleUv.x > 1.0 || sampleUv.y < 0.0 || sampleUv.y > 1.0) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  } else {
    gl_FragColor = texture2D(uTexture, sampleUv);
  }
}
`;

export function initAvatarRipple(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  visual: HTMLElement,
  dragLayer: HTMLElement
): AvatarRippleController | null {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    return null;
  }

  // 1. All state variables declared upfront (no TDZ)
  let isDestroyed = false;
  let isFailed = false;
  let isTextureLoaded = false;
  let hasRenderedFirstFrame = false;
  let isHeroVisible = true;
  let isDocumentVisible = typeof document !== "undefined" ? !document.hidden : true;
  let isLoopRunning = false;
  let rafId: number | null = null;
  let lastTime = performance.now();

  // Water Ripple Pulses State
  const MAX_PULSES = 5;
  const pulses: Pulse[] = [];
  let lastHoverPulseTime = 0;

  // CSS Avatar Tilt & Drag State
  const MAX_FOLLOW_YAW = 7.0; // deg (+-7deg)
  const MAX_FOLLOW_PITCH = 4.0; // deg (+-4deg)
  const MAX_DRAG_ANGLE = 12.0; // deg (+-12deg)

  let rotX = 0; // Current pitch (deg)
  let rotY = 0; // Current yaw (deg)
  let targetFollowX = 0;
  let targetFollowY = 0;

  let isDragging = false;
  let activePointerId: number | null = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartRotX = 0;
  let dragStartRotY = 0;
  let dragTargetX = 0;
  let dragTargetY = 0;

  let resizeObserver: ResizeObserver | null = null;
  const abortController = new AbortController();
  const signal = abortController.signal;

  // Safe Fallback Handler
  function markFailed() {
    if (isDestroyed || isFailed) return;
    isFailed = true;

    if (isDragging && activePointerId !== null) {
      try {
        visual.releasePointerCapture(activePointerId);
      } catch {}
    }
    isDragging = false;
    activePointerId = null;
    visual.classList.remove("is-grabbing");

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    isLoopRunning = false;

    canvas.style.display = "none";
    img.style.opacity = "";
    dragLayer.style.transform = "";
  }

  // 2. Initialize Native WebGL
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    powerPreference: "high-performance",
  });

  if (!gl) {
    markFailed();
    return null;
  }

  // Compile Shaders
  function createShader(glCtx: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
    const shader = glCtx.createShader(type);
    if (!shader) return null;
    glCtx.shaderSource(shader, src);
    glCtx.compileShader(shader);
    if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
      glCtx.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
  if (!vertShader || !fragShader) {
    markFailed();
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    markFailed();
    return null;
  }

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    markFailed();
    return null;
  }

  gl.useProgram(program);

  // Buffer: Fullscreen Quad (2 Triangles)
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]),
    gl.STATIC_DRAW
  );

  const aPositionLoc = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(aPositionLoc);
  gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

  // Uniform Locations
  const uTextureLoc = gl.getUniformLocation(program, "uTexture");
  const uPulseCenterLoc = gl.getUniformLocation(program, "uPulseCenter");
  const uPulseTimeLoc = gl.getUniformLocation(program, "uPulseTime");
  const uPulseAmpLoc = gl.getUniformLocation(program, "uPulseAmp");
  const uPulseCountLoc = gl.getUniformLocation(program, "uPulseCount");

  gl.uniform1i(uTextureLoc, 0);

  // Texture creation
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  function uploadTexture() {
    if (isDestroyed || isFailed || !gl || !texture) return;
    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      isTextureLoaded = true;
      requestFrame();
    } catch {
      markFailed();
    }
  }

  if (img.complete && img.naturalWidth > 0) {
    uploadTexture();
  } else {
    img.addEventListener("load", () => uploadTexture(), { once: true, signal });
    img.addEventListener("error", () => markFailed(), { once: true, signal });
  }

  // Pre-allocated arrays for uniform uploads (5 pulses max)
  const pulseCentersArray = new Float32Array(MAX_PULSES * 2);
  const pulseTimesArray = new Float32Array(MAX_PULSES);
  const pulseAmpsArray = new Float32Array(MAX_PULSES);

  function addPulse(u: number, v: number, amp: number) {
    if (prefersReducedMotion || isDestroyed || isFailed) return;
    pulses.push({ u, v, time: 0, amp });
    if (pulses.length > MAX_PULSES) {
      pulses.shift();
    }
    requestFrame();
  }

  function resizeCanvas() {
    if (isDestroyed || isFailed || !gl) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = Math.round(rect.width * dpr);
    const displayHeight = Math.round(rect.height * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, displayWidth, displayHeight);
      requestFrame();
    }
  }

  resizeCanvas();
  resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObserver.observe(canvas);

  function requestFrame() {
    if (isDestroyed || isFailed) return;
    if (prefersReducedMotion && hasRenderedFirstFrame) return;
    if (!isLoopRunning && isHeroVisible && isDocumentVisible) {
      isLoopRunning = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(render);
    }
  }

  function render(now = performance.now()) {
    rafId = null;

    if (isDestroyed || isFailed || !isTextureLoaded || !gl) {
      isLoopRunning = false;
      return;
    }

    if (!isHeroVisible || !isDocumentVisible) {
      isLoopRunning = false;
      return;
    }

    const dt = Math.min(0.033, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    if (!prefersReducedMotion) {
      // 1. Update Ripple Pulses (expand and fade over 1.6s)
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].time += dt;
        if (pulses[i].time >= 1.6) {
          pulses.splice(i, 1);
        }
      }

      // 2. CSS Avatar Follow & Drag Physics
      if (isDragging) {
        rotX += (dragTargetX - rotX) * 0.25;
        rotY += (dragTargetY - rotY) * 0.25;
      } else {
        // Smooth unpressed follow (+-7deg yaw, +-4deg pitch, smooth 0.12)
        rotX += (targetFollowX - rotX) * 0.12;
        rotY += (targetFollowY - rotY) * 0.12;
      }

      rotX = Math.max(-MAX_DRAG_ANGLE, Math.min(MAX_DRAG_ANGLE, rotX));
      rotY = Math.max(-MAX_DRAG_ANGLE, Math.min(MAX_DRAG_ANGLE, rotY));

      dragLayer.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    }

    // 3. WebGL Draw
    pulseCentersArray.fill(0);
    pulseTimesArray.fill(999);
    pulseAmpsArray.fill(0);

    for (let i = 0; i < pulses.length; i++) {
      pulseCentersArray[i * 2 + 0] = pulses[i].u;
      pulseCentersArray[i * 2 + 1] = pulses[i].v;
      pulseTimesArray[i] = pulses[i].time;
      pulseAmpsArray[i] = pulses[i].amp;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform2fv(uPulseCenterLoc, pulseCentersArray);
    gl.uniform1fv(uPulseTimeLoc, pulseTimesArray);
    gl.uniform1fv(uPulseAmpLoc, pulseAmpsArray);
    gl.uniform1i(uPulseCountLoc, pulses.length);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (!hasRenderedFirstFrame) {
      hasRenderedFirstFrame = true;
      img.style.opacity = "0";
      canvas.style.opacity = "1";
    }

    if (prefersReducedMotion) {
      isLoopRunning = false;
      dragLayer.style.transform = "none";
      return;
    }

    // 4. Idle Check: pause rAF when stationary and no ripples
    const targetX = isDragging ? dragTargetX : targetFollowX;
    const targetY = isDragging ? dragTargetY : targetFollowY;
    const isMoving =
      pulses.length > 0 ||
      isDragging ||
      Math.abs(rotX - targetX) > 0.05 ||
      Math.abs(rotY - targetY) > 0.05;

    if (isMoving) {
      rafId = requestAnimationFrame(render);
      isLoopRunning = true;
    } else {
      rotX = targetX;
      rotY = targetY;
      dragLayer.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      isLoopRunning = false;
    }
  }

  // 3. Pointer Interaction Listeners
  const onPointerDown = (e: PointerEvent) => {
    if (isDestroyed || isFailed || !isTextureLoaded || prefersReducedMotion) return;
    if (e.isPrimary === false) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (activePointerId !== null) return;

    const rect = canvas.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return;
    }

    // Click pulse: 0.008 UV amplitude
    const u = (e.clientX - rect.left) / rect.width;
    const v = 1.0 - (e.clientY - rect.top) / rect.height;
    addPulse(u, v, 0.008);

    // Touch device: triggers ripple without capturing pointer or blocking vertical scroll
    if (e.pointerType === "touch") {
      return;
    }

    // Desktop: initiate drag rotation (clamped to +-12 deg)
    isDragging = true;
    activePointerId = e.pointerId;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartRotX = rotX;
    dragStartRotY = rotY;
    dragTargetX = rotX;
    dragTargetY = rotY;

    visual.classList.add("is-grabbing");
    try {
      visual.setPointerCapture(e.pointerId);
    } catch {}

    requestFrame();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (isDestroyed || isFailed || !isTextureLoaded || prefersReducedMotion) return;

    if (isDragging && e.pointerId === activePointerId) {
      const deltaX = (e.clientX - dragStartX) * 0.08;
      const deltaY = (e.clientY - dragStartY) * 0.08;

      dragTargetY = Math.max(-MAX_DRAG_ANGLE, Math.min(MAX_DRAG_ANGLE, dragStartRotY + deltaX));
      dragTargetX = Math.max(-MAX_DRAG_ANGLE, Math.min(MAX_DRAG_ANGLE, dragStartRotX - deltaY));

      requestFrame();
      return;
    }

    // Hover ripple: throttled to 200ms with small disturbance (~0.0028 UV)
    if (!isDragging && e.pointerType !== "touch") {
      const now = performance.now();
      if (now - lastHoverPulseTime >= 200) {
        const rect = canvas.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          lastHoverPulseTime = now;
          const u = (e.clientX - rect.left) / rect.width;
          const v = 1.0 - (e.clientY - rect.top) / rect.height;
          addPulse(u, v, 0.0028);
        }
      }
    }
  };

  // Window pointer move for smooth unpressed tilt follow (+-7deg yaw, +-4deg pitch)
  const onWindowPointerMove = (e: PointerEvent) => {
    if (isDestroyed || isFailed || prefersReducedMotion) return;
    if (e.pointerType === "touch") return;

    const rect = visual.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const nx = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth * 0.5)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight * 0.5)));

    targetFollowY = nx * MAX_FOLLOW_YAW;
    targetFollowX = -ny * MAX_FOLLOW_PITCH;

    requestFrame();
  };

  const onWindowPointerLeave = () => {
    targetFollowX = 0;
    targetFollowY = 0;
    requestFrame();
  };

  const onPointerUp = (e: PointerEvent) => {
    if (isDestroyed || isFailed) return;
    if (!isDragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;

    const pid = activePointerId;
    isDragging = false;
    activePointerId = null;
    visual.classList.remove("is-grabbing");

    if (pid !== null) {
      try {
        visual.releasePointerCapture(pid);
      } catch {}
    }

    // Drag released: smoothly returns to mouse follow target
    requestFrame();
  };

  const onPointerCancelOrLost = () => {
    if (isDestroyed || isFailed) return;
    if (!isDragging) return;

    const pid = activePointerId;
    isDragging = false;
    activePointerId = null;
    visual.classList.remove("is-grabbing");

    if (pid !== null) {
      try {
        visual.releasePointerCapture(pid);
      } catch {}
    }

    requestFrame();
  };

  visual.addEventListener("pointerdown", onPointerDown, { passive: true, signal });
  visual.addEventListener("pointermove", onPointerMove, { passive: true, signal });
  visual.addEventListener("pointerup", onPointerUp, { passive: true, signal });
  visual.addEventListener("pointercancel", onPointerCancelOrLost, { passive: true, signal });
  visual.addEventListener("lostpointercapture", onPointerCancelOrLost as EventListener, { passive: true, signal });

  window.addEventListener("pointermove", onWindowPointerMove, { passive: true, signal });
  document.addEventListener("pointerleave", onWindowPointerLeave, { passive: true, signal });

  // 4. Document Visibility Handling
  const onVisibilityChange = () => {
    if (isDestroyed || isFailed) return;
    isDocumentVisible = !document.hidden;

    if (document.hidden) {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      isLoopRunning = false;
      if (isDragging && activePointerId !== null) {
        const pid = activePointerId;
        isDragging = false;
        activePointerId = null;
        visual.classList.remove("is-grabbing");
        try {
          visual.releasePointerCapture(pid);
        } catch {}
      }
    } else {
      if ((!prefersReducedMotion || !hasRenderedFirstFrame) && isHeroVisible) {
        requestFrame();
      }
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange, { signal });

  const onContextLost = (e: Event) => {
    e.preventDefault();
    markFailed();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    setHeroVisible(visible: boolean) {
      if (isDestroyed || isFailed) return;
      isHeroVisible = visible;
      if (isHeroVisible) {
        if ((!prefersReducedMotion || !hasRenderedFirstFrame) && isDocumentVisible) {
          requestFrame();
        }
      } else {
        if (isDragging && activePointerId !== null) {
          const pid = activePointerId;
          isDragging = false;
          activePointerId = null;
          visual.classList.remove("is-grabbing");
          try {
            visual.releasePointerCapture(pid);
          } catch {}
        }
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
          isLoopRunning = false;
        }
      }
    },
    destroy() {
      if (isDestroyed) return;
      isDestroyed = true;

      abortController.abort();
      resizeObserver?.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);

      if (isDragging && activePointerId !== null) {
        try {
          visual.releasePointerCapture(activePointerId);
        } catch {}
        activePointerId = null;
        isDragging = false;
      }

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      isLoopRunning = false;

      // Restore DOM elements
      img.style.opacity = "";
      canvas.style.opacity = "";
      visual.classList.remove("is-grabbing");
      dragLayer.style.transform = "";

      // Clean up GPU resources
      if (gl) {
        if (texture) gl.deleteTexture(texture);
        if (quadBuffer) gl.deleteBuffer(quadBuffer);
        if (program) gl.deleteProgram(program);
        if (vertShader) gl.deleteShader(vertShader);
        if (fragShader) gl.deleteShader(fragShader);
      }
    },
  };
}
