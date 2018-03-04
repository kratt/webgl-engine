/**
* author: Julian Kratt
*
**/
precision highp float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texVelocity;
uniform sampler2D texColor;
uniform sampler2D texPos;
uniform sampler2D texInitPos;

uniform float texWidth;
uniform float texHeight;
uniform float curAnimationTime;
uniform float initPosTransition;


void main() 
{   
	vec2 uv = vec2(vTexture.x, vTexture.y);
	vec3 curPos = texture2D(texPos, vec2(uv.x, 1.0-uv.y)).xyz;
	vec3 curVelocity = texture2D(texVelocity, vec2(uv.x, 1.0-uv.y)).xyz;
	vec3 curColor = texture2D(texColor, uv).xyz;
	
	float step_u = 1.0 / texWidth;
	float step_v = 1.0 / texHeight;
	float half_u = 0.5 * step_u;
	float half_v = 0.5 * step_v;
	
	const int width  = 64;
	const int height = 64;
	
	vec3 avg_pos = vec3(0.0);
	vec3 avg_velo = vec3(0.0);
	vec3 c = vec3(0.0);
	
	float eps = 0.0001;
	
	for(int x=0; x<width; ++x)
	{
		for(int y=0; y<height; ++y)
		{
			float cur_u = half_u + float(x) * step_u;
			float cur_v = half_v + float(y) * step_v;
			
			if(length(vec2(cur_u, cur_v) - vec2(uv.x, 1.0-uv.y)) < eps)
				continue;
			
			vec3 pos  = texture2D(texPos, vec2(cur_u, cur_v)).xyz;
			vec3 velo = texture2D(texVelocity, vec2(cur_u, cur_v)).xyz;	
			vec3 color = texture2D(texColor, vec2(cur_u, cur_v)).xyz;
			
			float colDist = length(color-curColor);
			avg_pos  += colDist*pos;
			avg_velo += colDist*velo;
			
			if(length(pos - curPos) < 5.0)
			{
				c -= pos - curPos;
			}			
		}
	}
	float numBoids = texWidth * texHeight - 1.0;
	avg_pos  /= numBoids;
	avg_velo /= numBoids;
	
	vec3 rule_1 = (avg_pos - curPos) / 1000.0;
	vec3 rule_2 = c ;
	vec3 rule_3 = (avg_velo - curVelocity) / 80.0;

	float t = curAnimationTime;
	float PI2 = 2.0*3.14;
	float r = 30.0;
	vec3 attrPos1 = r* vec3(cos(t*PI2), sin(t*PI2), sin(t*PI2));
	vec3 attrPos2 = r* vec3(cos(t*PI2), cos(t*PI2), sin(t*PI2));
	
	float red   = 1.0 / length(vec3(1.0, 0.0, 0.0) - curColor);
	float green = 1.0 / length(vec3(0.0, 1.0, 0.0) - curColor);

	vec3 rule_4 = (attrPos1 - curPos) / 10.0 * red;
	vec3 rule_5 = (attrPos2 - curPos) / 10.0 * green;
	
	vec3 newVolcity = curVelocity + rule_1 + rule_2 + rule_4;
	
	gl_FragColor = vec4(newVolcity, 1.0);
}














