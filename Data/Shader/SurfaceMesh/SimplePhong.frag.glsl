precision highp float;

varying vec4 vPosition; 
varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texKd;

void main() 
{    
	vec3 texColor = texture2D(texKd, vec2(1.0-vTexture.y, vTexture.x)).xyz;
	
	gl_FragColor = vec4(texColor.xyz, 1);
}