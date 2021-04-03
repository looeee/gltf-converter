precision mediump float;

uniform vec3 color1;
uniform vec3 color2;

uniform float vignetteAmount;
uniform float mixAmount;
uniform vec2 smooth;

uniform sampler2D noiseTexture;

varying vec2 uv;

void main() {

	float dst = length( uv );
	// dst = smoothstep( smooth.x, smooth.y, dst );

	vec3 color = mix( color1, color2, dst );

  // tile the small noise texture - technically this should be
  // passing in the screen dimensions and using those to calculate,
  // but we'll just take an intermediate value here for simplicity
  vec2 texSize = vec2( 0.25, 0.25 );
  vec2 phase = fract(  uv / texSize );
	vec3 noise = mix( color, texture2D( noiseTexture, phase ).rgb, mixAmount );

	vec4 col = vec4( mix( noise, vec3( vignetteAmount ), dot( uv, uv ) ), 1.0 );

	gl_FragColor = col;

}