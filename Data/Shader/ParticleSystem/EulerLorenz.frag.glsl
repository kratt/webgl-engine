/**
* author: Julian Kratt
*
**/

precision highp float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texPos;
uniform sampler2D texLifeTime;
uniform sampler2D texInitPos;

uniform float Sigma;
uniform float Beta;
uniform float Rho;
uniform float Delta;

uniform float resetTime;


vec3 f_lorenz(vec3 v)
{ 
    vec3 l;
    l.x = Sigma * (v.y - v.x);
    l.y = v.x * (Rho - v.z) - v.y;
    l.z = v.x * v.y - Beta * v.z;

    return l;
}

vec3 euler(vec3 yn, float h)
{
    vec3 yn1 = yn + h * f_lorenz(yn);
    return yn1;
}


void main() 
{   
	float delta = 0.01;
	
	vec3 curPos = texture2D(texPos, vTexture.xy).xyz;
	vec3 newPos = euler(curPos, Delta);
	
	float maxLifeTime = texture2D(texLifeTime, vTexture.xy).x;
	float curLifeTime = texture2D(texPos, vTexture.xy).w;
	
	curLifeTime += 0.0005;
	
	
	if(curLifeTime > maxLifeTime)
	{
		curLifeTime = 0.0;
		//newPos  = texture2D(texInitPos, vTexture.xy).xyz;
	}
	
	 if(resetTime > 0.0)
	 {
		 vec3 initPos = texture2D(texInitPos, vTexture.xy).xyz + vec3(0.0, 0.0, 25.0);
		
		 vec3 dir = normalize( initPos - curPos);
		
		 newPos = curPos + resetTime * 10.0 * dir;
	
	 }

	gl_FragColor = vec4(curPos, curLifeTime);
}














