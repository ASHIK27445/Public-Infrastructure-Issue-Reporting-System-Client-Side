import { useRef, useEffect, useState } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

export const LiquidChrome = ({
  baseColor = [0.1, 0.1, 0.1],
  speed = 0.2,
  amplitude = 0.5,
  frequencyX = 3,
  frequencyY = 2,
  interactive = true,
  ...props
}) => {
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    // Ensure the component is mounted and container exists
    if (!isMounted || !containerRef.current) return;

    const container = containerRef.current;
    
    // Safety check - make sure container has dimensions
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      console.warn('Container has no dimensions, skipping renderer initialization');
      return;
    }

    try {
      // Create renderer with explicit canvas creation
      const renderer = new Renderer({ 
        antialias: true,
        alpha: false,
        width: container.offsetWidth,
        height: container.offsetHeight
      });
      
      const gl = renderer.gl;
      gl.clearColor(1, 1, 1, 1);

      const vertexShader = `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fragmentShader = `
        precision highp float;
        uniform float uTime;
        uniform vec3 uResolution;
        uniform vec3 uBaseColor;
        uniform float uAmplitude;
        uniform float uFrequencyX;
        uniform float uFrequencyY;
        uniform vec2 uMouse;
        varying vec2 vUv;

        vec4 renderImage(vec2 uvCoord) {
            vec2 fragCoord = uvCoord * uResolution.xy;
            vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

            for (float i = 1.0; i < 10.0; i++){
                uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
                uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
            }

            vec2 diff = (uvCoord - uMouse);
            float dist = length(diff);
            float falloff = exp(-dist * 20.0);
            float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
            uv += (diff / (dist + 0.0001)) * ripple * falloff;

            vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
            return vec4(color, 1.0);
        }

        void main() {
            vec4 col = vec4(0.0);
            int samples = 0;
            for (int i = -1; i <= 1; i++){
                for (int j = -1; j <= 1; j++){
                    vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
                    col += renderImage(vUv + offset);
                    samples++;
                }
            }
            gl_FragColor = col / float(samples);
        }
      `;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: {
            value: new Float32Array([gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height])
          },
          uBaseColor: { value: new Float32Array(baseColor) },
          uAmplitude: { value: amplitude },
          uFrequencyX: { value: frequencyX },
          uFrequencyY: { value: frequencyY },
          uMouse: { value: new Float32Array([0, 0]) }
        }
      });
      const mesh = new Mesh(gl, { geometry, program });

      // Append canvas to container BEFORE setting up resize
      container.appendChild(gl.canvas);
      
      // Style the canvas to fill container
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.display = 'block';

      function resize() {
        if (!container || !gl || !program) return;
        
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        
        if (width === 0 || height === 0) return;
        
        renderer.setSize(width, height);
        
        const resUniform = program.uniforms.uResolution.value;
        if (resUniform) {
          resUniform[0] = gl.canvas.width;
          resUniform[1] = gl.canvas.height;
          resUniform[2] = gl.canvas.width / gl.canvas.height;
        }
      }

      // Use ResizeObserver for better resize handling
      const resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(container);

      // Also listen to window resize
      window.addEventListener('resize', resize);
      
      // Initial resize
      resize();

      function handleMouseMove(event) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = 1 - (event.clientY - rect.top) / rect.height;
        const mouseUniform = program.uniforms.uMouse.value;
        if (mouseUniform) {
          mouseUniform[0] = Math.max(0, Math.min(1, x));
          mouseUniform[1] = Math.max(0, Math.min(1, y));
        }
      }

      function handleTouchMove(event) {
        if (event.touches.length > 0 && container) {
          const touch = event.touches[0];
          const rect = container.getBoundingClientRect();
          const x = (touch.clientX - rect.left) / rect.width;
          const y = 1 - (touch.clientY - rect.top) / rect.height;
          const mouseUniform = program.uniforms.uMouse.value;
          if (mouseUniform) {
            mouseUniform[0] = Math.max(0, Math.min(1, x));
            mouseUniform[1] = Math.max(0, Math.min(1, y));
          }
        }
      }

      if (interactive) {
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('touchmove', handleTouchMove);
      }

      let animationId;
      function update(t) {
        animationId = requestAnimationFrame(update);
        if (program && program.uniforms) {
          program.uniforms.uTime.value = t * 0.001 * speed;
        }
        if (renderer && mesh) {
          renderer.render({ scene: mesh });
        }
      }
      animationId = requestAnimationFrame(update);

      // Cleanup function
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        
        window.removeEventListener('resize', resize);
        
        if (interactive && container) {
          container.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('touchmove', handleTouchMove);
        }
        
        if (gl && gl.canvas && gl.canvas.parentElement) {
          gl.canvas.parentElement.removeChild(gl.canvas);
        }
        
        if (gl) {
          const loseContext = gl.getExtension('WEBGL_lose_context');
          if (loseContext) {
            loseContext.loseContext();
          }
        }
        
        // Clean up renderer
        if (renderer && renderer.gl) {
          renderer.gl = null;
        }
      };
    } catch (error) {
      console.error('Error initializing LiquidChrome:', error);
      return () => {};
    }
  }, [baseColor, speed, amplitude, frequencyX, frequencyY, interactive, isMounted]);

  // Render a placeholder while not mounted
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full" 
      style={{ minHeight: '200px', position: 'relative' }}
      {...props}
    >
      {!isMounted && (
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f0f0f0'
        }}>
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};

export default LiquidChrome;