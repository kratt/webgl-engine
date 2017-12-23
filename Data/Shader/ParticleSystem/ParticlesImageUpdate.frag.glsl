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
uniform float curAnimationTime;

vec3 attrRed   = vec3(0.0, 150.0, 0.0);
vec3 attrGreen = vec3(150.0, 0.0, 0.0);
vec3 attrBlue  = vec3(-150.0, 0.0, 0.0);



void main() 
{   
	vec2 uv = vec2(vTexture.x, vTexture.y);
	
	vec3 curPos = texture2D(texPos, vec2(uv.x, 1.0-uv.y)).xyz;
	vec3 color  = texture2D(texColor, vec2(uv.x, uv.y)).xyz;
	
	float PI = 3.14;
	float r = 50.0;
	
	attrRed   += vec3(r*cos(2.0*PI * curAnimationTime), r*sin(2.0*PI + curAnimationTime), 0.0);
	attrGreen += vec3(r*cos(2.0*PI * curAnimationTime), r*sin(2.0*PI + curAnimationTime), 0.0);
	attrBlue  += vec3(r*cos(2.0*PI * curAnimationTime), r*sin(2.0*PI + curAnimationTime), 0.0);
	
	vec3 dirRed   = normalize(attrRed   - curPos);
	vec3 dirGreen = normalize(attrGreen - curPos);
	vec3 dirBlue  = normalize(attrBlue  - curPos);
	
	vec3 dir = color.x * dirRed + color.y * dirGreen + color.z * dirBlue;
	vec3 newPos = curPos + dir;
	
	
	//vec3 newPos = curPos - acceleration;
	gl_FragColor = vec4(newPos, 1.0);
	
	
	/*
	
	const int numAttrs = 2;
	vec3  attrPos[2];
	float attrMass[2];
	
	attrPos[0] = vec3(-50.0, 0.0, 0.0);
	attrPos[1] = vec3(50.0, 0.0, 0.0);
	
	attrMass[0] = 50.0;
	attrMass[1] = 10.0;
		
			
	float curMass = 1.0;
	float eps = 10.1;
	float G = 19.81;
	
	
	vec3 acceleration;
	for(int i=0; i<numAttrs; ++i)
	{
		acceleration += attrMass[i] * (attrPos[i]-curPos) / pow(length(curPos-attrPos[i]) + eps, 3.0);	
	}
	
	
	vec3 attrRed = vec3(0.0);
	vec3 posDir = curPos - attrOrg;
	float r = length(posDir);
	
	float angle = acos(dot(normalize(posDir), vec3(1.0, 0.0, 0.0)));
	
	angle += 0.001;
	
	float PI = 3.14;
	float x = r * cos(angle);
	float y = r * sin(angle);
	vec3 newPos = vec3(x, y, 0.0) + attrOrg;
	

	//float g = atan(10, 10);
		
	//vec3 newPos = curPos - acceleration;
	gl_FragColor = vec4(newPos, 1.0);*/
}














