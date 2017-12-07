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
	
	vec3 curPos = texture2D(texPos,   uv).xyz;
	vec3 color  = texture2D(texColor, vec2(uv.x, 1.0-uv.y)).xyz;
	
	vec3 dirRed   = normalize(attrRed   - curPos);
	vec3 dirGreen = normalize(attrGreen - curPos);
	vec3 dirBlue  = normalize(attrBlue  - curPos);
	
	float step = 0.0;
	
	if(color.r > 0.0)
		step = 1.0;
	
	vec3 dir = step*dirRed;
	
	// + color.g*dirGreen + color.b*dirBlue);

	vec3 newPos = curPos + dir;
	gl_FragColor = vec4(color , 1.0);
}














