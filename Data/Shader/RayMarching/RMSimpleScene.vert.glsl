attribute vec4 Position; 
attribute vec4 Normal; 
attribute vec4 Color; 
attribute vec4 Texture; 

varying vec4 vPosition; 
varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform mat4 matProjection;
uniform mat4 matModel; 
uniform mat4 matView; 

uniform sampler2D tex;
uniform float x;

uniform float window_width;
uniform float window_height;

void main() 
{ 
	vec2 pos = Position.xy;
	pos = (pos / vec2(window_width, window_height)) * 2.0 - 1.0;
			
	gl_Position = vec4(pos, 0.0, 1);
	  	
	vPosition = Position;
	vNormal  = Normal; 
	vColor   = Color; 
	vTexture = Texture; 
}