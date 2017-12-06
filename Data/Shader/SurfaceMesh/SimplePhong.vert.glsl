attribute vec4 Position; 
attribute vec4 Normal; 
attribute vec4 Color; 
attribute vec4 Texture; 

varying vec4 vPosition;
varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 
 
varying vec3 vEyeVec;
varying vec3 vLightVec;

uniform mat4 matProjection;
uniform mat4 matModel; 
uniform mat4 matView; 
uniform vec3 camPos;


void main() 
{ 
	gl_Position = matProjection * matView * matModel * vec4(Position.xyz, 1.0);
	vNormal  = matView * matModel * vec4(Normal.xyz, 0.0); 
	vColor   = Color; 
	vTexture = Texture; 
	vPosition = Position;
	
	// compute camera position
	vec3 lightPos = vec3(0.0, 0.5, 1.0);
	
	// all computations are done in eye space
	vec4 viewPos   = matView * matModel * vec4(Position.xyz, 1.0);
	vec4 viewLight = matView * matModel * vec4(lightPos.xyz, 1.0);
	
	vEyeVec   = -viewPos.xyz;
    vLightVec = viewLight.xyz - viewPos.xyz;
	
    gl_Position = matProjection * matView * matModel * vec4(Position.xyz, 1);
	
}