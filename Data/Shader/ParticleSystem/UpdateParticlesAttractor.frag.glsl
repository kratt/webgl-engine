precision highp float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texPos;
uniform sampler2D texLifeTime;
uniform sampler2D texInitPos;


vec3 f_lorenz(vec3 v)
{
   /* float a = 10;
    float b = 28;
    float c = 8/3;*/

	 float Beta = 8.0/3.0;
	float Rho = 28.0;
	float Sigma = 10.0;
 
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
	float delta = 0.001;
	
	vec3 up = vec3(0.0, 1.0, 0.03);
	
	vec3 curPos = texture2D(texPos, vTexture.xy).xyz;
	vec3 newPos = curPos + up;
	
	float maxLifeTime = texture2D(texLifeTime, vTexture.xy).x;
	float curLifeTime = texture2D(texPos, vTexture.xy).w;
	
	curLifeTime += 0.005;
	
	if(curLifeTime > maxLifeTime)
	{
		curLifeTime = 0.0;
		newPos  = texture2D(texInitPos, vTexture.xy).xyz;
	}
	
	
	gl_FragColor = vec4(newPos, curLifeTime);
}














