/**
* author: Julian Kratt
*
**/

precision highp float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texPos;
uniform sampler2D texColor;

vec3 attrRed   = vec3(0.0, 150.0, 0.0);
vec3 attrGreen = vec3(150.0, 0.0, 0.0);
vec3 attrBlue  = vec3(-150.0, 0.0, 0.0);

void main() 
{   
	vec2 uv = vec2(vTexture.x, vTexture.y);
	
	vec3 curPos = texture2D(texPos, vec2(uv.x, 1.0-uv.y)).xyz;
	vec3 color  = texture2D(texColor, vec2(uv.x, uv.y)).xyz;
	
	vec3 dirRed   = normalize(attrRed   - curPos);
	vec3 dirGreen = normalize(attrGreen - curPos);
	vec3 dirBlue  = normalize(attrBlue  - curPos);
	
	float step = 0.0;
	
	if(length(color - vec3(1.0/255.0,1,0)) < 0.00001)
		step = 0.1;
	
	vec3 dir = step*vec3(1,0,0);
	
	// + color.g*dirGreen + color.b*dirBlue);

	vec3 newPos = curPos + dir;
	gl_FragColor = vec4(newPos, 1.0);
}














