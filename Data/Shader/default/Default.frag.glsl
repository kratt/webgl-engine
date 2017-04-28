precision highp float;


varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D tex;

void main() 
{    
	gl_FragColor = vec4(vColor.xyz, 1.0);
}