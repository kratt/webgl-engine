attribute vec4 Position; 
attribute vec4 Normal; 
attribute vec4 Color; 
attribute vec4 Texture; 

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform mat4 matProjection;
uniform mat4 matModel; 
uniform mat4 matView; 

uniform sampler2D texPos;

void main() 
{ 
	gl_PointSize = 10.0; 
	vNormal  = Normal; 
	vColor   = Color; 
	vTexture = Texture; 
	
	vec3 pos = texture2D(texPos, Texture.xy).xyz;
	gl_Position = matProjection * matView * matModel * vec4(pos.xyz, 1.0);
}