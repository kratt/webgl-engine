/**
* author: Julian Kratt
*
**/
precision highp float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texPos;
uniform sampler2D texInitPos;
uniform sampler2D texVelocity;
uniform sampler2D texColor;

uniform float curAnimationTime;
uniform float initPosTransition;

void main() 
{   
	vec2 uv = vec2(vTexture.x, vTexture.y);
	
	vec3 curPos = texture2D(texPos, vec2(uv.x, 1.0-uv.y)).xyz;
	vec3 initPos = texture2D(texInitPos, vec2(uv.x, 1.0-uv.y)).xyz;
	vec3 curVelocity = texture2D(texVelocity, vec2(uv.x, 1.0-uv.y)).xyz;
	vec3 color  = texture2D(texColor, vec2(uv.x, uv.y)).xyz;
	
	float t = initPosTransition;
	vec3 newPos = (1.0-t)*(curPos + 0.005*curVelocity) + t*initPos;
	//vec3 newPos = curPos + 0.001*curVelocity;
	gl_FragColor = vec4(newPos, 1.0);
}














