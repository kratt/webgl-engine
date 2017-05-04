attribute vec4 Position; 
attribute vec4 Normal; 
attribute vec4 Color; 
attribute vec4 Texture; 

varying vec4 vPosition; 
varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform float windowWidth;
uniform float windowHeight;


void main() 
{ 
	vPosition = Position;
	vNormal  = Normal; 
	vColor   = Color; 
	vTexture = Texture; 
	
	vec2 pos = (Position.xy / vec2(float(windowWidth), float(windowHeight))) * 2.0 - 1.0;		
	gl_Position = vec4(pos, 0.0, 1);
	      
}