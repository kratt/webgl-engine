/**
* author: Julian Kratt
*
**/
#extension GL_EXT_draw_buffers : require
precision highp float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texPos;
uniform sampler2D texVelocity;
uniform sampler2D texColor;
uniform float curAnimationTime;

vec3 attrRed   = vec3(0.0, 0.0, 0.0);
vec3 attrGreen = vec3(0.0, 0.0, 0.0);
vec3 attrBlue  = vec3(0.0, 0.0, 0.0);

/*
void attractor()
{
	float PI2 = 2.0*3.14;
	float r = 1550.0;
	float r2 = 350.0;
	
	float t = curAnimationTime;
	
	vec3 attrRedPos   = attrRed   + vec3(0.0, r*cos(PI2*t), r*sin(PI2*t));
	vec3 attrGreenPos = attrGreen + vec3(r*cos(PI2*t), r*sin(PI2*t), 0.0);
	vec3 attrBluePos  = attrBlue  + vec3(r*cos(PI2*t), r2*sin(PI2*t), 0.0);
	
	vec3 dirRed   = normalize(attrRedPos   - curPos);
	vec3 dirGreen = normalize(attrGreenPos - curPos);
	vec3 dirBlue  = normalize(attrBluePos  - curPos);
	
	//vec3 dir =  color.y * dirGreen + color.z * dirBlue;
	
	float step = 0.2;
	
	vec3 dir = curPos;
	float len = length(dir);
	
	float lenLeft = 1.0 - len;
	
	vec3 newPos = curPos;
	if(lenLeft < 100.0)
		newPos = curPos + step*normalize(dir);
	//vec3 newPos = curPos - acceleration;
	gl_FragColor = vec4(newPos, 1.0);

}
*/


void main() 
{   
	vec2 uv = vec2(vTexture.x, vTexture.y);
	
	vec3 curPos = texture2D(texPos, vec2(uv.x, 1.0-uv.y)).xyz;
	vec3 curVelocity = texture2D(texVelocity, vec2(uv.x, 1.0-uv.y)).xyz;
	vec3 color  = texture2D(texColor, vec2(uv.x, uv.y)).xyz;
	
	vec3 dir = 0.1*normalize(curVelocity);
	vec3 newPos = curPos + dir;
	
	gl_FragData[0] = vec4(curVelocity, 1.0);
	gl_FragData[1] = vec4(curVelocity, 1.0);
}














